import TextDirectoryRepresentation from "./representation/TextDirectoryRepresentation";
import asciiCharset from "./charset/ascii";
import utf8Charset from "./charset/utf8";
import utf8IconsCharset from "./charset/utf8Icons";

const charsetByKey = {
  [asciiCharset.key]: asciiCharset,
  [utf8Charset.key]: utf8Charset,
  [utf8IconsCharset.key]: utf8IconsCharset,
};

export default class DirectoryRepresentationProvider {
  static getDirectoryRepresentation(charset = utf8Charset.key) {
    let charsetToUse = charset;

    if (!charsetByKey[charsetToUse]) {
      charsetToUse = utf8Charset.key;
    }

    return new TextDirectoryRepresentation(charsetByKey[charsetToUse]);
  }
}
