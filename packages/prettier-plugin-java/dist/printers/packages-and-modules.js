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
exports.PackagesAndModulesPrettierVisitor = void 0;
var prettier_builder_1 = require("./prettier-builder");
var format_comments_1 = require("./comments/format-comments");
var printer_utils_1 = require("./printer-utils");
var doc_1 = require("prettier/doc");
var base_cst_printer_1 = require("../base-cst-printer");
var utils_1 = require("../types/utils");
var line = doc_1.builders.line, hardline = doc_1.builders.hardline, indent = doc_1.builders.indent, group = doc_1.builders.group;
var PackagesAndModulesPrettierVisitor = /** @class */ (function (_super) {
    __extends(PackagesAndModulesPrettierVisitor, _super);
    function PackagesAndModulesPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PackagesAndModulesPrettierVisitor.prototype.compilationUnit = function (ctx) {
        var compilationUnit = (0, utils_1.isOrdinaryCompilationUnitCtx)(ctx)
            ? ctx.ordinaryCompilationUnit
            : ctx.modularCompilationUnit;
        return (0, prettier_builder_1.concat)([this.visit(compilationUnit[0]), line]);
    };
    PackagesAndModulesPrettierVisitor.prototype.ordinaryCompilationUnit = function (ctx) {
        var packageDecl = this.visit(ctx.packageDeclaration);
        var sortedImportsDecl = (0, printer_utils_1.sortImports)(ctx.importDeclaration);
        var nonStaticImports = this.mapVisit(sortedImportsDecl.nonStaticImports);
        var staticImports = this.mapVisit(sortedImportsDecl.staticImports);
        var typesDecl = this.mapVisit(ctx.typeDeclaration);
        // TODO: utility to add item+line (or multiple lines) but only if an item exists
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([hardline, hardline]), [
                packageDecl,
                (0, printer_utils_1.rejectAndJoin)(hardline, staticImports),
                (0, printer_utils_1.rejectAndJoin)(hardline, nonStaticImports),
                (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([hardline, hardline]), typesDecl)
            ])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.modularCompilationUnit = function (ctx) {
        var sortedImportsDecl = (0, printer_utils_1.sortImports)(ctx.importDeclaration);
        var nonStaticImports = this.mapVisit(sortedImportsDecl.nonStaticImports);
        var staticImports = this.mapVisit(sortedImportsDecl.staticImports);
        var moduleDeclaration = this.visit(ctx.moduleDeclaration);
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([hardline, hardline]), [
                (0, printer_utils_1.rejectAndJoin)(hardline, staticImports),
                (0, printer_utils_1.rejectAndJoin)(hardline, nonStaticImports),
                moduleDeclaration
            ])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.packageDeclaration = function (ctx) {
        var modifiers = this.mapVisit(ctx.packageModifier);
        var name = (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, modifiers),
            (0, prettier_builder_1.concat)([ctx.Package[0], " ", name, ctx.Semicolon[0]])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.packageModifier = function (ctx) {
        return this.visitSingle(ctx);
    };
    PackagesAndModulesPrettierVisitor.prototype.importDeclaration = function (ctx) {
        if (ctx.emptyStatement !== undefined) {
            return this.visit(ctx.emptyStatement);
        }
        var optionalStatic = ctx.Static ? ctx.Static[0] : "";
        var packageOrTypeName = this.visit(ctx.packageOrTypeName);
        var optionalDotStar = ctx.Dot ? (0, prettier_builder_1.concat)([ctx.Dot[0], ctx.Star[0]]) : "";
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.Import[0],
            optionalStatic,
            (0, printer_utils_1.rejectAndConcat)([packageOrTypeName, optionalDotStar, ctx.Semicolon[0]])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.typeDeclaration = function (ctx) {
        if (ctx.Semicolon) {
            return (0, printer_utils_1.displaySemicolon)(ctx.Semicolon[0]);
        }
        return this.visitSingle(ctx);
    };
    PackagesAndModulesPrettierVisitor.prototype.moduleDeclaration = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var optionalOpen = ctx.Open ? ctx.Open[0] : "";
        var name = (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
        var moduleDirectives = this.mapVisit(ctx.moduleDirective);
        var content = (0, printer_utils_1.rejectAndJoinSeps)((0, printer_utils_1.getBlankLinesSeparator)(ctx.moduleDirective), moduleDirectives);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.join)(" ", annotations),
            optionalOpen,
            ctx.Module[0],
            name,
            (0, printer_utils_1.putIntoBraces)(content, hardline, ctx.LCurly[0], ctx.RCurly[0])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.moduleDirective = function (ctx) {
        return this.visitSingle(ctx);
    };
    PackagesAndModulesPrettierVisitor.prototype.requiresModuleDirective = function (ctx) {
        var modifiers = this.mapVisit(ctx.requiresModifier);
        var moduleName = this.visit(ctx.moduleName);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.Requires[0],
            (0, prettier_builder_1.join)(" ", modifiers),
            (0, prettier_builder_1.concat)([moduleName, ctx.Semicolon[0]])
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.exportsModuleDirective = function (ctx) {
        var packageName = this.visit(ctx.packageName);
        var moduleNames = this.mapVisit(ctx.moduleName);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        if (ctx.To) {
            return group((0, printer_utils_1.rejectAndConcat)([
                indent((0, printer_utils_1.rejectAndJoin)(line, [
                    (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Exports[0], packageName]),
                    group(indent((0, printer_utils_1.rejectAndJoin)(line, [
                        ctx.To[0],
                        (0, printer_utils_1.rejectAndJoinSeps)(commas, moduleNames)
                    ])))
                ])),
                ctx.Semicolon[0]
            ]));
        }
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.concat)([ctx.Exports[0], " "]),
            packageName,
            ctx.Semicolon[0]
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.opensModuleDirective = function (ctx) {
        var packageName = this.visit(ctx.packageName);
        var to = ctx.To ? ctx.To[0] : "";
        var moduleNames = this.mapVisit(ctx.moduleName);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        if (ctx.To) {
            return group((0, printer_utils_1.rejectAndConcat)([
                indent((0, printer_utils_1.rejectAndJoin)(line, [
                    (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Opens[0], packageName]),
                    group(indent((0, printer_utils_1.rejectAndJoin)(line, [
                        ctx.To[0],
                        (0, printer_utils_1.rejectAndJoinSeps)(commas, moduleNames)
                    ])))
                ])),
                ctx.Semicolon[0]
            ]));
        }
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.concat)([ctx.Opens[0], " "]),
            packageName,
            ctx.Semicolon[0]
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.usesModuleDirective = function (ctx) {
        var typeName = this.visit(ctx.typeName);
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.concat)([ctx.Uses[0], " "]),
            typeName,
            ctx.Semicolon[0]
        ]);
    };
    PackagesAndModulesPrettierVisitor.prototype.providesModuleDirective = function (ctx) {
        var firstTypeName = this.visit(ctx.typeName[0]);
        var otherTypeNames = this.mapVisit(ctx.typeName.slice(1));
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, line]); }) : [];
        return group((0, printer_utils_1.rejectAndConcat)([
            indent((0, printer_utils_1.rejectAndJoin)(line, [
                (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Provides[0], firstTypeName]),
                group(indent((0, printer_utils_1.rejectAndJoin)(line, [
                    ctx.With[0],
                    (0, printer_utils_1.rejectAndJoinSeps)(commas, otherTypeNames)
                ])))
            ])),
            ctx.Semicolon[0]
        ]));
    };
    PackagesAndModulesPrettierVisitor.prototype.requiresModifier = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    PackagesAndModulesPrettierVisitor.prototype.isModuleCompilationUnit = function () {
        return "isModuleCompilationUnit";
    };
    return PackagesAndModulesPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.PackagesAndModulesPrettierVisitor = PackagesAndModulesPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZXMtYW5kLW1vZHVsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJpbnRlcnMvcGFja2FnZXMtYW5kLW1vZHVsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQWtEO0FBQ2xELDhEQUFvRTtBQUNwRSxpREFTeUI7QUFDekIsb0NBQXdDO0FBQ3hDLHdEQUE2RDtBQW1CN0Qsd0NBQThEO0FBRXRELElBQUEsSUFBSSxHQUE4QixjQUFRLEtBQXRDLEVBQUUsUUFBUSxHQUFvQixjQUFRLFNBQTVCLEVBQUUsTUFBTSxHQUFZLGNBQVEsT0FBcEIsRUFBRSxLQUFLLEdBQUssY0FBUSxNQUFiLENBQWM7QUFFbkQ7SUFBdUQscURBQXNCO0lBQTdFOztJQWtPQSxDQUFDO0lBak9DLDJEQUFlLEdBQWYsVUFBZ0IsR0FBdUI7UUFDckMsSUFBTSxlQUFlLEdBQUcsSUFBQSxvQ0FBNEIsRUFBQyxHQUFHLENBQUM7WUFDdkQsQ0FBQyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUI7WUFDN0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQztRQUUvQixPQUFPLElBQUEseUJBQU0sRUFBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsbUVBQXVCLEdBQXZCLFVBQXdCLEdBQStCO1FBQ3JELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFFdkQsSUFBTSxpQkFBaUIsR0FBRyxJQUFBLDJCQUFXLEVBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDN0QsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDM0UsSUFBTSxh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