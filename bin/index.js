#!/usr/bin/env node
/* eslint-disable no-console */

const treeExtended = require("../src/tree-extended");
const FilterConfigurationItem = require("../src/filters/FilterConfigurationItem");
const helpString = require("./helpText");

const HELP = "HELP";
const MAX_LEVEL = "MAX_LEVEL";
const SHOW_NOT_EMPTY = "SHOW_NOT_EMPTY";
const ASCII = "ASCII";
const GIT_IGNORE = "GIT_IGNORE";
const IGNORES = "IGNORES";
const ONLY = "ONLY";

const parameters = {
  [HELP]: /^[-|/](\?|help|h)$/, // ['?', 'h', 'help']
  [MAX_LEVEL]: /^[-|/]max=(\d+)$/,
  [SHOW_NOT_EMPTY]: /^[-|/]max-show-not-empty$/,
  [ASCII]: /^[-|/]ascii$/,
  [GIT_IGNORE]: /^[-|/]gitignore$/,
  [IGNORES]: /^[-|/]ignore=(.+)$/,
  [ONLY]: /^[-|/]only=(.+)$/,
};

/** Check if some test value match with one of the predefined parameters (testParam)
 * @param {string} testParam some value of the parameters array for test if testVal is inside it
 * @param {string} testVal value to check in parameters array
 */
const checkParam = (testParam, testVal) => parameters[testParam] && parameters[testParam].test(testVal);

/** Parse the IGNORES and ONLY argument string.
 * @param {string} argString string in the format `[level1:]folder/file name1,
 * [level2:]folder/file name2`
 * @returns {Array<FilterConfiguration>} list of FilterConfiguration items.
 */
const parseFilterArgument = (argString) => {
  const result = [];
  argString.split(",").map((it) => it.trim()).forEach((it) => {
    const itArray = it.split(":");
    if (itArray.length === 1) result.push(new FilterConfigurationItem(itArray[0]));
    else if (itArray.length === 2) result.push(new FilterConfigurationItem(itArray[1], Number(itArray[0])));
  });
  return result;
};

const [, , ...args] = process.argv;

// process the arguments
// check for help
if (args.some((it) => checkParam(HELP, it.toLowerCase()))) {
  console.log(helpString);
} else {
  let path = args[0];

  // check if there is no path parameter (should be the first one)
  if (Object.keys(parameters).some((key) => checkParam(key, path))) path = undefined;

  const ascii = args.some((it) => checkParam(ASCII, it.toLowerCase()));
  const showNotEmpty = args.some((it) => checkParam(SHOW_NOT_EMPTY, it.toLowerCase()));
  const gitignore = args.some((it) => checkParam(GIT_IGNORE, it.toLowerCase()));
  let maxLevel = null;
  let ignores = [];
  let only = [];

  const maxLevelParam = args.find((it) => checkParam(MAX_LEVEL, it.toLowerCase()));
  if (maxLevelParam) maxLevel = Number(parameters[MAX_LEVEL].exec(maxLevelParam)[1]);

  const ignoresParam = args.find((it) => checkParam(IGNORES, it.toLowerCase()));
  if (ignoresParam) {
    const ignoresStrValue = parameters[IGNORES].exec(ignoresParam)[1];
    ignores = parseFilterArgument(ignoresStrValue);
  }
  const onlyParam = args.find((it) => checkParam(ONLY, it.toLowerCase()));
  if (onlyParam) {
    const onlyStrValue = parameters[ONLY].exec(onlyParam)[1];
    only = parseFilterArgument(onlyStrValue);
  }

  console.log(treeExtended(path, ascii, maxLevel, showNotEmpty, gitignore, ignores, only));
}
