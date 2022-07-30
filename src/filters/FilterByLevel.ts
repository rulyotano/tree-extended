import IFilter from './IFilter';
import type FilterConfigurationItem from './FilterConfigurationItem';
import type IRunningEnvironment from '../IRunningEnvironment';

export default abstract class FilterByLevel implements IFilter {
  configurationByLevel: { [level: number|null]: FilterConfigurationItem[]; };
  runningEnvironment: IRunningEnvironment;

  constructor(runningEnvironment: IRunningEnvironment, configurationItems: FilterConfigurationItem[] = []) {
    this.configurationByLevel = FilterByLevel.getConfigurationByLevels(configurationItems);
    this.runningEnvironment = runningEnvironment;
  }

  abstract matchFilter(path: string, deep: number): Promise<boolean>;

  static getConfigurationByLevels(configurationItems: FilterConfigurationItem[]): {
    [level: number|null]: FilterConfigurationItem[];
  } {
    const configurationByLevel: { [level: number|null]: FilterConfigurationItem[] } = {};
    configurationItems.forEach(configurationItem => {
      if (!configurationByLevel[configurationItem.deep]) {
        configurationByLevel[configurationItem.deep] = [];
      }
      configurationByLevel[configurationItem.deep].push(configurationItem);
    });
    return configurationByLevel;
  }

  getCurrentPathPart(path: string): string {
    const pathParts = this.runningEnvironment.getPathParts(path);
    return pathParts[pathParts.length - 1];
  }
}
