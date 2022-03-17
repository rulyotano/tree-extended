export default {
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
