"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSingleArgumentLambdaExpressionWithBlock = exports.isArgumentListSingleLambda = void 0;
function isArgumentListSingleLambda(argumentList) {
    if (argumentList === undefined) {
        return false;
    }
    var args = argumentList[0].children.expression;
    if (args.length !== 1) {
        return false;
    }
    var argument = args[0];
    return argument.children.lambdaExpression !== undefined;
}
exports.isArgumentListSingleLambda = isArgumentListSingleLambda;
var isSingleArgumentLambdaExpressionWithBlock = function (argumentList) {
    if (argumentList === undefined) {
        return false;
    }
    var args = argumentList[0].children.expression;
    if (args.length !== 1) {
        return false;
    }
    var argument = args[0];
    return (argument.children.lambdaExpression !== undefined &&
        argument.children.lambdaExpression[0].children.lambdaBody[0].children
            .block !== undefined);
};
exports.isSingleArgumentLambdaExpressionWithBlock = isSingleArgumentLambdaExpressionWithBlock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwcmVzc2lvbnMtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvZXhwcmVzc2lvbnMtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEsU0FBZ0IsMEJBQTBCLENBQ3hDLFlBQStDO0lBRS9DLElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTtRQUM5QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFDakQsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUNyQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTLENBQUM7QUFDMUQsQ0FBQztBQWRELGdFQWNDO0FBRU0sSUFBTSx5Q0FBeUMsR0FBRyxVQUN2RCxZQUErQztJQUUvQyxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7UUFDOUIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELElBQU0sSUFBSSxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDO0lBQ2pELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDckIsT0FBTyxLQUFLLENBQUM7S0FDZDtJQUVELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6QixPQUFPLENBQ0wsUUFBUSxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsS0FBSyxTQUFTO1FBQ2hELFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRO2FBQ2xFLEtBQUssS0FBSyxTQUFTLENBQ3ZCLENBQUM7QUFDSixDQUFDLENBQUM7QUFsQlcsUUFBQSx5Q0FBeUMsNkNBa0JwRCJ9