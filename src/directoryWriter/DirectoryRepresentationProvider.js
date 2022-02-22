const TextDirectoryRepresentation = require("./representation/TextDirectoryRepresentation");
const asciiCharset = require("./charset/ascii");
const utf8Charset = require("./charset/utf8");
const utf8IconsCharset = require("./charset/utf8Icons");

const charsetByKey = {
  [asciiCharset.key]: asciiCharset,
  [utf8Charset.key]: utf8Charset,
  [utf8IconsCharset.key]: utf8IconsCharset,
};

module.exports = class DirectoryRepresentationProvider {
  static getDirectoryRepresentation(charset = utf8Charset.key) {
    let charsetToUse = charset;

    if (!charsetByKey[charsetToUse]) {
      charsetToUse = utf8Charset.key;
    }

    return new TextDirectoryRepresentation(charsetByKey[charsetToUse]);
  }
};
