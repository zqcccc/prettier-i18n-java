"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.printArrayList = exports.isUniqueMethodInvocation = exports.sortImports = exports.isStatementEmptyStatement = exports.isShiftOperator = exports.separateTokensIntoGroups = exports.putIntoBraces = exports.getInterfaceBodyDeclarationsSeparator = exports.getClassBodyDeclarationsSeparator = exports.getBlankLinesSeparator = exports.isExplicitLambdaParameter = exports.displaySemicolon = exports.findDeepElementInPartsArray = exports.sortModifiers = exports.sortClassTypeChildren = exports.matchCategory = exports.sortNodes = exports.sortAnnotationIdentifier = exports.rejectAndConcat = exports.rejectAndJoin = exports.rejectSeparators = exports.reject = exports.rejectAndJoinSeps = exports.buildFqn = void 0;
var findIndex_1 = __importDefault(require("lodash/findIndex"));
var findLastIndex_1 = __importDefault(require("lodash/findLastIndex"));
var forEach_1 = __importDefault(require("lodash/forEach"));
var forEachRight_1 = __importDefault(require("lodash/forEachRight"));
var includes_1 = __importDefault(require("lodash/includes"));
var doc_1 = require("prettier/doc");
var utils_1 = require("../types/utils");
var utils_2 = require("../utils");
var comments_utils_1 = require("./comments/comments-utils");
var format_comments_1 = require("./comments/format-comments");
var prettier_builder_1 = require("./prettier-builder");
var indent = doc_1.builders.indent, hardline = doc_1.builders.hardline, line = doc_1.builders.line;
var orderedModifiers = [
    "Public",
    "Protected",
    "Private",
    "Abstract",
    "Default",
    "Static",
    "Final",
    "Transient",
    "Volatile",
    "Synchronized",
    "Native",
    "Sealed",
    "NonSealed",
    "Strictfp"
];
function buildFqn(tokens, dots) {
    return rejectAndJoinSeps(dots ? dots : [], tokens);
}
exports.buildFqn = buildFqn;
function rejectAndJoinSeps(sepTokens, elems, sep) {
    if (!Array.isArray(sepTokens)) {
        return rejectAndJoin(sepTokens, elems);
    }
    var actualElements = reject(elems);
    var res = [];
    for (var i = 0; i < sepTokens.length; i++) {
        res.push(actualElements[i], sepTokens[i]);
        if (sep) {
            res.push(sep);
        }
    }
    res.push.apply(res, actualElements.slice(sepTokens.length));
    return (0, prettier_builder_1.concat)(res);
}
exports.rejectAndJoinSeps = rejectAndJoinSeps;
function reject(elems) {
    return elems.filter(function (item) {
        if (typeof item === "string") {
            return item !== "";
        }
        // eslint-ignore next - We want the conversion to boolean!
        // @ts-ignore
        return item != false && item !== undefined;
    });
}
exports.reject = reject;
function rejectSeparators(separators, elems) {
    var realElements = reject(elems);
    var realSeparators = [];
    for (var i = 0; i < realElements.length - 1; i++) {
        if (realElements[i] !== "") {
            realSeparators.push(separators[i]);
        }
    }
    return realSeparators;
}
exports.rejectSeparators = rejectSeparators;
function rejectAndJoin(sep, elems) {
    var actualElements = reject(elems);
    return (0, prettier_builder_1.join)(sep, actualElements);
}
exports.rejectAndJoin = rejectAndJoin;
function rejectAndConcat(elems) {
    var actualElements = reject(elems);
    return (0, prettier_builder_1.concat)(actualElements);
}
exports.rejectAndConcat = rejectAndConcat;
function sortAnnotationIdentifier(annotations, identifiers) {
    var tokens = __spreadArray([], identifiers, true);
    if (annotations && annotations.length > 0) {
        tokens = __spreadArray(__spreadArray([], tokens, true), annotations, true);
    }
    return tokens.sort(function (a, b) {
        var startOffset1 = (0, utils_1.isCstNode)(a)
            ? a.children.At[0].startOffset
            : a.startOffset;
        var startOffset2 = (0, utils_1.isCstNode)(b)
            ? b.children.At[0].startOffset
            : b.startOffset;
        return startOffset1 - startOffset2;
    });
}
exports.sortAnnotationIdentifier = sortAnnotationIdentifier;
function sortTokens(values) {
    var tokens = [];
    (0, forEach_1.default)(values, function (argument) {
        if (argument) {
            tokens = tokens.concat(argument);
        }
    });
    return tokens.sort(function (a, b) {
        return a.startOffset - b.startOffset;
    });
}
function sortNodes(values) {
    var nodes = [];
    (0, forEach_1.default)(values, function (argument) {
        if (argument) {
            nodes = nodes.concat(argument);
        }
    });
    return nodes.sort(function (a, b) {
        var aOffset = a.location.startOffset;
        var bOffset = b.location.startOffset;
        return aOffset - bOffset;
    });
}
exports.sortNodes = sortNodes;
function matchCategory(token, categoryName) {
    var labels = (token.tokenType.CATEGORIES || []).map(function (category) {
        return category.LABEL;
    });
    return labels.indexOf(categoryName) !== -1;
}
exports.matchCategory = matchCategory;
function sortClassTypeChildren(annotations, typeArguments, identifiers, dots) {
    var tokens = __spreadArray([], identifiers, true);
    if (annotations && annotations.length > 0) {
        tokens = __spreadArray(__spreadArray([], tokens, true), annotations, true);
    }
    if (typeArguments && typeArguments.length > 0) {
        tokens = __spreadArray(__spreadArray([], tokens, true), typeArguments, true);
    }
    if (dots && dots.length > 0) {
        tokens = __spreadArray(__spreadArray([], tokens, true), dots, true);
    }
    return tokens.sort(function (a, b) {
        var startOffsetA = (0, utils_1.isCstNode)(a)
            ? a.children.At
                ? a.children.At[0].startOffset
                : a.children.Less[0].startOffset
            : a.startOffset;
        var startOffsetB = (0, utils_1.isCstNode)(b)
            ? b.children.At
                ? b.children.At[0].startOffset
                : b.children.Less[0].startOffset
            : b.startOffset;
        return startOffsetA - startOffsetB;
    });
}
exports.sortClassTypeChildren = sortClassTypeChildren;
function sortModifiers(modifiers) {
    var firstAnnotations = [];
    var otherModifiers = [];
    var lastAnnotations = [];
    var hasOtherModifier = false;
    /**
     * iterate in reverse order because we special-case
     * method annotations which come after all other
     * modifiers
     */
    (0, forEachRight_1.default)(modifiers, function (modifier) {
        var isAnnotation = modifier.children.annotation !== undefined;
        var isMethodAnnotation = isAnnotation &&
            (modifier.name === "methodModifier" ||
                modifier.name === "interfaceMethodModifier");
        if (isAnnotation) {
            if (isMethodAnnotation && !hasOtherModifier) {
                lastAnnotations.unshift(modifier);
            }
            else {
                firstAnnotations.unshift(modifier);
            }
        }
        else {
            otherModifiers.unshift(modifier);
            hasOtherModifier = true;
        }
    });
    /**
     * if there are only annotations, move everything from
     * lastAnnotations to firstAnnotations
     */
    if (!hasOtherModifier) {
        firstAnnotations = firstAnnotations.concat(lastAnnotations);
        lastAnnotations = [];
    }
    otherModifiers.sort(function (a, b) {
        var modifierIndexA = orderedModifiers.indexOf(Object.keys(a.children)[0]);
        var modifierIndexB = orderedModifiers.indexOf(Object.keys(b.children)[0]);
        return modifierIndexA - modifierIndexB;
    });
    return [firstAnnotations, otherModifiers.concat(lastAnnotations)];
}
exports.sortModifiers = sortModifiers;
function findDeepElementInPartsArray(item, elt) {
    if (Array.isArray(item)) {
        if ((0, includes_1.default)(item, elt)) {
            return true;
        }
        for (var i = 0; i < item.length; i++) {
            if (findDeepElementInPartsArray(item[i], elt)) {
                return true;
            }
        }
    }
    else {
        for (var key in item) {
            if (typeof item[key] === "object" &&
                findDeepElementInPartsArray(item[key], elt)) {
                return true;
            }
        }
    }
    return false;
}
exports.findDeepElementInPartsArray = findDeepElementInPartsArray;
function displaySemicolon(token, params) {
    if (params !== undefined && params.allowEmptyStatement) {
        return (0, format_comments_1.printTokenWithComments)(token);
    }
    if (!(0, comments_utils_1.hasComments)(token)) {
        return "";
    }
    token.image = "";
    return (0, format_comments_1.printTokenWithComments)(token);
}
exports.displaySemicolon = displaySemicolon;
function isExplicitLambdaParameter(ctx) {
    return (ctx &&
        ctx.lambdaParameterList &&
        ctx.lambdaParameterList[0] &&
        ctx.lambdaParameterList[0].children &&
        ctx.lambdaParameterList[0].children.explicitLambdaParameterList);
}
exports.isExplicitLambdaParameter = isExplicitLambdaParameter;
function getBlankLinesSeparator(ctx, separator) {
    if (separator === void 0) { separator = hardline; }
    if (ctx === undefined) {
        return [];
    }
    var separators = [];
    for (var i = 0; i < ctx.length - 1; i++) {
        var node = ctx[i];
        var previousRuleEndLineWithComment = (0, comments_utils_1.hasTrailingComments)(node)
            ? node.trailingComments[node.trailingComments.length - 1].endLine
            : node.location.endLine;
        var nextNode = ctx[i + 1];
        var nextRuleStartLineWithComment = (0, comments_utils_1.hasLeadingComments)(nextNode)
            ? nextNode.leadingComments[0].startLine
            : nextNode.location.startLine;
        if (nextRuleStartLineWithComment - previousRuleEndLineWithComment > 1) {
            separators.push([hardline, hardline]);
        }
        else {
            separators.push(separator);
        }
    }
    return separators;
}
exports.getBlankLinesSeparator = getBlankLinesSeparator;
var isTwoHardLine = function (userBlankLinesSeparator) {
    if (!Array.isArray(userBlankLinesSeparator)) {
        return false;
    }
    return (userBlankLinesSeparator.length === 2 &&
        userBlankLinesSeparator[0] === hardline &&
        userBlankLinesSeparator[1] === hardline);
};
function getDeclarationsSeparator(declarations, needLineDeclaration, isSemicolon) {
    var declarationsWithoutEmptyStatements = declarations.filter(function (declaration) { return !isSemicolon(declaration); });
    var userBlankLinesSeparators = getBlankLinesSeparator(declarationsWithoutEmptyStatements);
    var additionalBlankLines = declarationsWithoutEmptyStatements.map(needLineDeclaration);
    var separators = [];
    var indexNextNotEmptyDeclaration = 0;
    for (var i = 0; i < declarations.length - 1; i++) {
        // if the empty statement has comments
        // we want to print them on their own line
        if (isSemicolon(declarations[i])) {
            if ((0, comments_utils_1.hasComments)(declarations[i])) {
                separators.push(hardline);
            }
        }
        else if (indexNextNotEmptyDeclaration <
            declarationsWithoutEmptyStatements.length - 1) {
            var isNextSeparatorTwoHardLine = isTwoHardLine(userBlankLinesSeparators[indexNextNotEmptyDeclaration]);
            var additionalSep = !isNextSeparatorTwoHardLine &&
                (additionalBlankLines[indexNextNotEmptyDeclaration + 1] ||
                    additionalBlankLines[indexNextNotEmptyDeclaration])
                ? hardline
                : "";
            separators.push((0, prettier_builder_1.concat)([
                userBlankLinesSeparators[indexNextNotEmptyDeclaration],
                additionalSep
            ]));
            indexNextNotEmptyDeclaration += 1;
        }
    }
    return separators;
}
function needLineClassBodyDeclaration(declaration) {
    if (declaration.children.classMemberDeclaration === undefined) {
        return true;
    }
    var classMemberDeclaration = declaration.children.classMemberDeclaration[0];
    if (classMemberDeclaration.children.fieldDeclaration !== undefined) {
        var fieldDeclaration = classMemberDeclaration.children.fieldDeclaration[0];
        if (fieldDeclaration.children.fieldModifier !== undefined &&
            hasAnnotation(fieldDeclaration.children.fieldModifier)) {
            return true;
        }
        return false;
    }
    else if (classMemberDeclaration.children.Semicolon !== undefined) {
        return false;
    }
    return true;
}
function needLineInterfaceMemberDeclaration(declaration) {
    if (declaration.children.constantDeclaration !== undefined) {
        var constantDeclaration = declaration.children.constantDeclaration[0];
        if (constantDeclaration.children.constantModifier !== undefined &&
            hasAnnotation(constantDeclaration.children.constantModifier)) {
            return true;
        }
        return false;
    }
    else if (declaration.children.interfaceMethodDeclaration !== undefined) {
        var interfaceMethodDeclaration = declaration.children.interfaceMethodDeclaration[0];
        if (interfaceMethodDeclaration.children.interfaceMethodModifier !==
            undefined &&
            hasNonTrailingAnnotation(interfaceMethodDeclaration.children.interfaceMethodModifier)) {
            return true;
        }
        return false;
    }
    return true;
}
function isClassBodyDeclarationASemicolon(classBodyDeclaration) {
    if (classBodyDeclaration.children.classMemberDeclaration) {
        if (classBodyDeclaration.children.classMemberDeclaration[0].children
            .Semicolon !== undefined) {
            return true;
        }
    }
    return false;
}
function isInterfaceMemberASemicolon(interfaceMemberDeclaration) {
    return interfaceMemberDeclaration.children.Semicolon !== undefined;
}
function hasAnnotation(modifiers) {
    return modifiers.some(function (modifier) { return modifier.children.annotation !== undefined; });
}
/**
 * Return true if there is a method modifier that does not come after all other modifiers
 * It is useful to know if sortModifiers will add an annotation before other modifiers
 *
 * @param methodModifiers
 * @returns {boolean}
 */
