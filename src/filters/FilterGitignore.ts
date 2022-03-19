import type Filter from './IFilter';
import GitignoreParser from './GitignoreParser';

export default class FilterGitignore implements Filter {
  useGitignore: boolean;
  absolutePath: string;
  gitIgnore: {
    accepts(input: string): boolean;
    denies(input: string): boolean;
    maybe(input: string): boolean;
  };

  constructor(useGitignore: boolean, absolutePath: string) {
    this.useGitignore = useGitignore;
    this.absolutePath = absolutePath;
    this.gitIgnore = FilterGitignore.configureGitignore(useGitignore, absolutePath);
  }

  matchFilter(path: string) {
    const pathIsGitDirectory = path.match(/\.git[/|\\]?$/);
    if (this.useGitignore && pathIsGitDirectory) return false;

    return !this.gitIgnore || this.gitIgnore.accepts(path);
  }

  static configureGitignore(useGitignore: boolean, absolutePath: string) {
    const gitIgnoreParser = new GitignoreParser(absolutePath);

    if (useGitignore && gitIgnoreParser.doesGitignoreFileExist()) {
      return gitIgnoreParser.getGitignoreFile();
    }

    return null;
  }
}
