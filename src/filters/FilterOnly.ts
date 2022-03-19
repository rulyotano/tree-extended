import FilterByLevel from "./FilterByLevel";
import FilterConfigurationItem, { EMPTY_DEEP } from './FilterConfigurationItem';

export default class FilterOnly extends FilterByLevel {
  constructor(configurationItems: FilterConfigurationItem[] = []) {
    super(configurationItems);
  }

  matchFilter(path: string, deep: number) {
    const existGlobalFilterAndThereIsNoOneMatching = this.configurationByLevel[EMPTY_DEEP]
      && this.configurationByLevel[EMPTY_DEEP].every((it) => !it.isMatch(path));

    if (existGlobalFilterAndThereIsNoOneMatching) return false;

    const existLevelSpecificFilterAndThereIsNoOneMatching = this.configurationByLevel[deep]
     && this.configurationByLevel[deep].every((it) => !it.isMatch(path));

    return !existLevelSpecificFilterAndThereIsNoOneMatching;
  }
}
