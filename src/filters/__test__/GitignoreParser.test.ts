import * as mockFs from "mock-fs";
import * as os from "os";
import GitignoreParser from "../GitignoreParser";
import NodeRunningEnvironment from "../../bin/NodeRunningEnvironment";
import { mockGitignoreInFileSystem } from "../../__test__/testHelpers";

describe("src > GitignoreParser", () => {
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

  test("Should ignore text files (simple test)", async () => {
    mockFileSystem("*.txt");

    const gitignoreParser = new GitignoreParser(directoryName, runningEnvironment);
    const gitIgnore = await gitignoreParser.getGitignoreFile();

    expect(gitIgnore.accepts("testFile.txt")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.ptx")).toBeTruthy();
  });

  test("Should clean lines ending slash and backslash characters", async () => {
    mockFileSystem(`*.txt/${endOfLine}*.jpg\\${endOfLine}*.png`);

    const gitignoreParser = new GitignoreParser(directoryName, runningEnvironment);
    const gitIgnore = await gitignoreParser.getGitignoreFile();

    expect(gitIgnore.accepts("testFile.txt")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.jpg")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.png")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.bmp")).toBeTruthy();
  });
});
