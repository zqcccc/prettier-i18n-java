"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassesPrettierVisitor = void 0;
var forEach_1 = __importDefault(require("lodash/forEach"));
var printer_utils_1 = require("./printer-utils");
var prettier_builder_1 = require("./prettier-builder");
var format_comments_1 = require("./comments/format-comments");
var comments_utils_1 = require("./comments/comments-utils");
var doc_1 = require("prettier/doc");
var base_cst_printer_1 = require("../base-cst-printer");
var utils_1 = require("../types/utils");
var utils_2 = require("../utils");
var line = doc_1.builders.line, softline = doc_1.builders.softline, hardline = doc_1.builders.hardline;
var ClassesPrettierVisitor = /** @class */ (function (_super) {
    __extends(ClassesPrettierVisitor, _super);
    function ClassesPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassesPrettierVisitor.prototype.classDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.classModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var classCST;
        if (ctx.normalClassDeclaration !== undefined) {
            classCST = ctx.normalClassDeclaration;
        }
        else if (ctx.enumDeclaration !== undefined) {
            classCST = ctx.enumDeclaration;
        }
        else {
            classCST = ctx.recordDeclaration;
        }
        var classDoc = this.visit(classCST);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [(0, prettier_builder_1.join)(" ", otherModifiers), classDoc])
        ]);
    };
    ClassesPrettierVisitor.prototype.normalClassDeclaration = function (ctx) {
        var name = this.visit(ctx.typeIdentifier);
        var optionalTypeParams = this.visit(ctx.typeParameters);
        var optionalSuperClasses = this.visit(ctx.superclass);
        var optionalSuperInterfaces = this.visit(ctx.superinterfaces);
        var optionalClassPermits = this.visit(ctx.classPermits);
        var body = this.visit(ctx.classBody, { isNormalClassDeclaration: true });
        var superClassesPart = "";
        if (optionalSuperClasses) {
            superClassesPart = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, optionalSuperClasses]));
        }
        var superInterfacesPart = "";
        if (optionalSuperInterfaces) {
            superInterfacesPart = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, optionalSuperInterfaces]));
        }
        var classPermits = "";
        if (optionalClassPermits) {
            classPermits = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, optionalClassPermits]));
        }
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
                (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Class[0], name]),
                optionalTypeParams,
                superClassesPart,
                superInterfacesPart,
                classPermits
            ])),
            body
        ]);
    };
    ClassesPrettierVisitor.prototype.classModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visit(ctx.annotation);
        }
        // public | protected | private | ...
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.typeParameters = function (ctx) {
        var typeParameterList = this.visit(ctx.typeParameterList);
        return (0, printer_utils_1.putIntoBraces)(typeParameterList, softline, ctx.Less[0], ctx.Greater[0]);
    };
    ClassesPrettierVisitor.prototype.typeParameterList = function (ctx) {
        var typeParameter = this.mapVisit(ctx.typeParameter);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(commas, typeParameter));
    };
    ClassesPrettierVisitor.prototype.superclass = function (ctx) {
        return (0, prettier_builder_1.join)(" ", [ctx.Extends[0], this.visit(ctx.classType)]);
    };
    ClassesPrettierVisitor.prototype.superinterfaces = function (ctx) {
        var interfaceTypeList = this.visit(ctx.interfaceTypeList);
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
            ctx.Implements[0],
            (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, interfaceTypeList]))
        ]));
    };
    ClassesPrettierVisitor.prototype.classPermits = function (ctx) {
        var typeNames = this.mapVisit(ctx.typeName);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
            ctx.Permits[0],
            (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(commas, typeNames))]))
        ]));
    };
    ClassesPrettierVisitor.prototype.interfaceTypeList = function (ctx) {
        var interfaceType = this.mapVisit(ctx.interfaceType);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(commas, interfaceType));
    };
    ClassesPrettierVisitor.prototype.classBody = function (ctx, param) {
        var content = "";
        if (ctx.classBodyDeclaration !== undefined) {
            var classBodyDeclsVisited = (0, printer_utils_1.reject)(this.mapVisit(ctx.classBodyDeclaration));
            var separators = (0, printer_utils_1.getClassBodyDeclarationsSeparator)(ctx.classBodyDeclaration);
            content = (0, printer_utils_1.rejectAndJoinSeps)(separators, classBodyDeclsVisited);
            // edge case when we have SemiColons
            var shouldHardline_1 = false;
            ctx.classBodyDeclaration.forEach(function (elt) {
                if ((elt.children.classMemberDeclaration &&
                    !elt.children.classMemberDeclaration[0].children.Semicolon) ||
                    elt.children.constructorDeclaration) {
                    shouldHardline_1 = true;
                }
            });
            if ((ctx.classBodyDeclaration[0].children.classMemberDeclaration ||
                ctx.classBodyDeclaration[0].children.constructorDeclaration) &&
                shouldHardline_1 &&
                param &&
                param.isNormalClassDeclaration) {
                content = (0, printer_utils_1.rejectAndConcat)([hardline, content]);
            }
        }
        return (0, printer_utils_1.putIntoBraces)(content, hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    ClassesPrettierVisitor.prototype.classBodyDeclaration = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.classMemberDeclaration = function (ctx) {
        if (ctx.Semicolon) {
            return (0, printer_utils_1.displaySemicolon)(ctx.Semicolon[0]);
        }
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.fieldDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.fieldModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var unannType = this.visit(ctx.unannType);
        var variableDeclaratorList = this.visit(ctx.variableDeclaratorList);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                unannType,
                (0, prettier_builder_1.concat)([variableDeclaratorList, ctx.Semicolon[0]])
            ])
        ]);
    };
    ClassesPrettierVisitor.prototype.fieldModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visit(ctx.annotation);
        }
        // public | protected | private | ...
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.variableDeclaratorList = function (ctx) {
        var variableDeclarators = this.mapVisit(ctx.variableDeclarator);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, " "]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, variableDeclarators);
    };
    ClassesPrettierVisitor.prototype.variableDeclarator = function (ctx) {
        var variableDeclaratorId = this.visit(ctx.variableDeclaratorId);
        if (ctx.Equals) {
            var variableInitializer = this.visit(ctx.variableInitializer);
            if ((0, comments_utils_1.hasLeadingLineComments)(ctx.variableInitializer[0])) {
                return (0, prettier_builder_1.group)((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)(hardline, [
                    (0, printer_utils_1.rejectAndJoin)(" ", [variableDeclaratorId, ctx.Equals[0]]),
                    variableInitializer
                ])));
            }
            if (
            // Array Initialisation
            ctx.variableInitializer[0].children.arrayInitializer !== undefined ||
                // Lambda expression
                ctx.variableInitializer[0].children.expression[0].children
                    .lambdaExpression !== undefined ||
                // Ternary Expression
                (ctx.variableInitializer[0].children.expression[0].children
                    .ternaryExpression !== undefined &&
                    ctx.variableInitializer[0].children.expression[0].children
                        .ternaryExpression[0].children.QuestionMark !== undefined)) {
                return (0, printer_utils_1.rejectAndJoin)(" ", [
                    variableDeclaratorId,
                    ctx.Equals[0],
                    variableInitializer
                ]);
            }
            if (ctx.variableInitializer[0].children.expression[0].children
                .ternaryExpression !== undefined) {
                var firstPrimary = ctx.variableInitializer[0].children.expression[0].children
                    .ternaryExpression[0].children.binaryExpression[0].children
                    .unaryExpression[0].children.primary[0];
                // Cast Expression
                if (firstPrimary.children.primaryPrefix[0].children.castExpression !==
                    undefined) {
                    return (0, printer_utils_1.rejectAndJoin)(" ", [
                        variableDeclaratorId,
                        ctx.Equals[0],
                        variableInitializer
                    ]);
                }
                // New Expression
                if (firstPrimary.children.primaryPrefix[0].children.newExpression !==
                    undefined) {
                    return (0, printer_utils_1.rejectAndJoin)(" ", [
                        variableDeclaratorId,
                        ctx.Equals[0],
                        variableInitializer
                    ]);
                }
                // Method Invocation
                var isMethodInvocation = firstPrimary.children.primarySuffix !== undefined &&
                    firstPrimary.children.primarySuffix[0].children
                        .methodInvocationSuffix !== undefined;
                var isUniqueUnaryExpression = ctx.variableInitializer[0].children.expression[0].children
                    .ternaryExpression[0].children.binaryExpression[0].children
                    .unaryExpression.length === 1;
                var isUniqueMethodInvocation = isMethodInvocation && isUniqueUnaryExpression;
                if (isUniqueMethodInvocation) {
                    return (0, printer_utils_1.rejectAndJoin)(" ", [
                        variableDeclaratorId,
                        ctx.Equals[0],
                        variableInitializer
                    ]);
                }
            }
            return (0, prettier_builder_1.group)((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)(line, [
                (0, printer_utils_1.rejectAndJoin)(" ", [variableDeclaratorId, ctx.Equals[0]]),
                variableInitializer
            ])));
        }
        return variableDeclaratorId;
    };
    ClassesPrettierVisitor.prototype.variableDeclaratorId = function (ctx) {
        var identifier = ctx.Identifier[0];
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndConcat)([identifier, dims]);
    };
    ClassesPrettierVisitor.prototype.variableInitializer = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.unannType = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.unannPrimitiveTypeWithOptionalDimsSuffix = function (ctx) {
        var unannPrimitiveType = this.visit(ctx.unannPrimitiveType);
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndConcat)([unannPrimitiveType, dims]);
    };
    ClassesPrettierVisitor.prototype.unannPrimitiveType = function (ctx) {
        if (ctx.numericType) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.unannReferenceType = function (ctx) {
        var unannClassOrInterfaceType = this.visit(ctx.unannClassOrInterfaceType);
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndConcat)([unannClassOrInterfaceType, dims]);
    };
    ClassesPrettierVisitor.prototype.unannClassOrInterfaceType = function (ctx) {
        return this.visit(ctx.unannClassType);
    };
    ClassesPrettierVisitor.prototype.unannClassType = function (ctx) {
        var _this = this;
        var tokens = (0, printer_utils_1.sortClassTypeChildren)(ctx.annotation, ctx.typeArguments, ctx.Identifier);
        var segments = [];
        var currentSegment = [];
        (0, forEach_1.default)(tokens, function (token, i) {
            if ((0, utils_1.isTypeArgumentsCstNode)(token)) {
                currentSegment.push(_this.visit([token]));
                segments.push((0, printer_utils_1.rejectAndConcat)(currentSegment));
                currentSegment = [];
            }
            else if ((0, utils_1.isAnnotationCstNode)(token)) {
                currentSegment.push(_this.visit([token]));
                currentSegment.push(" ");
            }
            else {
                currentSegment.push(token);
                if ((i + 1 < tokens.length && !(0, utils_1.isTypeArgumentsCstNode)(tokens[i + 1])) ||
                    i + 1 === tokens.length) {
                    segments.push((0, printer_utils_1.rejectAndConcat)(currentSegment));
                    currentSegment = [];
                }
            }
        });
        return (0, printer_utils_1.rejectAndJoinSeps)(ctx.Dot, segments);
    };
    ClassesPrettierVisitor.prototype.unannInterfaceType = function (ctx) {
        return this.visit(ctx.unannClassType);
    };
    ClassesPrettierVisitor.prototype.unannTypeVariable = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.methodDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.methodModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var header = this.visit(ctx.methodHeader);
        var body = this.visit(ctx.methodBody);
        var headerBodySeparator = (0, printer_utils_1.isStatementEmptyStatement)(body) ? "" : " ";
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                (0, printer_utils_1.rejectAndJoin)(headerBodySeparator, [header, body])
            ])
        ]);
    };
    ClassesPrettierVisitor.prototype.methodModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visit(ctx.annotation);
        }
        // public | protected | private | Synchronized | ...
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.methodHeader = function (ctx) {
        var typeParameters = this.visit(ctx.typeParameters);
        var annotations = this.mapVisit(ctx.annotation);
        var result = this.visit(ctx.result);
        var declarator = this.visit(ctx.methodDeclarator);
        var throws = this.visit(ctx.throws);
        return (0, prettier_builder_1.group)((0, prettier_builder_1.concat)([
            (0, printer_utils_1.rejectAndJoin)(" ", [
                typeParameters,
                (0, printer_utils_1.rejectAndJoin)(line, annotations),
                result,
                declarator,
                throws
            ])
        ]));
    };
    ClassesPrettierVisitor.prototype.result = function (ctx) {
        if (ctx.unannType) {
            return this.visit(ctx.unannType);
        }
        // void
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.methodDeclarator = function (ctx) {
        var identifier = (0, format_comments_1.printTokenWithComments)(ctx.Identifier[0]);
        var formalParameterList = this.visit(ctx.formalParameterList);
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndConcat)([
            identifier,
            (0, printer_utils_1.putIntoBraces)(formalParameterList, softline, ctx.LBrace[0], ctx.RBrace[0]),
            dims
        ]);
    };
    ClassesPrettierVisitor.prototype.receiverParameter = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var unannType = this.visit(ctx.unannType);
        var identifier = ctx.Identifier
            ? (0, prettier_builder_1.concat)([ctx.Identifier[0], ctx.Dot[0]])
            : "";
        return (0, printer_utils_1.rejectAndJoin)("", [
            (0, printer_utils_1.rejectAndJoin)(" ", annotations),
            unannType,
            identifier,
            ctx.This[0]
        ]);
    };
    ClassesPrettierVisitor.prototype.formalParameterList = function (ctx) {
        var formalParameter = this.mapVisit(ctx.formalParameter);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, formalParameter);
    };
    ClassesPrettierVisitor.prototype.formalParameter = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.variableParaRegularParameter = function (ctx) {
        var variableModifier = this.mapVisit(ctx.variableModifier);
        var unannType = this.visit(ctx.unannType);
        var variableDeclaratorId = this.visit(ctx.variableDeclaratorId);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", variableModifier),
            unannType,
            variableDeclaratorId
        ]);
    };
    ClassesPrettierVisitor.prototype.variableArityParameter = function (ctx) {
        var variableModifier = this.mapVisit(ctx.variableModifier);
        var unannType = this.visit(ctx.unannType);
        var annotations = this.mapVisit(ctx.annotation);
        var identifier = ctx.Identifier[0];
        var unannTypePrinted = ctx.annotation === undefined
            ? (0, prettier_builder_1.concat)([unannType, ctx.DotDotDot[0]])
            : unannType;
        var annotationsPrinted = ctx.annotation === undefined
            ? annotations
            : (0, prettier_builder_1.concat)([(0, printer_utils_1.rejectAndJoin)(" ", annotations), ctx.DotDotDot[0]]);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.join)(" ", variableModifier),
            unannTypePrinted,
            annotationsPrinted,
            identifier
        ]);
    };
    ClassesPrettierVisitor.prototype.variableModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visit(ctx.annotation);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.throws = function (ctx) {
        var exceptionTypeList = this.visit(ctx.exceptionTypeList);
        var throwsDeclaration = (0, prettier_builder_1.join)(" ", [ctx.Throws[0], exceptionTypeList]);
        return (0, prettier_builder_1.group)((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([softline, throwsDeclaration])));
    };
    ClassesPrettierVisitor.prototype.exceptionTypeList = function (ctx) {
        var exceptionTypes = this.mapVisit(ctx.exceptionType);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, " "]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, exceptionTypes);
    };
    ClassesPrettierVisitor.prototype.exceptionType = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.methodBody = function (ctx) {
        if (ctx.block) {
            return this.visit(ctx.block);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.instanceInitializer = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.staticInitializer = function (ctx) {
        var block = this.visit(ctx.block);
        return (0, prettier_builder_1.join)(" ", [ctx.Static[0], block]);
    };
    ClassesPrettierVisitor.prototype.constructorDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.constructorModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var constructorDeclarator = this.visit(ctx.constructorDeclarator);
        var throws = this.visit(ctx.throws);
        var constructorBody = this.visit(ctx.constructorBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(hardline, [
                (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
                (0, printer_utils_1.rejectAndJoin)(" ", [
                    (0, prettier_builder_1.join)(" ", otherModifiers),
                    constructorDeclarator,
                    throws
                ])
            ])),
            constructorBody
        ]);
    };
    ClassesPrettierVisitor.prototype.constructorModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visit(ctx.annotation);
        }
        // public | protected | private | Synchronized | ...
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.constructorDeclarator = function (ctx) {
        var typeParameters = this.visit(ctx.typeParameters);
        var simpleTypeName = this.visit(ctx.simpleTypeName);
        var receiverParameter = this.visit(ctx.receiverParameter);
        var formalParameterList = this.visit(ctx.formalParameterList);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, " "]); }) : [];
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            typeParameters,
            (0, prettier_builder_1.concat)([
                simpleTypeName,
                (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndJoinSeps)(commas, [receiverParameter, formalParameterList]), softline, ctx.LBrace[0], ctx.RBrace[0])
            ])
        ]);
    };
    ClassesPrettierVisitor.prototype.simpleTypeName = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ClassesPrettierVisitor.prototype.constructorBody = function (ctx) {
        var explicitConstructorInvocation = this.visit(ctx.explicitConstructorInvocation);
        var blockStatements = this.visit(ctx.blockStatements);
        return (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndJoin)(hardline, [explicitConstructorInvocation, blockStatements]), hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    ClassesPrettierVisitor.prototype.explicitConstructorInvocation = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.unqualifiedExplicitConstructorInvocation = function (ctx) {
        var typeArguments = this.visit(ctx.typeArguments);
        var keyWord = ctx.This ? ctx.This[0] : ctx.Super[0];
        var argumentList = utils_2.printArgumentListWithBraces.call(this, ctx.argumentList, ctx.RBrace[0], ctx.LBrace[0]);
        return (0, printer_utils_1.rejectAndConcat)([
            typeArguments,
            keyWord,
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([argumentList, ctx.Semicolon[0]]))
        ]);
    };
    ClassesPrettierVisitor.prototype.qualifiedExplicitConstructorInvocation = function (ctx) {
        var expressionName = this.visit(ctx.expressionName);
        var typeArguments = this.visit(ctx.typeArguments);
        var argumentList = utils_2.printArgumentListWithBraces.call(this, ctx.argumentList, ctx.RBrace[0], ctx.LBrace[0]);
        return (0, printer_utils_1.rejectAndConcat)([
            expressionName,
            ctx.Dot[0],
            typeArguments,
            ctx.Super[0],
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([argumentList, ctx.Semicolon[0]]))
        ]);
    };
    ClassesPrettierVisitor.prototype.enumDeclaration = function (ctx) {
        var classModifier = this.mapVisit(ctx.classModifier);
        var typeIdentifier = this.visit(ctx.typeIdentifier);
        var superinterfaces = this.visit(ctx.superinterfaces);
        var enumBody = this.visit(ctx.enumBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.join)(" ", classModifier),
            ctx.Enum[0],
            typeIdentifier,
            superinterfaces,
            enumBody
        ]);
    };
    ClassesPrettierVisitor.prototype.enumBody = function (ctx) {
        var enumConstantList = this.visit(ctx.enumConstantList);
        var enumBodyDeclarations = this.visit(ctx.enumBodyDeclarations);
        var hasEnumConstants = ctx.enumConstantList !== undefined;
        var hasNoClassBodyDeclarations = ctx.enumBodyDeclarations === undefined ||
            ctx.enumBodyDeclarations[0].children.classBodyDeclaration === undefined;
        // edge case: https://github.com/jhipster/prettier-java/issues/383
        var handleEnumBodyDeclarationsLeadingComments = !hasNoClassBodyDeclarations &&
            (0, comments_utils_1.hasLeadingComments)(ctx.enumBodyDeclarations[0])
            ? hardline
            : "";
        var optionalComma;
        if (hasEnumConstants &&
            hasNoClassBodyDeclarations &&
            this.prettierOptions.trailingComma !== "none") {
            optionalComma = ctx.Comma ? ctx.Comma[0] : ",";
        }
        else {
            optionalComma = ctx.Comma ? __assign(__assign({}, ctx.Comma[0]), { image: "" }) : "";
        }
        return (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndConcat)([
            enumConstantList,
            optionalComma,
            handleEnumBodyDeclarationsLeadingComments,
            enumBodyDeclarations
        ]), hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    ClassesPrettierVisitor.prototype.enumConstantList = function (ctx) {
        var enumConstants = this.mapVisit(ctx.enumConstant);
        var blankLineSeparators = (0, printer_utils_1.getBlankLinesSeparator)(ctx.enumConstant);
        var commas = ctx.Comma
            ? ctx.Comma.map(function (elt, index) {
                return (0, prettier_builder_1.concat)([elt, blankLineSeparators[index]]);
            })
            : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(commas, enumConstants));
    };
    ClassesPrettierVisitor.prototype.enumConstant = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.enumConstantModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var identifier = ctx.Identifier[0];
        var classBody = this.visit(ctx.classBody);
        var optionalBracesAndArgumentList = ctx.LBrace
            ? utils_2.printArgumentListWithBraces.call(this, ctx.argumentList, ctx.RBrace[0], ctx.LBrace[0])
            : "";
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                (0, printer_utils_1.rejectAndConcat)([identifier, optionalBracesAndArgumentList]),
                classBody
            ])
        ]);
    };
    ClassesPrettierVisitor.prototype.enumConstantModifier = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.enumBodyDeclarations = function (ctx) {
        if (ctx.classBodyDeclaration !== undefined) {
            var classBodyDeclaration = this.mapVisit(ctx.classBodyDeclaration);
            var separators = (0, printer_utils_1.getClassBodyDeclarationsSeparator)(ctx.classBodyDeclaration);
            return (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([hardline, hardline]), [
                ctx.Semicolon[0],
                (0, printer_utils_1.rejectAndJoinSeps)(separators, classBodyDeclaration)
            ]);
        }
        return (0, format_comments_1.printTokenWithComments)(__assign(__assign({}, ctx.Semicolon[0]), { image: "" }));
    };
    ClassesPrettierVisitor.prototype.recordDeclaration = function (ctx) {
        var name = this.visit(ctx.typeIdentifier);
        var optionalTypeParams = this.visit(ctx.typeParameters);
        var recordHeader = this.visit(ctx.recordHeader);
        var superInterfacesPart = "";
        var optionalSuperInterfaces = this.visit(ctx.superinterfaces);
        if (optionalSuperInterfaces) {
            superInterfacesPart = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, optionalSuperInterfaces]));
        }
        var body = this.visit(ctx.recordBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
                (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Record[0], name]),
                optionalTypeParams,
                recordHeader,
                superInterfacesPart
            ])),
            body
        ]);
    };
    ClassesPrettierVisitor.prototype.recordHeader = function (ctx) {
        var recordComponentList = this.visit(ctx.recordComponentList);
        return (0, printer_utils_1.putIntoBraces)(recordComponentList, softline, ctx.LBrace[0], ctx.RBrace[0]);
    };
    ClassesPrettierVisitor.prototype.recordComponentList = function (ctx) {
        var recordComponents = this.mapVisit(ctx.recordComponent);
        var blankLineSeparators = (0, printer_utils_1.getBlankLinesSeparator)(ctx.recordComponent, line);
        var commas = ctx.Comma
            ? ctx.Comma.map(function (elt, index) {
                return (0, prettier_builder_1.concat)([elt, blankLineSeparators[index]]);
            })
            : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, recordComponents);
    };
    ClassesPrettierVisitor.prototype.recordComponent = function (ctx) {
        var modifiers = this.mapVisit(ctx.recordComponentModifier);
        var unannType = this.visit(ctx.unannType);
        if (ctx.Identifier !== undefined) {
            return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(line, [
                (0, prettier_builder_1.join)(line, modifiers),
                (0, prettier_builder_1.join)(" ", [unannType, ctx.Identifier[0]])
            ]));
        }
        var variableArityRecordComponent = this.visit(ctx.variableArityRecordComponent);
        if (ctx.variableArityRecordComponent[0].children.annotation !== undefined) {
            return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(line, [
                (0, prettier_builder_1.join)(line, modifiers),
                (0, prettier_builder_1.join)(" ", [unannType, variableArityRecordComponent])
            ]));
        }
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(line, [
            (0, prettier_builder_1.join)(line, modifiers),
            (0, prettier_builder_1.concat)([unannType, variableArityRecordComponent])
        ]));
    };
    ClassesPrettierVisitor.prototype.variableArityRecordComponent = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var identifier = ctx.Identifier[0];
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndConcat)([(0, printer_utils_1.rejectAndJoin)(" ", annotations), ctx.DotDotDot[0]]),
            identifier
        ]);
    };
    ClassesPrettierVisitor.prototype.recordComponentModifier = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.recordBody = function (ctx) {
        return (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndJoinSeps)((0, printer_utils_1.getBlankLinesSeparator)(ctx.recordBodyDeclaration), this.mapVisit(ctx.recordBodyDeclaration)), hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    ClassesPrettierVisitor.prototype.recordBodyDeclaration = function (ctx) {
        return this.visitSingle(ctx);
    };
    ClassesPrettierVisitor.prototype.compactConstructorDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.constructorModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var name = this.visit(ctx.simpleTypeName);
        var constructorBody = this.visit(ctx.constructorBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(hardline, [
                (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
                (0, printer_utils_1.rejectAndJoin)(" ", [(0, prettier_builder_1.join)(" ", otherModifiers), name])
            ])),
            constructorBody
        ]);
    };
    ClassesPrettierVisitor.prototype.isClassDeclaration = function () {
        return "isClassDeclaration";
    };
    ClassesPrettierVisitor.prototype.identifyClassBodyDeclarationType = function () {
        return "identifyClassBodyDeclarationType";
    };
    ClassesPrettierVisitor.prototype.isDims = function () {
        return "isDims";
    };
    ClassesPrettierVisitor.prototype.isCompactConstructorDeclaration = function () {
        return "isCompactConstructorDeclaration";
    };
    return ClassesPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.ClassesPrettierVisitor = ClassesPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xhc3Nlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmludGVycy9jbGFzc2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkRBQXFDO0FBQ3JDLGlEQVl5QjtBQUN6Qix1REFBaUU7QUFDakUsOERBQW9FO0FBQ3BFLDREQUdtQztBQUNuQyxvQ0FBd0M7QUFDeEMsd0RBQTZEO0FBdUU3RCx3Q0FBNkU7QUFDN0Usa0NBQXVEO0FBRS9DLElBQUEsSUFBSSxHQUF5QixjQUFRLEtBQWpDLEVBQUUsUUFBUSxHQUFlLGNBQVEsU0FBdkIsRUFBRSxRQUFRLEdBQUssY0FBUSxTQUFiLENBQWM7QUFFOUM7SUFBNEMsMENBQXNCO0lBQWxFOztJQWk3QkEsQ0FBQztJQWg3QkMsaURBQWdCLEdBQWhCLFVBQWlCLEdBQXdCO1FBQ3ZDLElBQU0sU0FBUyxHQUFHLElBQUEsNkJBQWEsRUFBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbkQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsSUFBSSxRQUFRLENBQUM7UUFDYixJQUFJLEdBQUcsQ0FBQyxzQkFBc0IsS0FBSyxTQUFTLEVBQUU7WUFDNUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztTQUN2QzthQUFNLElBQUksR0FBRyxDQUFDLGVBQWUsS0FBSyxTQUFTLEVBQUU7WUFDNUMsUUFBUSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUM7U0FDaEM7YUFBTTtZQUNMLFFBQVEsR0FBRyxHQUFHLENBQUMsaUJBQWlCLENBQUM7U0FDbEM7UUFFRCxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRXRDLE9BQU8sSUFBQSw2QkFBYSxFQUFDLFFBQVEsRUFBRTtZQUM3QixJQUFBLDZCQUFhLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixDQUFDO1lBQ3pDLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFBLHVCQUFJLEVBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQzFELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx1REFBc0IsR0FBdEIsVUFBdUIsR0FBOEI7UUFDbkQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDNUMsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxRCxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3hELElBQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDaEUsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMxRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBRSx3QkFBd0IsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBRTNFLElBQUksZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO1FBQzFCLElBQUksb0JBQW9CLEVBQUU7WUFDeEIsZ0JBQWdCLEdBQUcsSUFBQSx5QkFBTSxFQUFDLElBQUEsK0JBQWUsRUFBQyxDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMxRTtRQUVELElBQUksbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1FBQzdCLElBQUksdUJBQXVCLEVBQUU7WUFDM0IsbUJBQW1CLEdBQUcsSUFBQSx5QkFBTSxFQUMxQixJQUFBLCtCQUFlLEVBQUMsQ0FBQyxJQUFJLEVBQUUsdUJBQXVCLENBQUMsQ0FBQyxDQUNqRCxDQUFDO1NBQ0g7UUFFRCxJQUFJLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDdEIsSUFBSSxvQkFBb0IsRUFBRTtZQUN4QixZQUFZLEdBQUcsSUFBQSx5QkFBTSxFQUFDLElBQUEsK0JBQWUsRUFBQyxDQUFDLElBQUksRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0RTtRQUVELE9BQU8sSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtZQUN4QixJQUFBLHdCQUFLLEVBQ0gsSUFBQSwrQkFBZSxFQUFDO2dCQUNkLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxrQkFBa0I7Z0JBQ2xCLGdCQUFnQjtnQkFDaEIsbUJBQW1CO2dCQUNuQixZQUFZO2FBQ2IsQ0FBQyxDQUNIO1lBQ0QsSUFBSTtTQUNMLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw4Q0FBYSxHQUFiLFVBQWMsR0FBcUI7UUFDakMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkM7UUFDRCxxQ0FBcUM7UUFDckMsT0FBTyxJQUFBLHdDQUFzQixFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsK0NBQWMsR0FBZCxVQUFlLEdBQXNCO1FBQ25DLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUU1RCxPQUFPLElBQUEsNkJBQWEsRUFDbEIsaUJBQWlCLEVBQ2pCLFFBQVEsRUFDUixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUNYLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRCxrREFBaUIsR0FBakIsVUFBa0IsR0FBeUI7UUFDekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMUUsT0FBTyxJQUFBLHdCQUFLLEVBQUMsSUFBQSxpQ0FBaUIsRUFBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsMkNBQVUsR0FBVixVQUFXLEdBQWtCO1FBQzNCLE9BQU8sSUFBQSx1QkFBSSxFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxnREFBZSxHQUFmLFVBQWdCLEdBQXVCO1FBQ3JDLElBQU0saUJBQWlCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztRQUU1RCxPQUFPLElBQUEsd0JBQUssRUFDVixJQUFBLCtCQUFlLEVBQUM7WUFDZCxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNqQixJQUFBLHlCQUFNLEVBQUMsSUFBQSwrQkFBZSxFQUFDLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQztTQUNuRCxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCw2Q0FBWSxHQUFaLFVBQWEsR0FBb0I7UUFDL0IsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUMsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMUUsT0FBTyxJQUFBLHdCQUFLLEVBQ1YsSUFBQSwrQkFBZSxFQUFDO1lBQ2QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZCxJQUFBLHlCQUFNLEVBQ0osSUFBQSwrQkFBZSxFQUFDLENBQUMsSUFBSSxFQUFFLElBQUEsd0JBQUssRUFBQyxJQUFBLGlDQUFpQixFQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDckU7U0FDRixDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCxrREFBaUIsR0FBakIsVUFBa0IsR0FBeUI7UUFDekMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFMUUsT0FBTyxJQUFBLHdCQUFLLEVBQUMsSUFBQSxpQ0FBaUIsRUFBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBRUQsMENBQVMsR0FBVCxVQUFVLEdBQWlCLEVBQUUsS0FBVTtRQUNyQyxJQUFJLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDdEIsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEtBQUssU0FBUyxFQUFFO1lBQzFDLElBQU0scUJBQXFCLEdBQUcsSUFBQSxzQkFBTSxFQUNsQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUN4QyxDQUFDO1lBRUYsSUFBTSxVQUFVLEdBQUcsSUFBQSxpREFBaUMsRUFDbEQsR0FBRyxDQUFDLG9CQUFvQixDQUN6QixDQUFDO1lBRUYsT0FBTyxHQUFHLElBQUEsaUNBQWlCLEVBQUMsVUFBVSxFQUFFLHFCQUFxQixDQUFDLENBQUM7WUFFL0Qsb0NBQW9DO1lBQ3BDLElBQUksZ0JBQWMsR0FBRyxLQUFLLENBQUM7WUFDM0IsR0FBRyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7Z0JBQ2xDLElBQ0UsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLHNCQUFzQjtvQkFDbEMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7b0JBQzdELEdBQUcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQ25DO29CQUNBLGdCQUFjLEdBQUcsSUFBSSxDQUFDO2lCQUN2QjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFDRSxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCO2dCQUMxRCxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLHNCQUFzQixDQUFDO2dCQUM5RCxnQkFBYztnQkFDZCxLQUFLO2dCQUNMLEtBQUssQ0FBQyx3QkFBd0IsRUFDOUI7Z0JBQ0EsT0FBTyxHQUFHLElBQUEsK0JBQWUsRUFBQyxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ2hEO1NBQ0Y7UUFFRCxPQUFPLElBQUEsNkJBQWEsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxxREFBb0IsR0FBcEIsVUFBcUIsR0FBNEI7UUFDL0MsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx1REFBc0IsR0FBdEIsVUFBdUIsR0FBOEI7UUFDbkQsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO1lBQ2pCLE9BQU8sSUFBQSxnQ0FBZ0IsRUFBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDM0M7UUFFRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGlEQUFnQixHQUFoQixVQUFpQixHQUF3QjtRQUN2QyxJQUFNLFNBQVMsR0FBRyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ25ELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5ELElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzVDLElBQU0sc0JBQXNCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUV0RSxPQUFPLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUU7WUFDN0IsSUFBQSw2QkFBYSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQztZQUN6QyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQztnQkFDbEMsU0FBUztnQkFDVCxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxzQkFBc0IsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkQsQ0FBQztTQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCw4Q0FBYSxHQUFiLFVBQWMsR0FBcUI7UUFDakMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkM7UUFDRCxxQ0FBcUM7UUFDckMsT0FBTyxJQUFBLHdDQUFzQixFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsdURBQXNCLEdBQXRCLFVBQXVCLEdBQThCO1FBQ25ELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNsRSxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUEseUJBQU0sRUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUN6RSxPQUFPLElBQUEsaUNBQWlCLEVBQUMsTUFBTSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVELG1EQUFrQixHQUFsQixVQUFtQixHQUEwQjtRQUMzQyxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDbEUsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO1lBQ2QsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1lBRWhFLElBQUksSUFBQSx1Q0FBc0IsRUFBQyxHQUFHLENBQUMsbUJBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDdkQsT0FBTyxJQUFBLHdCQUFLLEVBQ1YsSUFBQSx5QkFBTSxFQUNKLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUU7b0JBQ3RCLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pELG1CQUFtQjtpQkFDcEIsQ0FBQyxDQUNILENBQ0YsQ0FBQzthQUNIO1lBRUQ7WUFDRSx1QkFBdUI7WUFDdkIsR0FBRyxDQUFDLG1CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTO2dCQUNuRSxvQkFBb0I7Z0JBQ3BCLEdBQUcsQ0FBQyxtQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7cUJBQ3pELGdCQUFnQixLQUFLLFNBQVM7Z0JBQ2pDLHFCQUFxQjtnQkFDckIsQ0FBQyxHQUFHLENBQUMsbUJBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO3FCQUMxRCxpQkFBaUIsS0FBSyxTQUFTO29CQUNoQyxHQUFHLENBQUMsbUJBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO3lCQUN6RCxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxFQUM5RDtnQkFDQSxPQUFPLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7b0JBQ3hCLG9CQUFvQjtvQkFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2IsbUJBQW1CO2lCQUNwQixDQUFDLENBQUM7YUFDSjtZQUVELElBQ0UsR0FBRyxDQUFDLG1CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtpQkFDekQsaUJBQWlCLEtBQUssU0FBUyxFQUNsQztnQkFDQSxJQUFNLFlBQVksR0FDaEIsR0FBRyxDQUFDLG1CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtxQkFDekQsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7cUJBQzFELGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUU1QyxrQkFBa0I7Z0JBQ2xCLElBQ0UsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWM7b0JBQzlELFNBQVMsRUFDVDtvQkFDQSxPQUFPLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7d0JBQ3hCLG9CQUFvQjt3QkFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2IsbUJBQW1CO3FCQUNwQixDQUFDLENBQUM7aUJBQ0o7Z0JBRUQsaUJBQWlCO2dCQUNqQixJQUNFLFlBQVksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxhQUFhO29CQUM3RCxTQUFTLEVBQ1Q7b0JBQ0EsT0FBTyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO3dCQUN4QixvQkFBb0I7d0JBQ3BCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNiLG1CQUFtQjtxQkFDcEIsQ0FBQyxDQUFDO2lCQUNKO2dCQUVELG9CQUFvQjtnQkFDcEIsSUFBTSxrQkFBa0IsR0FDdEIsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssU0FBUztvQkFDakQsWUFBWSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTt5QkFDNUMsc0JBQXNCLEtBQUssU0FBUyxDQUFDO2dCQUMxQyxJQUFNLHVCQUF1QixHQUMzQixHQUFHLENBQUMsbUJBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO3FCQUN6RCxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtxQkFDMUQsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7Z0JBRWxDLElBQU0sd0JBQXdCLEdBQzVCLGtCQUFrQixJQUFJLHVCQUF1QixDQUFDO2dCQUNoRCxJQUFJLHdCQUF3QixFQUFFO29CQUM1QixPQUFPLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7d0JBQ3hCLG9CQUFvQjt3QkFDcEIsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2IsbUJBQW1CO3FCQUNwQixDQUFDLENBQUM7aUJBQ0o7YUFDRjtZQUVELE9BQU8sSUFBQSx3QkFBSyxFQUNWLElBQUEseUJBQU0sRUFDSixJQUFBLDZCQUFhLEVBQUMsSUFBSSxFQUFFO2dCQUNsQixJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFLENBQUMsb0JBQW9CLEVBQUUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxtQkFBbUI7YUFDcEIsQ0FBQyxDQUNILENBQ0YsQ0FBQztTQUNIO1FBQ0QsT0FBTyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDO0lBRUQscURBQW9CLEdBQXBCLFVBQXFCLEdBQTRCO1FBQy9DLElBQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFbEMsT0FBTyxJQUFBLCtCQUFlLEVBQUMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsb0RBQW1CLEdBQW5CLFVBQW9CLEdBQTJCO1FBQzdDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsMENBQVMsR0FBVCxVQUFVLEdBQWlCO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQseUVBQXdDLEdBQXhDLFVBQ0UsR0FBZ0Q7UUFFaEQsSUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBQzlELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLE9BQU8sSUFBQSwrQkFBZSxFQUFDLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsbURBQWtCLEdBQWxCLFVBQW1CLEdBQTBCO1FBQzNDLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRTtZQUNuQixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxtREFBa0IsR0FBbEIsVUFBbUIsR0FBMEI7UUFDM0MsSUFBTSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1FBQzVFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLE9BQU8sSUFBQSwrQkFBZSxFQUFDLENBQUMseUJBQXlCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsMERBQXlCLEdBQXpCLFVBQTBCLEdBQWlDO1FBQ3pELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDeEMsQ0FBQztJQUVELCtDQUFjLEdBQWQsVUFBZSxHQUFzQjtRQUFyQyxpQkErQkM7UUE5QkMsSUFBTSxNQUFNLEdBQUcsSUFBQSxxQ0FBcUIsRUFDbEMsR0FBRyxDQUFDLFVBQVUsRUFDZCxHQUFHLENBQUMsYUFBYSxFQUNqQixHQUFHLENBQUMsVUFBVSxDQUNmLENBQUM7UUFFRixJQUFNLFFBQVEsR0FBVSxFQUFFLENBQUM7UUFDM0IsSUFBSSxjQUFjLEdBQXFCLEVBQUUsQ0FBQztRQUUxQyxJQUFBLGlCQUFPLEVBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkIsSUFBSSxJQUFBLDhCQUFzQixFQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNqQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBQSwrQkFBZSxFQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9DLGNBQWMsR0FBRyxFQUFFLENBQUM7YUFDckI7aUJBQU0sSUFBSSxJQUFBLDJCQUFtQixFQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0wsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFlLENBQUMsQ0FBQztnQkFDckMsSUFDRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUEsOEJBQXNCLEVBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNqRSxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxNQUFNLEVBQ3ZCO29CQUNBLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBQSwrQkFBZSxFQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7b0JBQy9DLGNBQWMsR0FBRyxFQUFFLENBQUM7aUJBQ3JCO2FBQ0Y7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sSUFBQSxpQ0FBaUIsRUFBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxtREFBa0IsR0FBbEIsVUFBbUIsR0FBMEI7UUFDM0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsa0RBQWlCLEdBQWpCLFVBQWtCLEdBQXlCO1FBQ3pDLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGtEQUFpQixHQUFqQixVQUFrQixHQUF5QjtRQUN6QyxJQUFNLFNBQVMsR0FBRyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3BELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5ELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQzVDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXhDLElBQU0sbUJBQW1CLEdBQUcsSUFBQSx5Q0FBeUIsRUFBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFdkUsT0FBTyxJQUFBLDZCQUFhLEVBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7WUFDekMsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxjQUFjLENBQUM7Z0JBQ2xDLElBQUEsNkJBQWEsRUFBQyxtQkFBbUIsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNuRCxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELCtDQUFjLEdBQWQsVUFBZSxHQUFzQjtRQUNuQyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQztRQUNELG9EQUFvRDtRQUNwRCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCw2Q0FBWSxHQUFaLFVBQWEsR0FBb0I7UUFDL0IsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEMsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNwRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUV0QyxPQUFPLElBQUEsd0JBQUssRUFDVixJQUFBLHlCQUFNLEVBQUM7WUFDTCxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO2dCQUNqQixjQUFjO2dCQUNkLElBQUEsNkJBQWEsRUFBQyxJQUFJLEVBQUUsV0FBVyxDQUFDO2dCQUNoQyxNQUFNO2dCQUNOLFVBQVU7Z0JBQ1YsTUFBTTthQUNQLENBQUM7U0FDSCxDQUFDLENBQ0gsQ0FBQztJQUNKLENBQUM7SUFFRCx1Q0FBTSxHQUFOLFVBQU8sR0FBYztRQUNuQixJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNsQztRQUNELE9BQU87UUFDUCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxpREFBZ0IsR0FBaEIsVUFBaUIsR0FBd0I7UUFDdkMsSUFBTSxVQUFVLEdBQUcsSUFBQSx3Q0FBc0IsRUFBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0QsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWxDLE9BQU8sSUFBQSwrQkFBZSxFQUFDO1lBQ3JCLFVBQVU7WUFDVixJQUFBLDZCQUFhLEVBQ1gsbUJBQW1CLEVBQ25CLFFBQVEsRUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2Q7WUFDRCxJQUFJO1NBQ0wsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGtEQUFpQixHQUFqQixVQUFrQixHQUF5QjtRQUN6QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVTtZQUMvQixDQUFDLENBQUMsSUFBQSx5QkFBTSxFQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsR0FBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLE9BQU8sSUFBQSw2QkFBYSxFQUFDLEVBQUUsRUFBRTtZQUN2QixJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQztZQUMvQixTQUFTO1lBQ1QsVUFBVTtZQUNWLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ1osQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9EQUFtQixHQUFuQixVQUFvQixHQUEyQjtRQUM3QyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMzRCxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUEseUJBQU0sRUFBQyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUMxRSxPQUFPLElBQUEsaUNBQWlCLEVBQUMsTUFBTSxFQUFFLGVBQWUsQ0FBQyxDQUFDO0lBQ3BELENBQUM7SUFFRCxnREFBZSxHQUFmLFVBQWdCLEdBQXVCO1FBQ3JDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsNkRBQTRCLEdBQTVCLFVBQTZCLEdBQW9DO1FBQy9ELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFFbEUsT0FBTyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUM7WUFDcEMsU0FBUztZQUNULG9CQUFvQjtTQUNyQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsdURBQXNCLEdBQXRCLFVBQXVCLEdBQThCO1FBQ25ELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM3RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLElBQU0sZ0JBQWdCLEdBQ3BCLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUztZQUMxQixDQUFDLENBQUMsSUFBQSx5QkFBTSxFQUFDLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2hCLElBQU0sa0JBQWtCLEdBQ3RCLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUztZQUMxQixDQUFDLENBQUMsV0FBVztZQUNiLENBQUMsQ0FBQyxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtZQUN4QixJQUFBLHVCQUFJLEVBQUMsR0FBRyxFQUFFLGdCQUFnQixDQUFDO1lBQzNCLGdCQUFnQjtZQUNoQixrQkFBa0I7WUFDbEIsVUFBVTtTQUNYLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxpREFBZ0IsR0FBaEIsVUFBaUIsR0FBd0I7UUFDdkMsSUFBSSxHQUFHLENBQUMsVUFBVSxFQUFFO1lBQ2xCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCx1Q0FBTSxHQUFOLFVBQU8sR0FBYztRQUNuQixJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDNUQsSUFBTSxpQkFBaUIsR0FBRyxJQUFBLHVCQUFJLEVBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDeEUsT0FBTyxJQUFBLHdCQUFLLEVBQUMsSUFBQSx5QkFBTSxFQUFDLElBQUEsK0JBQWUsRUFBQyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxrREFBaUIsR0FBakIsVUFBa0IsR0FBeUI7UUFDekMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDeEQsSUFBTSxNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekUsT0FBTyxJQUFBLGlDQUFpQixFQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQsOENBQWEsR0FBYixVQUFjLEdBQXFCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsMkNBQVUsR0FBVixVQUFXLEdBQWtCO1FBQzNCLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNiLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxvREFBbUIsR0FBbkIsVUFBb0IsR0FBMkI7UUFDN0MsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxrREFBaUIsR0FBakIsVUFBa0IsR0FBeUI7UUFDekMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFcEMsT0FBTyxJQUFBLHVCQUFJLEVBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCx1REFBc0IsR0FBdEIsVUFBdUIsR0FBOEI7UUFDbkQsSUFBTSxTQUFTLEdBQUcsSUFBQSw2QkFBYSxFQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5ELElBQU0scUJBQXFCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNwRSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN0QyxJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV4RCxPQUFPLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7WUFDeEIsSUFBQSx3QkFBSyxFQUNILElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUU7Z0JBQ3RCLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7Z0JBQ3pDLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7b0JBQ2pCLElBQUEsdUJBQUksRUFBQyxHQUFHLEVBQUUsY0FBYyxDQUFDO29CQUN6QixxQkFBcUI7b0JBQ3JCLE1BQU07aUJBQ1AsQ0FBQzthQUNILENBQUMsQ0FDSDtZQUNELGVBQWU7U0FDaEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELG9EQUFtQixHQUFuQixVQUFvQixHQUEyQjtRQUM3QyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7WUFDbEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUNuQztRQUNELG9EQUFvRDtRQUNwRCxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxzREFBcUIsR0FBckIsVUFBc0IsR0FBNkI7UUFDakQsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQzVELElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNoRSxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLElBQUEseUJBQU0sRUFBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUV6RSxPQUFPLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUU7WUFDeEIsY0FBYztZQUNkLElBQUEseUJBQU0sRUFBQztnQkFDTCxjQUFjO2dCQUNkLElBQUEsNkJBQWEsRUFDWCxJQUFBLGlDQUFpQixFQUFDLE1BQU0sRUFBRSxDQUFDLGlCQUFpQixFQUFFLG1CQUFtQixDQUFDLENBQUMsRUFDbkUsUUFBUSxFQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDZDthQUNGLENBQUM7U0FDSCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsK0NBQWMsR0FBZCxVQUFlLEdBQXNCO1FBQ25DLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGdEQUFlLEdBQWYsVUFBZ0IsR0FBdUI7UUFDckMsSUFBTSw2QkFBNkIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM5QyxHQUFHLENBQUMsNkJBQTZCLENBQ2xDLENBQUM7UUFFRixJQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV4RCxPQUFPLElBQUEsNkJBQWEsRUFDbEIsSUFBQSw2QkFBYSxFQUFDLFFBQVEsRUFBRSxDQUFDLDZCQUE2QixFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQ3pFLFFBQVEsRUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCw4REFBNkIsR0FBN0IsVUFBOEIsR0FBcUM7UUFDakUsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCx5RUFBd0MsR0FBeEMsVUFDRSxHQUFnRDtRQUVoRCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxJQUFNLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQU0sWUFBWSxHQUFHLG1DQUEyQixDQUFDLElBQUksQ0FDbkQsSUFBSSxFQUNKLEdBQUcsQ0FBQyxZQUFZLEVBQ2hCLEdBQUcsQ0FBQyxNQUFPLENBQUMsQ0FBQyxDQUFDLEVBQ2QsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDZCxDQUFDO1FBQ0YsT0FBTyxJQUFBLCtCQUFlLEVBQUM7WUFDckIsYUFBYTtZQUNiLE9BQU87WUFDUCxJQUFBLHdCQUFLLEVBQUMsSUFBQSwrQkFBZSxFQUFDLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx1RUFBc0MsR0FBdEMsVUFDRSxHQUE4QztRQUU5QyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0RCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRCxJQUFNLFlBQVksR0FBRyxtQ0FBMkIsQ0FBQyxJQUFJLENBQ25ELElBQUksRUFDSixHQUFHLENBQUMsWUFBWSxFQUNoQixHQUFHLENBQUMsTUFBTyxDQUFDLENBQUMsQ0FBQyxFQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2QsQ0FBQztRQUVGLE9BQU8sSUFBQSwrQkFBZSxFQUFDO1lBQ3JCLGNBQWM7WUFDZCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNWLGFBQWE7WUFDYixHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUEsd0JBQUssRUFBQyxJQUFBLCtCQUFlLEVBQUMsQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdEQUFlLEdBQWYsVUFBZ0IsR0FBdUI7UUFDckMsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDdkQsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDdEQsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDeEQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFMUMsT0FBTyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUEsdUJBQUksRUFBQyxHQUFHLEVBQUUsYUFBYSxDQUFDO1lBQ3hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ1gsY0FBYztZQUNkLGVBQWU7WUFDZixRQUFRO1NBQ1QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHlDQUFRLEdBQVIsVUFBUyxHQUFnQjtRQUN2QixJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDMUQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1FBRWxFLElBQU0sZ0JBQWdCLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQztRQUM1RCxJQUFNLDBCQUEwQixHQUM5QixHQUFHLENBQUMsb0JBQW9CLEtBQUssU0FBUztZQUN0QyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLG9CQUFvQixLQUFLLFNBQVMsQ0FBQztRQUUxRSxrRUFBa0U7UUFDbEUsSUFBTSx5Q0FBeUMsR0FDN0MsQ0FBQywwQkFBMEI7WUFDM0IsSUFBQSxtQ0FBa0IsRUFBQyxHQUFHLENBQUMsb0JBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsQ0FBQyxDQUFDLFFBQVE7WUFDVixDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVQsSUFBSSxhQUFhLENBQUM7UUFDbEIsSUFDRSxnQkFBZ0I7WUFDaEIsMEJBQTBCO1lBQzFCLElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxLQUFLLE1BQU0sRUFDN0M7WUFDQSxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO1NBQ2hEO2FBQU07WUFDTCxhQUFhLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLHVCQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUUsS0FBSyxFQUFFLEVBQUUsSUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ2pFO1FBRUQsT0FBTyxJQUFBLDZCQUFhLEVBQ2xCLElBQUEsK0JBQWUsRUFBQztZQUNkLGdCQUFnQjtZQUNoQixhQUFhO1lBQ2IseUNBQXlDO1lBQ3pDLG9CQUFvQjtTQUNyQixDQUFDLEVBQ0YsUUFBUSxFQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDZCxDQUFDO0lBQ0osQ0FBQztJQUVELGlEQUFnQixHQUFoQixVQUFpQixHQUF3QjtRQUN2QyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUV0RCxJQUFNLG1CQUFtQixHQUFHLElBQUEsc0NBQXNCLEVBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ3JFLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLO1lBQ3RCLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUN2QixPQUFBLElBQUEseUJBQU0sRUFBQyxDQUFDLEdBQUcsRUFBRSxtQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQTFDLENBQTBDLENBQzNDO1lBQ0gsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLE9BQU8sSUFBQSx3QkFBSyxFQUFDLElBQUEsaUNBQWlCLEVBQUMsTUFBTSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVELDZDQUFZLEdBQVosVUFBYSxHQUFvQjtRQUMvQixJQUFNLFNBQVMsR0FBRyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7UUFDMUQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QyxJQUFNLDZCQUE2QixHQUFHLEdBQUcsQ0FBQyxNQUFNO1lBQzlDLENBQUMsQ0FBQyxtQ0FBMkIsQ0FBQyxJQUFJLENBQzlCLElBQUksRUFDSixHQUFHLENBQUMsWUFBWSxFQUNoQixHQUFHLENBQUMsTUFBTyxDQUFDLENBQUMsQ0FBQyxFQUNkLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2Q7WUFDSCxDQUFDLENBQUMsRUFBRSxDQUFDO1FBRVAsT0FBTyxJQUFBLDZCQUFhLEVBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7WUFDekMsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtnQkFDakIsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxjQUFjLENBQUM7Z0JBQ2xDLElBQUEsK0JBQWUsRUFBQyxDQUFDLFVBQVUsRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO2dCQUM1RCxTQUFTO2FBQ1YsQ0FBQztTQUNILENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxREFBb0IsR0FBcEIsVUFBcUIsR0FBNEI7UUFDL0MsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxxREFBb0IsR0FBcEIsVUFBcUIsR0FBNEI7UUFDL0MsSUFBSSxHQUFHLENBQUMsb0JBQW9CLEtBQUssU0FBUyxFQUFFO1lBQzFDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVyRSxJQUFNLFVBQVUsR0FBRyxJQUFBLGlEQUFpQyxFQUNsRCxHQUFHLENBQUMsb0JBQW9CLENBQ3pCLENBQUM7WUFFRixPQUFPLElBQUEsNkJBQWEsRUFBQyxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtnQkFDakQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLElBQUEsaUNBQWlCLEVBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDO2FBQ3BELENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxJQUFBLHdDQUFzQix3QkFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFFLEtBQUssRUFBRSxFQUFFLElBQUcsQ0FBQztJQUNwRSxDQUFDO0lBRUQsa0RBQWlCLEdBQWpCLFVBQWtCLEdBQXlCO1FBQ3pDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLElBQU0sa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFMUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFbEQsSUFBSSxtQkFBbUIsR0FBRyxFQUFFLENBQUM7UUFDN0IsSUFBTSx1QkFBdUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNoRSxJQUFJLHVCQUF1QixFQUFFO1lBQzNCLG1CQUFtQixHQUFHLElBQUEseUJBQU0sRUFDMUIsSUFBQSwrQkFBZSxFQUFDLENBQUMsSUFBSSxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FDakQsQ0FBQztTQUNIO1FBRUQsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFeEMsT0FBTyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUEsd0JBQUssRUFDSCxJQUFBLCtCQUFlLEVBQUM7Z0JBQ2QsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLGtCQUFrQjtnQkFDbEIsWUFBWTtnQkFDWixtQkFBbUI7YUFDcEIsQ0FBQyxDQUNIO1lBQ0QsSUFBSTtTQUNMLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCw2Q0FBWSxHQUFaLFVBQWEsR0FBb0I7UUFDL0IsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ2hFLE9BQU8sSUFBQSw2QkFBYSxFQUNsQixtQkFBbUIsRUFDbkIsUUFBUSxFQUNSLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQ2IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FDZCxDQUFDO0lBQ0osQ0FBQztJQUNELG9EQUFtQixHQUFuQixVQUFvQixHQUEyQjtRQUM3QyxJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRTVELElBQU0sbUJBQW1CLEdBQUcsSUFBQSxzQ0FBc0IsRUFDaEQsR0FBRyxDQUFDLGVBQWUsRUFDbkIsSUFBSSxDQUNMLENBQUM7UUFDRixJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBSztZQUN0QixDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUUsS0FBSztnQkFDdkIsT0FBQSxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxHQUFHLEVBQUUsbUJBQW9CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUExQyxDQUEwQyxDQUMzQztZQUNILENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFUCxPQUFPLElBQUEsaUNBQWlCLEVBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDckQsQ0FBQztJQUNELGdEQUFlLEdBQWYsVUFBZ0IsR0FBdUI7UUFDckMsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUM3RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUU1QyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO1lBQ2hDLE9BQU8sSUFBQSx3QkFBSyxFQUNWLElBQUEsNkJBQWEsRUFBQyxJQUFJLEVBQUU7Z0JBQ2xCLElBQUEsdUJBQUksRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO2dCQUNyQixJQUFBLHVCQUFJLEVBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxQyxDQUFDLENBQ0gsQ0FBQztTQUNIO1FBRUQsSUFBTSw0QkFBNEIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUM3QyxHQUFHLENBQUMsNEJBQTRCLENBQ2pDLENBQUM7UUFDRixJQUNFLEdBQUcsQ0FBQyw0QkFBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFDdEU7WUFDQSxPQUFPLElBQUEsd0JBQUssRUFDVixJQUFBLDZCQUFhLEVBQUMsSUFBSSxFQUFFO2dCQUNsQixJQUFBLHVCQUFJLEVBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQztnQkFDckIsSUFBQSx1QkFBSSxFQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO2FBQ3JELENBQUMsQ0FDSCxDQUFDO1NBQ0g7UUFFRCxPQUFPLElBQUEsd0JBQUssRUFDVixJQUFBLDZCQUFhLEVBQUMsSUFBSSxFQUFFO1lBQ2xCLElBQUEsdUJBQUksRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQ3JCLElBQUEseUJBQU0sRUFBQyxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1NBQ2xELENBQUMsQ0FDSCxDQUFDO0lBQ0osQ0FBQztJQUNELDZEQUE0QixHQUE1QixVQUE2QixHQUFvQztRQUMvRCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXJDLE9BQU8sSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtZQUN4QixJQUFBLCtCQUFlLEVBQUMsQ0FBQyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRSxVQUFVO1NBQ1gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELHdEQUF1QixHQUF2QixVQUF3QixHQUErQjtRQUNyRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELDJDQUFVLEdBQVYsVUFBVyxHQUFrQjtRQUMzQixPQUFPLElBQUEsNkJBQWEsRUFDbEIsSUFBQSxpQ0FBaUIsRUFDZixJQUFBLHNDQUFzQixFQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxFQUNqRCxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUN6QyxFQUNELFFBQVEsRUFDUixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNiLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQ2QsQ0FBQztJQUNKLENBQUM7SUFFRCxzREFBcUIsR0FBckIsVUFBc0IsR0FBNkI7UUFDakQsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCw4REFBNkIsR0FBN0IsVUFBOEIsR0FBcUM7UUFDakUsSUFBTSxTQUFTLEdBQUcsSUFBQSw2QkFBYSxFQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3pELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNyRCxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRW5ELElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzVDLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRXhELE9BQU8sSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRTtZQUN4QixJQUFBLHdCQUFLLEVBQ0gsSUFBQSw2QkFBYSxFQUFDLFFBQVEsRUFBRTtnQkFDdEIsSUFBQSw2QkFBYSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsQ0FBQztnQkFDekMsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsdUJBQUksRUFBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDdEQsQ0FBQyxDQUNIO1lBQ0QsZUFBZTtTQUNoQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsbURBQWtCLEdBQWxCO1FBQ0UsT0FBTyxvQkFBb0IsQ0FBQztJQUM5QixDQUFDO0lBRUQsaUVBQWdDLEdBQWhDO1FBQ0UsT0FBTyxrQ0FBa0MsQ0FBQztJQUM1QyxDQUFDO0lBRUQsdUNBQU0sR0FBTjtRQUNFLE9BQU8sUUFBUSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxnRUFBK0IsR0FBL0I7UUFDRSxPQUFPLGlDQUFpQyxDQUFDO0lBQzNDLENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUFqN0JELENBQTRDLHlDQUFzQixHQWk3QmpFO0FBajdCWSx3REFBc0IifQ==