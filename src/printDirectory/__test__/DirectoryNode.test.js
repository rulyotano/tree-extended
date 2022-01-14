const DirectoryNode = require("../DirectoryNode");
const directoryNodeTypes = require("../DirectoryNodeTypes");

describe("printDirectory > DirectoryNode", () => {
  const fakeDirectoryName = "test-directory";
  const fakeFileName = "test-file.txt";
  const secondFakeFileName = "test-file-2.txt";

  beforeEach(() => {});

  afterEach(() => {});

  describe("ctor()", () => {
    test("Should initialize correctly", () => {
      const expectedDeep = 2;
      const directoryNode = new DirectoryNode(fakeDirectoryName, expectedDeep, directoryNodeTypes.DIRECTORY_TYPE);

      expect(directoryNode.name).toBe(fakeDirectoryName);
      expect(directoryNode.deep).toBe(expectedDeep);
      expect(directoryNode.kind).toBe(directoryNodeTypes.DIRECTORY_TYPE);
      expect(directoryNode.children).toHaveLength(0);
    });
  });

  describe("addChildren()", () => {
    test("Should add children correctly", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      directoryNode.addChildren([new DirectoryNode(fakeFileName)]);

      expect(directoryNode.children.length).toBe(1);
    });

    test("When already has children should append", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      directoryNode.addChildren([new DirectoryNode(fakeFileName)]);
      directoryNode.addChildren([new DirectoryNode(secondFakeFileName)]);

      expect(directoryNode.children.length).toBe(2);
      const [child1, child2] = directoryNode.children;
      expect(child1.name).toBe(fakeFileName);
      expect(child2.name).toBe(secondFakeFileName);
    });
  });

  describe("isLeaf()", () => {
    test("When have no children isLeaf should be true", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      expect(directoryNode.isLeaf()).toBeTruthy();
    });

    test("When any children isLeaf should be false", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      directoryNode.addChildren([new DirectoryNode(fakeFileName)]);
      expect(directoryNode.isLeaf()).toBeFalsy();
    });
  });
});
