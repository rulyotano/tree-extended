import type Filter from './IFilter';
import GitignoreParser from './GitignoreParser';
import type IRunningEnvironment from '../IRunningEnvironment';

export default class FilterGitignore implements Filter {
  useGitignore: boolean;
  absolutePath: string;
  gitIgnore: {
    accepts(input: string): boolean;
    denies(input: string): boolean;
    maybe(input: string): boolean;
  };

  constructor(
    useGitignore: boolean,
    absolutePath: string,
    runningEnvironment: IRunningEnvironment
  ) {
    this.useGitignore = useGitignore;
    this.absolutePath = absolutePath;
    this.gitIgnore = FilterGitignore.configureGitignore(
      useGitignore,
      absolutePath,
      runningEnvironment
    );
  }

  matchFilter(path: string) {
    const pathIsGitDirectory = path.match(/\.git[/|\\]?$/);
    if (this.useGitignore && pathIsGitDirectory) return false;

    return !this.gitIgnore || this.gitIgnore.accepts(path);
  }

  static configureGitignore(
    useGitignore: boolean,
    absolutePath: string,
    runningEnvironment: IRunningEnvironment
  ) {
    const gitIgnoreParser = new GitignoreParser(absolutePath, runningEnvironment);

    if (useGitignore && gitIgnoreParser.doesGitignoreFileExist()) {
      return gitIgnoreParser.getGitignoreFile();
    }

    return null;
  }
}
