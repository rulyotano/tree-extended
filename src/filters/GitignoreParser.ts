import { compile } from "gitignore-parser";
import type IRunningEnvironment from "../IRunningEnvironment";

export default class GitignoreParser {
  gitignoreFilePath: string;
  runningEnvironment: IRunningEnvironment;

  constructor(targetPath: string, runningEnvironment: IRunningEnvironment) {
    this.gitignoreFilePath = runningEnvironment.pathJoins(targetPath, ".gitignore");
    this.runningEnvironment = runningEnvironment;
  }

  doesGitignoreFileExist() {
    return this.runningEnvironment.pathExist(this.gitignoreFilePath);
  }

  getGitignoreFile() {
    return compile(this.getCleanedGitignoreFileContent());
  }

  getCleanedGitignoreFileContent() {
    const endOfLine = this.runningEnvironment.getEndOfLine();

    return this.runningEnvironment.readTextFile(this.gitignoreFilePath)
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
