"use strict";
var createPrettierDoc = require("./cst-printer").createPrettierDoc;
// eslint-disable-next-line no-unused-vars
function genericPrint(path, options, print) {
    var node = path.getValue();
    // console.log(node);
    // if (node.comments) {
    //   console.log(node.type, node.comments);
    // }
    // node["comments"] = [
    //   {
    //     ast_type: "comment",
    //     value: "// a",
    //     leading: false,
    //     trailing: true,
    //     printed: false
    //   },
    //   {
    //     ast_type: "comment",
    //     value: "// b",
    //     leading: true,
    //     trailing: false,
    //     printed: false
    //   }
    // ];
    return createPrettierDoc(node, options);
}
module.exports = genericPrint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpbnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmludGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNMLElBQUEsaUJBQWlCLEdBQUssT0FBTyxDQUFDLGVBQWUsQ0FBQyxrQkFBN0IsQ0FBOEI7QUFFdkQsMENBQTBDO0FBQzFDLFNBQVMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSztJQUN4QyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0IscUJBQXFCO0lBQ3JCLHVCQUF1QjtJQUN2QiwyQ0FBMkM7SUFDM0MsSUFBSTtJQUVKLHVCQUF1QjtJQUN2QixNQUFNO0lBQ04sMkJBQTJCO0lBQzNCLHFCQUFxQjtJQUNyQixzQkFBc0I7SUFDdEIsc0JBQXNCO0lBQ3RCLHFCQUFxQjtJQUNyQixPQUFPO0lBQ1AsTUFBTTtJQUNOLDJCQUEyQjtJQUMzQixxQkFBcUI7SUFDckIscUJBQXFCO0lBQ3JCLHVCQUF1QjtJQUN2QixxQkFBcUI7SUFDckIsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMifQ==