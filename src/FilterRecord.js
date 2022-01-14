module.exports = class FilterRecord {
  /** @param {number?} deep - Deep in the tree where this pattern will be executed
   * @param {string} pattern - Pattern or regex to match
   */
  constructor(pattern, deep = null) {
    this.deep = deep;
    this.pattern = pattern;
  }

  /** Returns true if is match */
  isMatch(path, deep = null) {
    if (!this.regex) {
      this.regex = this.pattern instanceof RegExp ? this.pattern : new RegExp(this.pattern);
    }
    if (this.deep !== null && deep !== null && this.deep !== deep) {
      return false;
    }
    return this.regex.test(path);
  }
};
