import type ICharset from "./ICharset";

const ascii: ICharset = {
  key: "ascii",
  verticalDiv: "|",
  horizontalDiv: "-",
  expand: "+",
  final: "\\",
  breakLine: "\n",
  notEmpty: "...",
  getFolderRepresentation: (folderName) => `${folderName}/`,
  getFileRepresentation: (fileName) => fileName,
};

export default ascii;
