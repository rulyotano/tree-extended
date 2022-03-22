export default interface ICharset {
  key: string,
  verticalDiv: string,
  horizontalDiv: string,
  expand: string,
  final: string,
  breakLine: string,
  notEmpty: string,
  getFolderRepresentation: (folderName: string) => string,
  getFileRepresentation: (fileName: string) => string,
}