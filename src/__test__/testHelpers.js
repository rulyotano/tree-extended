// eslint-disable-next-line import/no-extraneous-dependencies
import mockFs from "mock-fs";

export const mockGitignoreInFileSystem = (gitignoreContent, directoryName) => {
  mockFs({
    [directoryName]: {
      ".gitignore": gitignoreContent,
    },
  });
};

export default {};
