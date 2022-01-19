const FilterByLevel = require("./FilterByLevel");

module.exports = class FilterOnly extends FilterByLevel {
  constructor(configurationItems = []) {
    super(configurationItems);
  }

  matchFilter(path, deep) {
    const existGlobalFilterAndThereIsNoOneMatching = this.configurationByLevel.null
      && this.configurationByLevel.null.every((it) => !it.isMatch(path));

    if (existGlobalFilterAndThereIsNoOneMatching) return false;

    const existLevelSpecificFilterAndThereIsNoOneMatching = this.configurationByLevel[deep]
     && this.configurationByLevel[deep].every((it) => !it.isMatch(path));

    return !existLevelSpecificFilterAndThereIsNoOneMatching;
  }
};
