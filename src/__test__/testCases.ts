import directories from "./mockDirectories";
import Configuration from "../Configuration";
import asciiCharset from "../directory/directoryWriter/charset/ascii";
import utf8Charset from "../directory/directoryWriter/charset/utf8";

export interface IDirectory {
  [key: string]: IDirectory | string | undefined
}

export interface ITestCase {
  description: string,
    directories?: IDirectory,
    arguments: {
      targetPath?: string,
      configuration: Configuration,
    },
    expected: string
}

const testCases: ITestCase[] = [{
  description: "Default configuration should return full directory",
  directories: directories.directory1,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(),
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
`,
},
{
  description: "Max level K, should only show K levels",
  directories: directories.directory1,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(utf8Charset.key, 2),
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
`,
},
{
  description: "When '-max-show-not-empty' option = true should show '...' when cut level folder is not empty",
  directories: directories.directory1,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, 1, true),
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
`,
},
{
  description: "When ascii option, should only use ascii characters",
  directories: directories.directory1,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(asciiCharset.key, 2),
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
`,
},
{
  description: "When -ignores at level 1, level 2, and all levels, should not showing those ignores",
  directories: directories.directory1,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, undefined, "1:ba, 2:bafile1, c"),
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
`,
},
{
  description: "When -only at level 0, level 1, and level 2, should only show those files at such levels",
  directories: directories.directory2,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, undefined, undefined, "0:b, 1:bc, 2:bca"),
  },
  expected: `├───b/
│   └───bc/
│       └───bca/
│           └───bca-file1.txt
└───ba/
`,
},
{
  description: "When -only, but matching regex, must match regex",
  directories: directories.directory2,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, undefined, undefined, "0:b$, 1:bc, 2:bca"),
  },
  expected: `└───b/
    └───bc/
        └───bca/
            └───bca-file1.txt
`,
},
{
  description: "When custom target path should only match that directory",
  directories: directories.directory1,
  arguments: {
    targetPath: "./b",
    configuration: new Configuration(),
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
`,
},
{
  description: "When gitignore option, should ignore the items inside .gitignore file",
  directories: directories.directory1Gitignore,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, true),
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
`,
},
{
  description: "When ignore filter without level, should apply it to all levels",
  directories: directories.directoryExcludeSeveralLevels,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, true, 'b'),
  },
  expected: `└───aa/
    └───a.txt
`
},
{
  description: "Only filter global case",
  directories: directories.onlyGlobalFilter,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, 3, undefined, true, undefined, 'b,d,c'),
  },
  expected: `├───bbb/
│   └───ddd/
│       └───d.txt
└───ccc/
    └───d.txt
`
},
{
  description: "Only filter, when level filter match also root, should apply level filter correctly",
  directories: directories.onlyFilterNestedByLevel,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, true, undefined, '2:aaa'),
  },
  expected: `└───aaa/
    └───bbb/
        └───aaa/
`
},
{
  description: "Only filter, when having global filters and level specific filters, should include level specific items matching",
  directories: directories.onlyFilterNestedByLevel,
  arguments: {
    targetPath: undefined,
    configuration: new Configuration(undefined, undefined, undefined, true, undefined, 'aaa,bbb,2:ddd'),
  },
  expected: `└───aaa/
    └───bbb/
        ├───aaa/
        └───ddd/
`
},
];

export default {
  cases: testCases,
};
