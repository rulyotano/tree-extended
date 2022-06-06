import { CustomFilterCollection } from './filters';
import { DirectoryParser, DirectoryWriter, DirectoryRepresentationProvider } from './directory';
import { getAbsolutePathOrThrow } from './helpers';
import Configuration from './Configuration';
import type IRunningEnvironment from './IRunningEnvironment';

export default class TreeExtended {
  runningEnvironment: IRunningEnvironment;

  constructor(runningEnvironment: IRunningEnvironment) {
    this.runningEnvironment = runningEnvironment;
  }

  async getDirectoryTree(targetPath = './', configuration: Configuration = new Configuration()) {
    const absoluteTargetPath = await getAbsolutePathOrThrow(targetPath, this.runningEnvironment);

    const filters = new CustomFilterCollection(
      this.runningEnvironment,
      configuration.ignoreFilters,
      configuration.onlyFilters,
      configuration.includeGitIgnore,
      absoluteTargetPath
    );
    const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation(
      configuration.charset
    );

    const directoryParser = new DirectoryParser(
      absoluteTargetPath,
      filters,
      this.runningEnvironment,
      configuration.maximumDeep,
      configuration.showIndicatorWhenDirectoryIsNotEmpty
    );
    const directoryWriter = new DirectoryWriter(directoryRepresentation);

    return directoryWriter.getDirectoryRepresentation(await directoryParser.parse());
  }
}
