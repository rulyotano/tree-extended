import type FilterConfigurationItem from './filters/FilterConfigurationItem';

export interface IConfiguration {
  charset?: string;
  maximumDeep?: number;
  showIndicatorWhenDirectoryIsNotEmpty?: boolean;
  includeGitIgnore?: boolean;
  ignoreFilters?: FilterConfigurationItem[];
  onlyFilters?: FilterConfigurationItem[];
}

export default class Configuration implements IConfiguration {
  charset?: string;
  maximumDeep?: number;
  showIndicatorWhenDirectoryIsNotEmpty?: boolean;
  includeGitIgnore?: boolean;
  ignoreFilters?: FilterConfigurationItem[];
  onlyFilters?: FilterConfigurationItem[];

  constructor(
    charset: string = null,
    maximumDeep: number = null,
    showIndicatorWhenDirectoryIsNotEmpty: boolean = false,
    includeGitIgnore: boolean = false,
    ignoreFilters: FilterConfigurationItem[] = [],
    onlyFilters: FilterConfigurationItem[] = []
  ) {
    this.charset = charset;
    this.maximumDeep = maximumDeep;
    this.showIndicatorWhenDirectoryIsNotEmpty = showIndicatorWhenDirectoryIsNotEmpty;
    this.includeGitIgnore = includeGitIgnore;
    this.ignoreFilters = ignoreFilters;
    this.onlyFilters = onlyFilters;
  }
}
