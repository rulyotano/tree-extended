export default interface IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string;
  pathExist(path: string): Promise<boolean>;
  getCurrentPath(): Promise<string>;
  getDirectoryContent(directoryPath: string): Promise<string[]>;
  isDirectory(path: string): Promise<boolean>;
  isFile(path: string): Promise<boolean>;
  readTextFile(path: string): Promise<string>;
  getEndOfLine(): string;
}
