import Filter from "./Filter";
import GitignoreParser from "./GitignoreParser";

export default class FilterGitignore extends Filter {
  constructor(useGitignore, absolutePath) {
    super();
    this.useGitignore = useGitignore;
    this.absolutePath = absolutePath;
    this.gitIgnore = FilterGitignore.configureGitignore(useGitignore, absolutePath);
  }

  matchFilter(path) {
    const pathIsGitDirectory = path.match(/\.git[/|\\]?$/);
    if (this.useGitignore && pathIsGitDirectory) return false;

    return !this.gitIgnore || this.gitIgnore.accepts(path);
  }

  static configureGitignore(useGitignore, absolutePath) {
    const gitIgnoreParser = new GitignoreParser(absolutePath);

    if (useGitignore && gitIgnoreParser.doesGitignoreFileExist()) {
      return gitIgnoreParser.getGitignoreFile();
    }

    return null;
  }
}
