const directories = require("./mockDirectories");
const FilterRecord = require("../filterRecord");

module.exports = {
  cases: [
    {
      description: "Default configuration should return full directory",
      directories: directories.directory1,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: undefined,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: undefined
      },
      expected: `├───a/
│   ├───aa/
│   ├───ab/
│   └───ac/
├───a1/
├───b/
│   ├───ba/
│   │   ├───bafile1.txt
│   │   └───bafile2.txt
│   ├───bb/
│   ├───bc/
│   │   └───bca/
│   │       └───bca-file1.txt
│   ├───bd/
│   └───bfile1.txt
├───c/
├───c1/
└───d/
    ├───d1/
    └───d2/
`
    },
    {
      description: "Max level K, should only show K levels",
      directories: directories.directory1,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: 2,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: undefined
      },
      expected: `├───a/
│   ├───aa/
│   ├───ab/
│   └───ac/
├───a1/
├───b/
│   ├───ba/
│   ├───bb/
│   ├───bc/
│   ├───bd/
│   └───bfile1.txt
├───c/
├───c1/
└───d/
    ├───d1/
    └───d2/
`
    },
    {
      description:
        "When '-max-show-not-empty' option = true should show '...' when cut level folder is not empty",
      directories: directories.directory1,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: 1,
        showNotEmpty: true,
        gitignore: undefined,
        ignores: undefined,
        only: undefined
      },
      expected: `├───a/
│   └───...
├───a1/
├───b/
│   └───...
├───c/
├───c1/
└───d/
    └───...
`
    },
    {
      description: "When ascii option, should only use ascii characters",
      directories: directories.directory1,
      arguments: {
        targetPath: undefined,
        ascii: true,
        maxLevel: 2,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: undefined
      },
      expected: `+---a/
|   +---aa/
|   +---ab/
|   \\---ac/
+---a1/
+---b/
|   +---ba/
|   +---bb/
|   +---bc/
|   +---bd/
|   \\---bfile1.txt
+---c/
+---c1/
\\---d/
    +---d1/
    \\---d2/
`
    },
    {
      description:
        "When -ignores at level 1, level 2, and all levels, should not showing those ignores",
      directories: directories.directory1,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: undefined,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: [
          new FilterRecord("ba", 1),
          new FilterRecord("bafile1", 2),
          new FilterRecord("c")
        ],
        only: undefined
      },
      expected: `├───a/
│   ├───aa/
│   └───ab/
├───a1/
├───b/
│   ├───bb/
│   ├───bd/
│   └───bfile1.txt
└───d/
    ├───d1/
    └───d2/
`
    },
    {
      description:
        "When -only at level 0, level 1, and level 2, should only show those files at such levels",
      directories: directories.directory2,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: undefined,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: [ new FilterRecord("b", 0), new FilterRecord("bc", 1), new FilterRecord("bca", 2) ]
      },
      expected: `├───b/
│   └───bc/
│       └───bca/
│           └───bca-file1.txt
└───ba/
`
    },
    {
      description: "When -only, but matching regex, must match regex",
      directories: directories.directory2,
      arguments: {
        targetPath: undefined,
        ascii: undefined,
        maxLevel: undefined,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: [ new FilterRecord("b$", 0), new FilterRecord("bc", 1), new FilterRecord("bca", 2) ]
      },
      expected: `└───b/
    └───bc/
        └───bca/
            └───bca-file1.txt
`
    },
    {
      description: "When custom target path should only match that directory",
      directories: directories.directory1,
      arguments: {
        targetPath: "./b",
        ascii: undefined,
        maxLevel: undefined,
        showNotEmpty: undefined,
        gitignore: undefined,
        ignores: undefined,
        only: undefined
      },
      expected: `├───ba/
│   ├───bafile1.txt
│   └───bafile2.txt
├───bb/
├───bc/
│   └───bca/
│       └───bca-file1.txt
├───bd/
└───bfile1.txt
`
    },
    {
        description: "When gitignore option, should ignore the items inside .gitignore file",
        directories: directories.directory1Gitignore,
        arguments: {
          targetPath: undefined,
          ascii: undefined,
          maxLevel: undefined,
          showNotEmpty: undefined,
          gitignore: true,
          ignores: undefined,
          only: undefined
        },
        expected: `├───a/
│   ├───aa/
│   ├───ab/
│   └───ac/
├───a1/
├───b/
│   ├───ba/
│   ├───bb/
│   ├───bc/
│   │   └───bca/
│   └───bd/
├───c/
├───c1/
├───d/
│   ├───d1/
│   └───d2/
└───.gitignore
`
      }
  ]
};
