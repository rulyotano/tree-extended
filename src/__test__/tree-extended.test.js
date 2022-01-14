const mockFs = require("mock-fs");
const treeExtended = require("../tree-extended");
const testCases = require("./testCases");

describe("tree-extended.js", () => {
  beforeEach(() => {});

  afterEach(() => {
    mockFs.restore();
  });

  const runTestCase = (testCase) => test(`Test Case Description: ${testCase.description}`, () => {
    mockFs(testCase.directories);

    const {
      targetPath,
      ascii,
      maxLevel,
      showNotEmpty,
      gitignore,
      ignores,
      only,
    } = testCase.arguments;

    const result = treeExtended(
      targetPath,
      ascii,
      maxLevel,
      showNotEmpty,
      gitignore,
      ignores,
      only,
    );

    // console.warn(result)
    expect(result).toEqual(testCase.expected);
  });

  testCases.cases.map((testCase) => runTestCase(testCase));
});
