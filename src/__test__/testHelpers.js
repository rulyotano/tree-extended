// eslint-disable-next-line import/no-extraneous-dependencies
const mockFs = require("mock-fs");

const mockGitignoreInFileSystem = (gitignoreContent, directoryName) => {
  mockFs({
    [directoryName]: {
      ".gitignore": gitignoreContent,
    },
  });
};

module.exports = {
  mockGitignoreInFileSystem,
};
