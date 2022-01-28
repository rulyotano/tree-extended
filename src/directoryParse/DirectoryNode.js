const directoryNodeTypes = require("./DirectoryNodeTypes");

module.exports = class DirectoryNode {
  static ROOT_NAME = "root";

  static ROOT_DIRECTORY_INDEX = -1;

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
    this.directoryIndex = DirectoryNode.ROOT_DIRECTORY_INDEX;
  }

  static createDirectory(name, deep, children = []) {
    return new DirectoryNode(name, deep, directoryNodeTypes.DIRECTORY_TYPE, children);
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
    this.childrenIndexes = null;
  }

  setDirectoryIndex(directoryIndex) {
    this.directoryIndex = directoryIndex;
  }

  isLastChild(child) {
    const childrenIndexes = this.getChildrenIndexes();
    const lastIndex = this.children.length - 1;
    return childrenIndexes[child.getHashCode()] === lastIndex;
  }

  getChildrenIndexes() {
    if (!this.childrenIndexes) {
      this.childrenIndexes = this.children.reduce((prev, current, index) => ({
        ...prev,
        [current.getHashCode()]: index,
      }), {});
    }

    return this.childrenIndexes;
  }

  getHashCode() {
    return this.name;
  }
};
