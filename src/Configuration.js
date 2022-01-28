module.exports = class Configuration {
  constructor(
    useLegacyCharacters = false,
    maximumDeep = null,
    showIndicatorWhenDirectoryIsNotEmpty = false,
    includeGitIgnore = false,
    ignoreFilters = [],
    onlyFilters = [],
  ) {
    this.useLegacyCharacters = useLegacyCharacters;
    this.maximumDeep = maximumDeep;
    this.showIndicatorWhenDirectoryIsNotEmpty = showIndicatorWhenDirectoryIsNotEmpty;
    this.includeGitIgnore = includeGitIgnore;
    this.ignoreFilters = ignoreFilters;
    this.onlyFilters = onlyFilters;
  }
};
