#!/usr/bin/env node

const treeExtended = require('../tree-extended')
const FilterRecord = require('../filterRecord')
const helpString = require('./helpText')
const HELP = 'HELP';
const MAX_LEVEL = 'MAX_LEVEL';
const SHOW_NOT_EMPTY = 'SHOW_NOT_EMPTY';
const ASCII = 'ASCII';
const GIT_IGNORE = 'GIT_IGNORE';
const IGNORES = 'IGNORES';
const ONLY = 'ONLY';

const parameters = {
    [HELP]: /^[-|/](\?|help|h)$/, // ['?', 'h', 'help']
    [MAX_LEVEL]: /^[-|/]max=(\d+)$/,
    [SHOW_NOT_EMPTY]: /^[-|/]max-show-not-empty$/,
    [ASCII]: /^[-|/]ascii$/,
    [GIT_IGNORE]: /^[-|/]gitignore$/,
    [IGNORES]: /^[-|/]ignore=(.+)$/,
    [ONLY]: /^[-|/]only=(.+)$/,
}

/**Check if some test value match with one of the predefined parameters (testParam) 
 * @param {string} testParam some value of the parameters array for test if testVal is inside it
 * @param {string} testVal value to check in parameters array
*/
const checkParam = (testParam, testVal) => parameters[testParam] && parameters[testParam].test(testVal)

/**Parse the INGONRES and ONLY argument string.
 * @param {string} argString string in the format `[level1:]folder/file name1,  [level2:]folder/file name2, ...`
 * @returns {Array<FilterRecord>} list of FilterRecord items.
 */
const parseFilterArgument = (argString) => {
    let result = []    
    argString.split(',').map(it=>it.trim()).forEach(it=>{
        let itArray = it.split(':');
        if (itArray.length === 1)
            result.push(new FilterRecord(itArray[0]))
        else if (itArray.length === 2)
            result.push(new FilterRecord(itArray[1], itArray[0]*1));
    });
    return result;
}

let [,, ...args] =  process.argv

//process the arguments
//check for help
if (args.some(it=>checkParam(HELP, it.toLowerCase())))
{
    console.log(helpString);
} else {
    let path = args[0];
    
    //check if there is no path parameter (should be the first one)
    if (Object.keys(parameters).some(key=>checkParam(key, path)))
        path = undefined;

    let ascii = args.some(it => checkParam(ASCII, it.toLowerCase()));
    let showNotEmpty = args.some(it => checkParam(SHOW_NOT_EMPTY, it.toLowerCase()));
    let gitignore = args.some(it => checkParam(GIT_IGNORE, it.toLowerCase()));
    let maxLevel = null;
    let ignores = [];
    let onlys = [];
    
    let maxLevelParam = args.find(it => checkParam(MAX_LEVEL, it.toLowerCase()));
    if (maxLevelParam)
        maxLevel = parameters[MAX_LEVEL].exec(maxLevelParam)[1]*1;   //convert to int so *1

    let ignoresParam = args.find(it => checkParam(IGNORES, it.toLowerCase()));
    if (ignoresParam){
        let ignoresStrValue = parameters[IGNORES].exec(ignoresParam)[1];
        ignores = parseFilterArgument(ignoresStrValue);
    }
    let onlyParam = args.find(it => checkParam(ONLY, it.toLowerCase()));
    if (onlyParam){
        let onlyStrValue = parameters[ONLY].exec(onlyParam)[1];
        onlys = parseFilterArgument(onlyStrValue);
    }
    
    console.log(treeExtended(path, ascii, maxLevel, showNotEmpty, gitignore, ignores, onlys));
}
