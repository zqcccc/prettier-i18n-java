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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InterfacesPrettierVisitor = void 0;
var prettier_builder_1 = require("./prettier-builder");
var format_comments_1 = require("./comments/format-comments");
var printer_utils_1 = require("./printer-utils");
var doc_1 = require("prettier/doc");
var base_cst_printer_1 = require("../base-cst-printer");
var line = doc_1.builders.line, softline = doc_1.builders.softline, hardline = doc_1.builders.hardline;
var InterfacesPrettierVisitor = /** @class */ (function (_super) {
    __extends(InterfacesPrettierVisitor, _super);
    function InterfacesPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InterfacesPrettierVisitor.prototype.interfaceDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.interfaceModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var declaration = ctx.normalInterfaceDeclaration
            ? this.visit(ctx.normalInterfaceDeclaration)
            : this.visit(ctx.annotationTypeDeclaration);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [(0, printer_utils_1.rejectAndJoin)(" ", otherModifiers), declaration])
        ]);
    };
    InterfacesPrettierVisitor.prototype.normalInterfaceDeclaration = function (ctx) {
        var typeIdentifier = this.visit(ctx.typeIdentifier);
        var typeParameters = this.visit(ctx.typeParameters);
        var extendsInterfaces = this.visit(ctx.extendsInterfaces);
        var optionalInterfacePermits = this.visit(ctx.interfacePermits);
        var interfaceBody = this.visit(ctx.interfaceBody);
        var extendsInterfacesPart = "";
        if (extendsInterfaces) {
            extendsInterfacesPart = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([softline, extendsInterfaces]));
        }
        var interfacePermits = "";
        if (optionalInterfacePermits) {
            interfacePermits = (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([softline, optionalInterfacePermits]));
        }
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoin)(" ", [
                ctx.Interface[0],
                (0, prettier_builder_1.concat)([typeIdentifier, typeParameters]),
                extendsInterfacesPart,
                interfacePermits
            ])),
            interfaceBody
        ]);
    };
    InterfacesPrettierVisitor.prototype.interfaceModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    InterfacesPrettierVisitor.prototype.extendsInterfaces = function (ctx) {
        var interfaceTypeList = this.visit(ctx.interfaceTypeList);
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
            ctx.Extends[0],
            (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([line, interfaceTypeList]))
        ]));
    };
    InterfacesPrettierVisitor.prototype.interfacePermits = function (ctx) {
        return this.classPermits(ctx);
    };
    InterfacesPrettierVisitor.prototype.interfaceBody = function (ctx) {
        var joinedInterfaceMemberDeclaration = "";
        if (ctx.interfaceMemberDeclaration !== undefined) {
            var interfaceMemberDeclaration = this.mapVisit(ctx.interfaceMemberDeclaration);
            var separators = (0, printer_utils_1.getInterfaceBodyDeclarationsSeparator)(ctx.interfaceMemberDeclaration);
            joinedInterfaceMemberDeclaration = (0, printer_utils_1.rejectAndJoinSeps)(separators, interfaceMemberDeclaration);
        }
        return (0, printer_utils_1.putIntoBraces)(joinedInterfaceMemberDeclaration, hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    InterfacesPrettierVisitor.prototype.interfaceMemberDeclaration = function (ctx) {
        if (ctx.Semicolon) {
            return (0, printer_utils_1.displaySemicolon)(ctx.Semicolon[0]);
        }
        return this.visitSingle(ctx);
    };
    InterfacesPrettierVisitor.prototype.constantDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.constantModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var unannType = this.visit(ctx.unannType);
        var variableDeclaratorList = this.visit(ctx.variableDeclaratorList);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                unannType,
                (0, printer_utils_1.rejectAndConcat)([variableDeclaratorList, ctx.Semicolon[0]])
            ])
        ]);
    };
    InterfacesPrettierVisitor.prototype.constantModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    InterfacesPrettierVisitor.prototype.interfaceMethodDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.interfaceMethodModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var methodHeader = this.visit(ctx.methodHeader);
        var methodBody = this.visit(ctx.methodBody);
        var separator = (0, printer_utils_1.isStatementEmptyStatement)(methodBody) ? "" : " ";
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                (0, printer_utils_1.rejectAndJoin)(separator, [methodHeader, methodBody])
            ])
        ]);
    };
    InterfacesPrettierVisitor.prototype.interfaceMethodModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    InterfacesPrettierVisitor.prototype.annotationTypeDeclaration = function (ctx) {
        var typeIdentifier = this.visit(ctx.typeIdentifier);
        var annotationTypeBody = this.visit(ctx.annotationTypeBody);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.concat)([ctx.At[0], ctx.Interface[0]]),
            typeIdentifier,
            annotationTypeBody
        ]);
    };
    InterfacesPrettierVisitor.prototype.annotationTypeBody = function (ctx) {
        var annotationTypeMemberDeclaration = this.mapVisit(ctx.annotationTypeMemberDeclaration);
        return (0, printer_utils_1.rejectAndJoin)(line, [
            (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndJoin)(line, [
                ctx.LCurly[0],
                (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([line, line]), annotationTypeMemberDeclaration)
            ])),
            ctx.RCurly[0]
        ]);
    };
    InterfacesPrettierVisitor.prototype.annotationTypeMemberDeclaration = function (ctx) {
        if (ctx.Semicolon) {
            return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
        }
        return this.visitSingle(ctx);
    };
    InterfacesPrettierVisitor.prototype.annotationTypeElementDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.annotationTypeElementModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var otherModifiers = this.mapVisit(modifiers[1]);
        var unannType = this.visit(ctx.unannType);
        var identifier = ctx.Identifier[0];
        var dims = this.visit(ctx.dims);
        var defaultValue = ctx.defaultValue
            ? (0, prettier_builder_1.concat)([" ", this.visit(ctx.defaultValue)])
            : "";
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", otherModifiers),
                unannType,
                (0, printer_utils_1.rejectAndConcat)([
                    identifier,
                    (0, prettier_builder_1.concat)([ctx.LBrace[0], ctx.RBrace[0]]),
                    dims,
                    defaultValue,
                    ctx.Semicolon[0]
                ])
            ])
        ]);
    };
    InterfacesPrettierVisitor.prototype.annotationTypeElementModifier = function (ctx) {
        if (ctx.annotation) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    InterfacesPrettierVisitor.prototype.defaultValue = function (ctx) {
        var elementValue = this.visit(ctx.elementValue);
        return (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Default[0], elementValue]);
    };
    InterfacesPrettierVisitor.prototype.annotation = function (ctx) {
        var fqn = this.visit(ctx.typeName);
        var annoArgs = "";
        if (ctx.LBrace) {
            if (ctx.elementValuePairList) {
                annoArgs = (0, printer_utils_1.putIntoBraces)(this.visit(ctx.elementValuePairList), softline, ctx.LBrace[0], ctx.RBrace[0]);
            }
            else if (ctx.elementValue) {
                annoArgs = (0, printer_utils_1.putIntoBraces)(this.visit(ctx.elementValue), softline, ctx.LBrace[0], ctx.RBrace[0]);
            }
        }
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([ctx.At[0], fqn, annoArgs]));
    };
    InterfacesPrettierVisitor.prototype.elementValuePairList = function (ctx) {
        var elementValuePairs = this.mapVisit(ctx.elementValuePair);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, elementValuePairs);
    };
    InterfacesPrettierVisitor.prototype.elementValuePair = function (ctx) {
        var identifier = ctx.Identifier[0];
        var elementValue = this.visit(ctx.elementValue);
        return (0, printer_utils_1.rejectAndJoin)(" ", [identifier, ctx.Equals[0], elementValue]);
    };
    InterfacesPrettierVisitor.prototype.elementValue = function (ctx) {
        return this.visitSingle(ctx);
    };
    InterfacesPrettierVisitor.prototype.elementValueArrayInitializer = function (ctx) {
        var elementValueList = this.visit(ctx.elementValueList);
        return (0, printer_utils_1.printArrayList)({
            list: elementValueList,
            extraComma: ctx.Comma,
            LCurly: ctx.LCurly[0],
            RCurly: ctx.RCurly[0],
            trailingComma: this.prettierOptions.trailingComma
        });
    };
    InterfacesPrettierVisitor.prototype.elementValueList = function (ctx) {
        var elementValues = this.mapVisit(ctx.elementValue);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([(0, printer_utils_1.rejectAndJoinSeps)(commas, elementValues)]));
    };
    InterfacesPrettierVisitor.prototype.identifyInterfaceBodyDeclarationType = function () {
        return "identifyInterfaceBodyDeclarationType";
    };
    InterfacesPrettierVisitor.prototype.identifyAnnotationBodyDeclarationType = function () {
        return "identifyAnnotationBodyDeclarationType";
    };
    InterfacesPrettierVisitor.prototype.isSimpleElementValueAnnotation = function () {
        return "isSimpleElementValueAnnotation";
    };
    return InterfacesPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.InterfacesPrettierVisitor = InterfacesPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJmYWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmludGVycy9pbnRlcmZhY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHVEQUEyRDtBQUMzRCw4REFBb0U7QUFDcEUsaURBVXlCO0FBRXpCLG9DQUF3QztBQUN4Qyx3REFBNkQ7QUE2QnJELElBQUEsSUFBSSxHQUF5QixjQUFRLEtBQWpDLEVBQUUsUUFBUSxHQUFlLGNBQVEsU0FBdkIsRUFBRSxRQUFRLEdBQUssY0FBUSxTQUFiLENBQWM7QUFFOUM7SUFBK0MsNkNBQXNCO0lBQXJFOztJQThTQSxDQUFDO0lBN1NDLHdEQUFvQixHQUFwQixVQUFxQixHQUE0QjtRQUMvQyxJQUFNLFNBQVMsR0FBRyxJQUFBLDZCQUFhLEVBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDdkQsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFbkQsSUFBTSxXQUFXLEdBQUcsR0FBRyxDQUFDLDBCQUEwQjtZQUNoRCxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsMEJBQTBCLENBQUM7WUFDNUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFBLDZCQUFhLEVBQUMsUUFBUSxFQUFFO1lBQzdCLElBQUEsNkJBQWEsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLENBQUM7WUFDekMsSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsNkJBQWEsRUFBQyxHQUFHLEVBQUUsY0FBYyxDQUFDLEVBQUUsV0FBVyxDQUFDLENB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