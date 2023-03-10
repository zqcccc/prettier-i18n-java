"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasComments = exports.hasTrailingLineComments = exports.hasLeadingLineComments = exports.hasTrailingComments = exports.hasLeadingComments = void 0;
function hasLeadingComments(token) {
    return token.leadingComments !== undefined;
}
exports.hasLeadingComments = hasLeadingComments;
function hasTrailingComments(token) {
    return token.trailingComments !== undefined;
}
exports.hasTrailingComments = hasTrailingComments;
function hasLeadingLineComments(token) {
    return (token.leadingComments !== undefined &&
        token.leadingComments.length !== 0 &&
        token.leadingComments[token.leadingComments.length - 1].tokenType.name ===
            "LineComment");
}
exports.hasLeadingLineComments = hasLeadingLineComments;
function hasTrailingLineComments(token) {
    return (token.trailingComments !== undefined &&
        token.trailingComments.length !== 0 &&
        token.trailingComments[token.trailingComments.length - 1].tokenType.name ===
            "LineComment");
}
exports.hasTrailingLineComments = hasTrailingLineComments;
function hasComments(token) {
    return hasLeadingComments(token) || hasTrailingComments(token);
}
exports.hasComments = hasComments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbWVudHMtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcHJpbnRlcnMvY29tbWVudHMvY29tbWVudHMtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBVUEsU0FBZ0Isa0JBQWtCLENBQ2hDLEtBQWlCO0lBRWpCLE9BQU8sS0FBSyxDQUFDLGVBQWUsS0FBSyxTQUFTLENBQUM7QUFDN0MsQ0FBQztBQUpELGdEQUlDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQ2pDLEtBQWlCO0lBRWpCLE9BQU8sS0FBSyxDQUFDLGdCQUFnQixLQUFLLFNBQVMsQ0FBQztBQUM5QyxDQUFDO0FBSkQsa0RBSUM7QUFFRCxTQUFnQixzQkFBc0IsQ0FDcEMsS0FBaUI7SUFFakIsT0FBTyxDQUNMLEtBQUssQ0FBQyxlQUFlLEtBQUssU0FBUztRQUNuQyxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQ2xDLEtBQUssQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDcEUsYUFBYSxDQUNoQixDQUFDO0FBQ0osQ0FBQztBQVRELHdEQVNDO0FBRUQsU0FBZ0IsdUJBQXVCLENBQ3JDLEtBQWlCO0lBRWpCLE9BQU8sQ0FDTCxLQUFLLENBQUMsZ0JBQWdCLEtBQUssU0FBUztRQUNwQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUM7UUFDbkMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUk7WUFDdEUsYUFBYSxDQUNoQixDQUFDO0FBQ0osQ0FBQztBQVRELDBEQVNDO0FBRUQsU0FBZ0IsV0FBVyxDQUFDLEtBQWlCO0lBQzNDLE9BQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakUsQ0FBQztBQUZELGtDQUVDIn0=