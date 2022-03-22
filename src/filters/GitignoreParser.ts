import {join} from "path";
import {existsSync, readFileSync} from "fs";
import {EOL} from "os";
import { compile } from "gitignore-parser";

export default class GitignoreParser {
  gitignoreFilePath: string;

  constructor(targetPath: string) {
    this.gitignoreFilePath = join(targetPath, ".gitignore");
  }

  doesGitignoreFileExist() {
    return existsSync(this.gitignoreFilePath);
  }

  getGitignoreFile() {
    return compile(this.getCleanedGitignoreFileContent());
  }

  getCleanedGitignoreFileContent() {
    const endOfLine = EOL;

    return readFileSync(this.gitignoreFilePath, "utf8")
      .split(endOfLine)
      .map(GitignoreParser.getLineWithoutSlashesEndings)
      .join(endOfLine);
  }

  static getLineWithoutSlashesEndings(line: string) {
    const trimmedLine = line.trimRight();
    if (trimmedLine.endsWith("/") || trimmedLine.endsWith("\\")) {
      return trimmedLine.substring(0, trimmedLine.length - 1);
    }
    return line;
  }
}
