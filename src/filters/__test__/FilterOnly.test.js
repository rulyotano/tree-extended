const FilterOnly = require("../FilterOnly");
const FilterConfiguration = require("../FilterConfiguration");

describe("filters > FilterOnly", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("When global filter should filter no matter level", () => {
    const filterConfigurations = { [null]: [new FilterConfiguration("abc")] };
    const filter = new FilterOnly(filterConfigurations);

    expect(filter.matchFilter("/path/file-abc.txt", 1)).toBeTruthy();
    expect(filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(filter.matchFilter("/path/file-efb.txt", 1)).toBeFalsy();
  });

  test("When specific level filter should filter only in that level", () => {
    const filterConfigurations = { 2: [new FilterConfiguration("abc")] };
    const filter = new FilterOnly(filterConfigurations);

    expect(filter.matchFilter("/path/file.txt", 0)).toBeTruthy();
    expect(filter.matchFilter("/path/file-any.txt", 1)).toBeTruthy();
    expect(filter.matchFilter("/path/file-abc.txt", 2)).toBeTruthy();
    expect(filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(filter.matchFilter("/path/file-efb.txt", 2)).toBeFalsy();
    expect(filter.matchFilter("/path/file-efb.txt", 3)).toBeTruthy();
  });
});
