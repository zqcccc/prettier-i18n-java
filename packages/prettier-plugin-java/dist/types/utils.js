"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOrdinaryCompilationUnitCtx = exports.isAnnotationCstNode = exports.isTypeArgumentsCstNode = exports.isCstElementOrUndefinedIToken = exports.isIToken = exports.isCstNode = void 0;
function isCstNode(tokenOrNode) {
    return !isIToken(tokenOrNode);
}
exports.isCstNode = isCstNode;
function isIToken(tokenOrNode) {
    return (tokenOrNode.tokenType !== undefined &&
        tokenOrNode.image !== undefined);
}
exports.isIToken = isIToken;
function isCstElementOrUndefinedIToken(tokenOrNode) {
    return tokenOrNode !== undefined && isIToken(tokenOrNode);
}
exports.isCstElementOrUndefinedIToken = isCstElementOrUndefinedIToken;
var isTypeArgumentsCstNode = function (cstElement) {
    return cstElement.name === "typeArguments";
};
exports.isTypeArgumentsCstNode = isTypeArgumentsCstNode;
var isAnnotationCstNode = function (cstElement) {
    return cstElement.name === "annotation";
};
exports.isAnnotationCstNode = isAnnotationCstNode;
var isOrdinaryCompilationUnitCtx = function (ctx) {
    return (ctx.ordinaryCompilationUnit !==
        undefined);
};
exports.isOrdinaryCompilationUnitCtx = isOrdinaryCompilationUnitCtx;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdHlwZXMvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsU0FBZ0IsU0FBUyxDQUFDLFdBQXVCO0lBQy9DLE9BQU8sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELDhCQUVDO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLFdBQXVCO0lBQzlDLE9BQU8sQ0FDSixXQUFzQixDQUFDLFNBQVMsS0FBSyxTQUFTO1FBQzlDLFdBQXNCLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FDNUMsQ0FBQztBQUNKLENBQUM7QUFMRCw0QkFLQztBQUVELFNBQWdCLDZCQUE2QixDQUMzQyxXQUFtQztJQUVuQyxPQUFPLFdBQVcsS0FBSyxTQUFTLElBQUksUUFBUSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFKRCxzRUFJQztBQUVNLElBQU0sc0JBQXNCLEdBQUcsVUFDcEMsVUFBc0I7SUFFdEIsT0FBUSxVQUFzQixDQUFDLElBQUksS0FBSyxlQUFlLENBQUM7QUFDMUQsQ0FBQyxDQUFDO0FBSlcsUUFBQSxzQkFBc0IsMEJBSWpDO0FBRUssSUFBTSxtQkFBbUIsR0FBRyxVQUNqQyxVQUFzQjtJQUV0QixPQUFRLFVBQXNCLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQztBQUN2RCxDQUFDLENBQUM7QUFKVyxRQUFBLG1CQUFtQix1QkFJOUI7QUFFSyxJQUFNLDRCQUE0QixHQUFHLFVBQzFDLEdBQXVCO0lBRXZCLE9BQU8sQ0FDSixHQUEwQyxDQUFDLHVCQUF1QjtRQUNuRSxTQUFTLENBQ1YsQ0FBQztBQUNKLENBQUMsQ0FBQztBQVBXLFFBQUEsNEJBQTRCLGdDQU92QyJ9