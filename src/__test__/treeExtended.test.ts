import * as mockFs from "mock-fs";
import treeExtended from "../treeExtended";
import testCases, { type IDirectory, type ITestCase } from "./testCases";

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

  const runTestCase = (testCase: ITestCase) => test(`Test Case Description: ${testCase.description}`, () => {
    mockFs(testCase.directories);

    const {
      targetPath,
      configuration,
    } = testCase.arguments;

    const result = treeExtended(targetPath, configuration);

    expect(result).toEqual(testCase.expected);
  });

  testCases.cases.map((testCase: ITestCase) => runTestCase(testCase));
});
