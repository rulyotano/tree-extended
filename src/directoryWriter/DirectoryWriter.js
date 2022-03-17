export default class DirectoryWriter {
  constructor(directoryRepresentation) {
    this.directoryRepresentation = directoryRepresentation;
  }

  getDirectoryRepresentation(rootDirectoryNode) {
    return this.getDirectoryStringRepresentation(rootDirectoryNode, "");
  }

  getDirectoryStringRepresentation(directoryNode, previousLevelContent) {
    const representation = this.directoryRepresentation;
    if (directoryNode.isLeafNotEmpty()) {
      return representation.directoryNotEmpty(previousLevelContent);
    }

    let result = "";
    directoryNode.children.forEach((child) => {
      const isLastChild = directoryNode.isLastChild(child);

      if (child.isDirectory()) {
        result += representation.directoryItem(isLastChild, previousLevelContent, child.name, true);
        const nextPreviousContent = previousLevelContent + representation.previousContent(isLastChild);
        result += this.getDirectoryStringRepresentation(child, nextPreviousContent);
      }

      if (child.isFile()) {
        result += representation.directoryItem(isLastChild, previousLevelContent, child.name);
      }
    });

    return result;
  }
}
