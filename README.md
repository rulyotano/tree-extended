# Tree Extended

NodeJs make a raw text tree representation of a directory's content. Accept several options

## Requires

NodeJs >= 6.x

## Install

Install as a node's package.

`npm install tree-extended -g`

Then, it is just running `tree-extended` in any directory.

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
```

## Screenshot

![Screenshot](https://github.com/rulyotano/tree-extended/blob/master/image.png)