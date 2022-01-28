const fs = require("fs");
const path = require("path");

module.exports = {
  getAbsolutePathOrThrow: (targetPath) => {
    if (fs.existsSync(targetPath)) {
      return targetPath;
    }
    const absolutePath = path.join(process.execPath, targetPath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`Path ${absolutePath} doesn't exist.`);
    }
    return absolutePath;
  },
};
