import FilterByLevel from './FilterByLevel';
import FilterConfigurationItem, { EMPTY_DEEP } from './FilterConfigurationItem';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class FilterIgnore extends FilterByLevel {
  constructor(runningEnvironment: IRunningEnvironment, configurationItems: FilterConfigurationItem[] = []) {
    super(runningEnvironment, configurationItems);
  }

  async matchFilter(path: string, deep: number): Promise<boolean> {
    const currentPath = this.getCurrentPathPart(path);
    const existGlobalFilterAndSomeIsIgnoring =
      this.configurationByLevel[EMPTY_DEEP] &&
      this.configurationByLevel[EMPTY_DEEP].some(it => it.isMatch(currentPath));

    if (existGlobalFilterAndSomeIsIgnoring) return false;

    const existLevelSpecificFilterAndSomeIsIgnoring =
      this.configurationByLevel[deep] &&
      this.configurationByLevel[deep].some(it => it.isMatch(currentPath, deep));

    return !existLevelSpecificFilterAndSomeIsIgnoring;
  }
}
