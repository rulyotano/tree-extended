const FilterCollection = require("./FilterCollection");
const FilterGitignore = require("./FilterGitignore");
const FilterIgnore = require("./FilterIgnore");
const FilterOnly = require("./FilterOnly");

module.exports = class CustomFilterCollection extends FilterCollection {
  constructor(ignoreItems = [], onlyItems = [], useGitignore = false, absolutePath = "") {
    super();
    this.addIgnoreFilter(ignoreItems);
    this.addOnlyFilter(onlyItems);
    this.addGitignoreFilter(useGitignore, absolutePath);
  }

  addGitignoreFilter(useGitignore = false, absolutePath = "") {
    this.addFilter(new FilterGitignore(useGitignore, absolutePath));
  }

  addIgnoreFilter(configurationItems = []) {
    this.addFilter(new FilterIgnore(configurationItems));
  }

  addOnlyFilter(configurationItems = []) {
    this.addFilter(new FilterOnly(configurationItems));
  }
};
