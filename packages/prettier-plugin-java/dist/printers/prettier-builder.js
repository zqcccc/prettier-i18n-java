"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ifBreak = exports.dedent = exports.indent = exports.fill = exports.group = exports.join = exports.concat = void 0;
var prettier = require("prettier").doc.builders;
var processComments = require("./comments/format-comments").processComments;
/*
 * ------------------------------------------------------------------
 * Wraps the Prettier builder functions to print tokens with comments
 * ------------------------------------------------------------------
 */
function concat(docs) {
    var concatenation = processComments(docs);
    if (!Array.isArray(docs)) {
        return "";
    }
    return concatenation;
}
exports.concat = concat;
function join(sep, docs) {
    var concatenation = prettier.join(processComments(sep), processComments(docs));
    return processEmptyDocs(concatenation);
}
exports.join = join;
function group(doc, opts) {
    var group = prettier.group(processComments(doc), opts);
    return group.contents === undefined ? "" : group;
}
exports.group = group;
function fill(docs) {
    var fill = prettier.fill(processComments(docs));
    return processEmptyDocs(fill);
}
exports.fill = fill;
function indent(doc) {
    var indentedDoc = prettier.indent(processComments(doc));
    return indentedDoc.contents.length === 0 ? "" : indentedDoc;
}
exports.indent = indent;
function dedent(doc) {
    var indentedDoc = prettier.dedent(processComments(doc));
    return indentedDoc.contents.length === 0 ? "" : indentedDoc;
}
exports.dedent = dedent;
function ifBreak(breakContents, flatContents) {
    return prettier.ifBreak(processComments(breakContents), processComments(flatContents));
}
exports.ifBreak = ifBreak;
// TODO: remove this once prettier 3.0 is released
var processEmptyDocs = function (doc) {
    var _a;
    return ((_a = doc.parts) === null || _a === void 0 ? void 0 : _a.length) === 0 ? "" : doc;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldHRpZXItYnVpbGRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmludGVycy9wcmV0dGllci1idWlsZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7O0FBT2IsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFFMUMsSUFBQSxlQUFlLEdBQUssT0FBTyxDQUFDLDRCQUE0QixDQUFDLGdCQUExQyxDQUEyQztBQUVsRTs7OztHQUlHO0FBRUgsU0FBZ0IsTUFBTSxDQUFDLElBQXNCO0lBQzNDLElBQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN4QixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQsT0FBTyxhQUFhLENBQUM7QUFDdkIsQ0FBQztBQVJELHdCQVFDO0FBRUQsU0FBZ0IsSUFBSSxDQUFDLEdBQVEsRUFBRSxJQUFzQjtJQUNuRCxJQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUNqQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQ3BCLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FDdEIsQ0FBQztJQUVGLE9BQU8sZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDekMsQ0FBQztBQVBELG9CQU9DO0FBRUQsU0FBZ0IsS0FBSyxDQUFDLEdBQWlCLEVBQUUsSUFBVTtJQUNqRCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxPQUFPLEtBQUssQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNuRCxDQUFDO0FBSEQsc0JBR0M7QUFFRCxTQUFnQixJQUFJLENBQUMsSUFBc0I7SUFDekMsSUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUVsRCxPQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFKRCxvQkFJQztBQUVELFNBQWdCLE1BQU0sQ0FBQyxHQUFpQjtJQUN0QyxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzFELE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztBQUM5RCxDQUFDO0FBSEQsd0JBR0M7QUFFRCxTQUFnQixNQUFNLENBQUMsR0FBaUI7SUFDdEMsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMxRCxPQUFPLFdBQVcsQ0FBQyxRQUFRLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7QUFDOUQsQ0FBQztBQUhELHdCQUdDO0FBRUQsU0FBZ0IsT0FBTyxDQUNyQixhQUEyQixFQUMzQixZQUEwQjtJQUUxQixPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQ3JCLGVBQWUsQ0FBQyxhQUFhLENBQUMsRUFDOUIsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUM5QixDQUFDO0FBQ0osQ0FBQztBQVJELDBCQVFDO0FBRUQsa0RBQWtEO0FBQ2xELElBQU0sZ0JBQWdCLEdBQUcsVUFBQyxHQUFrQjs7SUFDMUMsT0FBTyxDQUFBLE1BQUEsR0FBRyxDQUFDLEtBQUssMENBQUUsTUFBTSxNQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7QUFDNUMsQ0FBQyxDQUFDIn0=