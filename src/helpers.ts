import { existsSync } from "fs";
import { join } from "path";

export function getAbsolutePathOrThrow(targetPath: string) {
  if (existsSync(targetPath)) {
    return targetPath;
  }
  const absolutePath = join(process.execPath, targetPath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Path ${absolutePath} doesn't exist.`);
  }
  return absolutePath;
}

export default {};
