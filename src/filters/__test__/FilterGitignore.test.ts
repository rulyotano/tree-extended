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
    // mockFs.restore();
  });

  test("When git ignore filter is configured, should filter .git folder", async () => {
    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(await filter.matchFilter(".git")).toBeFalsy();
    expect(await filter.matchFilter(".git/")).toBeFalsy();
    expect(await filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("When git ignore filter ins't configured, should NOT filter .git folder", async () => {
    const filter = new FilterGitignore(false, directoryName, runningEnvironment);

    expect(await filter.matchFilter(".git")).toBeTruthy();
    expect(await filter.matchFilter(".git/")).toBeTruthy();
    expect(await filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("Should apply git ignore filters", async () => {
    mockFileSystem(`*.txt/${endOfLine}*.jpg\\${endOfLine}*.png`);

    const filter = new FilterGitignore(true, directoryName, runningEnvironment);

    expect(await filter.matchFilter("testFile.txt")).toBeFalsy();
    expect(await filter.matchFilter("testFile.jpg")).toBeFalsy();
    expect(await filter.matchFilter("testFile.png")).toBeFalsy();
    expect(await filter.matchFilter("testFile.bmp")).toBeTruthy();
  });
});
