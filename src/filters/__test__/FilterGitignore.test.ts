import * as os from "os";
import * as mockFs from "mock-fs";
import { mockGitignoreInFileSystem } from "../../__test__/testHelpers";
import FilterGitignore from "../FilterGitignore";
import NodeRunningEnvironment from "../../bin/NodeRunningEnvironment";

describe("filters > FilterGitignore", () => {
  const directoryName = "fake-directory";
  const endOfLine = os.EOL;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mockFileSystem = (config: any) => mockGitignoreInFileSystem(config, directoryName);
  const runningEnvironment = new NodeRunningEnvironment();

  beforeEach(() => {
    mockFs.restore();
  });

  afterEach(() => {
    mockFs.restore();
  });

  afterAll(() => {
    mockFs.restore();
  });

  test("When git ignore filter is configured, should filter .git folder", () => {
    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(filter.matchFilter(".git")).toBeFalsy();
    expect(filter.matchFilter(".git/")).toBeFalsy();
    expect(filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("When git ignore filter ins't configured, should NOT filter .git folder", () => {
    const filter = new FilterGitignore(false, directoryName, runningEnvironment);

    expect(filter.matchFilter(".git")).toBeTruthy();
    expect(filter.matchFilter(".git/")).toBeTruthy();
    expect(filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("Should apply git ignore filters", () => {
    mockFileSystem(`*.txt/${endOfLine}*.jpg\\${endOfLine}*.png`);

    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(filter.matchFilter("testFile.txt")).toBeFalsy();
    expect(filter.matchFilter("testFile.jpg")).toBeFalsy();
    expect(filter.matchFilter("testFile.png")).toBeFalsy();
    expect(filter.matchFilter("testFile.bmp")).toBeTruthy();
  });
});
