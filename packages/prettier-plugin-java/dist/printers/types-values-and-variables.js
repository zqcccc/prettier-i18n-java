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
exports.TypesValuesAndVariablesPrettierVisitor = void 0;
var forEach_1 = __importDefault(require("lodash/forEach"));
var prettier_builder_1 = require("./prettier-builder");
var format_comments_1 = require("./comments/format-comments");
var printer_utils_1 = require("./printer-utils");
var base_cst_printer_1 = require("../base-cst-printer");
var utils_1 = require("../types/utils");
var TypesValuesAndVariablesPrettierVisitor = /** @class */ (function (_super) {
    __extends(TypesValuesAndVariablesPrettierVisitor, _super);
    function TypesValuesAndVariablesPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypesValuesAndVariablesPrettierVisitor.prototype.primitiveType = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var type = ctx.numericType
            ? this.visit(ctx.numericType)
            : this.getSingle(ctx);
        return (0, printer_utils_1.rejectAndJoin)(" ", [(0, prettier_builder_1.join)(" ", annotations), type]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.numericType = function (ctx) {
        return this.visitSingle(ctx);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.integralType = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.floatingPointType = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.referenceType = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var type = ctx.primitiveType
            ? this.visit(ctx.primitiveType)
            : this.visit(ctx.classOrInterfaceType);
        var dims = this.visit(ctx.dims);
        return (0, printer_utils_1.rejectAndJoin)(" ", [(0, prettier_builder_1.join)(" ", annotations), (0, prettier_builder_1.concat)([type, dims])]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.classOrInterfaceType = function (ctx) {
        return this.visitSingle(ctx);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.classType = function (ctx) {
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
                currentSegment.push(_this.visit([token]), " ");
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
    TypesValuesAndVariablesPrettierVisitor.prototype.interfaceType = function (ctx) {
        return this.visitSingle(ctx);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeVariable = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var identifier = this.getSingle(ctx);
        return (0, printer_utils_1.rejectAndJoin)(" ", [(0, prettier_builder_1.join)(" ", annotations), identifier]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.dims = function (ctx) {
        var _this = this;
        var tokens = __spreadArray([], ctx.LSquare, true);
        if (ctx.annotation) {
            tokens = __spreadArray(__spreadArray([], tokens, true), ctx.annotation, true);
        }
        tokens = tokens.sort(function (a, b) {
            var startOffset1 = (0, utils_1.isCstNode)(a)
                ? a.children.At[0].startOffset
                : a.startOffset;
            var startOffset2 = (0, utils_1.isCstNode)(b)
                ? b.children.At[0].startOffset
                : b.startOffset;
            return startOffset1 - startOffset2;
        });
        var segments = [];
        var currentSegment = [];
        (0, forEach_1.default)(tokens, function (token) {
            if ((0, utils_1.isCstNode)(token)) {
                currentSegment.push(_this.visit([token]));
            }
            else {
                segments.push((0, printer_utils_1.rejectAndConcat)([
                    (0, printer_utils_1.rejectAndJoin)(" ", currentSegment),
                    (0, prettier_builder_1.concat)([ctx.LSquare[0], ctx.RSquare[0]])
                ]));
                currentSegment = [];
            }
        });
        return (0, printer_utils_1.rejectAndConcat)(segments);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeParameter = function (ctx) {
        var typeParameterModifiers = this.mapVisit(ctx.typeParameterModifier);
        var typeIdentifier = this.visit(ctx.typeIdentifier);
        var typeBound = this.visit(ctx.typeBound);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.join)(" ", typeParameterModifiers),
            typeIdentifier,
            typeBound
        ]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeParameterModifier = function (ctx) {
        return this.visitSingle(ctx);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeBound = function (ctx) {
        var classOrInterfaceType = this.visit(ctx.classOrInterfaceType);
        var additionalBound = this.mapVisit(ctx.additionalBound);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.Extends[0],
            classOrInterfaceType,
            (0, prettier_builder_1.join)(" ", additionalBound)
        ]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.additionalBound = function (ctx) {
        var interfaceType = this.visit(ctx.interfaceType);
        return (0, prettier_builder_1.join)(" ", [ctx.And[0], interfaceType]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeArguments = function (ctx) {
        var typeArgumentList = this.visit(ctx.typeArgumentList);
        return (0, printer_utils_1.rejectAndConcat)([ctx.Less[0], typeArgumentList, ctx.Greater[0]]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeArgumentList = function (ctx) {
        var typeArguments = this.mapVisit(ctx.typeArgument);
        var commas = ctx.Comma ? ctx.Comma.map(function (elt) { return (0, prettier_builder_1.concat)([elt, " "]); }) : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, typeArguments);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.typeArgument = function (ctx) {
        return this.visitSingle(ctx);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.wildcard = function (ctx) {
        var annotations = this.mapVisit(ctx.annotation);
        var wildcardBounds = this.visit(ctx.wildcardBounds);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, prettier_builder_1.join)(" ", annotations),
            ctx.QuestionMark[0],
            wildcardBounds
        ]);
    };
    TypesValuesAndVariablesPrettierVisitor.prototype.wildcardBounds = function (ctx) {
        var keyWord = ctx.Extends ? ctx.Extends[0] : ctx.Super[0];
        var referenceType = this.visit(ctx.referenceType);
        return (0, prettier_builder_1.join)(" ", [keyWord, referenceType]);
    };
    return TypesValuesAndVariablesPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.TypesValuesAndVariablesPrettierVisitor = TypesValuesAndVariablesPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMtdmFsdWVzLWFuZC12YXJpYWJsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJpbnRlcnMvdHlwZXMtdmFsdWVzLWFuZC12YXJpYWJsZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYiwyREFBcUM7QUFFckMsdURBQWtEO0FBQ2xELDhEQUFvRTtBQUNwRSxpREFLeUI7QUF5QnpCLHdEQUE2RDtBQUM3RCx3Q0FJd0I7QUFFeEI7SUFBNEQsMERBQXNCO0lBQWxGOztJQXdMQSxDQUFDO0lBdkxDLDhEQUFhLEdBQWIsVUFBYyxHQUFxQjtRQUNqQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsV0FBVztZQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO1lBQzdCLENBQUMsQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBWSxDQUFDO1FBRXBDLE9BQU8sSUFBQSw2QkFBYSxFQUFDLEdBQUcsRUFBRSxDQUFDLElBQUEsdUJBQUksRUFBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsNERBQVcsR0FBWCxVQUFZLEdBQW1CO1FBQzdCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsNkRBQVksR0FBWixVQUFhLEdBQW9CO1FBQy9CLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUVELGtFQUFpQixHQUFqQixVQUFrQixHQUF5QjtRQUN6QyxPQUFPLElBQUEs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