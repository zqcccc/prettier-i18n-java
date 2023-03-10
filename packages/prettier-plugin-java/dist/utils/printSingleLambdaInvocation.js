"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var doc_1 = require("prettier/doc");
var expressions_utils_1 = require("./expressions-utils");
var format_comments_1 = require("../printers/comments/format-comments");
var prettier_builder_1 = require("../printers/prettier-builder");
var printer_utils_1 = require("../printers/printer-utils");
var softline = doc_1.builders.softline, ifBreak = doc_1.builders.ifBreak;
function printSingleLambdaInvocation(argumentListCtx, rBrace, lBrace) {
    var lambdaParametersGroupId = Symbol("lambdaParameters");
    var argumentList = this.visit(argumentListCtx, {
        lambdaParametersGroupId: lambdaParametersGroupId,
        isInsideMethodInvocationSuffix: true
    });
    var formattedRBrace = (0, expressions_utils_1.isSingleArgumentLambdaExpressionWithBlock)(argumentListCtx)
        ? ifBreak((0, prettier_builder_1.indent)((0, prettier_builder_1.concat)([softline, rBrace])), (0, format_comments_1.printTokenWithComments)(rBrace), { groupId: lambdaParametersGroupId })
        : (0, prettier_builder_1.indent)((0, prettier_builder_1.concat)([softline, rBrace]));
    return (0, prettier_builder_1.dedent)((0, printer_utils_1.putIntoBraces)(argumentList, "", lBrace, formattedRBrace));
}
exports.default = printSingleLambdaInvocation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRTaW5nbGVMYW1iZGFJbnZvY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWxzL3ByaW50U2luZ2xlTGFtYmRhSW52b2NhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG9DQUF3QztBQUN4Qyx5REFBZ0Y7QUFDaEYsd0VBQThFO0FBQzlFLGlFQUFzRTtBQUN0RSwyREFBMEQ7QUFFbEQsSUFBQSxRQUFRLEdBQWMsY0FBUSxTQUF0QixFQUFFLE9BQU8sR0FBSyxjQUFRLFFBQWIsQ0FBYztBQUV2QyxTQUF3QiwyQkFBMkIsQ0FDakQsZUFBa0QsRUFDbEQsTUFBYyxFQUNkLE1BQWM7SUFFZCxJQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzNELElBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxFQUFFO1FBQy9DLHVCQUF1Qix5QkFBQTtRQUN2Qiw4QkFBOEIsRUFBRSxJQUFJO0tBQ3JDLENBQUMsQ0FBQztJQUVILElBQU0sZUFBZSxHQUFHLElBQUEsNkRBQXlDLEVBQy9ELGVBQWUsQ0FDaEI7UUFDQyxDQUFDLENBQUMsT0FBTyxDQUNMLElBQUEseUJBQU0sRUFBQyxJQUFBLHlCQUFNLEVBQUMsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUNsQyxJQUFBLHdDQUFzQixFQUFDLE1BQU0sQ0FBQyxFQUM5QixFQUFFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxDQUNyQztRQUNILENBQUMsQ0FBQyxJQUFBLHlCQUFNLEVBQUMsSUFBQSx5QkFBTSxFQUFDLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QyxPQUFPLElBQUEseUJBQU0sRUFBQyxJQUFBLDZCQUFhLEVBQUMsWUFBWSxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUMxRSxDQUFDO0FBckJELDhDQXFCQyJ9