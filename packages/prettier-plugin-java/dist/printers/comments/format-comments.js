"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processComments = exports.getTokenLeadingComments = exports.printNodeWithComments = exports.printTokenWithComments = void 0;
var doc_1 = require("prettier/doc");
var utils_1 = require("../../types/utils");
var isEmptyDoc_1 = __importDefault(require("../../utils/isEmptyDoc"));
var hardline = doc_1.builders.hardline, lineSuffix = doc_1.builders.lineSuffix, breakParent = doc_1.builders.breakParent, literalline = doc_1.builders.literalline;
/**
 * Takes a token and return a doc with:
 * - concatenated leading comments
 * - the token image
 * - concatenated trailing comments
 *
 * @param {IToken} token
 * @return a doc with the token and its comments
 */
function printTokenWithComments(token) {
    if (token.tokenType.name === 'StringLiteral') {
        token.image = token.image.replace(/[\u4e00-\u9fa5\u0800-\u4e00]+/g, '');
    }
    if (/text|string|char/i.test(token.tokenType.name)) {
        console.log('token: ', token);
    }
    return printWithComments(token, token.image, getTokenLeadingComments, getTokenTrailingComments);
}
exports.printTokenWithComments = printTokenWithComments;
/**
 * Takes a node and return a doc with:
 * - concatenated leading comments
 * - the node doc value
 * - concatenated trailing comments
 *
 * @param {CstNode} node
 * @param {Doc} value - the converted node value
 * @return a doc with the token and its comments
 */
function printNodeWithComments(node, value) {
    return printWithComments(node, value, getNodeLeadingComments, getNodeTrailingComments);
}
exports.printNodeWithComments = printNodeWithComments;
function printWithComments(nodeOrToken, value, getLeadingComments, getTrailingComments) {
    var leadingComments = getLeadingComments(nodeOrToken);
    var trailingComments = getTrailingComments(nodeOrToken, value);
    return leadingComments.length === 0 && trailingComments.length === 0
        ? value
        : __spreadArray(__spreadArray(__spreadArray([], leadingComments, true), [value], false), trailingComments, true);
}
/**
 * @param {IToken} token
 * @return an array containing processed leading comments and separators
 */
function getTokenLeadingComments(token) {
    return getLeadingComments(token, token);
}
exports.getTokenLeadingComments = getTokenLeadingComments;
/**
 * @param {CstNode} node
 * @return an array containing processed leading comments and separators
 */
function getNodeLeadingComments(node) {
    return getLeadingComments(node, node.location);
}
function getLeadingComments(nodeOrToken, location) {
    var arr = [];
    if (nodeOrToken.leadingComments !== undefined) {
        var previousEndLine = nodeOrToken.leadingComments[0].endLine;
        var step = void 0;
        arr.push(formatComment(nodeOrToken.leadingComments[0]));
        for (var i = 1; i < nodeOrToken.leadingComments.length; i++) {
            step = nodeOrToken.leadingComments[i].startLine - previousEndLine;
            if (step === 1 ||
                nodeOrToken.leadingComments[i].startOffset > location.startOffset) {
                arr.push(hardline);
            }
            else if (step > 1) {
                arr.push(hardline, hardline);
            }
            arr.push(formatComment(nodeOrToken.leadingComments[i]));
            previousEndLine = nodeOrToken.leadingComments[i].endLine;
        }
        step = location.startLine - previousEndLine;
        if (step === 1 ||
            nodeOrToken.leadingComments[nodeOrToken.leadingComments.length - 1]
                .startOffset > location.startOffset) {
            arr.push(hardline);
        }
        else if (step > 1) {
            arr.push(hardline, hardline);
        }
    }
    return arr;
}
/**
 * @param {IToken} token
 * @return an array containing processed trailing comments and separators
 */
function getTokenTrailingComments(token) {
    return getTrailingComments(token, token.image, token);
}
/**
 * @param {CstNode} node
 * @param {string} value
 * @return an array containing processed trailing comments and separators
 */
