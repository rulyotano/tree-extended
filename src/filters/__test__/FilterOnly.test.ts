import FilterOnly from "../FilterOnly";
import FilterConfigurationItem from "../FilterConfigurationItem";
import NodeRunningEnvironment from "../../bin/NodeRunningEnvironment";

describe("filters > FilterOnly", () => {
  const runningEnvironment = new NodeRunningEnvironment();
  test("When global filter should filter no matter level", async () => {
    const filter = new FilterOnly(runningEnvironment, [new FilterConfigurationItem("abc")]);

    expect(await filter.matchFilter("/path/file-abc.txt", 1)).toBeTruthy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-efb.txt", 1)).toBeFalsy();
  });

  test("When specific level filter should filter only in that level", async () => {
    const filter = new FilterOnly(runningEnvironment, [new FilterConfigurationItem("abc", 2)]);

    expect(await filter.matchFilter("/path/file.txt", 0)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-any.txt", 1)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-abc.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-efb.txt", 2)).toBeFalsy();
    expect(await filter.matchFilter("/path/file-efb.txt", 3)).toBeTruthy();
  });

  test("When combining global filters with level specific filters should match both", async () => {
    const filter = new FilterOnly(runningEnvironment, [
      new FilterConfigurationItem("aaa"),
      new FilterConfigurationItem("bbb"),
      new FilterConfigurationItem("ddd", 2)
    ]);

    expect(await filter.matchFilter("ddd.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("ddd.txt", 0)).toBeFalsy();
    expect(await filter.matchFilter("aaa/ddd.txt", 0)).toBeTruthy();
    expect(await filter.matchFilter("bbb/ddd.txt", 0)).toBeTruthy();
  });
});
