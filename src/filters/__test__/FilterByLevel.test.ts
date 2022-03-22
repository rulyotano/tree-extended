import type FilterByLevel from "../FilterByLevel";
import FilterOnly from "../FilterOnly";
import FilterConfigurationItem from "../FilterConfigurationItem";

describe("filters > FilterByLevel", () => {
  beforeEach(() => {});

  afterEach(() => {});

  test("Should create filter FilterByLevel by level", () => {
    const [key1, key2, key3] = ["es", "abc", "cde"];
    const filterItems = [
      new FilterConfigurationItem(key1, 2),
      new FilterConfigurationItem(key2, 1),
      new FilterConfigurationItem(key3, 1),
    ];
    const filterByLevel: FilterByLevel = new FilterOnly(filterItems);

    expect(Object.keys(filterByLevel.configurationByLevel)).toHaveLength(2);
    expect(filterByLevel.configurationByLevel[2][0].pattern).toBe(key1);
    expect(filterByLevel.configurationByLevel[1][0].pattern).toBe(key2);
    expect(filterByLevel.configurationByLevel[1][1].pattern).toBe(key3);
  });
});
