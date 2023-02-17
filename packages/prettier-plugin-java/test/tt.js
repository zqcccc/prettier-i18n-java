const path = require("path");
const prettier = require(path.join(
    __dirname,
    "../../../node_modules/prettier"
));

// const config = require(path.join(__dirname, "../../../.prettierrc.js"));

const fs = require("fs");

const codeStr = fs.readFileSync(path.join(__dirname, "./_input.java")).toString();
// const codeStr = fs.readFileSync(path.join(__dirname, './unit-test/expressions/_input.java'))

prettier
    .resolveConfig(path.join(__dirname, "../../../.prettierrc.js"))
    .then(config => {
        const formatted = prettier.format(codeStr, {
            ...config,
            filepath: path.join(__dirname, "./_input.java")
        });
        fs.writeFileSync(path.join(__dirname, "./_output.java"), formatted);
    });
