import { FilterCollection } from '../../filters';
import { DirectoryNode } from '../';
import type IRunningEnvironment from '../../IRunningEnvironment';

async function getSubdirectoriesMatchingFilters(
  directoryPath: string,
  currentLevel: number,
  filters: FilterCollection,
  runningEnvironment: IRunningEnvironment
) {
  const currentDirectoryContent = await runningEnvironment.getDirectoryContent(directoryPath);

  const filteredResult = await Promise.all(
    currentDirectoryContent.map((async directoryEntry => {
      const fullDirectoryEntryPath = runningEnvironment.pathJoins(directoryPath, directoryEntry);
      return await filters.matchFilters(fullDirectoryEntryPath, currentLevel);
    })));

  return currentDirectoryContent.filter((_, index) => filteredResult[index]);
}

const isMaxLevelButDirectoryIsNotEmpty = (
  maxLevel: number,
  currentLevel: number,
  subdirectories: string[]
) => maxLevel && maxLevel <= currentLevel && subdirectories.length > 0;

const getChildrenFolders = async (
  children: string[],
  directory: string,
  runningEnvironment: IRunningEnvironment
) => {
  const filteredResult = await Promise.all(
    children.map(
      async it => await runningEnvironment.isDirectory(runningEnvironment.pathJoins(directory, it))
    )
  );
  return children.filter((_, index) => filteredResult[index]);
};

const getChildrenFiles = async (
  children: string[],
  directory: string,
  runningEnvironment: IRunningEnvironment
) => {
  const filteredResult = await Promise.all(
    children.map(
      async it => await runningEnvironment.isFile(runningEnvironment.pathJoins(directory, it))
    )
  );
  return children.filter((_, index) => filteredResult[index]);
}

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

  async parse() {
    const root = new DirectoryNode();
    await this.includeChildrenFromDirectories(root, this.directoryPath, 0);

    return root;
  }

  async includeChildrenFromDirectories(
    parent: DirectoryNode,
    currentDirectory: string,
    currentLevel: number
  ) {
    const subdirectories = await getSubdirectoriesMatchingFilters(
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

    const childrenDirectories = await getChildrenFolders(
      subdirectories,
      currentDirectory,
      this.runningEnvironment
    );
    const childrenFiles = await getChildrenFiles(
      subdirectories,
      currentDirectory,
      this.runningEnvironment
    );

    const getChildrenDirectoryNodes = async () =>
      await Promise.all(
        childrenDirectories.map(async childDirectory => {
          const newNodeItem = DirectoryNode.createDirectory(childDirectory, currentLevel + 1);
          await this.includeChildrenFromDirectories(
            newNodeItem,
            this.runningEnvironment.pathJoins(currentDirectory, childDirectory),
            currentLevel + 1
          );
          return newNodeItem;
        })
      );

    const getChildrenFileNodes = () =>
      childrenFiles.map(childFile => DirectoryNode.createFile(childFile, currentLevel + 1));

    parent.addChildren(await getChildrenDirectoryNodes());
    parent.addChildren(getChildrenFileNodes());
  }
}
