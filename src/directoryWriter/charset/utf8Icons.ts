import type ICharset from "./ICharset";

const utf8Icons: ICharset = {
  key: "utf8-icons",
  verticalDiv: "│",
  horizontalDiv: "─",
  expand: "├",
  final: "└",
  breakLine: "\n",
  notEmpty: "...",
  getFolderRepresentation: (folderName) => `📁 ${folderName}/`,
  getFileRepresentation: (fileName) => `📄 ${fileName}`,
};

export default utf8Icons;