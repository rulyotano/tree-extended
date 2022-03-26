import TreeExtended from '../treeExtended';
import helpString from './helpText';
import NodeRunningEnvironment from './NodeRunningEnvironment';
import getConfigurationAndPathFromArguments, { isHelp } from './parse';

export default function printTreeExtendedResult(args: string[] = []) {
  if (isHelp(args)) {
    console.log(helpString);
  } else {
    const { path, configuration } = getConfigurationAndPathFromArguments(args);

    const nodeRunningEnvironment = new NodeRunningEnvironment();
    const treeExtended = new TreeExtended(nodeRunningEnvironment);
    console.log(treeExtended.getDirectoryTree(path, configuration));
  }
}