function hasNonTrailingAnnotation(methodModifiers) {
    var firstAnnotationIndex = (0, findIndex_1.default)(methodModifiers, function (modifier) { return modifier.children.annotation !== undefined; });
    var lastNonAnnotationIndex = (0, findLastIndex_1.default)(methodModifiers, function (modifier) { return modifier.children.annotation === undefined; });
    return (firstAnnotationIndex < lastNonAnnotationIndex ||
        lastNonAnnotationIndex === -1);
}
function getClassBodyDeclarationsSeparator(classBodyDeclarationContext) {
    return getDeclarationsSeparator(classBodyDeclarationContext, needLineClassBodyDeclaration, isClassBodyDeclarationASemicolon);
}
exports.getClassBodyDeclarationsSeparator = getClassBodyDeclarationsSeparator;
function getInterfaceBodyDeclarationsSeparator(interfaceMemberDeclarationContext) {
    return getDeclarationsSeparator(interfaceMemberDeclarationContext, needLineInterfaceMemberDeclaration, isInterfaceMemberASemicolon);
}
exports.getInterfaceBodyDeclarationsSeparator = getInterfaceBodyDeclarationsSeparator;
function putIntoBraces(argument, separator, LBrace, RBrace) {
    var rightBraceLeadingComments = (0, format_comments_1.getTokenLeadingComments)(RBrace);
    var lastBreakLine = 
    // check if last element of the array is a line
    rightBraceLeadingComments.length !== 0 &&
        rightBraceLeadingComments[rightBraceLeadingComments.length - 1] === hardline
        ? rightBraceLeadingComments.pop()
        : separator;
    delete RBrace.leadingComments;
    var contentInsideBraces;
    if ((0, utils_2.isEmptyDoc)(argument)) {
        if (rightBraceLeadingComments.length === 0) {
            return (0, prettier_builder_1.concat)([LBrace, RBrace]);
        }
        contentInsideBraces = __spreadArray([separator], rightBraceLeadingComments, true);
    }
    else if (rightBraceLeadingComments.length !== 0) {
        contentInsideBraces = __spreadArray([
            separator,
            argument,
            separator
        ], rightBraceLeadingComments, true);
    }
    else {
        contentInsideBraces = [separator, argument];
    }
    return (0, prettier_builder_1.group)(rejectAndConcat([
        LBrace,
        indent((0, prettier_builder_1.concat)(contentInsideBraces)),
        lastBreakLine,
        RBrace
    ]));
}
exports.putIntoBraces = putIntoBraces;
var andOrBinaryOperators = ["&&", "||", "&", "|", "^"];
function separateTokensIntoGroups(ctx) {
    /**
     * separate tokens into groups by andOrBinaryOperators ("&&", "||", "&", "|", "^")
     * in order to break those operators in priority.
     */
    var tokens = sortTokens([
        ctx.Instanceof,
        ctx.AssignmentOperator,
        ctx.Less,
        ctx.Greater,
        ctx.BinaryOperator
    ]);
    var groupsOfOperator = [];
    var sortedBinaryOperators = [];
    var tmpGroup = [];
    tokens.forEach(function (token) {
        if (matchCategory(token, "'BinaryOperator'") &&
            (0, includes_1.default)(andOrBinaryOperators, token.image)) {
            sortedBinaryOperators.push(token);
            groupsOfOperator.push(tmpGroup);
            tmpGroup = [];
        }
        else {
            tmpGroup.push(token);
        }
    });
    groupsOfOperator.push(tmpGroup);
    return {
        groupsOfOperator: groupsOfOperator,
        sortedBinaryOperators: sortedBinaryOperators
    };
}
exports.separateTokensIntoGroups = separateTokensIntoGroups;
function isShiftOperator(tokens, index) {
    if (tokens.length <= index + 1) {
        return "none";
    }
    if (tokens[index].image === "<" &&
        tokens[index + 1].image === "<" &&
        tokens[index].startOffset === tokens[index + 1].startOffset - 1) {
        return "leftShift";
    }
    if (tokens[index].image === ">" &&
        tokens[index + 1].image === ">" &&
        tokens[index].startOffset === tokens[index + 1].startOffset - 1) {
        if (tokens.length > index + 2 &&
            tokens[index + 2].image === ">" &&
            tokens[index + 1].startOffset === tokens[index + 2].startOffset - 1) {
            return "doubleRightShift";
        }
        return "rightShift";
    }
    return "none";
}
exports.isShiftOperator = isShiftOperator;
function isStatementEmptyStatement(statement) {
    return (statement === ";" || (Array.isArray(statement) && statement[0] === ";"));
}
exports.isStatementEmptyStatement = isStatementEmptyStatement;
function sortImports(imports) {
    var staticImports = [];
    var nonStaticImports = [];
    if (imports !== undefined) {
        for (var i = 0; i < imports.length; i++) {
            if (imports[i].children.Static !== undefined) {
                staticImports.push(imports[i]);
            }
            else if (imports[i].children.emptyStatement === undefined) {
                nonStaticImports.push(imports[i]);
            }
        }
        // TODO: Could be optimized as we could expect that the array is already almost sorted
        var comparator = function (first, second) {
            return compareFqn(first.children.packageOrTypeName[0], second.children.packageOrTypeName[0]);
        };
        staticImports.sort(comparator);
        nonStaticImports.sort(comparator);
    }
    return {
        staticImports: staticImports,
        nonStaticImports: nonStaticImports
    };
}
exports.sortImports = sortImports;
function compareFqn(packageOrTypeNameFirst, packageOrTypeNameSecond) {
    var identifiersFirst = packageOrTypeNameFirst.children.Identifier;
    var identifiersSecond = packageOrTypeNameSecond.children.Identifier;
    var minParts = Math.min(identifiersFirst.length, identifiersSecond.length);
    for (var i = 0; i < minParts; i++) {
        if (identifiersFirst[i].image < identifiersSecond[i].image) {
            return -1;
        }
        else if (identifiersFirst[i].image > identifiersSecond[i].image) {
            return 1;
        }
    }
    if (identifiersFirst.length < identifiersSecond.length) {
        return -1;
    }
    else if (identifiersFirst.length > identifiersSecond.length) {
        return 1;
    }
    return 0;
}
function isUniqueMethodInvocation(primarySuffixes) {
    if (primarySuffixes === undefined) {
        return 0;
    }
    var count = 0;
    primarySuffixes.forEach(function (primarySuffix) {
        if (primarySuffix.children.methodInvocationSuffix !== undefined) {
            count++;
            if (count > 1) {
                return 2;
            }
        }
    });
    return count;
}
exports.isUniqueMethodInvocation = isUniqueMethodInvocation;
function printArrayList(_a) {
    var list = _a.list, extraComma = _a.extraComma, LCurly = _a.LCurly, RCurly = _a.RCurly, trailingComma = _a.trailingComma;
    var optionalComma;
    if (trailingComma !== "none" && list !== "") {
        optionalComma = extraComma
            ? (0, prettier_builder_1.ifBreak)(extraComma[0], __assign(__assign({}, extraComma[0]), { image: "" }))
            : (0, prettier_builder_1.ifBreak)(",", "");
    }
    else {
        optionalComma = extraComma ? __assign(__assign({}, extraComma[0]), { image: "" }) : "";
    }
    return putIntoBraces(rejectAndConcat([list, optionalComma]), line, LCurly, RCurly);
}
exports.printArrayList = printArrayList;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRlci11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcmludGVycy9wcmludGVyLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLCtEQUF5QztBQUN6Qyx1RUFBaUQ7QUFDakQsMkRBQXFDO0FBQ3JDLHFFQUErQztBQUMvQyw2REFBdUM7QUFFdkMsb0NBQXdDO0FBQ3hDLHdDQUEyQztBQUMzQyxrQ0FBc0M7QUFDdEMsNERBSW1DO0FBQ25DLDhEQUdvQztBQUVwQyx1REFBa0U7QUFFMUQsSUFBQSxNQUFNLEdBQXFCLGNBQVEsT0FBN0IsRUFBRSxRQUFRLEdBQVcsY0FBUSxTQUFuQixFQUFFLElBQUksR0FBSyxjQUFRLEtBQWIsQ0FBYztBQUU1QyxJQUFNLGdCQUFnQixHQUFHO0lBQ3ZCLFFBQVE7SUFDUixXQUFXO0lBQ1gsU0FBUztJQUNULFVBQVU7SUFDVixTQUFTO0lBQ1QsUUFBUTtJQUNSLE9BQU87SUFDUCxXQUFXO0lBQ1gsVUFBVTtJQUNWLGNBQWM7SUFDZCxRQUFRO0lBQ1IsUUFBUTtJQUNSLFdBQVc7SUFDWCxVQUFVO0NBQ1gsQ0FBQztBQUVGLFNBQWdCLFFBQVEsQ0FBQyxNQUFnQixFQUFFLElBQTBCO0lBQ25FLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNyRCxDQUFDO0FBRkQsNEJBRUM7QUFFRCxTQUFnQixpQkFBaUIsQ0FDL0IsU0FBdUMsRUFDdkMsS0FBbUMsRUFDbkMsR0FBWTtJQUVaLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzdCLE9BQU8sYUFBYSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUN4QztJQUNELElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFFZixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN6QyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQyxJQUFJLEdBQUcsRUFBRTtZQUNQLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDZjtLQUNGO0lBQ0QsR0FBRyxDQUFDLElBQUksT0FBUixHQUFHLEVBQVMsY0FBYyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUU7SUFDcEQsT0FBTyxJQUFBLHlCQUFNLEVBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQW5CRCw4Q0FtQkM7QUFFRCxTQUFnQixNQUFNLENBQUMsS0FBbUM7SUFDeEQsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQUEsSUFBSTtRQUN0QixJQUFJLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUM1QixPQUFPLElBQUksS0FBSyxFQUFFLENBQUM7U0FDcEI7UUFDRCwwREFBMEQ7UUFDMUQsYUFBYTtRQUNiLE9BQU8sSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDO0lBQzdDLENBQUMsQ0FBcUIsQ0FBQztBQUN6QixDQUFDO0FBVEQsd0JBU0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FDOUIsVUFBNkIsRUFDN0IsS0FBbUM7SUFFbkMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRW5DLElBQU0sY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDaEQsSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzFCLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDckM7S0FDRjtJQUVELE9BQU8sY0FBYyxDQUFDO0FBQ3hCLENBQUM7QUFkRCw0Q0FjQztBQUVELFNBQWdCLGFBQWEsQ0FDM0IsR0FBNkIsRUFDN0IsS0FBbUM7SUFFbkMsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJDLE9BQU8sSUFBQSx1QkFBSSxFQUFDLEdBQUcsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNuQyxDQUFDO0FBUEQsc0NBT0M7QUFFRCxTQUFnQixlQUFlLENBQUMsS0FBbUM7SUFDakUsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXJDLE9BQU8sSUFBQSx5QkFBTSxFQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFKRCwwQ0FJQztBQUVELFNBQWdCLHdCQUF3QixDQUN0QyxXQUE0QyxFQUM1QyxXQUFxQjtJQUVyQixJQUFJLE1BQU0scUJBQXFCLFdBQVcsT0FBQyxDQUFDO0lBRTVDLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3pDLE1BQU0sbUNBQU8sTUFBTSxTQUFLLFdBQVcsT0FBQyxDQUFDO0tBQ3RDO0lBRUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7UUFDdEIsSUFBTSxZQUFZLEdBQUcsSUFBQSxpQkFBUyxFQUFDLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFZLENBQUMsV0FBVztZQUMxQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztRQUNsQixJQUFNLFlBQVksR0FBRyxJQUFBLGlCQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQVksQ0FBQyxXQUFXO1lBQzFDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2xCLE9BQU8sWUFBWSxHQUFHLFlBQVksQ0FBQztJQUNyQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFuQkQsNERBbUJDO0FBRUQsU0FBUyxVQUFVLENBQUMsTUFBZ0M7SUFDbEQsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBRTFCLElBQUEsaUJBQU8sRUFBQyxNQUFNLEVBQUUsVUFBQSxRQUFRO1FBQ3RCLElBQUksUUFBUSxFQUFFO1lBQ1osTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsV0FBVyxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQWdCLFNBQVMsQ0FBQyxNQUFpQztJQUN6RCxJQUFJLEtBQUssR0FBYyxFQUFFLENBQUM7SUFFMUIsSUFBQSxpQkFBTyxFQUFDLE1BQU0sRUFBRSxVQUFBLFFBQVE7UUFDdEIsSUFBSSxRQUFRLEVBQUU7WUFDWixLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7UUFDckIsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDdkMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDdkMsT0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWRELDhCQWNDO0FBRUQsU0FBZ0IsYUFBYSxDQUFDLEtBQWEsRUFBRSxZQUFvQjtJQUMvRCxJQUFNLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLFFBQVE7UUFDNUQsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFORCxzQ0FNQztBQUVELFNBQWdCLHFCQUFxQixDQUNuQyxXQUE0QyxFQUM1QyxhQUFpRCxFQUNqRCxXQUFxQixFQUNyQixJQUFlO0lBRWYsSUFBSSxNQUFNLHFCQUFxQixXQUFXLE9BQUMsQ0FBQztJQUU1QyxJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUN6QyxNQUFNLG1DQUFPLE1BQU0sU0FBSyxXQUFXLE9BQUMsQ0FBQztLQUN0QztJQUVELElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzdDLE1BQU0sbUNBQU8sTUFBTSxTQUFLLGFBQWEsT0FBQyxDQUFDO0tBQ3hDO0lBRUQsSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDM0IsTUFBTSxtQ0FBTyxNQUFNLFNBQUssSUFBSSxPQUFDLENBQUM7S0FDL0I7SUFFRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQztRQUN0QixJQUFNLFlBQVksR0FBRyxJQUFBLGlCQUFTLEVBQUMsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQ2IsQ0FBQyxDQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBWSxDQUFDLFdBQVc7Z0JBQzFDLENBQUMsQ0FBRSxDQUFDLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQVksQ0FBQyxXQUFXO1lBQzlDLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDO1FBQ2xCLElBQU0sWUFBWSxHQUFHLElBQUEsaUJBQVMsRUFBQyxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtnQkFDYixDQUFDLENBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFZLENBQUMsV0FBVztnQkFDMUMsQ0FBQyxDQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBWSxDQUFDLFdBQVc7WUFDOUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUM7UUFDbEIsT0FBTyxZQUFZLEdBQUcsWUFBWSxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWpDRCxzREFpQ0M7QUFFRCxTQUFnQixhQUFhLENBQUMsU0FBZ0M7SUFDNUQsSUFBSSxnQkFBZ0IsR0FBYyxFQUFFLENBQUM7SUFDckMsSUFBTSxjQUFjLEdBQWMsRUFBRSxDQUFDO0lBQ3JDLElBQUksZUFBZSxHQUFjLEVBQUUsQ0FBQztJQUNwQyxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztJQUU3Qjs7OztPQUlHO0lBQ0gsSUFBQSxzQkFBWSxFQUFDLFNBQVMsRUFBRSxVQUFBLFFBQVE7UUFDOUIsSUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxDQUFDO1FBQ2hFLElBQU0sa0JBQWtCLEdBQ3RCLFlBQVk7WUFDWixDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCO2dCQUNqQyxRQUFRLENBQUMsSUFBSSxLQUFLLHlCQUF5QixDQUFDLENBQUM7UUFFakQsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBSSxrQkFBa0IsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2dCQUMzQyxlQUFlLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQ25DO2lCQUFNO2dCQUNMLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNwQztTQUNGO2FBQU07WUFDTCxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2pDLGdCQUFnQixHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUg7OztPQUdHO0lBQ0gsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1FBQ3JCLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RCxlQUFlLEdBQUcsRUFBRSxDQUFDO0tBQ3RCO0lBRUQsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTVFLE9BQU8sY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUN6QyxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQS9DRCxzQ0ErQ0M7QUFFRCxTQUFnQiwyQkFBMkIsQ0FBQyxJQUFTLEVBQUUsR0FBUTtJQUM3RCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdkIsSUFBSSxJQUFBLGtCQUFRLEVBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNwQyxJQUFJLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsRUFBRTtnQkFDN0MsT0FBTyxJQUFJLENBQUM7YUFDYjtTQUNGO0tBQ0Y7U0FBTTtRQUNMLEtBQUssSUFBTSxHQUFHLElBQUksSUFBSSxFQUFFO1lBQ3RCLElBQ0UsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUTtnQkFDN0IsMkJBQTJCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUMzQztnQkFDQSxPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQXRCRCxrRUFzQkM7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxLQUFhLEVBQUUsTUFBWTtJQUMxRCxJQUFJLE1BQU0sS0FBSyxTQUFTLElBQUksTUFBTSxDQUFDLG1CQUFtQixFQUFFO1FBQ3RELE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxLQUFLLENBQUMsQ0FBQztLQUN0QztJQUVELElBQUksQ0FBQyxJQUFBLDRCQUFXLEVBQUMsS0FBSyxDQUFDLEVBQUU7UUFDdkIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2pCLE9BQU8sSUFBQSx3Q0FBc0IsRUFBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBWEQsNENBV0M7QUFFRCxTQUFnQix5QkFBeUIsQ0FBQyxHQUFrQztJQUMxRSxPQUFPLENBQ0wsR0FBRztRQUNILEdBQUcsQ0FBQyxtQkFBbUI7UUFDdkIsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztRQUMxQixHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTtRQUNuQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUNoRSxDQUFDO0FBQ0osQ0FBQztBQVJELDhEQVFDO0FBRUQsU0FBZ0Isc0JBQXNCLENBQ3BDLEdBQTBCLEVBQzFCLFNBQXFEO0lBQXJELDBCQUFBLEVBQUEsb0JBQXFEO0lBRXJELElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtRQUNyQixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQsSUFBTSxVQUFVLEdBQVUsRUFBRSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUN2QyxJQUFNLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSw4QkFBOEIsR0FBRyxJQUFBLG9DQUFtQixFQUFDLElBQUksQ0FBQztZQUM5RCxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsT0FBTztZQUNqRSxDQUFDLENBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFrQixDQUFDO1FBRXRDLElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBTSw0QkFBNEIsR0FBRyxJQUFBLG1DQUFrQixFQUFDLFFBQVEsQ0FBQztZQUMvRCxDQUFDLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ3ZDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQztRQUVoQyxJQUFJLDRCQUE0QixHQUFHLDhCQUE4QixHQUFHLENBQUMsRUFBRTtZQUNyRSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDNUI7S0FDRjtJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUE1QkQsd0RBNEJDO0FBRUQsSUFBTSxhQUFhLEdBQUcsVUFBQyx1QkFBNEI7SUFDakQsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsdUJBQXVCLENBQUMsRUFBRTtRQUMzQyxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxDQUNMLHVCQUF1QixDQUFDLE1BQU0sS0FBSyxDQUFDO1FBQ3BDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVE7UUFDdkMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxDQUN4QyxDQUFDO0FBQ0osQ0FBQyxDQUFDO0FBRUYsU0FBUyx3QkFBd0IsQ0FLL0IsWUFBMkIsRUFDM0IsbUJBQW1ELEVBQ25ELFdBQTJDO0lBRTNDLElBQU0sa0NBQWtDLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FDNUQsVUFBQSxXQUFXLElBQUksT0FBQSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsRUFBekIsQ0FBeUIsQ0FDekMsQ0FBQztJQUVGLElBQU0sd0JBQXdCLEdBQUcsc0JBQXNCLENBQ3JELGtDQUFrQyxDQUNuQyxDQUFDO0lBQ0YsSUFBTSxvQkFBb0IsR0FDeEIsa0NBQWtDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFFOUQsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLElBQUksNEJBQTRCLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNoRCxzQ0FBc0M7UUFDdEMsMENBQTBDO1FBQzFDLElBQUksV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ2hDLElBQUksSUFBQSw0QkFBVyxFQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUNoQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQzNCO1NBQ0Y7YUFBTSxJQUNMLDRCQUE0QjtZQUM1QixrQ0FBa0MsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUM3QztZQUNBLElBQU0sMEJBQTBCLEdBQUcsYUFBYSxDQUM5Qyx3QkFBd0IsQ0FBQyw0QkFBNEIsQ0FBQyxDQUN2RCxDQUFDO1lBQ0YsSUFBTSxhQUFhLEdBQ2pCLENBQUMsMEJBQTBCO2dCQUMzQixDQUFDLG9CQUFvQixDQUFDLDRCQUE0QixHQUFHLENBQUMsQ0FBQztvQkFDckQsb0JBQW9CLENBQUMsNEJBQTRCLENBQUMsQ0FBQztnQkFDbkQsQ0FBQyxDQUFDLFFBQVE7Z0JBQ1YsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNULFVBQVUsQ0FBQyxJQUFJLENBQ2IsSUFBQSx5QkFBTSxFQUFDO2dCQUNMLHdCQUF5QixDQUFDLDRCQUE0QixDQUFDO2dCQUN2RCxhQUFhO2FBQ2QsQ0FBQyxDQUNILENBQUM7WUFFRiw0QkFBNEIsSUFBSSxDQUFDLENBQUM7U0FDbkM7S0FDRjtJQUVELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUM7QUFFRCxTQUFTLDRCQUE0QixDQUNuQyxXQUF3QztJQUV4QyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEtBQUssU0FBUyxFQUFFO1FBQzdELE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFNLHNCQUFzQixHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFOUUsSUFBSSxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEtBQUssU0FBUyxFQUFFO1FBQ2xFLElBQU0sZ0JBQWdCLEdBQ3BCLHNCQUFzQixDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0RCxJQUNFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxhQUFhLEtBQUssU0FBUztZQUNyRCxhQUFhLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxFQUN0RDtZQUNBLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLFNBQVMsRUFBRTtRQUNsRSxPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsU0FBUyxrQ0FBa0MsQ0FDekMsV0FBOEM7SUFFOUMsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLG1CQUFtQixLQUFLLFNBQVMsRUFBRTtRQUMxRCxJQUFNLG1CQUFtQixHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFDRSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLEtBQUssU0FBUztZQUMzRCxhQUFhLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLEVBQzVEO1lBQ0EsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7U0FBTSxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLEtBQUssU0FBUyxFQUFFO1FBQ3hFLElBQU0sMEJBQTBCLEdBQzlCLFdBQVcsQ0FBQyxRQUFRLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckQsSUFDRSwwQkFBMEIsQ0FBQyxRQUFRLENBQUMsdUJBQXVCO1lBQ3pELFNBQVM7WUFDWCx3QkFBd0IsQ0FDdEIsMEJBQTBCLENBQUMsUUFBUSxDQUFDLHVCQUF1QixDQUM1RCxFQUNEO1lBQ0EsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUNELE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxTQUFTLGdDQUFnQyxDQUN2QyxvQkFBaUQ7SUFFakQsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDeEQsSUFDRSxvQkFBb0IsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUTthQUM3RCxTQUFTLEtBQUssU0FBUyxFQUMxQjtZQUNBLE9BQU8sSUFBSSxDQUFDO1NBQ2I7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELFNBQVMsMkJBQTJCLENBQ2xDLDBCQUE2RDtJQUU3RCxPQUFPLDBCQUEwQixDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDO0FBQ3JFLENBQUM7QUFFRCxTQUFTLGFBQWEsQ0FDcEIsU0FBNkQ7SUFFN0QsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUExQyxDQUEwQyxDQUFDLENBQUM7QUFDaEYsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQVMsd0JBQXdCLENBQy9CLGVBQTJFO0lBRTNFLElBQU0sb0JBQW9CLEdBQUcsSUFBQSxtQkFBUyxFQUNwQyxlQUFlLEVBQ2YsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsUUFBUSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQTFDLENBQTBDLENBQ3ZELENBQUM7SUFDRixJQUFNLHNCQUFzQixHQUFHLElBQUEsdUJBQWEsRUFDMUMsZUFBZSxFQUNmLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUExQyxDQUEwQyxDQUN2RCxDQUFDO0lBRUYsT0FBTyxDQUNMLG9CQUFvQixHQUFHLHNCQUFzQjtRQUM3QyxzQkFBc0IsS0FBSyxDQUFDLENBQUMsQ0FDOUIsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFnQixpQ0FBaUMsQ0FDL0MsMkJBQTBEO0lBRTFELE9BQU8sd0JBQXdCLENBQzdCLDJCQUEyQixFQUMzQiw0QkFBNEIsRUFDNUIsZ0NBQWdDLENBQ2pDLENBQUM7QUFDSixDQUFDO0FBUkQsOEVBUUM7QUFFRCxTQUFnQixxQ0FBcUMsQ0FDbkQsaUNBQXNFO0lBRXRFLE9BQU8sd0JBQXdCLENBQzdCLGlDQUFpQyxFQUNqQyxrQ0FBa0MsRUFDbEMsMkJBQTJCLENBQzVCLENBQUM7QUFDSixDQUFDO0FBUkQsc0ZBUUM7QUFFRCxTQUFnQixhQUFhLENBQzNCLFFBQWEsRUFDYixTQUFjLEVBQ2QsTUFBYyxFQUNkLE1BQWM7SUFFZCxJQUFNLHlCQUF5QixHQUFHLElBQUEseUNBQXVCLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEUsSUFBTSxhQUFhO0lBQ2pCLCtDQUErQztJQUMvQyx5QkFBeUIsQ0FBQyxNQUFNLEtBQUssQ0FBQztRQUN0Qyx5QkFBeUIsQ0FBQyx5QkFBeUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssUUFBUTtRQUMxRSxDQUFDLENBQUMseUJBQXlCLENBQUMsR0FBRyxFQUFFO1FBQ2pDLENBQUMsQ0FBQyxTQUFTLENBQUM7SUFDaEIsT0FBTyxNQUFNLENBQUMsZUFBZSxDQUFDO0lBRTlCLElBQUksbUJBQW1CLENBQUM7SUFFeEIsSUFBSSxJQUFBLGtCQUFVLEVBQUMsUUFBUSxDQUFDLEVBQUU7UUFDeEIsSUFBSSx5QkFBeUIsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQzFDLE9BQU8sSUFBQSx5QkFBTSxFQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7U0FDakM7UUFDRCxtQkFBbUIsa0JBQUksU0FBUyxHQUFLLHlCQUF5QixPQUFDLENBQUM7S0FDakU7U0FBTSxJQUFJLHlCQUF5QixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDakQsbUJBQW1CO1lBQ2pCLFNBQVM7WUFDVCxRQUFRO1lBQ1IsU0FBUztXQUNOLHlCQUF5QixPQUM3QixDQUFDO0tBQ0g7U0FBTTtRQUNMLG1CQUFtQixHQUFHLENBQUMsU0FBUyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQzdDO0lBRUQsT0FBTyxJQUFBLHdCQUFLLEVBQ1YsZUFBZSxDQUFDO1FBQ2QsTUFBTTtRQUNOLE1BQU0sQ0FBQyxJQUFBLHlCQUFNLEVBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUNuQyxhQUFhO1FBQ2IsTUFBTTtLQUNQLENBQUMsQ0FDSCxDQUFDO0FBQ0osQ0FBQztBQXpDRCxzQ0F5Q0M7QUFFRCxJQUFNLG9CQUFvQixHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBRXpELFNBQWdCLHdCQUF3QixDQUFDLEdBQXdCO0lBQy9EOzs7T0FHRztJQUNILElBQU0sTUFBTSxHQUFHLFVBQVUsQ0FBQztRQUN4QixHQUFHLENBQUMsVUFBVTtRQUNkLEdBQUcsQ0FBQyxrQkFBa0I7UUFDdEIsR0FBRyxDQUFDLElBQUk7UUFDUixHQUFHLENBQUMsT0FBTztRQUNYLEdBQUcsQ0FBQyxjQUFjO0tBQ25CLENBQUMsQ0FBQztJQUVILElBQU0sZ0JBQWdCLEdBQWUsRUFBRSxDQUFDO0lBQ3hDLElBQU0scUJBQXFCLEdBQWEsRUFBRSxDQUFDO0lBQzNDLElBQUksUUFBUSxHQUFhLEVBQUUsQ0FBQztJQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsS0FBSztRQUNsQixJQUNFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsa0JBQWtCLENBQUM7WUFDeEMsSUFBQSxrQkFBUSxFQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDM0M7WUFDQSxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hDLFFBQVEsR0FBRyxFQUFFLENBQUM7U0FDZjthQUFNO1lBQ0wsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBRUgsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBRWhDLE9BQU87UUFDTCxnQkFBZ0Isa0JBQUE7UUFDaEIscUJBQXFCLHVCQUFBO0tBQ3RCLENBQUM7QUFDSixDQUFDO0FBbkNELDREQW1DQztBQUVELFNBQWdCLGVBQWUsQ0FBQyxNQUFnQixFQUFFLEtBQWE7SUFDN0QsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7UUFDOUIsT0FBTyxNQUFNLENBQUM7S0FDZjtJQUVELElBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHO1FBQzNCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUc7UUFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFdBQVcsS0FBSyxNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxDQUFDLEVBQy9EO1FBQ0EsT0FBTyxXQUFXLENBQUM7S0FDcEI7SUFDRCxJQUNFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRztRQUMzQixNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHO1FBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEtBQUssTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxFQUMvRDtRQUNBLElBQ0UsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLEdBQUcsQ0FBQztZQUN6QixNQUFNLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHO1lBQy9CLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxLQUFLLE1BQU0sQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLENBQUMsRUFDbkU7WUFDQSxPQUFPLGtCQUFrQixDQUFDO1NBQzNCO1FBQ0QsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBNUJELDBDQTRCQztBQUVELFNBQWdCLHlCQUF5QixDQUFDLFNBQWM7SUFDdEQsT0FBTyxDQUNMLFNBQVMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FDeEUsQ0FBQztBQUNKLENBQUM7QUFKRCw4REFJQztBQUVELFNBQWdCLFdBQVcsQ0FBQyxPQUErQztJQUN6RSxJQUFNLGFBQWEsR0FBK0IsRUFBRSxDQUFDO0lBQ3JELElBQU0sZ0JBQWdCLEdBQStCLEVBQUUsQ0FBQztJQUV4RCxJQUFJLE9BQU8sS0FBSyxTQUFTLEVBQUU7UUFDekIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQzVDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDaEM7aUJBQU0sSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLGNBQWMsS0FBSyxTQUFTLEVBQUU7Z0JBQzNELGdCQUFnQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuQztTQUNGO1FBRUQsc0ZBQXNGO1FBQ3RGLElBQU0sVUFBVSxHQUFHLFVBQ2pCLEtBQStCLEVBQy9CLE1BQWdDO1lBRWhDLE9BQUEsVUFBVSxDQUNSLEtBQUssQ0FBQyxRQUFRLENBQUMsaUJBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQ3BDLE1BQU0sQ0FBQyxRQUFRLENBQUMsaUJBQWtCLENBQUMsQ0FBQyxDQUFDLENBQ3RDO1FBSEQsQ0FHQyxDQUFDO1FBQ0osYUFBYSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMvQixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7S0FDbkM7SUFFRCxPQUFPO1FBQ0wsYUFBYSxlQUFBO1FBQ2IsZ0JBQWdCLGtCQUFBO0tBQ2pCLENBQUM7QUFDSixDQUFDO0FBOUJELGtDQThCQztBQUVELFNBQVMsVUFBVSxDQUNqQixzQkFBOEQsRUFDOUQsdUJBQStEO0lBRS9ELElBQU0sZ0JBQWdCLEdBQUcsc0JBQXNCLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQztJQUNwRSxJQUFNLGlCQUFpQixHQUFHLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUM7SUFFdEUsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFJLGdCQUFnQixDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUU7WUFDMUQsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNYO2FBQU0sSUFBSSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2pFLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7S0FDRjtJQUVELElBQUksZ0JBQWdCLENBQUMsTUFBTSxHQUFHLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtRQUN0RCxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ1g7U0FBTSxJQUFJLGdCQUFnQixDQUFDLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7UUFDN0QsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELE9BQU8sQ0FBQyxDQUFDO0FBQ1gsQ0FBQztBQUVELFNBQWdCLHdCQUF3QixDQUN0QyxlQUFzQztJQUV0QyxJQUFJLGVBQWUsS0FBSyxTQUFTLEVBQUU7UUFDakMsT0FBTyxDQUFDLENBQUM7S0FDVjtJQUVELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLGVBQWUsQ0FBQyxPQUFPLENBQUMsVUFBQSxhQUFhO1FBQ25DLElBQUksYUFBYSxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsS0FBSyxTQUFTLEVBQUU7WUFDL0QsS0FBSyxFQUFFLENBQUM7WUFFUixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsT0FBTyxDQUFDLENBQUM7YUFDVjtTQUNGO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFuQkQsNERBbUJDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLEVBWTlCO1FBWEMsSUFBSSxVQUFBLEVBQ0osVUFBVSxnQkFBQSxFQUNWLE1BQU0sWUFBQSxFQUNOLE1BQU0sWUFBQSxFQUNOLGFBQWEsbUJBQUE7SUFRYixJQUFJLGFBQWEsQ0FBQztJQUNsQixJQUFJLGFBQWEsS0FBSyxNQUFNLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtRQUMzQyxhQUFhLEdBQUcsVUFBVTtZQUN4QixDQUFDLENBQUMsSUFBQSwwQkFBTyxFQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsd0JBQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFFLEtBQUssRUFBRSxFQUFFLElBQUc7WUFDekQsQ0FBQyxDQUFDLElBQUEsMEJBQU8sRUFBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7S0FDdEI7U0FBTTtRQUNMLGFBQWEsR0FBRyxVQUFVLENBQUMsQ0FBQyx1QkFBTSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUUsS0FBSyxFQUFFLEVBQUUsSUFBRyxDQUFDLENBQUMsRUFBRSxDQUFDO0tBQ25FO0lBRUQsT0FBTyxhQUFhLENBQ2xCLGVBQWUsQ0FBQyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxFQUN0QyxJQUFJLEVBQ0osTUFBTSxFQUNOLE1BQU0sQ0FDUCxDQUFDO0FBQ0osQ0FBQztBQTVCRCx3Q0E0QkMifQ==