import type IFilter from "../IFilter";

export default class FilterCollection {
  filters: IFilter[];

  constructor(filters: IFilter[] = []) {
    this.filters = filters;
  }

  addFilter(filter: IFilter) {
    this.filters.push(filter);
  }

  matchFilters(path: string, deep: number) {
    return this.filters.every((filter) => filter.matchFilter(path, deep));
  }
}
