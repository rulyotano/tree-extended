const TextDirectoryRepresentation = require("./representation/TextDirectoryRepresentation");
const asciiCharset = require("./charset/ascii");
const utf8Charset = require("./charset/utf8");

module.exports = class DirectoryRepresentationProvider {
  static getDirectoryRepresentation(isLegacy = false) {
    if (isLegacy) {
      return new TextDirectoryRepresentation(asciiCharset);
    }

    return new TextDirectoryRepresentation(utf8Charset);
  }
};
