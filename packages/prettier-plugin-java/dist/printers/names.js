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
exports.NamesPrettierVisitor = void 0;
var printer_utils_1 = require("./printer-utils");
var format_comments_1 = require("./comments/format-comments");
var base_cst_printer_1 = require("../base-cst-printer");
var NamesPrettierVisitor = /** @class */ (function (_super) {
    __extends(NamesPrettierVisitor, _super);
    function NamesPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NamesPrettierVisitor.prototype.typeIdentifier = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(ctx.Identifier[0]);
    };
    NamesPrettierVisitor.prototype.moduleName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    NamesPrettierVisitor.prototype.packageName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    NamesPrettierVisitor.prototype.typeName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    NamesPrettierVisitor.prototype.expressionName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    NamesPrettierVisitor.prototype.methodName = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(ctx.Identifier[0]);
    };
    NamesPrettierVisitor.prototype.packageOrTypeName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    NamesPrettierVisitor.prototype.ambiguousName = function (ctx) {
        return (0, printer_utils_1.buildFqn)(ctx.Identifier, ctx.Dot);
    };
    return NamesPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.NamesPrettierVisitor = NamesPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmFtZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJpbnRlcnMvbmFtZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFYixpREFBMkM7QUFDM0MsOERBQW9FO0FBQ3BFLHdEQUE2RDtBQVk3RDtJQUEwQyx3Q0FBc0I7SUFBaEU7O0lBZ0NBLENBQUM7SUEvQkMsNkNBQWMsR0FBZCxVQUFlLEdBQXNCO1FBQ25DLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELHlDQUFVLEdBQVYsVUFBVyxHQUFrQjtRQUMzQixPQUFPLElBQUEsd0JBQVEsRUFBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsMENBQVcsR0FBWCxVQUFZLEdBQW1CO1FBQzdCLE9BQU8sSUFBQSx3QkFBUSxFQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCx1Q0FBUSxHQUFSLFVBQVMsR0FBZ0I7UUFDdkIsT0FBTyxJQUFBLHdCQUFRLEVBQUMsR0FBRyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELDZDQUFjLEdBQWQsVUFBZSxHQUFzQjtRQUNuQyxPQUFPLElBQUEsd0JBQVEsRUFBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLEdBQWtCO1FBQzNCLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELGdEQUFpQixHQUFqQixVQUFrQixHQUF5QjtRQUN6QyxPQUFPLElBQUEsd0JBQVEsRUFBQyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsNENBQWEsR0FBYixVQUFjLEdBQXFCO1FBQ2pDLE9BQU8sSUFBQSx3QkFBUSxFQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFoQ0QsQ0FBMEMseUNBQXNCLEdBZ0MvRDtBQWhDWSxvREFBb0IifQ==