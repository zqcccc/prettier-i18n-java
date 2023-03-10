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
exports.LexicalStructurePrettierVisitor = void 0;
var format_comments_1 = require("./comments/format-comments");
var base_cst_printer_1 = require("../base-cst-printer");
var LexicalStructurePrettierVisitor = /** @class */ (function (_super) {
    __extends(LexicalStructurePrettierVisitor, _super);
    function LexicalStructurePrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LexicalStructurePrettierVisitor.prototype.literal = function (ctx) {
        if (ctx.CharLiteral || ctx.TextBlock || ctx.StringLiteral || ctx.Null) {
            return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
        }
        return this.visitSingle(ctx);
    };
    LexicalStructurePrettierVisitor.prototype.integerLiteral = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    LexicalStructurePrettierVisitor.prototype.floatingPointLiteral = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    LexicalStructurePrettierVisitor.prototype.booleanLiteral = function (ctx) {
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    return LexicalStructurePrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.LexicalStructurePrettierVisitor = LexicalStructurePrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGV4aWNhbC1zdHJ1Y3R1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcHJpbnRlcnMvbGV4aWNhbC1zdHJ1Y3R1cmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsOERBQW9FO0FBQ3BFLHdEQUE2RDtBQVM3RDtJQUFxRCxtREFBc0I7SUFBM0U7O0lBbUJBLENBQUM7SUFsQkMsaURBQU8sR0FBUCxVQUFRLEdBQWU7UUFDckIsSUFBSSxHQUFHLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQyxTQUFTLElBQUksR0FBRyxDQUFDLGFBQWEsSUFBSSxHQUFHLENBQUMsSUFBSSxFQUFFO1lBQ3JFLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBVyxDQUFDLENBQUM7U0FDOUQ7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELHdEQUFjLEdBQWQsVUFBZSxHQUFzQjtRQUNuQyxPQUFPLElBQUEsd0NBQXNCLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQVcsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCw4REFBb0IsR0FBcEIsVUFBcUIsR0FBNEI7UUFDL0MsT0FBTyxJQUFBLHdDQUFzQixFQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFXLENBQUMsQ0FBQztJQUMvRCxDQUFDO0lBRUQsd0RBQWMsR0FBZCxVQUFlLEdBQXNCO1FBQ25DLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBVyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQUNILHNDQUFDO0FBQUQsQ0FBQyxBQW5CRCxDQUFxRCx5Q0FBc0IsR0FtQjFFO0FBbkJZLDBFQUErQiJ9