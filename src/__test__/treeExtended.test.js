import mockFs from "mock-fs";
import treeExtended from "../treeExtended";
import testCases from "./testCases";

describe("tree-extended.js", () => {
  beforeEach(() => {
    mockFs.restore();
  });

  afterEach(() => {
    mockFs.restore();
  });

  afterAll(() => {
    mockFs.restore();
  });

  const runTestCase = (testCase) => test(`Test Case Description: ${testCase.description}`, () => {
    mockFs(testCase.directories);

    const {
      targetPath,
      configuration,
    } = testCase.arguments;

    const result = treeExtended(targetPath, configuration);

    // console.warn(result)
    expect(result).toEqual(testCase.expected);
  });

  testCases.cases.map((testCase) => runTestCase(testCase));
});
