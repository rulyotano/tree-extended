export default class TextDirectoryRepresentation {
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

  directoryItem(isLast, previousContent = "", itemName = "", isDirectory = false) {
    const { charset } = this;
    // eslint-disable-next-line object-curly-newline
    const { final, horizontalDiv, expand, breakLine, getFolderRepresentation, getFileRepresentation } = charset;

    const linePrefix = isLast ? final : expand;
    const itemText = isDirectory ? getFolderRepresentation(itemName) : getFileRepresentation(itemName);
    const directoryItemRepresentation = `${linePrefix}${horizontalDiv}${horizontalDiv}${horizontalDiv}${itemText}`;

    return `${previousContent}${directoryItemRepresentation}${breakLine}`;
  }
}
