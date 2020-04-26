module.exports = `
"tree-extended" is a function for making a directory tree in a text format. You can configure if you want print ascii characters or not. Also has a deep parameter.
    
'tree-extended ["Path for making the tree"] [argument1[="valArg1"]] [argument2[="valArg2"]] [argument3[="valArg3"]]...[argumentn[="valArgn"]]'

arguments:
    (-?, -h, -help): Prints this help
    (-max=max_level): The max deep level
    (-max-show-not-empty): If -max is setted and -max-show-not-empty is setted, show '...' string when level prune.
    (-ascii): Show ascii characters.
    (-gitignore): Ignore the .git/ folder and the content inside .gitignore file.
    (-ignore="[level1:]folder/file name1,  [level2:]folder/file name2, ..."): Ignores folders or files in an optional tree level.
    (-only="[level1:]folder/file name1,  [level2:]folder/file name2, ..."): Filter and only show that folders or files in an optional tree level.`;
