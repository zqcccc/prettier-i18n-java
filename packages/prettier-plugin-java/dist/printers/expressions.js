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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionsPrettierVisitor = void 0;
var forEach_1 = __importDefault(require("lodash/forEach"));
var doc_1 = require("prettier/doc");
var base_cst_printer_1 = require("../base-cst-printer");
var utils_1 = require("../types/utils");
var expressions_utils_1 = require("../utils/expressions-utils");
var utils_2 = require("../utils");
var format_comments_1 = require("./comments/format-comments");
var handle_comments_1 = require("./comments/handle-comments");
var prettier_builder_1 = require("./prettier-builder");
var printer_utils_1 = require("./printer-utils");
var ifBreak = doc_1.builders.ifBreak, line = doc_1.builders.line, softline = doc_1.builders.softline, indentIfBreak = doc_1.builders.indentIfBreak;
var ExpressionsPrettierVisitor = /** @class */ (function (_super) {
    __extends(ExpressionsPrettierVisitor, _super);
    function ExpressionsPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ExpressionsPrettierVisitor.prototype.expression = function (ctx, params) {
        return this.visitSingle(ctx, params);
    };
    ExpressionsPrettierVisitor.prototype.lambdaExpression = function (ctx, params) {
        var lambdaParameters = (0, prettier_builder_1.group)(this.visit(ctx.lambdaParameters, params), params ? { id: params.lambdaParametersGroupId } : undefined);
        var lambdaBody = this.visit(ctx.lambdaBody);
        var isLambdaBodyABlock = ctx.lambdaBody[0].children.block !== undefined;
        if (isLambdaBodyABlock) {
            return (0, printer_utils_1.rejectAndJoin)(" ", [
                lambdaParameters,
                ctx.Arrow[0],
                (params === null || params === void 0 ? void 0 : params.lambdaParametersGroupId) !== undefined
                    ? indentIfBreak(lambdaBody, {
                        groupId: params.lambdaParametersGroupId
                    })
                    : lambdaBody
            ]);
        }
        return (0, prettier_builder_1.group)((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)(line, [
            (0, printer_utils_1.rejectAndJoin)(" ", [lambdaParameters, ctx.Arrow[0]]),
            lambdaBody
        ])));
    };
    ExpressionsPrettierVisitor.prototype.lambdaParameters = function (ctx, params) {
        if (ctx.lambdaParametersWithBraces) {
            return this.visitSingle(ctx, params);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ExpressionsPrettierVisitor.prototype.lambdaParametersWithBraces = function (ctx, params) {
        var lambdaParameterList = this.visit(ctx.lambdaParameterList);
        if ((0, printer_utils_1.findDeepElementInPartsArray)(lambdaParameterList, ",")) {
            var content = (0, printer_utils_1.putIntoBraces)(lambdaParameterList, softline, ctx.LBrace[0], ctx.RBrace[0]);
            if ((params === null || params === void 0 ? void 0 : params.isInsideMethodInvocationSuffix) === true) {
                return (0, prettier_builder_1.indent)((0, prettier_builder_1.concat)([softline, content]));
            }
            return content;
        }
        // removing braces when only no comments attached
        if ((ctx.LBrace &&
            ctx.RBrace &&
            (!lambdaParameterList || (0, printer_utils_1.isExplicitLambdaParameter)(ctx))) ||
            ctx.LBrace[0].leadingComments ||
            ctx.LBrace[0].trailingComments ||
            ctx.RBrace[0].leadingComments ||
            ctx.RBrace[0].trailingComments) {
            return (0, printer_utils_1.rejectAndConcat)([
                ctx.LBrace[0],
                lambdaParameterList,
                ctx.RBrace[0]
            ]);
        }
        return lambdaParameterList;
    };
    ExpressionsPrettierVisitor.prototype.lambdaParameterList = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.inferredLambdaParameterList = function (ctx) {
        var commas = ctx.Comma
            ? ctx.Comma.map(function (elt) {
                return (0, prettier_builder_1.concat)([elt, line]);
            })
            : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, ctx.Identifier);
    };
    ExpressionsPrettierVisitor.prototype.explicitLambdaParameterList = function (ctx) {
        var lambdaParameter = this.mapVisit(ctx.lambdaParameter);
        var commas = ctx.Comma
            ? ctx.Comma.map(function (elt) {
                return (0, prettier_builder_1.concat)([elt, line]);
            })
            : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, lambdaParameter);
    };
    ExpressionsPrettierVisitor.prototype.lambdaParameter = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.regularLambdaParameter = function (ctx) {
        var variableModifier = this.mapVisit(ctx.variableModifier);
        var lambdaParameterType = this.visit(ctx.lambdaParameterType);
        var variableDeclaratorId = this.visit(ctx.variableDeclaratorId);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", variableModifier),
            lambdaParameterType,
            variableDeclaratorId
        ]);
    };
    ExpressionsPrettierVisitor.prototype.lambdaParameterType = function (ctx) {
        if (ctx.unannType) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    ExpressionsPrettierVisitor.prototype.lambdaBody = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.ternaryExpression = function (ctx, params) {
        var binaryExpression = this.visit(ctx.binaryExpression, params);
        if (ctx.QuestionMark) {
            var expression1 = this.visit(ctx.expression[0]);
            var expression2 = this.visit(ctx.expression[1]);
            return (0, prettier_builder_1.indent)((0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
                (0, printer_utils_1.rejectAndJoin)(line, [
                    binaryExpression,
                    (0, printer_utils_1.rejectAndJoin)(" ", [ctx.QuestionMark[0], expression1]),
                    (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Colon[0], expression2])
                ])
            ])));
        }
        return binaryExpression;
    };
    ExpressionsPrettierVisitor.prototype.binaryExpression = function (ctx, params) {
        (0, handle_comments_1.handleCommentsBinaryExpression)(ctx);
        var instanceofReferences = this.mapVisit((0, printer_utils_1.sortNodes)([ctx.pattern, ctx.referenceType]));
        var expression = this.mapVisit(ctx.expression);
        var unaryExpression = this.mapVisit(ctx.unaryExpression);
        var _a = (0, printer_utils_1.separateTokensIntoGroups)(ctx), groupsOfOperator = _a.groupsOfOperator, sortedBinaryOperators = _a.sortedBinaryOperators;
        var segmentsSplitByBinaryOperator = [];
        var currentSegment = [];
        if (groupsOfOperator.length === 1 && groupsOfOperator[0].length === 0) {
            return unaryExpression.shift();
        }
        groupsOfOperator.forEach(function (subgroup) {
            currentSegment = [unaryExpression.shift()];
            for (var i = 0; i < subgroup.length; i++) {
                var token = subgroup[i];
                var shiftOperator = (0, printer_utils_1.isShiftOperator)(subgroup, i);
                if (token.tokenType.name === "Instanceof") {
                    currentSegment.push((0, printer_utils_1.rejectAndJoin)(" ", [
                        ctx.Instanceof[0],
                        instanceofReferences.shift()
                    ]));
                }
                else if ((0, printer_utils_1.matchCategory)(token, "'AssignmentOperator'")) {
                    currentSegment.push((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)(line, [token, expression.shift()])));
                }
                else if (shiftOperator === "leftShift" ||
                    shiftOperator === "rightShift") {
                    currentSegment.push((0, printer_utils_1.rejectAndJoin)(" ", [
                        (0, printer_utils_1.rejectAndConcat)([token, subgroup[i + 1]]),
                        unaryExpression.shift()
                    ]));
                    i++;
                }
                else if (shiftOperator === "doubleRightShift") {
                    currentSegment.push((0, printer_utils_1.rejectAndJoin)(" ", [
                        (0, printer_utils_1.rejectAndConcat)([token, subgroup[i + 1], subgroup[i + 2]]),
                        unaryExpression.shift()
                    ]));
                    i += 2;
                }
                else if ((0, printer_utils_1.matchCategory)(token, "'BinaryOperator'")) {
                    currentSegment.push((0, printer_utils_1.rejectAndJoin)(line, [token, unaryExpression.shift()]));
                }
            }
            segmentsSplitByBinaryOperator.push((0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(" ", currentSegment)));
        });
        if (params !== undefined && params.addParenthesisToWrapStatement) {
            return (0, prettier_builder_1.group)((0, prettier_builder_1.concat)([
                ifBreak("(", ""),
                (0, prettier_builder_1.indent)((0, prettier_builder_1.concat)([
                    softline,
                    (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(sortedBinaryOperators.map(function (elt) { return (0, prettier_builder_1.concat)([" ", elt, line]); }), segmentsSplitByBinaryOperator))
                ])),
                softline,
                ifBreak(")")
            ]));
        }
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(sortedBinaryOperators.map(function (elt) { return (0, prettier_builder_1.concat)([" ", elt, line]); }), segmentsSplitByBinaryOperator));
    };
    ExpressionsPrettierVisitor.prototype.unaryExpression = function (ctx) {
        var unaryPrefixOperator = ctx.UnaryPrefixOperator
            ? ctx.UnaryPrefixOperator
            : [];
        var primary = this.visit(ctx.primary);
        var unarySuffixOperator = ctx.UnarySuffixOperator
            ? ctx.UnarySuffixOperator
            : [];
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndConcat)(unaryPrefixOperator),
            primary,
            (0, printer_utils_1.rejectAndConcat)(unarySuffixOperator)
        ]);
    };
    ExpressionsPrettierVisitor.prototype.unaryExpressionNotPlusMinus = function (ctx) {
        var unaryPrefixOperatorNotPlusMinus = ctx.UnaryPrefixOperatorNotPlusMinus // changed when moved to TS
            ? (0, printer_utils_1.rejectAndJoin)(" ", ctx.UnaryPrefixOperatorNotPlusMinus) // changed when moved to TS
            : "";
        var primary = this.visit(ctx.primary);
        var unarySuffixOperator = ctx.UnarySuffixOperator // changed when moved to TS
            ? (0, printer_utils_1.rejectAndJoin)(" ", ctx.UnarySuffixOperator) // changed when moved to TS
            : "";
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            unaryPrefixOperatorNotPlusMinus,
            primary,
            unarySuffixOperator
        ]);
    };
    ExpressionsPrettierVisitor.prototype.primary = function (ctx) {
        var countMethodInvocation = (0, printer_utils_1.isUniqueMethodInvocation)(ctx.primarySuffix);
        var primaryPrefix = this.visit(ctx.primaryPrefix, {
            shouldBreakBeforeFirstMethodInvocation: countMethodInvocation > 1
        });
        var suffixes = [];
        if (ctx.primarySuffix !== undefined) {
            // edge case: https://github.com/jhipster/prettier-java/issues/381
            var hasFirstInvocationArg = true;
            if (ctx.primarySuffix.length > 1 &&
                ctx.primarySuffix[1].children.methodInvocationSuffix &&
                Object.keys(ctx.primarySuffix[1].children.methodInvocationSuffix[0].children).length === 2) {
                hasFirstInvocationArg = false;
            }
            if (ctx.primarySuffix[0].children.Dot !== undefined &&
                ctx.primaryPrefix[0].children.newExpression !== undefined) {
                suffixes.push(softline);
            }
            suffixes.push(this.visit(ctx.primarySuffix[0], {
                shouldDedent: 
                // dedent when simple method invocation
                countMethodInvocation !== 1 &&
                    // dedent when (chain) method invocation
                    ctx.primaryPrefix[0] &&
                    ctx.primaryPrefix[0].children.fqnOrRefType &&
                    !(ctx.primaryPrefix[0].children.fqnOrRefType[0].children.Dot !==
                        undefined) &&
                    // indent when lambdaExpression
                    ctx.primarySuffix[0].children.methodInvocationSuffix &&
                    ctx.primarySuffix[0].children.methodInvocationSuffix[0].children
                        .argumentList &&
                    ctx.primarySuffix[0].children.methodInvocationSuffix[0].children
                        .argumentList[0].children.expression &&
                    ctx.primarySuffix[0].children.methodInvocationSuffix[0].children
                        .argumentList[0].children.expression[0].children
                        .lambdaExpression === undefined
            }));
            for (var i = 1; i < ctx.primarySuffix.length; i++) {
                if (ctx.primarySuffix[i].children.Dot !== undefined &&
                    ctx.primarySuffix[i - 1].children.methodInvocationSuffix !== undefined) {
                    suffixes.push(softline);
                }
                suffixes.push(this.visit(ctx.primarySuffix[i]));
            }
            if (countMethodInvocation === 1 &&
                ctx.primaryPrefix[0].children.newExpression === undefined) {
                return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
                    primaryPrefix,
                    hasFirstInvocationArg ? suffixes[0] : (0, prettier_builder_1.indent)(suffixes[0]),
                    (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)(suffixes.slice(1)))
                ]));
            }
        }
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([primaryPrefix, (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)(suffixes))]));
    };
    ExpressionsPrettierVisitor.prototype.primaryPrefix = function (ctx, params) {
        if (ctx.This || ctx.Void) {
            return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
        }
        return this.visitSingle(ctx, params);
    };
    ExpressionsPrettierVisitor.prototype.primarySuffix = function (ctx, params) {
        if (ctx.Dot) {
            if (ctx.This) {
                return (0, printer_utils_1.rejectAndConcat)([ctx.Dot[0], ctx.This[0]]);
            }
            else if (ctx.Identifier) {
                var typeArguments = this.visit(ctx.typeArguments);
                return (0, printer_utils_1.rejectAndConcat)([ctx.Dot[0], typeArguments, ctx.Identifier[0]]);
            }
            var unqualifiedClassInstanceCreationExpression = this.visit(ctx.unqualifiedClassInstanceCreationExpression);
            return (0, printer_utils_1.rejectAndConcat)([
                ctx.Dot[0],
                unqualifiedClassInstanceCreationExpression
            ]);
        }
        return this.visitSingle(ctx, params);
    };
    ExpressionsPrettierVisitor.prototype.fqnOrRefType = function (ctx, params) {
        var fqnOrRefTypePartFirst = this.visit(ctx.fqnOrRefTypePartFirst);
        var fqnOrRefTypePartRest = this.mapVisit(ctx.fqnOrRefTypePartRest);
        var dims = this.visit(ctx.dims);
        var dots = ctx.Dot ? ctx.Dot : [];
        var isMethodInvocation = ctx.Dot && ctx.Dot.length === 1;
        if (params !== undefined &&
            params.shouldBreakBeforeFirstMethodInvocation === true) {
            // when fqnOrRefType is a method call from an object
            if (isMethodInvocation) {
                return (0, printer_utils_1.rejectAndConcat)([
                    (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([softline, dots[0]]), [
                        fqnOrRefTypePartFirst,
                        (0, printer_utils_1.rejectAndJoinSeps)(dots.slice(1), fqnOrRefTypePartRest),
                        dims
                    ]))
                ]);
                // otherwise it is a fully qualified name but we need to exclude when it is just a method call
            }
            else if (ctx.Dot) {
                return (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([
                    (0, printer_utils_1.rejectAndJoinSeps)(dots.slice(0, dots.length - 1), __spreadArray([
                        fqnOrRefTypePartFirst
                    ], fqnOrRefTypePartRest.slice(0, fqnOrRefTypePartRest.length - 1), true)),
                    softline,
                    (0, printer_utils_1.rejectAndConcat)([
                        dots[dots.length - 1],
                        fqnOrRefTypePartRest[fqnOrRefTypePartRest.length - 1]
                    ]),
                    dims
                ]));
            }
        }
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoinSeps)(dots, __spreadArray([fqnOrRefTypePartFirst], fqnOrRefTypePartRest, true)),
            dims
        ]);
    };
    ExpressionsPrettierVisitor.prototype.fqnOrRefTypePartFirst = function (ctx) {
        var annotation = this.mapVisit(ctx.annotation);
        var fqnOrRefTypeCommon = this.visit(ctx.fqnOrRefTypePartCommon);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", annotation),
            fqnOrRefTypeCommon
        ]);
    };
    ExpressionsPrettierVisitor.prototype.fqnOrRefTypePartRest = function (ctx) {
        var annotation = this.mapVisit(ctx.annotation);
        var fqnOrRefTypeCommon = this.visit(ctx.fqnOrRefTypePartCommon);
        var typeArguments = this.visit(ctx.typeArguments);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", annotation),
            (0, printer_utils_1.rejectAndConcat)([typeArguments, fqnOrRefTypeCommon])
        ]);
    };
    ExpressionsPrettierVisitor.prototype.fqnOrRefTypePartCommon = function (ctx) {
        var keyWord = null;
        if (ctx.Identifier) {
            keyWord = ctx.Identifier[0];
        }
        else {
            keyWord = ctx.Super[0];
        }
        var typeArguments = this.visit(ctx.typeArguments);
        return (0, printer_utils_1.rejectAndConcat)([keyWord, typeArguments]);
    };
    ExpressionsPrettierVisitor.prototype.parenthesisExpression = function (ctx) {
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]);
    };
    ExpressionsPrettierVisitor.prototype.castExpression = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.primitiveCastExpression = function (ctx) {
        var primitiveType = this.visit(ctx.primitiveType);
        var unaryExpression = this.visit(ctx.unaryExpression);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndConcat)([ctx.LBrace[0], primitiveType, ctx.RBrace[0]]),
            unaryExpression
        ]);
    };
    ExpressionsPrettierVisitor.prototype.referenceTypeCastExpression = function (ctx) {
        var referenceType = this.visit(ctx.referenceType);
        var hasAdditionalBounds = ctx.additionalBound !== undefined;
        var additionalBounds = (0, printer_utils_1.rejectAndJoin)(line, this.mapVisit(ctx.additionalBound));
        var expression = ctx.lambdaExpression
            ? this.visit(ctx.lambdaExpression)
            : this.visit(ctx.unaryExpressionNotPlusMinus);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndJoin)(line, [referenceType, additionalBounds]), hasAdditionalBounds ? softline : "", ctx.LBrace[0], ctx.RBrace[0]),
            expression
        ]);
    };
    ExpressionsPrettierVisitor.prototype.newExpression = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.unqualifiedClassInstanceCreationExpression = function (ctx) {
        var typeArguments = this.visit(ctx.typeArguments);
        var classOrInterfaceTypeToInstantiate = this.visit(ctx.classOrInterfaceTypeToInstantiate);
        var content = utils_2.printArgumentListWithBraces.call(this, ctx.argumentList, ctx.RBrace[0], ctx.LBrace[0]);
        var classBody = this.visit(ctx.classBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.New[0],
            (0, printer_utils_1.rejectAndConcat)([
                typeArguments,
                classOrInterfaceTypeToInstantiate,
                content
            ]),
            classBody
        ]);
    };
    ExpressionsPrettierVisitor.prototype.classOrInterfaceTypeToInstantiate = function (ctx) {
        var _this = this;
        var tokens = (0, printer_utils_1.sortAnnotationIdentifier)(ctx.annotation, ctx.Identifier);
        var segments = [];
        var currentSegment = [];
        (0, forEach_1.default)(tokens, function (token) {
            if ((0, utils_1.isAnnotationCstNode)(token)) {
                currentSegment.push(_this.visit([token]));
            }
            else {
                currentSegment.push(token);
                segments.push((0, printer_utils_1.rejectAndJoin)(" ", currentSegment));
                currentSegment = [];
            }
        });
        var typeArgumentsOrDiamond = this.visit(ctx.typeArgumentsOrDiamond);
        var dots = ctx.Dot ? ctx.Dot : [];
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoinSeps)(dots, segments),
            typeArgumentsOrDiamond
        ]);
    };
    ExpressionsPrettierVisitor.prototype.typeArgumentsOrDiamond = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.diamond = function (ctx) {
        return (0, prettier_builder_1.concat)([ctx.Less[0], ctx.Greater[0]]);
    };
    ExpressionsPrettierVisitor.prototype.methodInvocationSuffix = function (ctx, params) {
        var isSingleLambda = (0, expressions_utils_1.isArgumentListSingleLambda)(ctx.argumentList);
        if (isSingleLambda) {
            return utils_2.printSingleLambdaInvocation.call(this, ctx.argumentList, ctx.RBrace[0], ctx.LBrace[0]);
        }
        var argumentList = this.visit(ctx.argumentList);
        if (params && params.shouldDedent) {
            return (0, prettier_builder_1.dedent)((0, printer_utils_1.putIntoBraces)(argumentList, softline, ctx.LBrace[0], ctx.RBrace[0]));
        }
        return (0, printer_utils_1.putIntoBraces)(argumentList, softline, ctx.LBrace[0], ctx.RBrace[0]);
    };
    ExpressionsPrettierVisitor.prototype.argumentList = function (ctx, params) {
        var expressions = this.mapVisit(ctx.expression, params);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, expressions);
    };
    ExpressionsPrettierVisitor.prototype.arrayCreationExpression = function (ctx) {
        var type = ctx.primitiveType
            ? this.visit(ctx.primitiveType)
            : this.visit(ctx.classOrInterfaceType);
        var suffix = ctx.arrayCreationDefaultInitSuffix
            ? this.visit(ctx.arrayCreationDefaultInitSuffix)
            : this.visit(ctx.arrayCreationExplicitInitSuffix);
        return (0, printer_utils_1.rejectAndConcat)([(0, prettier_builder_1.concat)([ctx.New[0], " "]), type, suffix]);
    };
    ExpressionsPrettierVisitor.prototype.arrayCreationDefaultInitSuffix = function (ctx) {
        var dimExprs = this.visit(ctx.dimExprs);
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndConcat)([dimExprs, dims]);
    };
    ExpressionsPrettierVisitor.prototype.arrayCreationExplicitInitSuffix = function (ctx) {
        var dims = this.visit(ctx.dims);
        var arrayInitializer = this.visit(ctx.arrayInitializer);
        return (0, printer_utils_1.rejectAndJoin)(" ", [dims, arrayInitializer]);
    };
    ExpressionsPrettierVisitor.prototype.dimExprs = function (ctx) {
        var dimExpr = this.mapVisit(ctx.dimExpr);
        return (0, printer_utils_1.rejectAndConcat)(dimExpr);
    };
    ExpressionsPrettierVisitor.prototype.dimExpr = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", annotations),
            (0, printer_utils_1.rejectAndConcat)([ctx.LSquare[0], expression, ctx.RSquare[0]])
        ]);
    };
    ExpressionsPrettierVisitor.prototype.classLiteralSuffix = function (ctx) {
        var squares = [];
        if (ctx.LSquare) {
            for (var i = 0; i < ctx.LSquare.length; i++) {
                squares.push((0, prettier_builder_1.concat)([ctx.LSquare[i], ctx.RSquare[i]]));
            }
        }
        return (0, printer_utils_1.rejectAndConcat)(__spreadArray(__spreadArray([], squares, true), [ctx.Dot[0], ctx.Class[0]], false));
    };
    ExpressionsPrettierVisitor.prototype.arrayAccessSuffix = function (ctx) {
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.rejectAndConcat)([ctx.LSquare[0], expression, ctx.RSquare[0]]);
    };
    ExpressionsPrettierVisitor.prototype.methodReferenceSuffix = function (ctx) {
        var typeArguments = this.visit(ctx.typeArguments);
        var identifierOrNew = ctx.New ? ctx.New[0] : ctx.Identifier[0];
        return (0, printer_utils_1.rejectAndConcat)([ctx.ColonColon[0], typeArguments, identifierOrNew]);
    };
    ExpressionsPrettierVisitor.prototype.pattern = function (ctx) {
        var primaryPattern = this.visit(ctx.primaryPattern);
        if (ctx.AndAnd === undefined) {
            return primaryPattern;
        }
        var binaryExpression = this.visit(ctx.binaryExpression);
        return (0, printer_utils_1.rejectAndConcat)([
            primaryPattern,
            " ",
            ctx.AndAnd[0],
            line,
            binaryExpression
        ]);
    };
    ExpressionsPrettierVisitor.prototype.primaryPattern = function (ctx) {
        if (ctx.LBrace === undefined) {
            return this.visitSingle(ctx);
        }
        var pattern = this.visit(ctx.pattern);
        return (0, printer_utils_1.putIntoBraces)(pattern, softline, ctx.LBrace[0], ctx.RBrace[0]);
    };
    ExpressionsPrettierVisitor.prototype.typePattern = function (ctx) {
        return this.visitSingle(ctx);
    };
    ExpressionsPrettierVisitor.prototype.identifyNewExpressionType = function () {
        return "identifyNewExpressionType";
    };
    ExpressionsPrettierVisitor.prototype.isLambdaExpression = function () {
        return "isLambdaExpression";
    };
    ExpressionsPrettierVisitor.prototype.isCastExpression = function () {
        return "isCastExpression";
    };
    ExpressionsPrettierVisitor.prototype.isPrimitiveCastExpression = function () {
        return "isPrimitiveCastExpression";
    };
    ExpressionsPrettierVisitor.prototype.isReferenceTypeCastExpression = function () {
        return "isReferenceTypeCastExpression";
    };
    ExpressionsPrettierVisitor.prototype.isRefTypeInMethodRef = function () {
        return "isRefTypeInMethodRef";
    };
    return ExpressionsPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.ExpressionsPrettierVisitor = ExpressionsPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJpbnRlcnMvZXhwcmVzc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtRGIsMkRBQXFDO0FBRXJDLG9DQUF3QztBQUN4Qyx3REFBNkQ7QUFDN0Qsd0NBQXFEO0FBQ3JELGdFQUF3RTtBQUN4RSxrQ0FHa0I7QUFDbEIsOERBQW9FO0FBQ3BFLDhEQUE0RTtBQUM1RSx1REFBbUU7QUFDbkUsaURBYXlCO0FBR2pCLElBQUEsT0FBTyxHQUFvQyxjQUFRLFFBQTVDLEVBQUUsSUFBSSxHQUE4QixjQUFRLEtBQXRDLEVBQUUsUUFBUSxHQUFvQixjQUFRLFNBQTVCLEVBQUUsYUFBYSxHQUFLLGNBQVEsY0FBYixDQUFjO0FBRTVEO0lBQWdELDhDQUFzQjtJQUF0RTs7SUE0dEJBLENBQUM7SUEzdEJDLCtDQUFVLEdBQVYsVUFBVyxHQUFrQixFQUFFLE1BQVc7UUFDeEMsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRUQscURBQWdCLEdBQWhCLFVBQ0UsR0FBd0IsRUFDeEIsTUFHQztRQUVELElBQU0sZ0JBQWdCLEdBQUcsSUFBQSx3QkFBSyxFQUM1QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsRUFDeEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUM1RCxDQUFDO1FBQ0YsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFOUMsSUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FB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