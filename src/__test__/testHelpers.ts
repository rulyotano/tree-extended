import * as mockFs from "mock-fs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockGitignoreInFileSystem = (gitignoreContent: any, directoryName: string) => {
  mockFs({
    [directoryName]: {
      ".gitignore": gitignoreContent,
    },
  });
};

export default {};
