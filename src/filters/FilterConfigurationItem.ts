export const EMPTY_DEEP = -1;

export default class FilterConfigurationItem {
  deep: number;
  pattern: string;
  regex: RegExp;

  constructor(pattern: string, deep: number = EMPTY_DEEP) {
    this.deep = deep;
    this.pattern = pattern;
    this.regex = FilterConfigurationItem.getRegexFromPattern(pattern);
  }

  isMatch(path: string, testDeep: number = EMPTY_DEEP) {
    if (FilterConfigurationItem.deepsAreDifferentAndNotEmpty(this.deep, testDeep)) {
      return false;
    }
    return this.regex.test(path);
  }

  isValid(){
    return this.pattern !== null && this.pattern !== undefined && !isNaN(this.deep);
  }

  isEmpty(){
    return this.pattern === '';
  } 

  static getRegexFromPattern(pattern: string | RegExp): RegExp {
    return pattern instanceof RegExp ? pattern : new RegExp(pattern);
  }

  static deepsAreDifferentAndNotEmpty(currentDeep: number, testDeep: number): boolean {
    return currentDeep !== EMPTY_DEEP && testDeep !== EMPTY_DEEP && currentDeep !== testDeep;
  }

  static parse(argItem: string): FilterConfigurationItem {
    const itemArray = argItem.trim().split(':');
    let result: FilterConfigurationItem = null;
    if (itemArray.length === 1) 
      result = new FilterConfigurationItem(itemArray[0]);
    if (itemArray.length === 2)
      result = new FilterConfigurationItem(itemArray[1], Number(itemArray[0]));
    if (result !== null && (!result.isValid() || result.isEmpty()))
      return null;
    return result;
  }

  static parseArray(arg: string): FilterConfigurationItem[] {
    return arg
      .split(',')
      .map(FilterConfigurationItem.parse)
      .filter(filterItem => filterItem !== null);
  }
}
