export default class FilterCollection {
  constructor(filters = []) {
    this.filters = filters;
  }

  addFilter(filter) {
    this.filters.push(filter);
  }

  matchFilters(path, deep) {
    return this.filters.every((filter) => filter.matchFilter(path, deep));
  }
}
