/* eslint-disable global-require */
describe("bin > index.js", () => {
  const FAKE_RESULT = "fake-result";
  const FAKE_CUSTOM_PATH = "custom-path";
  let consoleLogSpy = null;
  let originalProcessArgv = null;
  let treeExtended = null;
  let helpText = null;
  let FilterRecord = null;

  beforeEach(() => {
    jest.resetModules();

    treeExtended = require("../../src/tree-extended");
    FilterRecord = require("../../src/FilterRecord");
    helpText = require("../helpText");

    jest.mock("../../src/tree-extended");

    originalProcessArgv = process.argv;
    treeExtended.mockReturnValue(FAKE_RESULT);
    consoleLogSpy = jest.spyOn(console, "log");
    process.argv = [];
  });

  afterEach(() => {
    process.argv = originalProcessArgv;
  });

  const setArguments = (...customArguments) => {
    process.argv = [process.argv[0], process.argv[1], ...customArguments];
  };

  test("Default call should call treeExtended with default arguments", () => {
    require("../index");

    expect(treeExtended).toHaveBeenCalledWith(undefined, false, null, false, false, [], []);
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test("when help argument should return help string", () => {
    setArguments("-h");

    require("../index");

    expect(treeExtended).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(helpText);
  });

  test("when all arguments should transform them correctly", () => {
    setArguments(
      FAKE_CUSTOM_PATH,
      "-max=4",
      "-max-show-not-empty",
      "-ascii",
      "-gitignore",
      "-ignore=1:ba, 2:bafile1, c",
      "-only=0:b, 1:bc, 2:bca",
    );

    require("../index");

    expect(treeExtended).toHaveBeenCalledWith(
      FAKE_CUSTOM_PATH,
      true,
      4,
      true,
      true,
      [new FilterRecord("ba", 1), new FilterRecord("bafile1", 2), new FilterRecord("c")],
      [new FilterRecord("b", 0), new FilterRecord("bc", 1), new FilterRecord("bca", 2)],
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });
});
