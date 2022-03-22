export const EMPTY_DEEP = -1;

export default class FilterConfigurationItem {
  deep: number;
  pattern: string;
  regex: RegExp;

  constructor(pattern: string, deep: number = EMPTY_DEEP) {
    this.deep = deep;
    this.pattern = pattern;
    this.regex = FilterConfigurationItem.getRegexFromPatter(pattern);
  }

  isMatch(path: string, testDeep: number = EMPTY_DEEP) {
    if (FilterConfigurationItem.deepsAreDifferentAndNotEmpty(this.deep, testDeep)) {
      return false;
    }
    return this.regex.test(path);
  }

  static getRegexFromPatter(pattern: string | RegExp): RegExp {
    return pattern instanceof RegExp ? pattern : new RegExp(pattern);
  }

  static deepsAreDifferentAndNotEmpty(currentDeep: number, testDeep: number): boolean {
    return currentDeep !== EMPTY_DEEP && testDeep !== EMPTY_DEEP && currentDeep !== testDeep;
  }
}
