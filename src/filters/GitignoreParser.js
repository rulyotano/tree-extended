import path from "path";
import fs from "fs";
import os from "os";
import gitignoreParser from "gitignore-parser";

export default class GitignoreParser {
  constructor(targetPath) {
    this.gitignoreFilePath = path.join(targetPath, ".gitignore");
  }

  doesGitignoreFileExist() {
    return fs.existsSync(this.gitignoreFilePath);
  }

  getGitignoreFile() {
    return gitignoreParser.compile(this.getCleanedGitignoreFileContent());
  }

  getCleanedGitignoreFileContent() {
    const endOfLine = os.EOL;

    return fs
      .readFileSync(this.gitignoreFilePath, "utf8")
      .split(endOfLine)
      .map(GitignoreParser.getLineWithoutSlashesEndings)
      .join(endOfLine);
  }

  static getLineWithoutSlashesEndings(line) {
    const trimmedLine = line.trimRight();
    if (trimmedLine.endsWith("/") || trimmedLine.endsWith("\\")) {
      return trimmedLine.substr(0, trimmedLine.length - 1);
    }
    return line;
  }
}
