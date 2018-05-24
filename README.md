# Tree Extended

NodeJs make a raw text tree representation of a directory's content. Accept several options

## Requires

NodeJs >= 6.x

## Install

Install as a node's package.

`npm install tree-extended -g`

Then, it is just running `tree-extended` in any directory.

## Collaborate

You can contribute by forking the project on [GitHub](https://github.com/rulyotano/tree-extended).

## Doc

Run `tree-extended -h` for view the help.

```
"tree-extended" is a function for making a directory tree in a text format. You can configure if you want print ascii characters or not. Also has a deep parameter.
    
'tree-extended "Path for making the tree" [-argument1[="valArg1"]] [-argument2[="valArg2"]] [-argument3[="valArg3"]]...[-argumentn[="valArgn"]]'

arguments:
    (-?, -h, -help): Prints this help
    (-max=max_level): The max deep level
    (-max-show-not-empty): If -max is setted and -max-show-not-empty is setted, show '...' string when level prune.
    (-ascii): Show ascii characters.
    (-gitignore): Ignore the .git/ folder and the content inside .gitignore file.
    (-ignore="[level1:]folder/file name1,  [level2:]folder/file name2, ..."): Ignores folders or files in an optional tree level.
    (-only="[level1:]folder/file name1,  [level2:]folder/file name2, ..."): Filter and only show that folders or files in an optional tree level.
```

## Screenshot

![Screenshot](https://raw.githubusercontent.com/rulyotano/tree-extended/master/image.png)

## Samples
### Basic

Command: `tree-extended`

Directory Tree:

```
├───a/
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
```

### Max Level

Command: `tree-extended -max=2`

Directory Tree:

```
├───a/
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
```

### Max Level and Show not empty

Command: `tree-extended -max=1 -max-show-not-empty`

Directory Tree:

```
├───a/
│   └───...
├───a1/
├───b/
│   └───...
├───c/
├───c1/
└───d/
    └───...
```

### Ascii chars

Command: `tree-extended -max=2 -ascii`

Directory Tree:

```
+---a/
|   +---aa/
|   +---ab/
|   \---ac/
+---a1/
+---b/
|   +---ba/
|   +---bb/
|   +---bc/
|   +---bd/
|   \---bfile1.txt
+---c/
+---c1/
\---d/
    +---d1/
    \---d2/
```

### Ignores

Command: `tree-extended -ignore="1:ba, 2:bafile1, c"`

Directory Tree:

```
├───a/
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
```

### Only

Command: `tree-extended -only="0:b, 1:bc, 2:bca"`

Directory Tree:

```
├───b/
│   └───bc/
│       └───bca/
│           └───bca-file1.txt
└───ba/
```

In this example you can see you can restrict to only one path (or many). But here we can see that like the restriction is `0:b` (in the level `0` restrict to `b`) also `ba/` is included. For avoiding this, we can use regular expressions in the patterns.

Command: `tree-extended -only="0:b$, 1:bc, 2:bca"`

Directory Tree:

```
└───b/
    └───bc/
        └───bca/
            └───bca-file1.txt
```
