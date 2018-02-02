let fs = require("fs");
let path = require("path");

const breakLine = '\n';
const asciiChars = {
    verticalDiv: '|', horizontalDiv: '-', expand: '+', final: '\\' 
};

const noAsciiChars = {
    verticalDiv: '│', horizontalDiv: '─', expand: '├', final: '└' 
};

const printPrevious = (previous = [])=>{
    let result = ''
    previous.forEach(it=>result+=it)
    return result
}

/**Print the directory and all sub directories
 * @param dir {string} directory to print
 * @param ascii {boolean} if use ascii characters or not (default false)
 * @param currentLevel {number} current level (for recursive)
 * @param maxLevel  {number} max deep level
 * @param previous  {array} strings to be printed before every line 
*/
const printDirectory = (dir, ascii = false, currentLevel = 0, maxLevel = null, previous = [])=>{
    let chars = ascii ? asciiChars : noAsciiChars;
    let children = fs.readdirSync(dir);
    let subDirs = children.filter(it=>fs.lstatSync(path.join(dir, it)).isDirectory());
    let files = children.filter(it=>fs.lstatSync(path.join(dir, it)).isFile());
    let result = '';
    let itemPrevious = printPrevious(previous);
    subDirs.forEach((it, index) => {
        let isLast = index === subDirs.length - 1 && files.length === 0;
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        const childPrev = `${isLast ? chars.verticalDiv : ' '}   `;
        result += `${itemPrevious}${prev}${it}${breakLine}`;
        //TODO: Here print children recs
    })    

    files.forEach((it, index)=> {
        let isLast = index === files.length - 1
        const prev = `${isLast ? chars.final : chars.expand}${chars.horizontalDiv}${chars.horizontalDiv}${chars.horizontalDiv}`;
        result += `${itemPrevious}${prev}${it}${breakLine}`;
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