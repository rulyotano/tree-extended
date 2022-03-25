export default interface IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string;
  pathExist(path: string): boolean;
  getCurrentPath(): string;
  getDirectoryContent(directoryPath: string): string[];
  isDirectory(path: string): boolean;
  isFile(path: string): boolean;
  readTextFile(path: string): string;
  getEndOfLine(): string;
}
