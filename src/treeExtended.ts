import DirectoryRepresentationProvider from './directoryWriter/DirectoryRepresentationProvider';
import { CustomFilterCollection } from './filters';
import DirectoryParser from './directoryParse/DirectoryParser';
import DirectoryWriter from './directoryWriter/DirectoryWriter';
import { getAbsolutePathOrThrow } from './helpers';
import Configuration from './Configuration';

export default (
  targetPath: string = './',
  configuration: Configuration = new Configuration()
): string => {
  const absoluteTargetPath = getAbsolutePathOrThrow(targetPath);

  const filters = new CustomFilterCollection(
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
    configuration.maximumDeep,
    configuration.showIndicatorWhenDirectoryIsNotEmpty
  );
  const directoryWriter = new DirectoryWriter(directoryRepresentation);

  return directoryWriter.getDirectoryRepresentation(directoryParser.parse());
};
