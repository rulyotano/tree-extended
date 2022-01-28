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
      const children = [DirectoryNode.createDirectory()];
      const directoryEmpty = false;
      const directoryNode = new DirectoryNode(
        fakeDirectoryName,
        expectedDeep,
        directoryNodeTypes.DIRECTORY_TYPE,
        children,
        directoryEmpty,
      );

      expect(directoryNode.name).toBe(fakeDirectoryName);
      expect(directoryNode.deep).toBe(expectedDeep);
      expect(directoryNode.kind).toBe(directoryNodeTypes.DIRECTORY_TYPE);
      expect(directoryNode.children).toBe(children);
      expect(directoryNode.directoryEmpty).toBe(directoryEmpty);
      expect(directoryNode.directoryIndex).toBe(DirectoryNode.ROOT_DIRECTORY_INDEX);
      expect(directoryNode.childrenIndexes).toBeFalsy();
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

    test("Should reset children indexes after adding", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      directoryNode.childrenIndexes = [{ [DirectoryNode.createFile()]: 0 }];

      directoryNode.addChildren([new DirectoryNode(fakeFileName)]);

      expect(directoryNode.childrenIndexes).toBeFalsy();
    });
  });

  describe("isLeaf()", () => {
    test("When have no children isLeaf should be true", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      expect(directoryNode.isLeaf()).toBeTruthy();
    });

    test("When any children isLeaf should be false", () => {
      const directoryNode = new DirectoryNode(
        fakeDirectoryName,
        0,
        directoryNodeTypes.DIRECTORY_TYPE,
        [new DirectoryNode(fakeFileName)],
      );
      expect(directoryNode.isLeaf()).toBeFalsy();
    });
  });

  describe("markDirectoryAsNoEmpty()", () => {
    test("Should mark node as no empty", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      expect(directoryNode.directoryEmpty).toBeTruthy();
      directoryNode.markDirectoryAsNoEmpty();
      expect(directoryNode.directoryEmpty).toBeFalsy();
    });
  });

  describe("isRoot()", () => {
    test("Should be root by default", () => {
      const directoryNode = new DirectoryNode();
      expect(directoryNode.isRoot()).toBeTruthy();
    });

    test("When have a custom name isn't root", () => {
      const directoryNode = new DirectoryNode(fakeDirectoryName);
      expect(directoryNode.isRoot()).toBeFalsy();
    });
  });

  describe("createDirectory()", () => {
    test("Should create new directory node", () => {
      const directoryNode = DirectoryNode.createDirectory(fakeDirectoryName, 2);
      expect(directoryNode.name).toBe(fakeDirectoryName);
      expect(directoryNode.deep).toBe(2);
      expect(directoryNode.kind).toBe(directoryNodeTypes.DIRECTORY_TYPE);
    });
  });

  describe("createFile()", () => {
    test("Should create new file node", () => {
      const directoryNode = DirectoryNode.createFile(fakeDirectoryName, 2);
      expect(directoryNode.name).toBe(fakeDirectoryName);
      expect(directoryNode.deep).toBe(2);
      expect(directoryNode.kind).toBe(directoryNodeTypes.FILE_TYPE);
    });
  });

  describe("isDirectoryEmpty()", () => {
    test("Should return the same than directoryEmpty field", () => {
      const directoryNode = DirectoryNode.createDirectory();
      expect(directoryNode.isDirectoryEmpty()).toBeTruthy();
      directoryNode.markDirectoryAsNoEmpty();
      expect(directoryNode.isDirectoryEmpty()).toBeFalsy();
    });
  });

  describe("isLeafNotEmpty()", () => {
    test("When isLeaf() and isDirectoryEmpty() should be false", () => {
      const directoryNode = DirectoryNode.createDirectory();
      expect(directoryNode.isLeafNotEmpty()).toBeFalsy();
    });
    test("When isLeaf() and isDirectoryEmpty() is false should be true", () => {
      const directoryNode = DirectoryNode.createDirectory();
      directoryNode.markDirectoryAsNoEmpty();
      expect(directoryNode.isLeafNotEmpty()).toBeTruthy();
    });
    test("When isLeaf() is false and isDirectoryEmpty() [this case is edge - error] should be false", () => {
      const directoryNode = DirectoryNode.createDirectory();
      directoryNode.addChildren([DirectoryNode.createFile()]);
      directoryNode.markDirectoryAsNoEmpty();
      expect(directoryNode.isLeafNotEmpty()).toBeFalsy();
    });
  });

  describe("isLastChild()", () => {
    test("Is last child should work correctly", () => {
      const root = new DirectoryNode();
      const dir1 = DirectoryNode.createDirectory("dir1");
      const dir2 = DirectoryNode.createDirectory("dir2");
      const file3 = DirectoryNode.createDirectory("file1");

      root.addChildren([dir1, dir2, file3]);
      expect(root.isLastChild(dir1)).toBeFalsy();
      expect(root.isLastChild(dir2)).toBeFalsy();
      expect(root.isLastChild(file3)).toBeTruthy();
    });
  });
});
