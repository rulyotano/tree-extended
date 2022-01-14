const directoryNodeTypes = require("./DirectoryNodeTypes");

module.exports = class DirectoryNode {
  constructor(name, deep = 0, kind = directoryNodeTypes.FILE_TYPE) {
    this.name = name;
    this.deep = deep;
    this.kind = kind;
    this.children = [];
  }

  isLeaf() {
    return this.children.length === 0;
  }

  addChildren(newChildren = []) {
    this.children = [...this.children, ...newChildren];
  }
};
