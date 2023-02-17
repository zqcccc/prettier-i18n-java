const myPlugin = require('./packages/prettier-plugin-java/dist/index')

module.exports = {
  trailingComma: "none",
  useTabs: false,
  tabWidth: 4,
  semi: true,
  singleQuote: false,
  printWidth: 80,
  arrowParens: "avoid",
  plugins: [myPlugin]
};
