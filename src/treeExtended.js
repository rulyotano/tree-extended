const DirectoryRepresentationProvider = require("./directoryWriter/DirectoryRepresentationProvider");
const CustomFilterCollection = require("./filters/CustomFilterCollection");
const DirectoryParser = require("./directoryParse/DirectoryParser");
const DirectoryWriter = require("./directoryWriter/DirectoryWriter");
const {
  getAbsolutePathOrThrow,
} = require("./helpers");
const Configuration = require("./Configuration");

module.exports = (
  targetPath = "./",
  configuration = new Configuration(),
) => {
  const absoluteTargetPath = getAbsolutePathOrThrow(targetPath);

  const filters = new CustomFilterCollection(
    configuration.ignoreFilters,
    configuration.onlyFilters,
    configuration.includeGitIgnore,
    absoluteTargetPath,
  );
  const directoryRepresentation = DirectoryRepresentationProvider.getDirectoryRepresentation(
    configuration.charset,
  );

  const directoryParser = new DirectoryParser(
    absoluteTargetPath,
    filters,
    configuration.maximumDeep,
    configuration.showIndicatorWhenDirectoryIsNotEmpty,
  );
  const directoryWriter = new DirectoryWriter(directoryRepresentation);

  return directoryWriter.getDirectoryRepresentation(directoryParser.parse());
};
