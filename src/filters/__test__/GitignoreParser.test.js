/* eslint-disable no-use-before-define */
const mockFs = require("mock-fs");
const os = require("os");
const GitignoreParser = require("../GitignoreParser");
const { mockGitignoreInFileSystem } = require("../../__test__/testHelpers");

describe("src > GitignoreParser", () => {
  const directoryName = "fake-directory";
  const endOfLine = os.EOL;
  const mockFileSystem = (config) => mockGitignoreInFileSystem(config, directoryName);

  beforeEach(() => {
    mockFs.restore();
  });

  test("Should ignore text files (simple test)", () => {
    // eslint-disable-next-line no-use-before-define
    mockFileSystem("*.txt");

    const gitignoreParser = new GitignoreParser(directoryName);
    const gitIgnore = gitignoreParser.getGitignoreFile();

    expect(gitIgnore.accepts("testFile.txt")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.ptx")).toBeTruthy();
  });

  test("Should clean lines ending slash and backslash characters", () => {
    mockFileSystem(`*.txt/${endOfLine}*.jpg\\${endOfLine}*.png`);

    const gitignoreParser = new GitignoreParser(directoryName);
    const gitIgnore = gitignoreParser.getGitignoreFile();

    expect(gitIgnore.accepts("testFile.txt")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.jpg")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.png")).toBeFalsy();
    expect(gitIgnore.accepts("testFile.bmp")).toBeTruthy();
  });
});
