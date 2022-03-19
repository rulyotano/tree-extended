import treeExtended from "../treeExtended";
import helpString from "./helpText";
import getConfigurationAndPathFromArguments, {
  isHelp,
} from "./parse";

export default function printTreeExtendedResult(args: string[] = []) {
  if (isHelp(args)) {
    console.log(helpString);
  } else {
    const {
      path,
      configuration,
    } = getConfigurationAndPathFromArguments(args);
    console.log(treeExtended(path, configuration));
  }
}
