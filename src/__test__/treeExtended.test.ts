import * as mockFs from 'mock-fs';
import TreeExtended from '../treeExtended';
import NodeRunningEnvironment from '../bin/NodeRunningEnvironment';
import testCases, { type ITestCase } from './testCases';

describe('tree-extended.js', () => {
  beforeEach(() => {
    mockFs.restore();
  });

  afterEach(() => {
    mockFs.restore();
  });

  afterAll(() => {
    mockFs.restore();
  });

  const runTestCase = (testCase: ITestCase) =>
    test(`Test Case Description: ${testCase.description}`, async () => {
      mockFs(testCase.directories);

      const { targetPath, configuration } = testCase.arguments;

      const result = await new TreeExtended(new NodeRunningEnvironment()).getDirectoryTree(
        targetPath,
        configuration
      );

      expect(result).toEqual(testCase.expected);
    });

  testCases.cases.map((testCase: ITestCase) => runTestCase(testCase));
});
