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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlocksAndStatementPrettierVisitor = void 0;
var doc_1 = require("prettier/doc");
var prettier_builder_1 = require("./prettier-builder");
var format_comments_1 = require("./comments/format-comments");
var comments_utils_1 = require("./comments/comments-utils");
var printer_utils_1 = require("./printer-utils");
var base_cst_printer_1 = require("../base-cst-printer");
var line = doc_1.builders.line, softline = doc_1.builders.softline, hardline = doc_1.builders.hardline;
var BlocksAndStatementPrettierVisitor = /** @class */ (function (_super) {
    __extends(BlocksAndStatementPrettierVisitor, _super);
    function BlocksAndStatementPrettierVisitor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlocksAndStatementPrettierVisitor.prototype.block = function (ctx) {
        var blockStatements = this.visit(ctx.blockStatements);
        return (0, printer_utils_1.putIntoBraces)(blockStatements, hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    BlocksAndStatementPrettierVisitor.prototype.blockStatements = function (ctx) {
        var blockStatement = this.mapVisit(ctx.blockStatement);
        var separators = (0, printer_utils_1.rejectSeparators)((0, printer_utils_1.getBlankLinesSeparator)(ctx.blockStatement), blockStatement);
        return (0, printer_utils_1.rejectAndJoinSeps)(separators, blockStatement);
    };
    BlocksAndStatementPrettierVisitor.prototype.blockStatement = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.localVariableDeclarationStatement = function (ctx) {
        var localVariableDeclaration = this.visit(ctx.localVariableDeclaration);
        return (0, printer_utils_1.rejectAndConcat)([localVariableDeclaration, ctx.Semicolon[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.localVariableDeclaration = function (ctx) {
        var modifiers = (0, printer_utils_1.sortModifiers)(ctx.variableModifier);
        var firstAnnotations = this.mapVisit(modifiers[0]);
        var finalModifiers = this.mapVisit(modifiers[1]);
        var localVariableType = this.visit(ctx.localVariableType);
        var variableDeclaratorList = this.visit(ctx.variableDeclaratorList);
        return (0, printer_utils_1.rejectAndJoin)(hardline, [
            (0, printer_utils_1.rejectAndJoin)(hardline, firstAnnotations),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", finalModifiers),
                localVariableType,
                variableDeclaratorList
            ])
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.localVariableType = function (ctx) {
        if (ctx.unannType) {
            return this.visitSingle(ctx);
        }
        return (0, format_comments_1.printTokenWithComments)(this.getSingle(ctx));
    };
    BlocksAndStatementPrettierVisitor.prototype.statement = function (ctx, params) {
        // handling Labeled statements comments
        if (ctx.labeledStatement !== undefined) {
            var newLabelStatement = __assign({}, ctx.labeledStatement[0]);
            var newColon = __assign({}, ctx.labeledStatement[0].children.Colon[0]);
            var newStatement = __assign({}, ctx.labeledStatement[0].children.statement[0]);
            var labeledStatementLeadingComments = [];
            if (newColon.trailingComments !== undefined) {
                labeledStatementLeadingComments.push.apply(labeledStatementLeadingComments, newColon.trailingComments);
                delete newColon.trailingComments;
            }
            if (newStatement.leadingComments !== undefined) {
                labeledStatementLeadingComments.push.apply(labeledStatementLeadingComments, newStatement.leadingComments);
                delete newStatement.leadingComments;
            }
            if (labeledStatementLeadingComments.length !== 0) {
                newLabelStatement.leadingComments = labeledStatementLeadingComments;
            }
            newLabelStatement.children.Colon[0] = newColon;
            newLabelStatement.children.statement[0] = newStatement;
            return this.visit([newLabelStatement]);
        }
        return this.visitSingle(ctx, params);
    };
    BlocksAndStatementPrettierVisitor.prototype.statementWithoutTrailingSubstatement = function (ctx, params) {
        return this.visitSingle(ctx, params);
    };
    BlocksAndStatementPrettierVisitor.prototype.emptyStatement = function (ctx, params) {
        return (0, printer_utils_1.displaySemicolon)(ctx.Semicolon[0], params);
    };
    BlocksAndStatementPrettierVisitor.prototype.labeledStatement = function (ctx) {
        var identifier = ctx.Identifier[0];
        var statement = this.visit(ctx.statement);
        return (0, printer_utils_1.rejectAndJoin)(ctx.Colon[0], [identifier, statement]);
    };
    BlocksAndStatementPrettierVisitor.prototype.expressionStatement = function (ctx) {
        var statementExpression = this.visit(ctx.statementExpression);
        return (0, printer_utils_1.rejectAndConcat)([statementExpression, ctx.Semicolon[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.statementExpression = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.ifStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        var ifStatement = this.visit(ctx.statement[0], {
            allowEmptyStatement: true
        });
        var ifSeparator = (0, printer_utils_1.isStatementEmptyStatement)(ifStatement) ? "" : " ";
        var elsePart = "";
        if (ctx.Else !== undefined) {
            var elseStatement = this.visit(ctx.statement[1], {
                allowEmptyStatement: true
            });
            var elseSeparator = (0, printer_utils_1.isStatementEmptyStatement)(elseStatement) ? "" : " ";
            var elseOnSameLine = (0, comments_utils_1.hasTrailingLineComments)(ctx.statement[0]) ||
                (0, comments_utils_1.hasLeadingLineComments)(ctx.Else[0])
                ? hardline
                : " ";
            elsePart = (0, printer_utils_1.rejectAndJoin)(elseSeparator, [
                (0, prettier_builder_1.concat)([elseOnSameLine, ctx.Else[0]]),
                elseStatement
            ]);
        }
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoin)(" ", [
                ctx.If[0],
                (0, prettier_builder_1.concat)([
                    (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]),
                    ifSeparator
                ])
            ]),
            ifStatement,
            elsePart
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.assertStatement = function (ctx) {
        var expressions = this.mapVisit(ctx.expression);
        var colon = ctx.Colon ? ctx.Colon[0] : ":";
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.concat)([ctx.Assert[0], " "]),
            (0, printer_utils_1.rejectAndJoin)((0, prettier_builder_1.concat)([" ", colon, " "]), expressions),
            ctx.Semicolon[0]
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.switchStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        var switchBlock = this.visit(ctx.switchBlock);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.Switch[0],
            (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]),
            switchBlock
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.switchBlock = function (ctx) {
        var switchCases = ctx.switchBlockStatementGroup !== undefined
            ? this.mapVisit(ctx.switchBlockStatementGroup)
            : this.mapVisit(ctx.switchRule);
        return (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndJoin)(hardline, switchCases), hardline, ctx.LCurly[0], ctx.RCurly[0]);
    };
    BlocksAndStatementPrettierVisitor.prototype.switchBlockStatementGroup = function (ctx) {
        var switchLabel = this.visit(ctx.switchLabel);
        var blockStatements = this.visit(ctx.blockStatements);
        return (0, prettier_builder_1.concat)([
            switchLabel,
            ctx.Colon[0],
            blockStatements && (0, prettier_builder_1.indent)([hardline, blockStatements])
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.switchLabel = function (ctx) {
        var caseOrDefaultLabels = this.mapVisit(ctx.caseOrDefaultLabel);
        var colons = ctx.Colon
            ? ctx.Colon.map(function (elt) {
                return (0, prettier_builder_1.concat)([elt, hardline]);
            })
            : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(colons, caseOrDefaultLabels));
    };
    BlocksAndStatementPrettierVisitor.prototype.caseOrDefaultLabel = function (ctx) {
        if (ctx.Case) {
            var caseLabelElements = this.mapVisit(ctx.caseLabelElement);
            var commas = ctx.Comma
                ? ctx.Comma.map(function (elt) {
                    return (0, prettier_builder_1.concat)([elt, line]);
                })
                : [];
            return (0, prettier_builder_1.group)((0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([
                (0, prettier_builder_1.concat)([ctx.Case[0], " "]),
                (0, printer_utils_1.rejectAndJoinSeps)(commas, caseLabelElements)
            ])));
        }
        return (0, prettier_builder_1.concat)([ctx.Default[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.caseLabelElement = function (ctx) {
        if (ctx.Default || ctx.Null) {
            return this.getSingle(ctx);
        }
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.switchRule = function (ctx) {
        var switchLabel = this.visit(ctx.switchLabel);
        var caseInstruction;
        if (ctx.throwStatement !== undefined) {
            caseInstruction = this.visit(ctx.throwStatement);
        }
        else if (ctx.block !== undefined) {
            caseInstruction = this.visit(ctx.block);
        }
        else {
            caseInstruction = (0, prettier_builder_1.concat)([this.visit(ctx.expression), ctx.Semicolon[0]]);
        }
        return (0, prettier_builder_1.join)(" ", [switchLabel, ctx.Arrow[0], caseInstruction]);
    };
    BlocksAndStatementPrettierVisitor.prototype.caseConstant = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.whileStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        var statement = this.visit(ctx.statement[0], {
            allowEmptyStatement: true
        });
        var statementSeparator = (0, printer_utils_1.isStatementEmptyStatement)(statement) ? "" : " ";
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.While[0],
            (0, printer_utils_1.rejectAndJoin)(statementSeparator, [
                (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]),
                statement
            ])
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.doStatement = function (ctx) {
        var statement = this.visit(ctx.statement[0], {
            allowEmptyStatement: true
        });
        var statementSeparator = (0, printer_utils_1.isStatementEmptyStatement)(statement) ? "" : " ";
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(statementSeparator, [ctx.Do[0], statement]),
            ctx.While[0],
            (0, printer_utils_1.rejectAndConcat)([
                (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]),
                ctx.Semicolon[0]
            ])
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.forStatement = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.basicForStatement = function (ctx) {
        var forInit = this.visit(ctx.forInit);
        var expression = this.visit(ctx.expression);
        var forUpdate = this.visit(ctx.forUpdate);
        var statement = this.visit(ctx.statement[0], {
            allowEmptyStatement: true
        });
        var statementSeparator = (0, printer_utils_1.isStatementEmptyStatement)(statement) ? "" : " ";
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoin)(" ", [
                ctx.For[0],
                (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndConcat)([
                    forInit,
                    (0, printer_utils_1.rejectAndJoin)(line, [ctx.Semicolon[0], expression]),
                    (0, printer_utils_1.rejectAndJoin)(line, [ctx.Semicolon[1], forUpdate])
                ]), softline, ctx.LBrace[0], ctx.RBrace[0])
            ]),
            statementSeparator,
            statement
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.forInit = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.forUpdate = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.statementExpressionList = function (ctx) {
        var statementExpressions = this.mapVisit(ctx.statementExpression);
        var commas = ctx.Comma
            ? ctx.Comma.map(function (elt) {
                return (0, prettier_builder_1.concat)([(0, format_comments_1.printTokenWithComments)(elt), " "]);
            })
            : [];
        return (0, printer_utils_1.rejectAndJoinSeps)(commas, statementExpressions);
    };
    BlocksAndStatementPrettierVisitor.prototype.enhancedForStatement = function (ctx) {
        var variableModifiers = this.mapVisit(ctx.variableModifier);
        var localVariableType = this.visit(ctx.localVariableType);
        var variableDeclaratorId = this.visit(ctx.variableDeclaratorId);
        var expression = this.visit(ctx.expression);
        var statement = this.visit(ctx.statement[0], {
            allowEmptyStatement: true
        });
        var statementSeparator = (0, printer_utils_1.isStatementEmptyStatement)(statement) ? "" : " ";
        return (0, printer_utils_1.rejectAndConcat)([
            (0, printer_utils_1.rejectAndJoin)(" ", [ctx.For[0], ctx.LBrace[0]]),
            (0, printer_utils_1.rejectAndJoin)(" ", [
                (0, printer_utils_1.rejectAndJoin)(" ", variableModifiers),
                localVariableType,
                variableDeclaratorId
            ]),
            (0, prettier_builder_1.concat)([" ", ctx.Colon[0], " "]),
            expression,
            (0, prettier_builder_1.concat)([ctx.RBrace[0], statementSeparator]),
            statement
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.breakStatement = function (ctx) {
        if (ctx.Identifier) {
            var identifier = ctx.Identifier[0];
            return (0, printer_utils_1.rejectAndConcat)([
                (0, prettier_builder_1.concat)([ctx.Break[0], " "]),
                identifier,
                ctx.Semicolon[0]
            ]);
        }
        return (0, prettier_builder_1.concat)([ctx.Break[0], ctx.Semicolon[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.continueStatement = function (ctx) {
        if (ctx.Identifier) {
            var identifier = ctx.Identifier[0];
            return (0, printer_utils_1.rejectAndConcat)([
                (0, prettier_builder_1.concat)([ctx.Continue[0], " "]),
                identifier,
                ctx.Semicolon[0]
            ]);
        }
        return (0, printer_utils_1.rejectAndConcat)([ctx.Continue[0], ctx.Semicolon[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.returnStatement = function (ctx) {
        if (ctx.expression) {
            var expression = this.visit(ctx.expression, {
                addParenthesisToWrapStatement: true
            });
            return (0, printer_utils_1.rejectAndConcat)([
                (0, prettier_builder_1.concat)([ctx.Return[0], " "]),
                expression,
                ctx.Semicolon[0]
            ]);
        }
        return (0, printer_utils_1.rejectAndConcat)([ctx.Return[0], ctx.Semicolon[0]]);
    };
    BlocksAndStatementPrettierVisitor.prototype.throwStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.concat)([ctx.Throw[0], " "]),
            expression,
            ctx.Semicolon[0]
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.synchronizedStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        var block = this.visit(ctx.block);
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.join)(" ", [
                ctx.Synchronized[0],
                (0, prettier_builder_1.concat)([
                    (0, printer_utils_1.putIntoBraces)(expression, softline, ctx.LBrace[0], ctx.RBrace[0]),
                    " "
                ])
            ]),
            block
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.tryStatement = function (ctx) {
        if (ctx.tryWithResourcesStatement) {
            return this.visit(ctx.tryWithResourcesStatement);
        }
        var block = this.visit(ctx.block);
        var catches = this.visit(ctx.catches);
        var finallyBlock = this.visit(ctx.finally);
        return (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Try[0], block, catches, finallyBlock]);
    };
    BlocksAndStatementPrettierVisitor.prototype.catches = function (ctx) {
        var catchClauses = this.mapVisit(ctx.catchClause);
        return (0, printer_utils_1.rejectAndJoin)(" ", catchClauses);
    };
    BlocksAndStatementPrettierVisitor.prototype.catchClause = function (ctx) {
        var catchFormalParameter = this.visit(ctx.catchFormalParameter);
        var block = this.visit(ctx.block);
        return (0, printer_utils_1.rejectAndConcat)([
            (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndConcat)([
                (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Catch[0], ctx.LBrace[0]]),
                (0, prettier_builder_1.indent)((0, printer_utils_1.rejectAndConcat)([softline, catchFormalParameter])),
                softline,
                (0, prettier_builder_1.concat)([ctx.RBrace[0], " "])
            ])),
            block
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.catchFormalParameter = function (ctx) {
        var variableModifiers = this.mapVisit(ctx.variableModifier);
        var catchType = this.visit(ctx.catchType);
        var variableDeclaratorId = this.visit(ctx.variableDeclaratorId);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", variableModifiers),
            catchType,
            variableDeclaratorId
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.catchType = function (ctx) {
        var unannClassType = this.visit(ctx.unannClassType);
        var classTypes = this.mapVisit(ctx.classType);
        var ors = ctx.Or ? ctx.Or.map(function (elt) { return (0, prettier_builder_1.concat)([line, elt, " "]); }) : [];
        return (0, prettier_builder_1.group)((0, printer_utils_1.rejectAndJoinSeps)(ors, __spreadArray([unannClassType], classTypes, true)));
    };
    BlocksAndStatementPrettierVisitor.prototype.finally = function (ctx) {
        var block = this.visit(ctx.block);
        return (0, printer_utils_1.rejectAndJoin)(" ", [ctx.Finally[0], block]);
    };
    BlocksAndStatementPrettierVisitor.prototype.tryWithResourcesStatement = function (ctx) {
        var resourceSpecification = this.visit(ctx.resourceSpecification);
        var block = this.visit(ctx.block);
        var catches = this.visit(ctx.catches);
        var finallyBlock = this.visit(ctx.finally);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            ctx.Try[0],
            resourceSpecification,
            block,
            catches,
            finallyBlock
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.resourceSpecification = function (ctx) {
        var resourceList = this.visit(ctx.resourceList);
        var optionalSemicolon = ctx.Semicolon ? ctx.Semicolon[0] : "";
        return (0, printer_utils_1.putIntoBraces)((0, printer_utils_1.rejectAndConcat)([resourceList, optionalSemicolon]), softline, ctx.LBrace[0], ctx.RBrace[0]);
    };
    BlocksAndStatementPrettierVisitor.prototype.resourceList = function (ctx) {
        var resources = this.mapVisit(ctx.resource);
        var semicolons = ctx.Semicolon
            ? ctx.Semicolon.map(function (elt) {
                return (0, prettier_builder_1.concat)([elt, line]);
            })
            : [""];
        return (0, printer_utils_1.rejectAndJoinSeps)(semicolons, resources);
    };
    BlocksAndStatementPrettierVisitor.prototype.resource = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.resourceInit = function (ctx) {
        var variableModifiers = this.mapVisit(ctx.variableModifier);
        var localVariableType = this.visit(ctx.localVariableType);
        var identifier = ctx.Identifier[0];
        var expression = this.visit(ctx.expression);
        return (0, printer_utils_1.rejectAndJoin)(" ", [
            (0, printer_utils_1.rejectAndJoin)(" ", variableModifiers),
            localVariableType,
            identifier,
            ctx.Equals[0],
            expression
        ]);
    };
    BlocksAndStatementPrettierVisitor.prototype.yieldStatement = function (ctx) {
        var expression = this.visit(ctx.expression);
        return (0, prettier_builder_1.join)(" ", [ctx.Yield[0], (0, prettier_builder_1.concat)([expression, ctx.Semicolon[0]])]);
    };
    BlocksAndStatementPrettierVisitor.prototype.variableAccess = function (ctx) {
        return this.visitSingle(ctx);
    };
    BlocksAndStatementPrettierVisitor.prototype.isBasicForStatement = function () {
        return "isBasicForStatement";
    };
    BlocksAndStatementPrettierVisitor.prototype.isLocalVariableDeclaration = function () {
        return "isLocalVariableDeclaration";
    };
    BlocksAndStatementPrettierVisitor.prototype.isClassicSwitchLabel = function () {
        return "isClassicSwitchLabel";
    };
    return BlocksAndStatementPrettierVisitor;
}(base_cst_printer_1.BaseCstPrettierPrinter));
exports.BlocksAndStatementPrettierVisitor = BlocksAndStatementPrettierVisitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2tzLWFuZC1zdGF0ZW1lbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ByaW50ZXJzL2Jsb2Nrcy1hbmQtc3RhdGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRWIsb0NBQXdDO0FBQ3hDLHVEQUF5RTtBQUN6RSw4REFBb0U7QUFDcEUsNERBR21DO0FBQ25DLGlEQVV5QjtBQUN6Qix3REFBNkQ7QUFzRHJELElBQUEsSUFBSSxHQUF5QixjQUFRLEtBQWpDLEVBQUUsUUFBUSxHQUFlLGNBQVEsU0FBdkIsRUFBRSxRQUFRLEdBQUssY0FBUSxTQUFiLENBQWM7QUFFOUM7SUFBdUQscURBQXNCO0lBQTdFOztJQWtrQkEsQ0FBQztJQWprQkMsaURBQUssR0FBTCxVQUFNLEdBQWE7UUFDakIsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7UUFFeEQsT0FBTyxJQUFBLDZCQUFhLEVBQ2xCLGVBQWUsRUFDZixRQUFRLEVBQ1IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFDYixHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUNkLENBQUM7SUFDSixDQUFDO0lBRUQsMkRBQWUsR0FBZixVQUFnQixHQUF1QjtRQUNyQyxJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV6RCxJQUFNLFVBQVUsR0FBRyxJQUFBLGdDQUFnQixFQUNqQyxJQUFBLHNDQUFzQixFQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFDMUMsY0FBYyxDQUNmLENBQUM7UUFFRixPQUFPLElBQUEsaUNBQWlCLEVBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7SUFFRCwwREFBYyxHQUFkLFVB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