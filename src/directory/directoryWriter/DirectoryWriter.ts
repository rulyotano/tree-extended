import { DirectoryNode } from "../";
import TextDirectoryRepresentation from "./representation/TextDirectoryRepresentation";

export default class DirectoryWriter {
  directoryRepresentation: TextDirectoryRepresentation;

  constructor(directoryRepresentation: TextDirectoryRepresentation) {
    this.directoryRepresentation = directoryRepresentation;
  }

  getDirectoryRepresentation(rootDirectoryNode: DirectoryNode) {
    return this.getDirectoryStringRepresentation(rootDirectoryNode, "");
  }

  getDirectoryStringRepresentation(directoryNode: DirectoryNode, previousLevelContent: string) {
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
