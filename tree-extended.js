const fs = require("fs");
const path = require("path");
const gitignoreParser = require("gitignore-parser");
const os = require('os');

const breakLine = "\n";
const notEmptyString = "...";
const asciiChars = {
  verticalDiv: "|",
  horizontalDiv: "-",
  expand: "+",
  final: "\\"
};

const noAsciiChars = {
  verticalDiv: "│",
  horizontalDiv: "─",
  expand: "├",
  final: "└"
};

let _gitignore = false;
let _gitignoreFile = null;
let _ignoresMaps = {};
let _onlyMaps = {};

/**Configurates global gitignore variables. Before compile gitingore file content, pre-process lines for removing slash ending.
 * This is needed for the well performance of the `gitignore-parser` lib. 
 * @param {boolean} useGitignore it is true if flag for gitignore is on.
 * @param {string} targetPath path from where the dir tree is going to be generated
 */
const configGitignore = (useGitignore, targetPath) => {
  _gitignore = useGitignore;
  const gitignorePath = path.join(targetPath, ".gitignore");
  if (_gitignore && fs.existsSync(gitignorePath))
    _gitignoreFile = gitignoreParser.compile(
      parseGitFileWithRoutesEndingInName(gitignorePath)
    );
};

const parseGitFileWithRoutesEndingInName = gitignorePath => {
  const endOfLine = os.EOL;
  
  return fs
    .readFileSync(gitignorePath, "utf8")
    .split(endOfLine)
    .map(it => {
      let line = it.trimRight();
      if (line.endsWith("/") || line.endsWith("\\")) return line.slice(0, -1);
      return line;
    })
    .join(endOfLine)
}

/**Apply the filters based on ignores and only filter records. */
const applyFilter = (fullPath, level) => {
  //when have gitignore config, ignore the .git/ folder
  if (_gitignore && fullPath.match(/\.git[\/|\\]?$/)) return false;

  //if exist general only filters, but all them missmatch the path, then return false
  if (_onlyMaps[null] && _onlyMaps[null].every(it => !it.isMatch(fullPath))) return false;
  //a more specific case, has only maps of its level
  if (_onlyMaps[level] && _onlyMaps[level].every(it => !it.isMatch(fullPath))) return false;

  //if exist general ingore filters, and exist a match with the path, then return false
  if (_ignoresMaps[null] && _ignoresMaps[null].some(it => it.isMatch(fullPath))) return false;

  //a more specific case, has ignore maps of its level
  if (_ignoresMaps[level] && _ignoresMaps[level].some(it => it.isMatch(fullPath))) return false;
  return true;
};

/**Prints the directory and all sub-directories.
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
  previous = ""
) => {
  let chars = ascii ? asciiChars : noAsciiChars;
  let children = fs.readdirSync(dir).filter(it => {
    let tPath = path.join(dir, it);
    return applyFilter(tPath, currentLevel) && (!_gitignoreFile || _gitignoreFile.accepts(it));
  });

  //check if got the max level
  if (maxLevel && maxLevel <= currentLevel && children.length > 0) {
    return showNotEmpty
      ? `${previous}${chars.final}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}${notEmptyString}${breakLine}`
      : "";
  }

  let subDirs = children.filter(it => fs.lstatSync(path.join(dir, it)).isDirectory());
  let files = children.filter(it => fs.lstatSync(path.join(dir, it)).isFile());
  let result = "";

  //prints subdirectories
  subDirs.forEach((it, index) => {
    let isLast = index === subDirs.length - 1 && files.length === 0;
    const prev = `${isLast
      ? chars.final
      : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
    const childPrev = `${isLast ? " " : chars.verticalDiv}   `;
    result += `${previous}${prev}${it}/${breakLine}`;

    //Here print children recs
    result += printDirectory(
      path.join(dir, it),
      ascii,
      currentLevel + 1,
      maxLevel,
      showNotEmpty,
      previous + childPrev
    );
  });

  //print files
  files.forEach((it, index) => {
    let isLast = index === files.length - 1;
    const prev = `${isLast
      ? chars.final
      : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
    result += `${previous}${prev}${it}${breakLine}`;
  });
  return result;
};

/**Function for making a directory tree in text format.
 * @param {string} targetPath path of the directory to print childrens
 * @param {boolean} ascii if must print the tree using ascii chars or not (default true)
 * @param {number} maxLevel max deep level (default null)
 * @param {boolean} showNotEmpty if maxLevel is setted and showNotEmpty, then print a string for saying that it is not empty.
 * @param {Array<FilterRecord>} ignores array of filters to ignore.
 * @param {Array<FilterRecord>} only array of filters for only filtering.
*/
module.exports = treeExtended = (
  targetPath = "./",
  ascii = false,
  maxLevel = null,
  showNotEmpty = false,
  gitignore = false,
  ignores = [],
  only = []
) => {
  initialize();

  if (!fs.existsSync(targetPath)) {
    targetPath = path.join(process.execPath, targetPath);
    if (!fs.existsSync(targetPath)) throw `Path ${targetPath} doesn't exist.`;
  }

  //configurates git ingore
  configGitignore(gitignore, targetPath);

  ignores.forEach(it => {
    if (!_ignoresMaps[it.deep]) _ignoresMaps[it.deep] = [];
    _ignoresMaps[it.deep].push(it);
  });
  //fill onlyMap
  only.forEach(it => {
    if (!_onlyMaps[it.deep]) _onlyMaps[it.deep] = [];
    _onlyMaps[it.deep].push(it);
  });
  return printDirectory(targetPath, ascii, 0, maxLevel, showNotEmpty);
};

const initialize = () => {
  _gitignore = false;
  _gitignoreFile = null;
  _ignoresMaps = {};
  _onlyMaps = {};
};
