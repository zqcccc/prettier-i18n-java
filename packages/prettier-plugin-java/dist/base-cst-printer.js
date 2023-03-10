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
exports.BaseCstPrettierPrinter = void 0;
var java_parser_1 = require("java-parser");
var format_comments_1 = require("./printers/comments/format-comments");
var BaseCstPrettierPrinter = /** @class */ (function (_super) {
    __extends(BaseCstPrettierPrinter, _super);
    function BaseCstPrettierPrinter() {
        var _this = _super.call(this) || this;
        _this.mapVisit = function (elements, params) {
            if (elements === undefined) {
                // TODO: can optimize this by returning an immutable empty array singleton.
                return [];
            }
            return elements.map(function (element) { return _this.visit(element, params); });
        };
        _this.getSingle = function (ctx) {
            var ctxKeys = Object.keys(ctx);
            if (ctxKeys.length !== 1) {
                throw Error("Expecting single key CST ctx but found: <".concat(ctxKeys.length, "> keys"));
            }
            var singleElementKey = ctxKeys[0];
            var singleElementValues = ctx[singleElementKey];
            if ((singleElementValues === null || singleElementValues === void 0 ? void 0 : singleElementValues.length) !== 1) {
                throw Error("Expecting single item in CST ctx key but found: <".concat(singleElementValues === null || singleElementValues === void 0 ? void 0 : singleElementValues.length, "> items"));
            }
            return singleElementValues[0];
        };
        // @ts-ignore
        _this.orgVisit = _this.visit;
        _this.visit = function (ctx, inParam) {
            if (ctx === undefined) {
                // empty Doc
                return "";
            }
            var node = Array.isArray(ctx) ? ctx[0] : ctx;
            if (node.ignore) {
                try {
                    var startOffset = node.leadingComments !== undefined
                        ? node.leadingComments[0].startOffset
                        : node.location.startOffset;
                    var endOffset = (node.trailingComments !== undefined
                        ? node.trailingComments[node.trailingComments.length - 1].endOffset
                        : node.location.endOffset);
                    return this.prettierOptions.originalText.substring(startOffset, endOffset + 1);
                }
                catch (e) {
                    throw Error(e +
                        "\nThere might be a problem with prettier-ignore, please report an issue on https://github.com/jhipster/prettier-java/issues");
                }
            }
            return (0, format_comments_1.printNodeWithComments)(node, this.orgVisit.call(this, node, inParam));
        };
        _this.visitSingle = function (ctx, params) {
            var singleElement = this.getSingle(ctx);
            return this.visit(singleElement, params);
        };
        return _this;
    }
    return BaseCstPrettierPrinter;
}(java_parser_1.BaseJavaCstVisitor));
exports.BaseCstPrettierPrinter = BaseCstPrettierPrinter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jc3QtcHJpbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9iYXNlLWNzdC1wcmludGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDJDQUtxQjtBQUVyQix1RUFBNEU7QUFFNUU7SUFBNEMsMENBQWtCO0lBeUU1RDtRQUFBLFlBQ0UsaUJBQU8sU0FDUjtRQXhFRCxjQUFRLEdBQUcsVUFBQyxRQUErQixFQUFFLE1BQVk7WUFDdkQsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO2dCQUMxQiwyRUFBMkU7Z0JBQzNFLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxPQUFPLElBQUksT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsRUFBM0IsQ0FBMkIsQ0FBQyxDQUFDO1FBQzlELENBQUMsQ0FBQztRQUVGLGVBQVMsR0FBRyxVQUFDLEdBQTBCO1lBQ3JDLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDeEIsTUFBTSxLQUFLLENBQ1QsbURBQTRDLE9BQU8sQ0FBQyxNQUFNLFdBQVEsQ0FDbkUsQ0FBQzthQUNIO1lBQ0QsSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsSUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUVsRCxJQUFJLENBQUEsbUJBQW1CLGFBQW5CLG1CQUFtQix1QkFBbkIsbUJBQW1CLENBQUUsTUFBTSxNQUFLLENBQUMsRUFBRTtnQkFDckMsTUFBTSxLQUFLLENBQ1QsMkRBQW9ELG1CQUFtQixhQUFuQixtQkFBbUIsdUJBQW5CLG1CQUFtQixDQUFFLE1BQU0sWUFBUyxDQUN6RixDQUFDO2FBQ0g7WUFFRCxPQUFPLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQztRQUVGLGFBQWE7UUFDYixjQUFRLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQztRQUN0QixXQUFLLEdBQUcsVUFBVSxHQUFvQyxFQUFFLE9BQWE7WUFDbkUsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO2dCQUNyQixZQUFZO2dCQUNaLE9BQU8sRUFBRSxDQUFDO2FBQ1g7WUFFRCxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztZQUUvQyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ2YsSUFBSTtvQkFDRixJQUFNLFdBQVcsR0FDZixJQUFJLENBQUMsZUFBZSxLQUFLLFNBQVM7d0JBQ2hDLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVc7d0JBQ3JDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztvQkFDaEMsSUFBTSxTQUFTLEdBQUcsQ0FDaEIsSUFBSSxDQUFDLGdCQUFnQixLQUFLLFNBQVM7d0JBQ2pDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxTQUFTO3dCQUNuRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQ2xCLENBQUM7b0JBRVosT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQ2hELFdBQVcsRUFDWCxTQUFTLEdBQUcsQ0FBQyxDQUNkLENBQUM7aUJBQ0g7Z0JBQUMsT0FBTyxDQUFDLEVBQUU7b0JBQ1YsTUFBTSxLQUFLLENBQ1QsQ0FBQzt3QkFDQyw2SEFBNkgsQ0FDaEksQ0FBQztpQkFDSDthQUNGO1lBRUQsT0FBTyxJQUFBLHVDQUFxQixFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDO1FBRUYsaUJBQVcsR0FBRyxVQUFVLEdBQTBCLEVBQUUsTUFBWTtZQUM5RCxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDOztJQUlGLENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUE1RUQsQ0FBNEMsZ0NBQWtCLEdBNEU3RDtBQTVFWSx3REFBc0IifQ==