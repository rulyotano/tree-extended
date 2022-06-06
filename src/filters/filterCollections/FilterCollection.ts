import type IFilter from "../IFilter";

export default class FilterCollection {
  filters: IFilter[];

  constructor(filters: IFilter[] = []) {
    this.filters = filters;
  }

  addFilter(filter: IFilter) {
    this.filters.push(filter);
  }

  async matchFilters(path: string, deep: number) {
    const filterPromises = this.filters.map((filter) => filter.matchFilter(path, deep));
    const filterResults = await Promise.all(filterPromises);
    return filterResults.every(filterResult => filterResult);
  }
}
