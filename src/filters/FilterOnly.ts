import FilterByLevel from './FilterByLevel';
import FilterConfigurationItem, { EMPTY_DEEP } from './FilterConfigurationItem';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class FilterOnly extends FilterByLevel {
  constructor(
    runningEnvironment: IRunningEnvironment,
    configurationItems: FilterConfigurationItem[] = []
  ) {
    super(runningEnvironment, configurationItems);
  }

  async matchFilter(path: string, deep: number): Promise<boolean> {
    const currentPath = this.getCurrentPathPart(path);
    const existGlobalFilter = this.configurationByLevel[EMPTY_DEEP];
    const existMatchingGlobalFilter =
      existGlobalFilter &&
      this.configurationByLevel[EMPTY_DEEP].some(it => it.isMatch(currentPath));

    if (existMatchingGlobalFilter) return true;

    const existLevelFilter = this.configurationByLevel[deep];
    const existMatchingLevelFilter =
      existLevelFilter && this.configurationByLevel[deep].some(it => it.isMatch(currentPath, deep));
    if (existGlobalFilter || existLevelFilter) return existMatchingLevelFilter;

    return true;
  }
}
