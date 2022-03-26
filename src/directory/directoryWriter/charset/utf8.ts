import type ICharset from "./ICharset";

const utf8: ICharset = {
  key: "utf8",
  verticalDiv: "│",
  horizontalDiv: "─",
  expand: "├",
  final: "└",
  breakLine: "\n",
  notEmpty: "...",
  getFolderRepresentation: (folderName) => `${folderName}/`,
  getFileRepresentation: (fileName) => fileName,
};

export default utf8;
