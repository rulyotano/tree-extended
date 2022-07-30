import FilterIgnore from "../FilterIgnore";
import FilterConfigurationItem from "../FilterConfigurationItem";
import NodeRunningEnvironment from "../../bin/NodeRunningEnvironment";

describe("filters > FilterIgnore", () => {
  const runningEnvironment = new NodeRunningEnvironment();
  test("When global filter should filter no matter level", async () => {
    const filter = new FilterIgnore(runningEnvironment, [new FilterConfigurationItem("abc")]);

    expect(await filter.matchFilter("/path/file-abc.txt", 1)).toBeFalsy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeFalsy();
    expect(await filter.matchFilter("/path/file-efb.txt", 1)).toBeTruthy();
  });

  test("When specific level filter should filter only in that level", async () => {
    const filter = new FilterIgnore(runningEnvironment, [new FilterConfigurationItem("abc", 2)]);

    expect(await filter.matchFilter("/path/file.txt", 0)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-any.txt", 1)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-abc.txt", 2)).toBeFalsy();
    expect(await filter.matchFilter("/path/second/abc-def.txt", 2)).toBeFalsy();
    expect(await filter.matchFilter("/path/file-efb.txt", 2)).toBeTruthy();
    expect(await filter.matchFilter("/path/file-efb.txt", 3)).toBeTruthy();
  });
});
