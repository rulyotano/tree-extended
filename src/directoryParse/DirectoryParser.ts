import { FilterCollection } from '../filters';
import DirectoryNode from './DirectoryNode';
import type IRunningEnvironment from '../IRunningEnvironment';

function getSubdirectoriesMatchingFilters(
  directoryPath: string,
  currentLevel: number,
  filters: FilterCollection,
  runningEnvironment: IRunningEnvironment
) {
  return runningEnvironment.getDirectoryContent(directoryPath).filter(directoryEntry => {
    const fullDirectoryEntryPath = runningEnvironment.pathJoins(directoryPath, directoryEntry);
    return filters.matchFilters(fullDirectoryEntryPath, currentLevel);
  });
}

const isMaxLevelButDirectoryIsNotEmpty = (
  maxLevel: number,
  currentLevel: number,
  subdirectories: string[]
) => maxLevel && maxLevel <= currentLevel && subdirectories.length > 0;

const getChildrenFolders = (
  children: string[],
  directory: string,
  runningEnvironment: IRunningEnvironment
) =>
  children.filter(it =>
    runningEnvironment.isDirectory(runningEnvironment.pathJoins(directory, it))
  );

const getChildrenFiles = (
  children: string[],
  directory: string,
  runningEnvironment: IRunningEnvironment
) => children.filter(it => runningEnvironment.isFile(runningEnvironment.pathJoins(directory, it)));

export default class DirectoryParser {
  directoryPath: string;
  filters: FilterCollection;
  maxLevel: number;
  markNoEmptyDirectories: boolean;
  runningEnvironment: IRunningEnvironment;

  constructor(
    directoryPath: string,
    filters: FilterCollection,
    runningEnvironment: IRunningEnvironment,
    maxLevel: number | null = null,
    markNoEmptyDirectories = true
  ) {
    this.directoryPath = directoryPath;
    this.filters = filters;
    this.maxLevel = maxLevel;
    this.markNoEmptyDirectories = markNoEmptyDirectories;
    this.runningEnvironment = runningEnvironment;
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
      this.filters,
      this.runningEnvironment
    );

    if (isMaxLevelButDirectoryIsNotEmpty(this.maxLevel, currentLevel, subdirectories)) {
      if (this.markNoEmptyDirectories) {
        parent.markDirectoryAsNoEmpty();
      }
      return;
    }

    const childrenDirectories = getChildrenFolders(
      subdirectories,
      currentDirectory,
      this.runningEnvironment
    );
    const childrenFiles = getChildrenFiles(
      subdirectories,
      currentDirectory,
      this.runningEnvironment
    );

    const getChildrenDirectoryNodes = () =>
      childrenDirectories.map(childDirectory => {
        const newNodeItem = DirectoryNode.createDirectory(childDirectory, currentLevel + 1);
        this.includeChildrenFromDirectories(
          newNodeItem,
          this.runningEnvironment.pathJoins(currentDirectory, childDirectory),
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
