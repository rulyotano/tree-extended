#!/usr/bin/env node
/* eslint-disable no-console */

const treeExtended = require("../src/treeExtended");
const FilterConfigurationItem = require("../src/filters/FilterConfigurationItem");
const Configuration = require("../src/Configuration");
const helpString = require("./helpText");

const HELP = "HELP";
const MAX_LEVEL = "MAX_LEVEL";
const SHOW_NOT_EMPTY = "SHOW_NOT_EMPTY";
const GIT_IGNORE = "GIT_IGNORE";
const IGNORES = "IGNORES";
const ONLY = "ONLY";
const CHARSET = "CHARSET";
const CHARSET_SHORT = "CHARSET_SHORT";

const parameters = {
  [HELP]: /^[-|/](\?|help|h)$/, // ['?', 'h', 'help']
  [MAX_LEVEL]: /^[-|/]max=(\d+)$/,
  [SHOW_NOT_EMPTY]: /^[-|/]max-show-not-empty$/,
  [GIT_IGNORE]: /^[-|/]gitignore$/,
  [IGNORES]: /^[-|/]ignore=(.+)$/,
  [ONLY]: /^[-|/]only=(.+)$/,
  [CHARSET]: /^[-|/]charset=(.+)$/,
  [CHARSET_SHORT]: /^[-|/]c=(.+)$/,
};

const getParameterValue = (parameter, parameterValue) => parameters[parameter].exec(parameterValue)[1];

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

  const charsetArgument = args.find((it) => checkParam(CHARSET, it.toLowerCase()));
  const charsetShortArgument = args.find((it) => checkParam(CHARSET_SHORT, it.toLowerCase()));
  const showNotEmpty = args.some((it) => checkParam(SHOW_NOT_EMPTY, it.toLowerCase()));
  const gitignore = args.some((it) => checkParam(GIT_IGNORE, it.toLowerCase()));
  let maxLevel = null;
  let ignores = [];
  let only = [];

  let charset;

  if (charsetArgument) {
    charset = getParameterValue(CHARSET, charsetArgument);
  }

  if (!charset && charsetShortArgument) {
    charset = getParameterValue(CHARSET_SHORT, charsetShortArgument);
  }

  const maxLevelParam = args.find((it) => checkParam(MAX_LEVEL, it.toLowerCase()));
  if (maxLevelParam) maxLevel = Number(getParameterValue(MAX_LEVEL, maxLevelParam));

  const ignoresParam = args.find((it) => checkParam(IGNORES, it.toLowerCase()));
  if (ignoresParam) {
    const ignoresStrValue = getParameterValue(IGNORES, ignoresParam);
    ignores = parseFilterArgument(ignoresStrValue);
  }
  const onlyParam = args.find((it) => checkParam(ONLY, it.toLowerCase()));
  if (onlyParam) {
    const onlyStrValue = getParameterValue(ONLY, onlyParam);
    only = parseFilterArgument(onlyStrValue);
  }

  console.log(treeExtended(path, new Configuration(charset, maxLevel, showNotEmpty, gitignore, ignores, only)));
}
