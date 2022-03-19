import IFilter from './IFilter';
import type FilterConfigurationItem from './FilterConfigurationItem';

export default abstract class FilterByLevel implements IFilter {
  configurationByLevel: { [level: number|null]: FilterConfigurationItem[]; };

  constructor(configurationItems: FilterConfigurationItem[] = []) {
    this.configurationByLevel = FilterByLevel.getConfigurationByLevels(configurationItems);
  }

  abstract matchFilter(path: string, deep: number): boolean;

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
}
