"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCommentsBinaryExpression = void 0;
var comments_utils_1 = require("./comments-utils");
function handleCommentsBinaryExpression(ctx) {
    var unaryExpressionIndex = 1;
    if (ctx.BinaryOperator !== undefined) {
        ctx.BinaryOperator.forEach(function (binaryOperator) {
            var _a;
            if ((0, comments_utils_1.hasLeadingComments)(binaryOperator)) {
                while (ctx.unaryExpression[unaryExpressionIndex].location.startOffset <
                    binaryOperator.endOffset) {
                    unaryExpressionIndex++;
                }
                // Adapt the position of the operator and its leading comments
                var shiftUp = binaryOperator.leadingComments[0].startLine -
                    1 -
                    binaryOperator.startLine;
                if (binaryOperator.startLine !==
                    ctx.unaryExpression[unaryExpressionIndex].location.startLine) {
                    binaryOperator.leadingComments.forEach(function (comment) {
                        comment.startLine += 1;
                        comment.endLine += 1;
                    });
                }
                binaryOperator.startLine += shiftUp;
                binaryOperator.endLine += shiftUp;
                // Assign the leading comments & trailing comments of the binaryOperator
                // to the following unaryExpression as leading comments
                ctx.unaryExpression[unaryExpressionIndex].leadingComments =
                    ctx.unaryExpression[unaryExpressionIndex].leadingComments || [];
                (_a = ctx.unaryExpression[unaryExpressionIndex].leadingComments).unshift.apply(_a, binaryOperator.leadingComments);
                delete binaryOperator.leadingComments;
            }
        });
    }
}
exports.handleCommentsBinaryExpression = handleCommentsBinaryExpression;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlLWNvbW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ByaW50ZXJzL2NvbW1lbnRzL2hhbmRsZS1jb21tZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxtREFBc0Q7QUFHdEQsU0FBZ0IsOEJBQThCLENBQUMsR0FBd0I7SUFDckUsSUFBSSxvQkFBb0IsR0FBRyxDQUFDLENBQUM7SUFDN0IsSUFBSSxHQUFHLENBQUMsY0FBYyxLQUFLLFNBQVMsRUFBRTtRQUNwQyxHQUFHLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxVQUFBLGNBQWM7O1lBQ3ZDLElBQUksSUFBQSxtQ0FBa0IsRUFBQyxjQUFjLENBQUMsRUFBRTtnQkFDdEMsT0FDRSxHQUFHLENBQUMsZUFBZSxDQUFDLG9CQUFvQixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVc7b0JBQzlELGNBQWMsQ0FBQyxTQUFTLEVBQ3hCO29CQUNBLG9CQUFvQixFQUFFLENBQUM7aUJBQ3hCO2dCQUVELDhEQUE4RDtnQkFDOUQsSUFBTSxPQUFPLEdBQ1gsY0FBYyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO29CQUMzQyxDQUFDO29CQUNELGNBQWMsQ0FBQyxTQUFTLENBQUM7Z0JBRTNCLElBQ0UsY0FBYyxDQUFDLFNBQVM7b0JBQ3hCLEdBQUcsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUM1RDtvQkFDQSxjQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxVQUFBLE9BQU87d0JBQzVDLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDO3dCQUN2QixPQUFPLENBQUMsT0FBTyxJQUFJLENBQUMsQ0FBQztvQkFDdkIsQ0FBQyxDQUFDLENBQUM7aUJBQ0o7Z0JBQ0QsY0FBYyxDQUFDLFNBQVMsSUFBSSxPQUFPLENBQUM7Z0JBQ3BDLGNBQWMsQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDO2dCQUVsQyx3RUFBd0U7Z0JBQ3hFLHVEQUF1RDtnQkFDdkQsR0FBRyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLGVBQWU7b0JBQ3ZELEdBQUcsQ0FBQyxlQUFlLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxlQUFlLElBQUksRUFBRSxDQUFDO2dCQUNsRSxDQUFBLEtBQUEsR0FBRyxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLGVBQWdCLENBQUEsQ0FBQyxPQUFPLFdBQzdELGNBQWMsQ0FBQyxlQUFlLEVBQ2pDO2dCQUNGLE9BQVEsY0FBeUIsQ0FBQyxlQUFlLENBQUM7YUFDbkQ7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQXpDRCx3RUF5Q0MifQ==