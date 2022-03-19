import { FilterCollection } from '../filters';
import { readdirSync, lstatSync } from 'fs';
import { join } from 'path';
import DirectoryNode from './DirectoryNode';

function getSubdirectoriesMatchingFilters(
  directory: string,
  currentLevel: number,
  filters: FilterCollection
) {
  return readdirSync(directory).filter(it => {
    const tPath = join(directory, it);
    return filters.matchFilters(tPath, currentLevel);
  });
}

const isMaxLevelButDirectoryIsNotEmpty = (
  maxLevel: number,
  currentLevel: number,
  subdirectories: string[]
) => maxLevel && maxLevel <= currentLevel && subdirectories.length > 0;

const getChildrenFolders = (children: string[], directory: string) =>
  children.filter(it => lstatSync(join(directory, it)).isDirectory());

const getChildrenFiles = (children: string[], directory: string) =>
  children.filter(it => lstatSync(join(directory, it)).isFile());

export default class DirectoryParser {
  directoryPath: string;
  filters: FilterCollection;
  maxLevel: number;
  markNoEmptyDirectories: boolean;

  constructor(
    directoryPath: string,
    filters: FilterCollection,
    maxLevel: number | null = null,
    markNoEmptyDirectories = true
  ) {
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

  includeChildrenFromDirectories(
    parent: DirectoryNode,
    currentDirectory: string,
    currentLevel: number
  ) {
    const subdirectories = getSubdirectoriesMatchingFilters(
      currentDirectory,
      currentLevel,
      this.filters
    );

    if (isMaxLevelButDirectoryIsNotEmpty(this.maxLevel, currentLevel, subdirectories)) {
      if (this.markNoEmptyDirectories) {
        parent.markDirectoryAsNoEmpty();
      }
      return;
    }

    const childrenDirectories = getChildrenFolders(subdirectories, currentDirectory);
    const childrenFiles = getChildrenFiles(subdirectories, currentDirectory);

    const getChildrenDirectoryNodes = () =>
      childrenDirectories.map(childDirectory => {
        const newNodeItem = DirectoryNode.createDirectory(childDirectory, currentLevel + 1);
        this.includeChildrenFromDirectories(
          newNodeItem,
          join(currentDirectory, childDirectory),
          currentLevel + 1
        );
        return newNodeItem;
      });

    const getChildrenFileNodes = () =>
      childrenFiles.map(childFile => DirectoryNode.createFile(childFile, currentLevel + 1));

    parent.addChildren(getChildrenDirectoryNodes());
    parent.addChildren(getChildrenFileNodes());
  }
}
