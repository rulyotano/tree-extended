import FilterOnly from "../FilterOnly";
import FilterConfigurationItem from "../FilterConfigurationItem";

describe("filters > FilterOnly", () => {
  test("When global filter should filter no matter level", async () => {
    const filter = new FilterOnly([new FilterConfigurationItem("abc")]);

    expect(await filter.matchFilter("/path/file-abc.txt", 1)).toBeTruthy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-efb.txt", 1)).toBeFalsy();
  });

  test("When specific level filter should filter only in that level", async () => {
    const filter = new FilterOnly([new FilterConfigurationItem("abc", 2)]);

    expect(await filter.matchFilter("/path/file.txt", 0)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-any.txt", 1)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-abc.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-efb.txt", 2)).toBeFalsy();
    expect(await filter.matchFilter("/path/file-efb.txt", 3)).toBeTruthy();
  });
});
