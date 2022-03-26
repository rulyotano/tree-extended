import FilterConfigurationItem from '../FilterConfigurationItem';
import FilterCollection from './FilterCollection';
import FilterGitignore from '../FilterGitignore';
import FilterIgnore from '../FilterIgnore';
import FilterOnly from '../FilterOnly';
import type IRunningEnvironment from '../../IRunningEnvironment';

export default class CustomFilterCollection extends FilterCollection {
  constructor(
    runningEnvironment: IRunningEnvironment,
    ignoreItems: FilterConfigurationItem[] = [],
    onlyItems: FilterConfigurationItem[] = [],
    useGitignore = false,
    absolutePath = ''
  ) {
    super();
    this.addIgnoreFilter(ignoreItems);
    this.addOnlyFilter(onlyItems);
    this.addGitignoreFilter(runningEnvironment, useGitignore, absolutePath);
  }

  addGitignoreFilter(
    runningEnvironment: IRunningEnvironment,
    useGitignore = false,
    absolutePath = ''
  ) {
    this.addFilter(new FilterGitignore(useGitignore, absolutePath, runningEnvironment));
  }

  addIgnoreFilter(configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterIgnore(configurationItems));
  }

  addOnlyFilter(configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterOnly(configurationItems));
  }
}
