const GitignoreParser = require('../GitignoreParser');
const mockFs = require("mock-fs");
const os = require('os');

describe('src > GitignoreParser', () => {
  const directoryName = "fake-directory";
  const endOfLine = os.EOL;
  
  afterEach(() => {
    mockFs.restore();
  });

  test("Should ignore text files (simple test)", () => {
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

  const mockFileSystem = (gitignoreContent) => {
    mockFs({
      [directoryName]: {
        ".gitignore": gitignoreContent
      }
    });
  }
});
