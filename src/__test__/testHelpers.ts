// eslint-disable-next-line import/no-extraneous-dependencies
import * as mockFs from "mock-fs";

export const mockGitignoreInFileSystem = (gitignoreContent: any, directoryName: string) => {
  mockFs({
    [directoryName]: {
      ".gitignore": gitignoreContent,
    },
  });
};

export default {};
