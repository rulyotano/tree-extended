const Filter = require("./Filter");

module.exports = class FilterIgnore extends Filter {
  constructor(filterConfigurationByLevel) {
    super();
    this.filterConfigurationByLevel = filterConfigurationByLevel || {};
  }

  matchFilter(path, deep) {
    const existGlobalFilterAndSomeIsIgnoring = this.filterConfigurationByLevel.null
      && this.filterConfigurationByLevel.null.some((it) => it.isMatch(path));

    if (existGlobalFilterAndSomeIsIgnoring) return false;

    const existLevelSpecificFilterAndSomeIsIgnoring = this.filterConfigurationByLevel[deep]
     && this.filterConfigurationByLevel[deep].some((it) => it.isMatch(path));

    return !existLevelSpecificFilterAndSomeIsIgnoring;
  }
};
