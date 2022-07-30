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
    this.addIgnoreFilter(runningEnvironment, ignoreItems);
    this.addOnlyFilter(runningEnvironment, onlyItems);
    this.addGitignoreFilter(runningEnvironment, useGitignore, absolutePath);
  }

  addGitignoreFilter(
    runningEnvironment: IRunningEnvironment,
    useGitignore = false,
    absolutePath = ''
  ) {
    this.addFilter(new FilterGitignore(useGitignore, absolutePath, runningEnvironment));
  }

  addIgnoreFilter(runningEnvironment: IRunningEnvironment, configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterIgnore(runningEnvironment, configurationItems));
  }

  addOnlyFilter(runningEnvironment: IRunningEnvironment, configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterOnly(runningEnvironment, configurationItems));
  }
}
