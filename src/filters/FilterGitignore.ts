import type IFilter from './IFilter';
import GitignoreParser from './GitignoreParser';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class FilterGitignore implements IFilter {
  useGitignore: boolean;
  absolutePath: string;
  gitIgnore: {
    accepts(input: string): boolean;
    denies(input: string): boolean;
    maybe(input: string): boolean;
  };
  runningEnvironment: IRunningEnvironment;

  constructor(
    useGitignore: boolean,
    absolutePath: string,
    runningEnvironment: IRunningEnvironment
  ) {
    this.useGitignore = useGitignore;
    this.absolutePath = absolutePath;
    this.runningEnvironment = runningEnvironment;
    this.gitIgnore = undefined;
  }

  async matchFilter(path: string) {
    const pathIsGitDirectory = path.match(/\.git[/|\\]?$/);
    if (this.useGitignore && pathIsGitDirectory) return false;

    const gitIgnore = await this.getGitIgnoreOrCreate();
    const relativePath = this.getRelativeMatchPath(path);
    return !gitIgnore || gitIgnore.accepts(relativePath);
  }

  private async getGitIgnoreOrCreate() {
    if (this.gitIgnore === undefined) {
      this.gitIgnore = await FilterGitignore.configureGitignore(
        this.useGitignore,
        this.absolutePath,
        this.runningEnvironment
      );
    }

    return this.gitIgnore;
  }

  private getRelativeMatchPath(path: string) {
    const isPathAbsolute = path.includes(this.absolutePath);
    if (isPathAbsolute) {
      return this.removeAbsolutePath(path);
    }
    return path;
  }

  private removeAbsolutePath(path: string) {
    const relativePath = path.replace(this.absolutePath, '');
    if (relativePath.includes('\\')) {
      return relativePath.split('\\').join('/');
    }
    return relativePath;
  }

  static async configureGitignore(
    useGitignore: boolean,
    absolutePath: string,
    runningEnvironment: IRunningEnvironment
  ) {
    const gitIgnoreParser = new GitignoreParser(absolutePath, runningEnvironment);

    if (useGitignore && (await gitIgnoreParser.doesGitignoreFileExist())) {
      return await gitIgnoreParser.getGitignoreFile();
    }

    return null;
  }
}
