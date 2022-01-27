module.exports = class TextDirectoryRepresentation {
  constructor(charset) {
    this.charset = charset;
  }

  directoryNotEmpty(previousContent = "") {
    const { charset } = this;
    // eslint-disable-next-line object-curly-newline
    const { final, horizontalDiv, notEmpty, breakLine } = charset;

    return `${previousContent}${final}${horizontalDiv}${horizontalDiv}${horizontalDiv}${notEmpty}${breakLine}`;
  }

  previousContent(isLast) {
    const { charset } = this;

    return `${isLast ? " " : charset.verticalDiv}   `;
  }

  directoryItem(isLast, previousContent = "", itemName = "") {
    const { charset } = this;
    // eslint-disable-next-line object-curly-newline
    const { final, horizontalDiv, expand, breakLine } = charset;

    const linePrefix = isLast ? final : expand;
    const directoryItemRepresentation = `${linePrefix}${horizontalDiv}${horizontalDiv}${horizontalDiv}${itemName}`;

    return `${previousContent}${directoryItemRepresentation}${breakLine}`;
  }
};
