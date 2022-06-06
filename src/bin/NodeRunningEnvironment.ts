import { join } from 'path';
import { existsSync, readdirSync, lstatSync, readFileSync } from 'fs';
import { EOL } from 'os';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class NodeRunningEnvironment implements IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string {
    return join(leftPath, rightPath);
  }
  pathExist(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(existsSync(path)));
  }
  getCurrentPath(): Promise<string> {
    return new Promise(resolve => resolve(process.execPath));
  }
  getDirectoryContent(directoryPath: string): Promise<string[]> {
    return new Promise(resolve => resolve(readdirSync(directoryPath)));
  }
  isDirectory(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(lstatSync(path).isDirectory()));
  }
  isFile(path: string): Promise<boolean> {
    return new Promise(resolve => resolve(lstatSync(path).isFile()));
  }
  readTextFile(path: string): Promise<string> {
    return new Promise(resolve => resolve(readFileSync(path, 'utf-8')));
  }
  getEndOfLine(): string {
    return EOL;
  }
}
