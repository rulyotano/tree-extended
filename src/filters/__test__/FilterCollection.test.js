const FilterConfigurationItem = require("../FilterConfigurationItem");
const FilterCollection = require("../FilterCollection");
const FilterOnly = require("../FilterOnly");
const FilterIgnore = require("../FilterIgnore");

describe("filters > FilterCollection", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("Should add filters correctly", () => {
    const collection = new FilterCollection();
    collection.addFilter(new FilterOnly([new FilterConfigurationItem("es", 2)]));
    collection.addFilter(new FilterIgnore([new FilterConfigurationItem("abc", 1)]));

    expect(collection.matchFilters("test.txt", 2)).toBeTruthy();
    expect(collection.matchFilters("tee.txt", 2)).toBeFalsy();
    expect(collection.matchFilters("tee.txt", 2)).toBeFalsy();
    expect(collection.matchFilters("tee.txt", 1)).toBeTruthy();
    expect(collection.matchFilters("abcd.txt", 1)).toBeFalsy();
  });
});
