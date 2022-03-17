import FilterByLevel from "./FilterByLevel";

export default class FilterIgnore extends FilterByLevel {
  constructor(configurationItems = []) {
    super(configurationItems);
  }

  matchFilter(path, deep) {
    const existGlobalFilterAndSomeIsIgnoring = this.configurationByLevel.null
      && this.configurationByLevel.null.some((it) => it.isMatch(path));

    if (existGlobalFilterAndSomeIsIgnoring) return false;

    const existLevelSpecificFilterAndSomeIsIgnoring = this.configurationByLevel[deep]
     && this.configurationByLevel[deep].some((it) => it.isMatch(path));

    return !existLevelSpecificFilterAndSomeIsIgnoring;
  }
}
