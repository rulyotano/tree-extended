/* eslint-disable global-require */
const Configuration = require("../../src/Configuration");

describe("bin > index.js", () => {
  const FAKE_RESULT = "fake-result";
  const FAKE_CUSTOM_PATH = "custom-path";
  let consoleLogSpy = null;
  let originalProcessArgv = null;
  let treeExtended = null;
  let helpText = null;
  let FilterConfiguration = null;

  beforeEach(() => {
    jest.resetModules();

    treeExtended = require("../../src/treeExtended");
    FilterConfiguration = require("../../src/filters/FilterConfigurationItem");
    helpText = require("../helpText");

    jest.mock("../../src/treeExtended");

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

    expect(treeExtended).toHaveBeenCalledWith(undefined, new Configuration());
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test("Should receive argument -charset={charset} and pass it to configuration", () => {
    const fakeCharset = "fake-charset";
    setArguments(`-charset=${fakeCharset}`);

    require("../index");

    expect(treeExtended).toHaveBeenCalledWith(undefined, new Configuration(fakeCharset));
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test("when help argument should return help string", () => {
    setArguments("-h");

    require("../index");

    expect(treeExtended).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(helpText);
  });

  test("when all arguments should transform them correctly", () => {
    const fakeCharset = "fake-charset";
    setArguments(
      FAKE_CUSTOM_PATH,
      "-max=4",
      "-max-show-not-empty",
      "-gitignore",
      "-ignore=1:ba, 2:bafile1, c",
      "-only=0:b, 1:bc, 2:bca",
      `-c=${fakeCharset}`,
    );

    require("../index");

    expect(treeExtended).toHaveBeenCalledWith(
      FAKE_CUSTOM_PATH,
      new Configuration(
        fakeCharset,
        4,
        true,
        true,
        [new FilterConfiguration("ba", 1), new FilterConfiguration("bafile1", 2), new FilterConfiguration("c")],
        [new FilterConfiguration("b", 0), new FilterConfiguration("bc", 1), new FilterConfiguration("bca", 2)],
      ),
    );
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });
});
