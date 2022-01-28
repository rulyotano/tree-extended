const DirectoryWriter = require("../DirectoryWriter");
const TextDirectoryRepresentation = require("../representation/TextDirectoryRepresentation");
const charsetAscii = require("../charset/ascii");
const charsetUtf8 = require("../charset/utf8");
const DirectoryNode = require("../../directoryParse/DirectoryNode");

describe("directoryWriter > DirectoryWriter", () => {
  let directoryWriter = null;

  beforeEach(() => {
    directoryWriter = new DirectoryWriter(new TextDirectoryRepresentation(charsetAscii));
  });

  describe("Should return correct text:", () => {
    test("Simple files only", () => {
      const expected = `+---file1.txt
\\---file2.txt
`;
      const root = new DirectoryNode();
      root.addChildren([
        DirectoryNode.createFile("file1.txt"),
        DirectoryNode.createFile("file2.txt"),
      ]);
      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });

    test("Empty directories only", () => {
      const expected = `+---dir1/
+---dir2/
\\---dir3/
`;
      const root = new DirectoryNode();
      root.addChildren([
        DirectoryNode.createDirectory("dir1"),
        DirectoryNode.createDirectory("dir2"),
        DirectoryNode.createDirectory("dir3"),
      ]);
      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });

    test("One level directories and files", () => {
      const expected = `+---dir1/
+---dir2/
+---dir3/
+---file1.txt
\\---file2.txt
`;
      const root = new DirectoryNode();
      root.addChildren([
        DirectoryNode.createDirectory("dir1"),
        DirectoryNode.createDirectory("dir2"),
        DirectoryNode.createDirectory("dir3"),
        DirectoryNode.createFile("file1.txt"),
        DirectoryNode.createFile("file2.txt"),
      ]);
      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });

    test("Nested directories with files", () => {
      const expected = `+---dir1/
|   +---dir3/
|   |   \\---dir4/
|   |       \\---file2.txt
|   \\---file1.txt
\\---dir2/
`;
      const root = new DirectoryNode();
      root.addChildren([
        DirectoryNode.createDirectory("dir1", 1, [
          DirectoryNode.createDirectory("dir3", 2, [
            DirectoryNode.createDirectory("dir4", 3, [
              DirectoryNode.createFile("file2.txt"),
            ]),
          ]),
          DirectoryNode.createFile("file1.txt"),
        ]),
        DirectoryNode.createDirectory("dir2", 1, []),
      ]);

      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });

    test("Nested directories with different charset", () => {
      directoryWriter = new DirectoryWriter(new TextDirectoryRepresentation(charsetUtf8));

      const expected = `└───b/
    └───bc/
        └───bca/
            └───bca-file1.txt
`;
      const root = new DirectoryNode();
      root.addChildren([
        DirectoryNode.createDirectory("b", 1, [
          DirectoryNode.createDirectory("bc", 2, [
            DirectoryNode.createDirectory("bca", 3, [
              DirectoryNode.createFile("bca-file1.txt"),
            ]),
          ]),
        ]),
      ]);

      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });

    test("Nested directories with not empty ones", () => {
      directoryWriter = new DirectoryWriter(new TextDirectoryRepresentation(charsetUtf8));

      const expected = `├───a/
│   └───...
├───a1/
├───b/
│   └───...
├───c/
├───c1/
│   └───c2/
│       └───...
└───d/
    └───...
`;
      const root = new DirectoryNode();
      const directoryA = DirectoryNode.createDirectory("a");
      const directoryB = DirectoryNode.createDirectory("b");
      const directoryD = DirectoryNode.createDirectory("d");
      const directoryC2 = DirectoryNode.createDirectory("c2");
      directoryA.markDirectoryAsNoEmpty();
      directoryB.markDirectoryAsNoEmpty();
      directoryD.markDirectoryAsNoEmpty();
      directoryC2.markDirectoryAsNoEmpty();

      root.addChildren([
        directoryA,
        DirectoryNode.createDirectory("a1"),
        directoryB,
        DirectoryNode.createDirectory("c"),
        DirectoryNode.createDirectory("c1", 1, [directoryC2]),
        directoryD,
      ]);

      const result = directoryWriter.getDirectoryRepresentation(root);
      expect(result).toBe(expected);
    });
  });
});
