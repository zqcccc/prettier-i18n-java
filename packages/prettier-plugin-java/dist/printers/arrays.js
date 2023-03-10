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
exports.ArraysPrettierVisitor = void 0;
var printer_utils_1 = require("./printer-utils");
var doc_1 = require("prettier/doc");
var base_cst_printer_1 = require("../base-cst-printer");
var line = doc_1.builders.line;
var ArraysPrettierVisitor = /** @class */ (function (_super) {
    __extends(ArraysPrettierVisitor, _super);
    function ArraysPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ArraysPrettierVisitor.prototype.arrayInitializer = function (ctx) {
        var optionalVariableInitializerList = this.visit(ctx.variableInitializerList);
        return (0, printer_utils_1.printArrayList)({
            list: optionalVariableInitializerList,
            extraComma: ctx.Comma,
            LCurly: ctx.LCurly[0],
            RCurly: ctx.RCurly[0],
            trailingComma: this.prettierOptions.trailingComma
        });
    };
    ArraysPrettierVisitor.prototype.variableInitializerList = function (ctx) {
        var variableInitializers = this.mapVisit(ctx.variableInitializer);
        var commas = ctx.Comma
            ? ctx.Comma.map(function (comma) {
                return (0, printer_utils_1.rejectAndConcat)([comma, line]);
            })
            : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, variableInitializers);
    };
    return ArraysPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.ArraysPrettierVisitor = ArraysPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXlzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ByaW50ZXJzL2FycmF5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQSxpREFJeUI7QUFDekIsb0NBQXdDO0FBQ3hDLHdEQUE2RDtBQUVyRCxJQUFBLElBQUksR0FBSyxjQUFRLEtBQWIsQ0FBYztBQUUxQjtJQUEyQyx5Q0FBc0I7SUFBakU7O0lBMEJBLENBQUM7SUF4QkMsZ0RBQWdCLEdBQWhCLFVBQWlCLEdBQXdCO1FBQ3ZDLElBQU0sK0JBQStCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FDaEQsR0FBRyxDQUFDLHVCQUF1QixDQUM1QixDQUFDO1FBRUYsT0FBTyxJQUFBLDhCQUFjLEVBQUM7WUFDcEIsSUFBSSxFQUFFLCtCQUErQjtZQUNyQyxVQUFVLEVBQUUsR0FBRyxDQUFDLEtBQUs7WUFDckIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNyQixhQUFhLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxhQUFhO1NBQ2xELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCx1REFBdUIsR0FBdkIsVUFBd0IsR0FBK0I7UUFDckQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3BFLElBQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLO1lBQ3RCLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7Z0JBQ2pCLE9BQU8sSUFBQSwrQkFBZSxFQUFDLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUVQLE9BQU8sSUFBQSxpQ0FBaUIsRUFBQyxNQUFNLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztJQUN6RCxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBMUJELENBQTJDLHlDQUFzQixHQTBCaEU7QUExQlksc0RBQXFCIn0=