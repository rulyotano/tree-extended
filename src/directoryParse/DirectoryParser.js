const fs = require("fs");
const path = require("path");
const DirectoryNode = require("./DirectoryNode");

function getSubdirectoriesMatchingFilters(directory, currentLevel, filters) {
  return fs.readdirSync(directory).filter((it) => {
    const tPath = path.join(directory, it);
    return filters.matchFilters(tPath, currentLevel);
  });
}

const isMaxLevelButDirectoryIsNotEmpty = (maxLevel, currentLevel, subdirectories) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  maxLevel && maxLevel <= currentLevel && subdirectories.length > 0;

const getChildrenFolders = (children, directory) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  children.filter((it) => fs.lstatSync(path.join(directory, it)).isDirectory());

const getChildrenFiles = (children, directory) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  children.filter((it) => fs.lstatSync(path.join(directory, it)).isFile());

module.exports = class DirectoryParser {
  constructor(directoryPath, filters, maxLevel = null, markNoEmptyDirectories = true) {
    this.directoryPath = directoryPath;
    this.filters = filters;
    this.maxLevel = maxLevel;
    this.markNoEmptyDirectories = markNoEmptyDirectories;
  }

  parse() {
    const root = new DirectoryNode();
    this.includeChildrenFromDirectories(root, this.directoryPath, 0);

    return root;
  }

  includeChildrenFromDirectories(parent, currentDirectory, currentLevel) {
    const subdirectories = getSubdirectoriesMatchingFilters(currentDirectory, currentLevel, this.filters);

    if (isMaxLevelButDirectoryIsNotEmpty(this.maxLevel, currentLevel, subdirectories)) {
      if (this.markNoEmptyDirectories) {
        parent.markDirectoryAsNoEmpty();
      }
      return;
    }

    const childrenDirectories = getChildrenFolders(subdirectories, currentDirectory);
    const childrenFiles = getChildrenFiles(subdirectories, currentDirectory);

    const getChildrenDirectoryNodes = () => childrenDirectories.map((childDirectory) => {
      const newNodeItem = DirectoryNode.createDirectory(childDirectory, currentLevel + 1);
      this.includeChildrenFromDirectories(newNodeItem, path.join(currentDirectory, childDirectory), currentLevel + 1);
      return newNodeItem;
    });

    const getChildrenFileNodes = () =>
      // eslint-disable-next-line implicit-arrow-linebreak
      childrenFiles.map((childFile) => DirectoryNode.createFile(childFile, currentLevel + 1));

    parent.addChildren(getChildrenDirectoryNodes());
    parent.addChildren(getChildrenFileNodes());
  }
};
