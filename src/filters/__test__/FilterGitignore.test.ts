import * as os from 'os';
import * as mockFs from 'mock-fs';
import { mockGitignoreInFileSystem } from '../../__test__/testHelpers';
import FilterGitignore from '../FilterGitignore';
import NodeRunningEnvironment from '../../bin/NodeRunningEnvironment';

describe('filters > FilterGitignore', () => {
  const directoryName = 'fake-directory';
  const directoryNameAbsolute = '/usr/fake-directory';
  const directoryNameAbsoluteWindows = 'c:\\usr\\fake-directory';
  const endOfLine = os.EOL;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFileSystem = (config: any, directory = directoryName) =>
    mockGitignoreInFileSystem(config, directory);
  const runningEnvironment = new NodeRunningEnvironment();

  beforeEach(() => {
    mockFs.restore();
  });

  afterEach(() => {
    mockFs.restore();
  });

  afterAll(() => {
    // mockFs.restore();
  });

  test('When git ignore filter is configured, should filter .git folder', async () => {
    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(await filter.matchFilter('.git')).toBeFalsy();
    expect(await filter.matchFilter('.git/')).toBeFalsy();
    expect(await filter.matchFilter('other/fake-file')).toBeTruthy();
  });

  test("When git ignore filter ins't configured, should NOT filter .git folder", async () => {
    const filter = new FilterGitignore(false, directoryName, runningEnvironment);

    expect(await filter.matchFilter('.git')).toBeTruthy();
    expect(await filter.matchFilter('.git/')).toBeTruthy();
    expect(await filter.matchFilter('other/fake-file')).toBeTruthy();
  });

  test('Should apply git ignore filters', async () => {
    mockFileSystem(`*.txt${endOfLine}*.jpg${endOfLine}*.png`);

    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(await filter.matchFilter('testFile.txt')).toBeFalsy();
    expect(await filter.matchFilter('testFile.jpg')).toBeFalsy();
    expect(await filter.matchFilter('testFile.png')).toBeFalsy();
    expect(await filter.matchFilter('testFile.bmp')).toBeTruthy();
  });

  test('When absolute path, should also match git ignore expressions', async () => {
    mockFileSystem(`/node_modules${endOfLine}directoryA/${endOfLine}*.png`, directoryNameAbsolute);

    const filter = new FilterGitignore(true, directoryNameAbsolute, runningEnvironment);

    expect(await filter.matchFilter(`${directoryNameAbsolute}/node_modules`)).toBeFalsy();
    expect(await filter.matchFilter(`${directoryNameAbsolute}/node_modules/`)).toBeFalsy();
    expect(await filter.matchFilter(`${directoryNameAbsolute}/directoryA/test.txt`)).toBeFalsy();
    expect(await filter.matchFilter(`${directoryNameAbsolute}/nested/node_modules`)).toBeTruthy();
  });

  test('When windows absolute path, should also match git ignore expressions', async () => {
    mockFileSystem('/node_modules', directoryNameAbsoluteWindows);

    const filter = new FilterGitignore(true, directoryNameAbsoluteWindows, runningEnvironment);

    expect(await filter.matchFilter(`${directoryNameAbsoluteWindows}\\node_modules`)).toBeFalsy();
    expect(await filter.matchFilter(`${directoryNameAbsoluteWindows}\\node_modules\\`)).toBeFalsy();
    expect(await filter.matchFilter(`${directoryNameAbsoluteWindows}\\nested\\node_modules`)).toBeTruthy();
  });
});
