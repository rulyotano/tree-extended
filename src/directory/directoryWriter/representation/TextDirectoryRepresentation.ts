import type ICharset from '../charset/ICharset';

export default class TextDirectoryRepresentation {
  charset: ICharset;

  constructor(charset: ICharset) {
    this.charset = charset;
  }

  directoryNotEmpty(previousContent = '') {
    const { charset } = this;
    const { final, horizontalDiv, notEmpty, breakLine } = charset;

    return `${previousContent}${final}${horizontalDiv}${horizontalDiv}${horizontalDiv}${notEmpty}${breakLine}`;
  }

  previousContent(isLast: boolean) {
    const { charset } = this;

    return `${isLast ? ' ' : charset.verticalDiv}   `;
  }

  directoryItem(isLast: boolean, previousContent = '', itemName = '', isDirectory = false) {
    const { charset } = this;
    const {
      final,
      horizontalDiv,
      expand,
      breakLine,
      getFolderRepresentation,
      getFileRepresentation,
    } = charset;

    const linePrefix = isLast ? final : expand;
    const itemText = isDirectory
      ? getFolderRepresentation(itemName)
      : getFileRepresentation(itemName);
    const directoryItemRepresentation = `${linePrefix}${horizontalDiv}${horizontalDiv}${horizontalDiv}${itemText}`;

    return `${previousContent}${directoryItemRepresentation}${breakLine}`;
  }
}
