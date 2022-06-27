import FilterConfigurationItem from './filters/FilterConfigurationItem';

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
    showIndicatorWhenDirectoryIsNotEmpty = false,
    includeGitIgnore = false,
    ignoreFilters = "",
    onlyFilters = ""
  ) {
    this.charset = charset;
    this.maximumDeep = maximumDeep;
    this.showIndicatorWhenDirectoryIsNotEmpty = showIndicatorWhenDirectoryIsNotEmpty;
    this.includeGitIgnore = includeGitIgnore;
    this.ignoreFilters = FilterConfigurationItem.parseArray(ignoreFilters);
    this.onlyFilters =  FilterConfigurationItem.parseArray(onlyFilters);
  }
}
