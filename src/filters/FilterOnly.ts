import FilterByLevel from './FilterByLevel';
import FilterConfigurationItem, { EMPTY_DEEP } from './FilterConfigurationItem';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class FilterOnly extends FilterByLevel {
  constructor(runningEnvironment: IRunningEnvironment, configurationItems: FilterConfigurationItem[] = []) {
    super(runningEnvironment, configurationItems);
  }

  async matchFilter(path: string, deep: number): Promise<boolean> {
    const currentPath = this.getCurrentPathPart(path);
    const existGlobalFilterAndThereIsNoOneMatching =
      this.configurationByLevel[EMPTY_DEEP] &&
      this.configurationByLevel[EMPTY_DEEP].every(it => !it.isMatch(currentPath));

    if (existGlobalFilterAndThereIsNoOneMatching) return false;

    const existLevelSpecificFilterAndThereIsNoOneMatching =
      this.configurationByLevel[deep] &&
      this.configurationByLevel[deep].every(it => !it.isMatch(currentPath, deep));

    return !existLevelSpecificFilterAndThereIsNoOneMatching;
  }
}
