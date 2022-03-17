export default {
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
