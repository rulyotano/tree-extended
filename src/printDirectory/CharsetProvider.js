const asciiCharset = require("./charset/ascii");
const utf8Charset = require("./charset/utf8");

module.exports = class CharsetProvider {
  static getCharset(isLegacy = false) {
    if (isLegacy) {
      return asciiCharset;
    }

    return utf8Charset;
  }
};
