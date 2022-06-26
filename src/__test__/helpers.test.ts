import { getAbsolutePathOrThrow } from '../helpers';
import type IRunningEnvironment from '../IRunningEnvironment';

describe('src > helpers', () => {
  const existingPath = "existing-path";
  const notExistingPath = "not-existing-path";
  const currentPath = "current-path";

  class FakeRunningEnvironment implements IRunningEnvironment {
    pathJoins(leftPath: string, rightPath: string): string {
      return `${leftPath}/${rightPath}`;
    }
    pathExist(path: string): Promise<boolean> {
      return new Promise((resolve) => {
        if (path === existingPath || path === `${currentPath}/${notExistingPath}` ) 
        {
          resolve(true);
        }
        resolve(false);
      });
    }
    getCurrentPath(): Promise<string> {
      return new Promise((resolve) => resolve(currentPath));
    }
    getDirectoryContent(directoryPath: string): Promise<string[]> {
      throw new Error('Method not implemented.');
    }
    isDirectory(path: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    isFile(path: string): Promise<boolean> {
      throw new Error('Method not implemented.');
    }
    readTextFile(path: string): Promise<string> {
      throw new Error('Method not implemented.');
    }
    getEndOfLine(): string {
      throw new Error('Method not implemented.');
    }
  }

  const runningEnvironment = new FakeRunningEnvironment();

  test("when target path exist should return target path", async () => {
    const result = await getAbsolutePathOrThrow(existingPath, runningEnvironment);
    expect(result).toBe(existingPath);
  });

  test("when target is local and doesn't exist should return current path + target path (when exist)", async () => {
    const result = await getAbsolutePathOrThrow(notExistingPath, runningEnvironment);
    expect(result).toBe(`${currentPath}/${notExistingPath}`);
  });

  test("when target doesn't exist and absolute path also doesn't exist should throw error", async () => {
    await expect(getAbsolutePathOrThrow("not-existing", runningEnvironment)).rejects.toThrow();
  });
});
