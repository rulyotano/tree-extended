module.exports = class FilterConfiguration {
  /** @param {number?} deep - Deep in the tree where this pattern will be executed
   * @param {string} pattern - Pattern or regex to match
   */
  constructor(pattern, deep = null) {
    this.deep = deep;
    this.pattern = pattern;
    this.regex = FilterConfiguration.getRegexFromPatter(pattern);
  }

  /** Returns true if is match */
  isMatch(path, testDeep = null) {
    if (FilterConfiguration.deepsAreDifferentAndNotEmpty(testDeep)) {
      return false;
    }
    return this.regex.test(path);
  }

  static getRegexFromPatter(pattern) {
    return pattern instanceof RegExp ? pattern : new RegExp(pattern);
  }

  static deepsAreDifferentAndNotEmpty(currentDeep, testDeep) {
    return currentDeep !== null && testDeep !== null && currentDeep !== testDeep;
  }
};
