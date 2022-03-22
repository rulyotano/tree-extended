import FilterByLevel from './FilterByLevel';
import FilterConfigurationItem, { EMPTY_DEEP } from './FilterConfigurationItem';

export default class FilterIgnore extends FilterByLevel {
  constructor(configurationItems: FilterConfigurationItem[] = []) {
    super(configurationItems);
  }

  matchFilter(path: string, deep: number): boolean {
    const existGlobalFilterAndSomeIsIgnoring =
      this.configurationByLevel[EMPTY_DEEP] &&
      this.configurationByLevel[EMPTY_DEEP].some(it => it.isMatch(path));

    if (existGlobalFilterAndSomeIsIgnoring) return false;

    const existLevelSpecificFilterAndSomeIsIgnoring =
      this.configurationByLevel[deep] &&
      this.configurationByLevel[deep].some(it => it.isMatch(path, deep));

    return !existLevelSpecificFilterAndSomeIsIgnoring;
  }
}
