let fs = require("fs");
let path = require("path");

const breakLine = '\n';
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
 * @param {string} previous  strings to be printed before every line 
*/
const printDirectory = (dir, ascii = false, currentLevel = 0, maxLevel = null, previous = '')=>{
    let chars = ascii ? asciiChars : noAsciiChars;
    let children = fs.readdirSync(dir);
    let subDirs = children.filter(it=>fs.lstatSync(path.join(dir, it)).isDirectory());
    let files = children.filter(it=>fs.lstatSync(path.join(dir, it)).isFile());
    let result = '';

    //prints subdirectories
    subDirs.forEach((it, index) => {
        let isLast = index === subDirs.length - 1 && files.length === 0;
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        const childPrev = `${isLast ? ' ' : chars.verticalDiv}   `;
        result += `${previous}${prev}${it}${breakLine}`;

        //Here print children recs
        result += printDirectory(path.join(dir, it), ascii, currentLevel+1, maxLevel, previous + childPrev);
    })    

    //print files
    files.forEach((it, index)=> {
        let isLast = index === files.length - 1
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        result += `${previous}${prev}${it}${breakLine}`;
    });
    return result;
}

/**Function for making a  */
module.exports = treeExtended = (targetPath = './')=>{
    if (!fs.existsSync(targetPath)){
        targetPath = path.join(process.execPath, targetPath);
        if (!fs.existsSync(targetPath))
            throw `Path ${targetPath} doesn't exist.`        
    }
    console.log(`Directory ${targetPath}`);
    return printDirectory(targetPath);
}