const directory1 = {
  a: {
    aa: {},
    ab: {},
    ac: {}
  },
  a1: {},
  b: {
    ba: {
      "bafile1.txt": "file1",
      "bafile2.txt": "file2"
    },
    bb: {},
    bc: {
      bca: {
        "bca-file1.txt": "bca file 1 text"
      }
    },
    bd: {},
    "bfile1.txt": ""
  },
  c: {},
  c1: {},
  d: {
    d1: {},
    d2: {}
  }
};

const directory2 = {
  ...directory1,
  b: {
    ...directory1.b,
    ba: undefined
  },
  ba: {
    ...directory1.b.ba
  }
};

delete directory2.b.ba;

module.exports = {
  directory1,
  directory2,
  directory1Gitignore: {
    ...directory1,
    ".gitignore": "*.txt"
  }
};
