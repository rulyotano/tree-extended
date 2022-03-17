import FilterConfigurationItem from "../filters/FilterConfigurationItem";
import Configuration from "../Configuration";

class ParseParameter {
  constructor(regexExpression) {
    this.regexExpression = regexExpression;
  }

  getValue(value) {
    return this.regexExpression.exec(value)[1];
  }

  check(value) {
    return this.regexExpression.test(value);
  }
}

const parameters = {
  HELP: new ParseParameter(/^[-|/](\?|help|h)$/),
  MAX_LEVEL: new ParseParameter(/^[-|/]max=(\d+)$/),
  SHOW_NOT_EMPTY: new ParseParameter(/^[-|/]max-show-not-empty$/),
  GIT_IGNORE: new ParseParameter(/^[-|/]gitignore$/),
  IGNORES: new ParseParameter(/^[-|/]ignore=(.+)$/),
  ONLY: new ParseParameter(/^[-|/]only=(.+)$/),
  CHARSET: new ParseParameter(/^[-|/]charset=(.+)$/),
  CHARSET_SHORT: new ParseParameter(/^[-|/]c=(.+)$/),
};

const parseFilterArgument = (argString) => {
  const result = [];
  argString.split(",").map((it) => it.trim()).forEach((it) => {
    const itArray = it.split(":");
    if (itArray.length === 1) result.push(new FilterConfigurationItem(itArray[0]));
    else if (itArray.length === 2) result.push(new FilterConfigurationItem(itArray[1], Number(itArray[0])));
  });
  return result;
};

export function isHelp(args) {
  return args.some((it) => parameters.HELP.check(it.toLowerCase()));
}

function getConfigurationAndPathFromArguments(args) {
  let path = args[0];

  // check if there is no path parameter (should be the first one)
  if (Object.keys(parameters).some((key) => parameters[key].check(path))) path = undefined;

  const charsetArgument = args.find((it) => parameters.CHARSET.check(it.toLowerCase()));
  const charsetShortArgument = args.find((it) => parameters.CHARSET_SHORT.check(it.toLowerCase()));
  const showNotEmpty = args.some((it) => parameters.SHOW_NOT_EMPTY.check(it.toLowerCase()));
  const gitignore = args.some((it) => parameters.GIT_IGNORE.check(it.toLowerCase()));
  let maxLevel = null;
  let ignores = [];
  let only = [];

  let charset;

  if (charsetArgument) {
    charset = parameters.CHARSET.getValue(charsetArgument);
  }

  if (!charset && charsetShortArgument) {
    charset = parameters.CHARSET_SHORT.getValue(charsetShortArgument);
  }

  const maxLevelParam = args.find((it) => parameters.MAX_LEVEL.check(it.toLowerCase()));
  if (maxLevelParam) maxLevel = Number(parameters.MAX_LEVEL.getValue(maxLevelParam));

  const ignoresParam = args.find((it) => parameters.IGNORES.check(it.toLowerCase()));
  if (ignoresParam) {
    const ignoresStrValue = parameters.IGNORES.getValue(ignoresParam);
    ignores = parseFilterArgument(ignoresStrValue);
  }
  const onlyParam = args.find((it) => parameters.ONLY.check(it.toLowerCase()));
  if (onlyParam) {
    const onlyStrValue = parameters.ONLY.getValue(onlyParam);
    only = parseFilterArgument(onlyStrValue);
  }

  return {
    path,
    configuration: new Configuration(charset, maxLevel, showNotEmpty, gitignore, ignores, only),
  };
}

export default getConfigurationAndPathFromArguments;
