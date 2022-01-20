const directoryNodeTypes = require("./DirectoryNodeTypes");

module.exports = class DirectoryNode {
  static ROOT_NAME = "root";

  constructor(
    name = DirectoryNode.ROOT_NAME,
    deep = 0,
    kind = directoryNodeTypes.DIRECTORY_TYPE,
    children = [],
    directoryEmpty = true,
  ) {
    this.name = name;
    this.deep = deep;
    this.kind = kind;
    this.children = children;
    this.directoryEmpty = directoryEmpty;
  }

  static createDirectory(name, deep) {
    return new DirectoryNode(name, deep, directoryNodeTypes.DIRECTORY_TYPE);
  }

  static createFile(name, deep) {
    return new DirectoryNode(name, deep, directoryNodeTypes.FILE_TYPE);
  }

  isLeaf() {
    return this.children.length === 0;
  }

  isDirectoryEmpty() {
    return this.directoryEmpty;
  }

  isLeafNotEmpty() {
    return this.isLeaf() && !this.isDirectoryEmpty();
  }

  markDirectoryAsNoEmpty() {
    this.directoryEmpty = false;
  }

  isRoot() {
    return this.name === DirectoryNode.ROOT_NAME;
  }

  isFile() {
    return this.kind === directoryNodeTypes.FILE_TYPE;
  }

  isDirectory() {
    return this.kind === directoryNodeTypes.DIRECTORY_TYPE;
  }

  addChildren(newChildren = []) {
    this.children = [...this.children, ...newChildren];
  }
};
