const fs = require("fs");
const path = require("path");
const GitignoreParser = require("./GitignoreParser");
const CharsetProvider = require("./printDirectory/CharsetProvider");

const breakLine = "\n";
const notEmptyString = "...";

let gitignoreConfigured = false;
let gitignoreFile = null;
let ignoresMaps = {};
let onlyMaps = {};

function getAbsolutePathOrThrow(targetPath) {
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  const absolutePath = path.join(process.execPath, targetPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Path ${absolutePath} doesn't exist.`);
  }
  return absolutePath;
}

const initializeEmptyConfigurations = () => {
  gitignoreConfigured = false;
  gitignoreFile = null;
  ignoresMaps = {};
  onlyMaps = {};
};

function configureOnlyFilterFromInput(only) {
  only.forEach((it) => {
    if (!onlyMaps[it.deep]) {
      onlyMaps[it.deep] = [];
    }
    onlyMaps[it.deep].push(it);
  });
}

function configureIgnoreFromInput(ignores) {
  ignores.forEach((it) => {
    if (!ignoresMaps[it.deep]) {
      ignoresMaps[it.deep] = [];
    }
    ignoresMaps[it.deep].push(it);
  });
}

const configureGitignore = (useGitignore, targetPath) => {
  gitignoreConfigured = useGitignore;
  const gitIgnoreParser = new GitignoreParser(targetPath);

  if (gitignoreConfigured && gitIgnoreParser.doesGitignoreFileExist()) {
    gitignoreFile = gitIgnoreParser.getGitignoreFile();
  }
};

/** Apply the filters based on ignores and only filter records. */
const applyFilter = (fullPath, level) => {
  // when have gitignore config, ignore the .git/ folder
  if (gitignoreConfigured && fullPath.match(/\.git[/|\\]?$/)) return false;

  // if exist general only filters, but all them mismatch the path, then return false
  if (onlyMaps.null && onlyMaps.null.every((it) => !it.isMatch(fullPath))) return false;
  // a more specific case, has only maps of its level
  if (onlyMaps[level] && onlyMaps[level].every((it) => !it.isMatch(fullPath))) return false;

  // if exist general ignore filters, and exist a match with the path, then return false
  if (ignoresMaps.null && ignoresMaps.null.some((it) => it.isMatch(fullPath))) return false;

  // a more specific case, has ignore maps of its level
  if (ignoresMaps[level] && ignoresMaps[level].some((it) => it.isMatch(fullPath))) return false;
  return true;
};

/** Prints the directory and all sub-directories.
 * @param {string} dir directory to print
 * @param {boolean} ascii if use ascii characters or not (default false)
 * @param {number} currentLevel current level (for recursive)
 * @param {number} maxLevel  max deep level
 * @param {boolean} showNotEmpty  show the not empty string when get the max level of deep
 * @param {string} previous  strings to be printed before every line
 */
const printDirectory = (
  dir,
  ascii = false,
  currentLevel = 0,
  maxLevel = null,
  showNotEmpty = true,
  previous = "",
) => {
  const charset = CharsetProvider.getCharset(ascii);
  const children = fs.readdirSync(dir).filter((it) => {
    const tPath = path.join(dir, it);
    return applyFilter(tPath, currentLevel) && (!gitignoreFile || gitignoreFile.accepts(it));
  });

  // check if got the max level
  if (maxLevel && maxLevel <= currentLevel && children.length > 0) {
    return showNotEmpty
      // eslint-disable-next-line max-len
      ? `${previous}${charset.final}${charset.horizontalDiv}${charset.horizontalDiv}${charset.horizontalDiv}${notEmptyString}${breakLine}` : "";
  }

  const subDirs = children.filter((it) => fs.lstatSync(path.join(dir, it)).isDirectory());
  const files = children.filter((it) => fs.lstatSync(path.join(dir, it)).isFile());
  let result = "";

  // prints subdirectories
  subDirs.forEach((it, index) => {
    const isLast = index === subDirs.length - 1 && files.length === 0;
    const prev = `${isLast
      ? charset.final
      : charset.expand}${charset.horizontalDiv}${charset.horizontalDiv}${charset.horizontalDiv}`;
    const childPrev = `${isLast ? " " : charset.verticalDiv}   `;
    result += `${previous}${prev}${it}/${breakLine}`;

    // Here print children recs
    result += printDirectory(
      path.join(dir, it),
      ascii,
      currentLevel + 1,
      maxLevel,
      showNotEmpty,
      previous + childPrev,
    );
  });

  // print files
  files.forEach((it, index) => {
    const isLast = index === files.length - 1;
    const prev = `${isLast
      ? charset.final
      : charset.expand}${charset.horizontalDiv}${charset.horizontalDiv}${charset.horizontalDiv}`;
    result += `${previous}${prev}${it}${breakLine}`;
  });
  return result;
};

/** Function for making a directory tree in text format.
 * @param {string} targetPath path of the directory to print childrens
 * @param {boolean} ascii if must print the tree using ascii chars or not (default true)
 * @param {number} maxLevel max deep level (default null)
 * @param {boolean} showNotEmpty if maxLevel is set and showNotEmpty,
 * then print a string for saying that it is not empty.
 * @param {Array<FilterRecord>} ignores array of filters to ignore.
 * @param {Array<FilterRecord>} only array of filters for only filtering.
 */
module.exports = (
  targetPath = "./",
  ascii = false,
  maxLevel = null,
  showNotEmpty = false,
  gitignore = false,
  ignores = [],
  only = [],
) => {
  initializeEmptyConfigurations();

  const absoluteTargetPath = getAbsolutePathOrThrow(targetPath);

  configureGitignore(gitignore, absoluteTargetPath);

  configureIgnoreFromInput(ignores);

  configureOnlyFilterFromInput(only);

  return printDirectory(absoluteTargetPath, ascii, 0, maxLevel, showNotEmpty);
};
