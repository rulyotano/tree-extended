import { join } from 'path';
import { existsSync, readdirSync, lstatSync, readFileSync } from 'fs';
import { EOL } from 'os';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class NodeRunningEnvironment implements IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string {
    return join(leftPath, rightPath);
  }
  pathExist(path: string): boolean {
    return existsSync(path);
  }
  getCurrentPath(): string {
    return process.execPath;
  }
  getDirectoryContent(directoryPath: string): string[] {
    return readdirSync(directoryPath);
  }
  isDirectory(path: string): boolean {
    return lstatSync(path).isDirectory();
  }
  isFile(path: string): boolean {
    return lstatSync(path).isFile();
  }
  readTextFile(path: string): string {
    return readFileSync(path, 'utf-8');
  }
  getEndOfLine(): string {
    return EOL;
  }
}
