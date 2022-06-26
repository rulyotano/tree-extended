import type IRunningEnvironment from './IRunningEnvironment';

export async function getAbsolutePathOrThrow(
  targetPath: string,
  runningEnvironment: IRunningEnvironment
) {
  if (await runningEnvironment.pathExist(targetPath)) {
    return targetPath;
  }
  const currentPath = await runningEnvironment.getCurrentPath();
  const absolutePath = runningEnvironment.pathJoins(
    currentPath,
    targetPath
  );
  if (!await runningEnvironment.pathExist(absolutePath)) {
    throw new Error(`Path ${absolutePath} doesn't exist.`);
  }
  return absolutePath;
}

export default {};
