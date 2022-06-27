import Configuration from '../Configuration';

class ParseParameter {
  regexExpression: RegExp;

  constructor(regexExpression: RegExp) {
    this.regexExpression = regexExpression;
  }

  getValue(value: string): string {
    return this.regexExpression.exec(value)[1];
  }

  check(value: string): boolean {
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

type parameterKey =
  | 'HELP'
  | 'MAX_LEVEL'
  | 'SHOW_NOT_EMPTY'
  | 'GIT_IGNORE'
  | 'IGNORES'
  | 'ONLY'
  | 'CHARSET'
  | 'CHARSET_SHORT';

export function isHelp(args: string[]): boolean {
  return args.some(it => parameters.HELP.check(it.toLowerCase()));
}

function getConfigurationAndPathFromArguments(args: string[]) {
  let path: string = args[0];

  if (Object.keys(parameters).some((key: string) => parameters[key as parameterKey].check(path)))
    path = undefined;

  const charsetArgument = args.find(it => parameters.CHARSET.check(it.toLowerCase()));
  const charsetShortArgument = args.find(it => parameters.CHARSET_SHORT.check(it.toLowerCase()));
  const showNotEmpty = args.some(it => parameters.SHOW_NOT_EMPTY.check(it.toLowerCase()));
  const gitignore = args.some(it => parameters.GIT_IGNORE.check(it.toLowerCase()));
  let maxLevel = null;

  let charset;

  if (charsetArgument) {
    charset = parameters.CHARSET.getValue(charsetArgument);
  }

  if (!charset && charsetShortArgument) {
    charset = parameters.CHARSET_SHORT.getValue(charsetShortArgument);
  }

  const maxLevelParam = args.find(it => parameters.MAX_LEVEL.check(it.toLowerCase()));
  if (maxLevelParam) maxLevel = Number(parameters.MAX_LEVEL.getValue(maxLevelParam));

  const ignoresParam = args.find(it => parameters.IGNORES.check(it.toLowerCase()));
  let ignoresStrValue = '';
  if (ignoresParam) {
    ignoresStrValue = parameters.IGNORES.getValue(ignoresParam);
  }
  const onlyParam = args.find(it => parameters.ONLY.check(it.toLowerCase()));
  let onlyStrValue = '';
  if (onlyParam) {
    onlyStrValue = parameters.ONLY.getValue(onlyParam);
  }

  return {
    path,
    configuration: new Configuration(
      charset,
      maxLevel,
      showNotEmpty,
      gitignore,
      ignoresStrValue,
      onlyStrValue
    ),
  };
}

export default getConfigurationAndPathFromArguments;
