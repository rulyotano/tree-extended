#!/usr/bin/env node

const treeExtended = require('../tree-extended')
const HELP = 'HELP';
const MAX_LEVEL = 'MAX_LEVEL';
const SHOW_NOT_EMPTY = 'SHOW_NOT_EMPTY';
const ASCII = 'ASCII';

const parameters = {
    [HELP]: /^[-|/](\?|help|h)$/, // ['?', 'h', 'help']
    [MAX_LEVEL]: /^[-|/]max=(\d+)$/,
    [SHOW_NOT_EMPTY]: /^[-|/]max-show-not-empty$/,
    [ASCII]: /^[-|/]ascii$/,
}

/**Check if some test value match with one of the predefined parameters (testParam) 
 * @param {string} testParam some value of the parameters array for test if testVal is inside it
 * @param {string} testVal value to check in parameters array
*/
const checkParam = (testParam, testVal) => parameters[testParam] && parameters[testParam].test(testVal)

let args = process.argv.filter((it, index)=>index>1)

//process the arguments
//check for help
if (args.some(it=>checkParam(HELP, it.toLowerCase())))
{
    const helpString = 
`
"tree-extended" is a function for making a directory tree in a text format. You can configure if you want print ascii characters or not. Also has a deep parameter.
    
'tree-extended "Path for making the tree" [argument1[="valArg1"]] [argument2[="valArg2"]] [argument3[="valArg3"]]...[argumentn[="valArgn"]]'

arguments:
    (-?, -h, -help): Prints this help
    (-max=max_level): The max deep level
    (-max-show-not-empty): If -max is setted and -max-show-not-empty is setted, show '...' string when level prune.
    (-ascii): Show ascii characters.`;
    console.log(helpString);
} else {
    let path = args[0];
    let ascii = args.some(it => checkParam(ASCII, it.toLowerCase()))
    let showNotEmpty = args.some(it => checkParam(SHOW_NOT_EMPTY, it.toLowerCase()))
    let maxLevel = null
    
    let maxLevelParam = args.find(it => checkParam(MAX_LEVEL, it.toLowerCase()))
    if (maxLevelParam)
        maxLevel = parameters[MAX_LEVEL].exec(maxLevelParam)[1]*1   //convert to int so *1

    console.log(treeExtended(path, ascii, maxLevel, showNotEmpty));
}
