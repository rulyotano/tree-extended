const FilterIgnore = require("../FilterIgnore");
const FilterConfigurationItem = require("../FilterConfigurationItem");

describe("filters > FilterIgnore", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("When global filter should filter no matter level", () => {
    const filter = new FilterIgnore([new FilterConfigurationItem("abc")]);

    expect(filter.matchFilter("/path/file-abc.txt", 1)).toBeFalsy();
    expect(filter.matchFilter("/path/second/abc-def.txt", 2)).toBeFalsy();
    expect(filter.matchFilter("/path/file-efb.txt", 1)).toBeTruthy();
  });

  test("When specific level filter should filter only in that level", () => {
    const filter = new FilterIgnore([new FilterConfigurationItem("abc", 2)]);

    expect(filter.matchFilter("/path/file.txt", 0)).toBeTruthy();
    expect(filter.matchFilter("/path/file-any.txt", 1)).toBeTruthy();
    expect(filter.matchFilter("/path/file-abc.txt", 2)).toBeFalsy();
    expect(filter.matchFilter("/path/second/abc-def.txt", 2)).toBeFalsy();
    expect(filter.matchFilter("/path/file-efb.txt", 2)).toBeTruthy();
    expect(filter.matchFilter("/path/file-efb.txt", 3)).toBeTruthy();
  });
});
