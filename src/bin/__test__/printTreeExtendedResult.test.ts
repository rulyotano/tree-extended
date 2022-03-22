/* eslint-disable global-require */
import Configuration from "../../Configuration";
import FilterConfiguration from "../../filters/FilterConfigurationItem";
import helpText from "../helpText";
import treeExtended from "../../treeExtended";
import printTreeExtendedResult from "../printTreeExtendedResult";

jest.mock("../../treeExtended");
const mockTreeExtended = treeExtended as jest.MockedFunction<typeof treeExtended>;

describe("bin > index.js", () => {
  const FAKE_RESULT = "fake-result";
  const FAKE_CUSTOM_PATH = "custom-path";
  let consoleLogSpy: jest.SpyInstance = null;

  beforeEach(() => {
    jest.resetModules();

    mockTreeExtended.mockClear();
    mockTreeExtended.mockReturnValue(FAKE_RESULT);
    consoleLogSpy = jest.spyOn(console, "log");
  });

  test("Default call should call treeExtended with default arguments", () => {
    printTreeExtendedResult();

    expect(treeExtended).toHaveBeenCalledWith(undefined, new Configuration());
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test("Should receive argument -charset={charset} and pass it to configuration", () => {
    const fakeCharset = "fake-charset";
    printTreeExtendedResult([`-charset=${fakeCharset}`]);

    expect(treeExtended).toHaveBeenCalledWith(undefined, new Configuration(fakeCharset));
    expect(consoleLogSpy).toHaveBeenCalledWith(FAKE_RESULT);
  });

  test("when help argument should return help string", () => {
    printTreeExtendedResult(["-h"]);

    expect(treeExtended).not.toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith(helpText);
  });

  test("when all arguments should transform them correctly", () => {
    const fakeCharset = "fake-charset";
    printTreeExtendedResult([
      FAKE_CUSTOM_PATH,
      "-max=4",
      "-max-show-not-empty",
      "-gitignore",
      "-ignore=1:ba, 2:bafile1, c",
      "-only=0:b, 1:bc, 2:bca",
      `-c=${fakeCharset}`,
    ]);

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