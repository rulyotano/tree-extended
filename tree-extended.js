let fs = require("fs");
let path = require("path");

const breakLine = '\n';
const notEmptyString = '...';
const asciiChars = {
    verticalDiv: '|', horizontalDiv: '-', expand: '+', final: '\\' 
};

const noAsciiChars = {
    verticalDiv: '│', horizontalDiv: '─', expand: '├', final: '└' 
};

/**Prints the directory and all sub-directories.
 * @param {string} dir directory to print
 * @param {boolean} ascii if use ascii characters or not (default false)
 * @param {number} currentLevel current level (for recursive)
 * @param {number} maxLevel  max deep level
 * @param {boolean} showNotEmpty  show the not empty string when get the max level of deep
 * @param {string} previous  strings to be printed before every line 
*/
const printDirectory = (dir, ascii = false, currentLevel = 0, maxLevel = null, showNotEmpty = true, previous = '')=>{
    let chars = ascii ? asciiChars : noAsciiChars;
    let children = fs.readdirSync(dir);

    //check if got the max level
    if (maxLevel && maxLevel <= currentLevel && children.length > 0) {
        return showNotEmpty ? `${previous}${chars.final}${notEmptyString}${breakLine}` : '';                        
    }

    let subDirs = children.filter(it=>fs.lstatSync(path.join(dir, it)).isDirectory());
    let files = children.filter(it=>fs.lstatSync(path.join(dir, it)).isFile());
    let result = '';

    //prints subdirectories
    subDirs.forEach((it, index) => {
        let isLast = index === subDirs.length - 1 && files.length === 0;
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        const childPrev = `${isLast ? ' ' : chars.verticalDiv}   `;
        result += `${previous}${prev}${it}/${breakLine}`;

        //Here print children recs
        result += printDirectory(path.join(dir, it), ascii, currentLevel+1, maxLevel, showNotEmpty, previous + childPrev);
    })    

    //print files
    files.forEach((it, index)=> {
        let isLast = index === files.length - 1
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        result += `${previous}${prev}${it}${breakLine}`;
    });
    return result;
}

/**Function for making a directory tree in text format.
 * @param {string} targetPath path of the directory to print childrens
 * @param {boolean} ascii if must print the tree using ascii chars or not (default true)
 * @param {number} maxLevel max deep level (default null)
 * @param {boolean} showNotEmpty if maxLevel is setted and showNotEmpty, then print a string for saying that it is not empty.
*/
module.exports = treeExtended = (targetPath = './', ascii = false, maxLevel = null, showNotEmpty = false)=>{
    if (!fs.existsSync(targetPath)){
        targetPath = path.join(process.execPath, targetPath);
        if (!fs.existsSync(targetPath))
            throw `Path ${targetPath} doesn't exist.`        
    }
    return printDirectory(targetPath, ascii, 0, maxLevel, showNotEmpty);
}