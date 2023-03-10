"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrettierDoc = void 0;
var base_cst_printer_1 = require("./base-cst-printer");
var arrays_1 = require("./printers/arrays");
var blocks_and_statements_1 = require("./printers/blocks-and-statements");
var classes_1 = require("./printers/classes");
var expressions_1 = require("./printers/expressions");
var interfaces_1 = require("./printers/interfaces");
var lexical_structure_1 = require("./printers/lexical-structure");
var names_1 = require("./printers/names");
var types_values_and_variables_1 = require("./printers/types-values-and-variables");
var packages_and_modules_1 = require("./printers/packages-and-modules");
// Mixins for the win
mixInMethods(arrays_1.ArraysPrettierVisitor, blocks_and_statements_1.BlocksAndStatementPrettierVisitor, classes_1.ClassesPrettierVisitor, expressions_1.ExpressionsPrettierVisitor, interfaces_1.InterfacesPrettierVisitor, lexical_structure_1.LexicalStructurePrettierVisitor, names_1.NamesPrettierVisitor, types_values_and_variables_1.TypesValuesAndVariablesPrettierVisitor, packages_and_modules_1.PackagesAndModulesPrettierVisitor);
function mixInMethods() {
    var classesToMix = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        classesToMix[_i] = arguments[_i];
    }
    classesToMix.forEach(function (from) {
        var fromMethodsNames = Object.getOwnPropertyNames(from.prototype);
        var fromPureMethodsName = fromMethodsNames.filter(function (methodName) { return methodName !== "constructor"; });
        fromPureMethodsName.forEach(function (methodName) {
            // @ts-ignore
            base_cst_printer_1.BaseCstPrettierPrinter.prototype[methodName] = from.prototype[methodName];
        });
    });
}
var prettyPrinter = new base_cst_printer_1.BaseCstPrettierPrinter();
// TODO: do we need the "path" and "print" arguments passed by prettier
// see https://github.com/prettier/prettier/issues/5747
function createPrettierDoc(cstNode, options) {
    prettyPrinter.prettierOptions = options;
    return prettyPrinter.visit(cstNode);
}
exports.createPrettierDoc = createPrettierDoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3N0LXByaW50ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvY3N0LXByaW50ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdURBQTREO0FBQzVELDRDQUEwRDtBQUMxRCwwRUFBcUY7QUFDckYsOENBQTREO0FBQzVELHNEQUFvRTtBQUNwRSxvREFBa0U7QUFDbEUsa0VBQStFO0FBQy9FLDBDQUF3RDtBQUN4RCxvRkFBK0Y7QUFDL0Ysd0VBQW9GO0FBRXBGLHFCQUFxQjtBQUNyQixZQUFZLENBQ1YsOEJBQXFCLEVBQ3JCLHlEQUFpQyxFQUNqQyxnQ0FBc0IsRUFDdEIsd0NBQTBCLEVBQzFCLHNDQUF5QixFQUN6QixtREFBK0IsRUFDL0IsNEJBQW9CLEVBQ3BCLG1FQUFzQyxFQUN0Qyx3REFBaUMsQ0FDbEMsQ0FBQztBQUVGLFNBQVMsWUFBWTtJQUFDLHNCQUFzQjtTQUF0QixVQUFzQixFQUF0QixxQkFBc0IsRUFBdEIsSUFBc0I7UUFBdEIsaUNBQXNCOztJQUMxQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtRQUN2QixJQUFNLGdCQUFnQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDcEUsSUFBTSxtQkFBbUIsR0FBRyxnQkFBZ0IsQ0FBQyxNQUFNLENBQ2pELFVBQUEsVUFBVSxJQUFJLE9BQUEsVUFBVSxLQUFLLGFBQWEsRUFBNUIsQ0FBNEIsQ0FDM0MsQ0FBQztRQUNGLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxVQUFBLFVBQVU7WUFDcEMsYUFBYTtZQUNiLHlDQUFzQixDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzVFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsSUFBTSxhQUFhLEdBQUcsSUFBSSx5Q0FBc0IsRUFBRSxDQUFDO0FBRW5ELHVFQUF1RTtBQUN2RSx1REFBdUQ7QUFDdkQsU0FBZ0IsaUJBQWlCLENBQUMsT0FBWSxFQUFFLE9BQVk7SUFDMUQsYUFBYSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUM7SUFDeEMsT0FBTyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFIRCw4Q0FHQyJ9