const mockFs = require("mock-fs");
const DirectoryParser = require("../DirectoryParser");
const FilterCollection = require("../../filters/FilterCollection");
const FilterIgnore = require("../../filters/FilterIgnore");
const FilterConfigurationItem = require("../../filters/FilterConfigurationItem");

describe("directoryParse > DirectoryParser", () => {
  const emptyFilters = new FilterCollection();
  const [fakeFile1, fakeFile2, fakeFile3] = ["aaFile1.txt", "abFile2.txt", "cdFile3.txt"];
  const [fakeDir1, fakeDir2, fakeDir3] = ["ccDir1.txt", "ddDir2.txt", "ffDir3.txt"];
  beforeEach(() => {
    mockFs.restore();
  });

  afterEach(() => {
    mockFs.restore();
  });

  afterAll(() => {
    mockFs.restore();
  });

  const checkDirectoryNode = (node, name = null, isRoot = null, isFile = null, level = null, childrenCount = null) => {
    if (name !== null) {
      expect(node.name).toBe(name);
    }
    if (isRoot !== null) {
      expect(node.isRoot()).toBe(isRoot);
    }
    if (isFile !== null) {
      if (isFile) {
        expect(node.isFile()).toBeTruthy();
      } else {
        expect(node.isDirectory()).toBeTruthy();
      }
    }
    if (level !== null) {
      expect(node.deep).toBe(level);
    }
    if (childrenCount !== null) {
      expect(node.children.length).toBe(childrenCount);
    }
  };

  test("When only has files should return root with all the files", () => {
    mockFs({
      c: {
        [fakeFile1]: "",
        [fakeFile2]: "",
      },
    });

    const parser = new DirectoryParser("c", emptyFilters);
    const result = parser.parse();

    checkDirectoryNode(result, null, true);
    checkDirectoryNode(result.children[0], fakeFile1, false, true, 1);
    checkDirectoryNode(result.children[1], fakeFile2, false, true, 1);
  });

  test("When we have subdirectories", () => {
    mockFs({
      c: {
        [fakeDir1]: {
          [fakeFile1]: "",
          [fakeFile2]: "",
        },
        [fakeDir2]: {
          [fakeFile3]: "",
        },
        [fakeDir3]: {},
      },
    });

    const parser = new DirectoryParser("c", emptyFilters);
    const result = parser.parse();

    checkDirectoryNode(result, null, true, null, null, 3);
    checkDirectoryNode(result.children[0], fakeDir1, false, false, 1, 2);
    checkDirectoryNode(result.children[1], fakeDir2, false, false, 1, 1);
    checkDirectoryNode(result.children[2], fakeDir3, false, false, 1, 0);
    expect(result.children[2].isLeaf()).toBeTruthy();
    expect(result.children[2].directoryEmpty).toBeTruthy();
    checkDirectoryNode(result.children[0].children[0], fakeFile1, false, true, 2);
    checkDirectoryNode(result.children[0].children[1], fakeFile2, false, true, 2);
    checkDirectoryNode(result.children[1].children[0], fakeFile3, false, true, 2);
  });

  test("When deeper (3) level should nest correctly", () => {
    mockFs({
      c: {
        [fakeDir1]: {
          [fakeFile1]: "",
          [fakeFile2]: "",
          [fakeDir2]: {
            [fakeDir3]: {
              [fakeFile3]: "",
            },
          },
        },
      },
    });

    const parser = new DirectoryParser("c", emptyFilters);
    const result = parser.parse();

    checkDirectoryNode(result, null, true, null, null, 1);
    checkDirectoryNode(result.children[0], fakeDir1, false, false, 1, 3);
    checkDirectoryNode(result.children[0].children[0], fakeDir2, false, false, 2, 1);
    checkDirectoryNode(result.children[0].children[1], fakeFile1, false, true, 2);
    checkDirectoryNode(result.children[0].children[2], fakeFile2, false, true, 2);
    checkDirectoryNode(result.children[0].children[0].children[0], fakeDir3, false, false, 3, 1);
    checkDirectoryNode(result.children[0].children[0].children[0].children[0], fakeFile3, false, true, 4);
  });

  test("When when max level and directory no-empty should mark it as no empty (and still is leaf)", () => {
    mockFs({
      c: {
        [fakeDir1]: {
          [fakeDir2]: {
            [fakeFile1]: "",
          },
        },
      },
    });

    const maxLevel = 2;
    const parser = new DirectoryParser("c", emptyFilters, maxLevel);
    const result = parser.parse();

    checkDirectoryNode(result, null, true, null, null, 1);
    checkDirectoryNode(result.children[0], fakeDir1, false, false, 1, 1);
    checkDirectoryNode(result.children[0].children[0], fakeDir2, false, false, 2, 0);
    const nodeSecondLevelDir = result.children[0].children[0];
    expect(nodeSecondLevelDir.isLeaf()).toBeTruthy();
    expect(nodeSecondLevelDir.isDirectoryEmpty()).toBeFalsy();
  });

  // eslint-disable-next-line max-len
  test("When when max level and directory no-empty but option markNoEmptyDirectories = false should NOT mark it as no empty", () => {
    mockFs({
      c: {
        [fakeDir1]: {
          [fakeDir2]: {
            [fakeFile1]: "",
          },
        },
      },
    });

    const maxLevel = 2;
    const parser = new DirectoryParser("c", emptyFilters, maxLevel, false);
    const result = parser.parse();

    checkDirectoryNode(result, null, true, null, null, 1);
    checkDirectoryNode(result.children[0], fakeDir1, false, false, 1, 1);
    checkDirectoryNode(result.children[0].children[0], fakeDir2, false, false, 2, 0);
    const nodeSecondLevelDir = result.children[0].children[0];
    expect(nodeSecondLevelDir.isLeaf()).toBeTruthy();
    expect(nodeSecondLevelDir.isDirectoryEmpty()).toBeTruthy();
  });

  test("When filters should apply them", () => {
    mockFs({
      c: {
        [fakeDir1]: {
          [fakeDir2]: {
            [fakeFile1]: "",
          },
        },
      },
    });

    const filters = new FilterCollection();
    filters.addFilter(new FilterIgnore([new FilterConfigurationItem("dd")]));
    const parser = new DirectoryParser("c", filters);
    const result = parser.parse();

    checkDirectoryNode(result, null, true, null, null, 1);
    const expectedChildrenCount = 0;
    checkDirectoryNode(result.children[0], fakeDir1, false, false, 1, expectedChildrenCount);
  });
});
