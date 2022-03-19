import FilterConfigurationItem from '../FilterConfigurationItem';
import FilterCollection from './FilterCollection';
import FilterGitignore from '../FilterGitignore';
import FilterIgnore from '../FilterIgnore';
import FilterOnly from '../FilterOnly';

export default class CustomFilterCollection extends FilterCollection {
  constructor(
    ignoreItems: FilterConfigurationItem[] = [],
    onlyItems: FilterConfigurationItem[] = [],
    useGitignore = false,
    absolutePath = ''
  ) {
    super();
    this.addIgnoreFilter(ignoreItems);
    this.addOnlyFilter(onlyItems);
    this.addGitignoreFilter(useGitignore, absolutePath);
  }

  addGitignoreFilter(useGitignore = false, absolutePath = '') {
    this.addFilter(new FilterGitignore(useGitignore, absolutePath));
  }

  addIgnoreFilter(configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterIgnore(configurationItems));
  }

  addOnlyFilter(configurationItems: FilterConfigurationItem[] = []) {
    this.addFilter(new FilterOnly(configurationItems));
  }
}