function getNodeTrailingComments(node, value) {
    return getTrailingComments(node, value, node.location);
}
function getTrailingComments(nodeOrToken, value, location) {
    var arr = [];
    var previousEndLine = location.endLine;
    if (nodeOrToken.trailingComments !== undefined) {
        nodeOrToken.trailingComments.forEach(function (comment, idx) {
            var separator = "";
            if (comment.startLine !== previousEndLine) {
                arr.push(hardline);
            }
            else if (!(0, isEmptyDoc_1.default)(value) && idx === 0) {
                separator = " ";
            }
            if (comment.tokenType.name === "LineComment") {
                arr.push(lineSuffix([separator, formatComment(comment), breakParent]));
            }
            else {
                arr.push(formatComment(comment));
            }
            previousEndLine = comment.endLine;
        });
    }
    return arr;
}
function isJavaDoc(comment, lines) {
    var isJavaDoc = true;
    if (comment.tokenType.name === "TraditionalComment" && lines.length > 1) {
        for (var i = 1; i < lines.length; i++) {
            if (lines[i].trim().charAt(0) !== "*") {
                isJavaDoc = false;
                break;
            }
        }
    }
    else {
        isJavaDoc = false;
    }
    return isJavaDoc;
}
function formatJavaDoc(lines) {
    var res = [lines[0].trim()];
    for (var i = 1; i < lines.length; i++) {
        res.push(hardline);
        res.push(" " + lines[i].trim());
    }
    return res;
}
function formatComment(comment) {
    var res = [];
    var lines = comment.image.split("\n");
    if (isJavaDoc(comment, lines)) {
        return formatJavaDoc(lines);
    }
    lines.forEach(function (line) {
        res.push(line);
        res.push(literalline);
    });
    res.pop();
    return res;
}
function processComments(docs) {
    if (!Array.isArray(docs)) {
        if ((0, utils_1.isCstElementOrUndefinedIToken)(docs)) {
            return printTokenWithComments(docs);
        }
        return docs;
    }
    return docs.map(function (elt) {
        if ((0, utils_1.isCstElementOrUndefinedIToken)(elt)) {
            return printTokenWithComments(elt);
        }
        return elt;
    });
}
exports.processComments = processComments;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LWNvbW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3ByaW50ZXJzL2NvbW1lbnRzL2Zvcm1hdC1jb21tZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvQ0FBd0M7QUFHeEMsMkNBQWtFO0FBRWxFLHNFQUFnRDtBQUV4QyxJQUFBLFFBQVEsR0FBMkMsY0FBUSxTQUFuRCxFQUFFLFVBQVUsR0FBK0IsY0FBUSxXQUF2QyxFQUFFLFdBQVcsR0FBa0IsY0FBUSxZQUExQixFQUFFLFdBQVcsR0FBSyxjQUFRLFlBQWIsQ0FBYztBQUVwRTs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLHNCQUFzQixDQUFDLEtBQWE7SUFDbEQsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksS0FBSyxlQUFlLEVBQUU7UUFDNUMsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxnQ0FBZ0MsRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUN4RTtJQUNELElBQUksbUJBQW1CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7S0FDOUI7SUFDRCxPQUFPLGlCQUFpQixDQUN0QixLQUFLLEVBQ0wsS0FBSyxDQUFDLEtBQUssRUFDWCx1QkFBdUIsRUFDdkIsd0JBQXdCLENBQ3pCLENBQUM7QUFDSixDQUFDO0FBYkQsd0RBYUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFDSCxTQUFnQixxQkFBcUIsQ0FBQyxJQUFhLEVBQUUsS0FBVTtJQUM3RCxPQUFPLGlCQUFpQixDQUN0QixJQUFJLEVBQ0osS0FBSyxFQUNMLHNCQUFzQixFQUN0Qix1QkFBdUIsQ0FDeEIsQ0FBQztBQUNKLENBQUM7QUFQRCxzREFPQztBQUVELFNBQVMsaUJBQWlCLENB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