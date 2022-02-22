module.exports = class Configuration {
  constructor(
    charset = null,
    maximumDeep = null,
    showIndicatorWhenDirectoryIsNotEmpty = false,
    includeGitIgnore = false,
    ignoreFilters = [],
    onlyFilters = [],
  ) {
    this.charset = charset;
    this.maximumDeep = maximumDeep;
    this.showIndicatorWhenDirectoryIsNotEmpty = showIndicatorWhenDirectoryIsNotEmpty;
    this.includeGitIgnore = includeGitIgnore;
    this.ignoreFilters = ignoreFilters;
    this.onlyFilters = onlyFilters;
  }
};
