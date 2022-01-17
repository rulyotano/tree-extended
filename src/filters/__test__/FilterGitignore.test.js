const os = require("os");
const { mockGitignoreInFileSystem } = require("../../__test__/testHelpers");
const FilterGitignore = require("../FilterGitignore");

describe("filters > FilterGitignore", () => {
  const directoryName = "fake-directory";
  const endOfLine = os.EOL;
  const mockFileSystem = (config) => mockGitignoreInFileSystem(config, directoryName);
  beforeEach(() => {});

  afterEach(() => {});

  test("When git ignore filter is configured, should filter .git folder", () => {
    const filter = new FilterGitignore(true, directoryName);

    expect(filter.matchFilter(".git")).toBeFalsy();
    expect(filter.matchFilter(".git/")).toBeFalsy();
    expect(filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("When git ignore filter ins't configured, should NOT filter .git folder", () => {
    const filter = new FilterGitignore(false, directoryName);

    expect(filter.matchFilter(".git")).toBeTruthy();
    expect(filter.matchFilter(".git/")).toBeTruthy();
    expect(filter.matchFilter("other/fake-file")).toBeTruthy();
  });

  test("Should apply git ignore filters", () => {
    mockFileSystem(`*.txt/${endOfLine}*.jpg\\${endOfLine}*.png`, directoryName);

    const filter = new FilterGitignore(true, directoryName);

    expect(filter.matchFilter("testFile.txt")).toBeFalsy();
    expect(filter.matchFilter("testFile.jpg")).toBeFalsy();
    expect(filter.matchFilter("testFile.png")).toBeFalsy();
    expect(filter.matchFilter("testFile.bmp")).toBeTruthy();
  });
});
