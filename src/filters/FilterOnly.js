const Filter = require("./Filter");

module.exports = class FilterOnly extends Filter {
  constructor(filterConfigurationByLevel) {
    super();
    this.filterConfigurationByLevel = filterConfigurationByLevel || {};
  }

  matchFilter(path, deep) {
    const existGlobalFilterAndThereIsNoOneMatching = this.filterConfigurationByLevel.null
      && this.filterConfigurationByLevel.null.every((it) => !it.isMatch(path));

    if (existGlobalFilterAndThereIsNoOneMatching) return false;

    const existLevelSpecificFilterAndThereIsNoOneMatching = this.filterConfigurationByLevel[deep]
     && this.filterConfigurationByLevel[deep].every((it) => !it.isMatch(path));

    return !existLevelSpecificFilterAndThereIsNoOneMatching;
  }
};
