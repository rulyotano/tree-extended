import { join } from 'path';
import { access, constants, readdirSync, lstatSync, readFileSync } from 'fs';
import { EOL } from 'os';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class NodeRunningEnvironment implements IRunningEnvironment {
  pathJoins(leftPath: string, rightPath: string): string {
    return join(leftPath, rightPath);
  }
  async pathExist(path: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      access(path, constants.F_OK, err => {
        resolve(err == null);
      });
    });
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
