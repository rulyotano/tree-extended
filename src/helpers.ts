import type IRunningEnvironment from './IRunningEnvironment';

export function getAbsolutePathOrThrow(
  targetPath: string,
  runningEnvironment: IRunningEnvironment
) {
  if (runningEnvironment.pathExist(targetPath)) {
    return targetPath;
  }
  const absolutePath = runningEnvironment.pathJoins(
    runningEnvironment.getCurrentPath(),
    targetPath
  );
  if (!runningEnvironment.pathExist(absolutePath)) {
    throw new Error(`Path ${absolutePath} doesn't exist.`);
  }
  return absolutePath;
}

export default {};
