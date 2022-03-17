import fs from "fs";
import path from "path";

export function getAbsolutePathOrThrow(targetPath) {
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  const absolutePath = path.join(process.execPath, targetPath);
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Path ${absolutePath} doesn't exist.`);
  }
  return absolutePath;
}

export default {};
