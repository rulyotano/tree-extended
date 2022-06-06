import { compile } from "gitignore-parser";
import type IRunningEnvironment from "../IRunningEnvironment";

export default class GitignoreParser {
  gitignoreFilePath: string;
  runningEnvironment: IRunningEnvironment;

  constructor(targetPath: string, runningEnvironment: IRunningEnvironment) {
    this.gitignoreFilePath = runningEnvironment.pathJoins(targetPath, ".gitignore");
    this.runningEnvironment = runningEnvironment;
  }

  async doesGitignoreFileExist() {
    return await this.runningEnvironment.pathExist(this.gitignoreFilePath);
  }

  async getGitignoreFile() {
    return compile(await this.getCleanedGitignoreFileContent());
  }

  async getCleanedGitignoreFileContent() {
    const endOfLine = this.runningEnvironment.getEndOfLine();
    const gitIgnoreFileText = await this.runningEnvironment.readTextFile(this.gitignoreFilePath);

    return gitIgnoreFileText
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
