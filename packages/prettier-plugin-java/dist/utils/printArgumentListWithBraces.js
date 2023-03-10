"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("prettier/doc");
var expressions_utils_1 = require("./expressions-utils");
var printer_utils_1 = require("../printers/printer-utils");
var printSingleLambdaInvocation_1 = __importDefault(require("./printSingleLambdaInvocation"));
var softline = doc_1.builders.softline;
function printArgumentListWithBraces(argumentListCtx, rBrace, lBrace) {
    var isSingleLambda = (0, expressions_utils_1.isArgumentListSingleLambda)(argumentListCtx);
    if (isSingleLambda) {
        return printSingleLambdaInvocation_1.default.call(this, argumentListCtx, rBrace, lBrace);
    }
    var argumentList = this.visit(argumentListCtx, {
        isInsideMethodInvocationSuffix: true
    });
    return (0, printer_utils_1.putIntoBraces)(argumentList, softline, lBrace, rBrace);
}
exports.default = printArgumentListWithBraces;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRBcmd1bWVudExpc3RXaXRoQnJhY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3ByaW50QXJndW1lbnRMaXN0V2l0aEJyYWNlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLG9DQUF3QztBQUN4Qyx5REFBaUU7QUFDakUsMkRBQTBEO0FBQzFELDhGQUF3RTtBQUVoRSxJQUFBLFFBQVEsR0FBSyxjQUFRLFNBQWIsQ0FBYztBQUU5QixTQUF3QiwyQkFBMkIsQ0FDakQsZUFBa0QsRUFDbEQsTUFBYyxFQUNkLE1BQWM7SUFFZCxJQUFNLGNBQWMsR0FBRyxJQUFBLDhDQUEwQixFQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQ25FLElBQUksY0FBYyxFQUFFO1FBQ2xCLE9BQU8scUNBQTJCLENBQUMsSUFBSSxDQUNyQyxJQUFJLEVBQ0osZUFBZSxFQUNmLE1BQU0sRUFDTixNQUFNLENBQ1AsQ0FBQztLQUNIO0lBRUQsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUU7UUFDL0MsOEJBQThCLEVBQUUsSUFBSTtLQUNyQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUEsNkJBQWEsRUFBQyxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBbkJELDhDQW1CQyJ9