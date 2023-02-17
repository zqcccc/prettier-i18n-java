"use strict";
var parse = require("./parser");
var print = require("./printer");
var options = require("./options");
var languages = [
    {
        name: "Java",
        parsers: ["java"],
        group: "Java",
        tmScope: "text.html.vue",
        aceMode: "html",
        codemirrorMode: "clike",
        codemirrorMimeType: "text/x-java",
        extensions: [".java"],
        linguistLanguageId: 181,
        vscodeLanguageIds: ["java"]
    }
];
function locStart( /* node */) {
    return -1;
}
function locEnd( /* node */) {
    return -1;
}
function hasPragma( /* text */) {
    return false;
}
var parsers = {
    java: {
        parse: parse,
        astFormat: "java",
        locStart: locStart,
        locEnd: locEnd,
        hasPragma: hasPragma,
        preprocess: function (code, options) {
            var javaParser = require("../../java-parser");
            var cst = javaParser.parse(code, options.entrypoint);
            return "// hello world, This is from preprocess 你好吗？\n" + code;
        }
    }
};
function canAttachComment(node) {
    return node.ast_type && node.ast_type !== "comment";
}
function printComment(commentPath) {
    var comment = commentPath.getValue();
    switch (comment.ast_type) {
        case "comment":
            return comment.value;
        default:
            throw new Error("Not a comment: " + JSON.stringify(comment));
    }
}
function clean(ast, newObj) {
    delete newObj.lineno;
    delete newObj.col_offset;
}
var printers = {
    java: {
        print: print,
        // hasPrettierIgnore,
        printComment: printComment,
        canAttachComment: canAttachComment,
        massageAstNode: clean
    }
};
module.exports = {
    languages: languages,
    printers: printers,
    parsers: parsers,
    options: options
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBRWIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFckMsSUFBTSxTQUFTLEdBQUc7SUFDaEI7UUFDRSxJQUFJLEVBQUUsTUFBTTtRQUNaLE9BQU8sRUFBRSxDQUFDLE1BQU0sQ0FBQztRQUNqQixLQUFLLEVBQUUsTUFBTTtRQUNiLE9BQU8sRUFBRSxlQUFlO1FBQ3hCLE9BQU8sRUFBRSxNQUFNO1FBQ2YsY0FBYyxFQUFFLE9BQU87UUFDdkIsa0JBQWtCLEVBQUUsYUFBYTtRQUNqQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7UUFDckIsa0JBQWtCLEVBQUUsR0FBRztRQUN2QixpQkFBaUIsRUFBRSxDQUFDLE1BQU0sQ0FBQztLQUM1QjtDQUNGLENBQUM7QUFFRixTQUFTLFFBQVEsRUFBQyxVQUFVO0lBQzFCLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDWixDQUFDO0FBRUQsU0FBUyxNQUFNLEVBQUMsVUFBVTtJQUN4QixPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQ1osQ0FBQztBQUVELFNBQVMsU0FBUyxFQUFDLFVBQVU7SUFDM0IsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsSUFBTSxPQUFPLEdBQUc7SUFDZCxJQUFJLEVBQUU7UUFDSixLQUFLLE9BQUE7UUFDTCxTQUFTLEVBQUUsTUFBTTtRQUNqQixRQUFRLFVBQUE7UUFDUixNQUFNLFFBQUE7UUFDTixTQUFTLFdBQUE7UUFDVCxVQUFVLEVBQUUsVUFBVSxJQUFJLEVBQUUsT0FBTztZQUN2QyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNoRCxJQUFNLEdBQUcsR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUE7WUFDaEQsT0FBTyxnREFBZ0QsR0FBRyxJQUFJLENBQUM7UUFDakUsQ0FBQztLQUNGO0NBQ0YsQ0FBQztBQUVGLFNBQVMsZ0JBQWdCLENBQUMsSUFBSTtJQUM1QixPQUFPLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUM7QUFDdEQsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLFdBQVc7SUFDL0IsSUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBRXZDLFFBQVEsT0FBTyxDQUFDLFFBQVEsRUFBRTtRQUN4QixLQUFLLFNBQVM7WUFDWixPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUM7UUFDdkI7WUFDRSxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNoRTtBQUNILENBQUM7QUFFRCxTQUFTLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTTtJQUN4QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDckIsT0FBTyxNQUFNLENBQUMsVUFBVSxDQUFDO0FBQzNCLENBQUM7QUFFRCxJQUFNLFFBQVEsR0FBRztJQUNmLElBQUksRUFBRTtRQUNKLEtBQUssT0FBQTtRQUNMLHFCQUFxQjtRQUNyQixZQUFZLGNBQUE7UUFDWixnQkFBZ0Isa0JBQUE7UUFDaEIsY0FBYyxFQUFFLEtBQUs7S0FDdEI7Q0FDRixDQUFDO0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNmLFNBQVMsV0FBQTtJQUNULFFBQVEsVUFBQTtJQUNSLE9BQU8sU0FBQTtJQUNQLE9BQU8sU0FBQTtDQUNSLENBQUMifQ==