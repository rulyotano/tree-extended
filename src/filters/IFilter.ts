export default interface IFilter {
  matchFilter(path: string, deep: number): Promise<boolean>;
}
