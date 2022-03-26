import directoryNodeTypes from './DirectoryNodeTypes';

export default class DirectoryNode {
  static ROOT_NAME = 'root';

  static ROOT_DIRECTORY_INDEX = -1;
  name: string;
  deep: number;
  kind: number;
  children: DirectoryNode[];
  directoryEmpty: boolean;
  directoryIndex: number;
  childrenIndexes: { [hashCode: string]: number };

  constructor(
    name = DirectoryNode.ROOT_NAME,
    deep = 0,
    kind = directoryNodeTypes.DIRECTORY_TYPE,
    children: DirectoryNode[] = [],
    directoryEmpty = true
  ) {
    this.name = name;
    this.deep = deep;
    this.kind = kind;
    this.children = children;
    this.directoryEmpty = directoryEmpty;
    this.directoryIndex = DirectoryNode.ROOT_DIRECTORY_INDEX;
  }

  static createDirectory(name: string, deep: number, children: DirectoryNode[] = []) {
    return new DirectoryNode(name, deep, directoryNodeTypes.DIRECTORY_TYPE, children);
  }

  static createFile(name: string, deep: number) {
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

  addChildren(newChildren: DirectoryNode[] = []) {
    this.children = [...this.children, ...newChildren];
    this.childrenIndexes = null;
  }

  setDirectoryIndex(directoryIndex: number) {
    this.directoryIndex = directoryIndex;
  }

  isLastChild(child: DirectoryNode) {
    const childrenIndexes = this.getChildrenIndexes();
    const lastIndex = this.children.length - 1;
    return childrenIndexes[child.getHashCode()] === lastIndex;
  }

  getChildrenIndexes() {
    if (!this.childrenIndexes) {
      this.childrenIndexes = this.children.reduce(
        (prev, current, index) => ({
          ...prev,
          [current.getHashCode()]: index,
        }),
        {}
      );
    }

    return this.childrenIndexes;
  }

  getHashCode() {
    return this.name;
  }
}
