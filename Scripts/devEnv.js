/**
 * @author Galyfray
 * 
 * @file this file contains the functions that will be used to create the dev environment.
 * 
 * @param {String} html the root folder of the html files to be parsed.
 * @param {String} js the root folder of the js files to be included in the html.
 * @param {String} css the root folder of the css files to be included in the html.
 * @param {String} as the root folder of the assembly scripts files to be compiled.
 */

const fs = require("fs");
const path = require("path");


/** This function will find every file in the given directory and his subdirectories and return an array of all the file names.
 * 
 * @param {String} dir the name of the directory to iterate through.
 */
async function getAllFiles(dir) {
    return fs.promises.readdir(dir).then(async files => {
        const allFiles = [];
        for (let file of files) {

            if (await (
                    fs.promises.stat(path.join(dir, file))
                        .then(stats => stats.isDirectory())
            )) {
                allFiles.concat(
                    await ( getAllFiles(path.join(dir, file)) )
                );
            } else {
                allFiles.push(path.join(dir, file));
            }
        }
        return allFiles;
    });
}

(async ()=>{
    "use strict;";

    // TODO: change to assemblyscript/asc when this shit get fixed + move it back to the beginning of the file.
    const asc = await import("assemblyscript/dist/asc.js");

    // 4 arguments + two string that are always there : "node" and the script file name
    if(process.argv.length < 4+2){
        console.log("Usage: node devEnv.js <html> <js> <css> <as>");
        process.exit(1);
    }

    const START = Date.now();
    const BUILD_DIR = "build";
    const LOG_DIR = path.join(BUILD_DIR,"log");
    const DEV_DIR = path.join(BUILD_DIR,"dev");

    await Promise.all([
        fs.promises.mkdir(BUILD_DIR,{ recursive: true }),
        fs.promises.mkdir(LOG_DIR  ,{ recursive: true }),
        fs.promises.mkdir(DEV_DIR  ,{ recursive: true })
    ]);

    const LOG = await fs.promises.open(path.join(LOG_DIR, (new Date(Date.now())).toISOString().replace(/:/g,"_") + "_dev_env_setup.log"),"w");
    const BUFFER = [];

    try{
        const HTML_SOURCES = await getAllFiles(process.argv[2]);
        // We use path.relative to remove the root folder from the file name.
        const JS_SOURCES  = (await getAllFiles(process.argv[3])).map(file => path.relative(process.argv[3],file));
        const CSS_SOURCES = (await getAllFiles(process.argv[4])).map(file => path.relative(process.argv[4],file));
        const AS_SOURCES  = await getAllFiles(process.argv[5]);

        /*== Compilig AssemblyScript files ==*/

        let result, errorFlag = false;

        for (let file of AS_SOURCES) {
            result = await asc.main([
                file,
                "--outFile", path.join(DEV_DIR,path.relative(process.argv[5],file).replace(/\.ts$/,".wasm")),
            ]);
            if (result.error) {
                errorFlag = true;
                console.log("Compilation failed: " + file);
                BUFFER.push(`[ERROR] Compilation failed: ${file}`);
                BUFFER.push(`[ERROR] ${result.error.message}`);
                BUFFER.push(result.stderr.toString().replace(/\n/g,"\n[ERROR] "));
            }

        }

        if (errorFlag) {
            throw new Error("Compilation failed");
        }

        /*== Evaluating and replacing source tags in the HTML files ==*/

        // The filtering/mapping functions are declared here to avoid the overhead of creating new lambdas every time.
        const FILTER = (source) => regexp.test(source);
        const JS_MAPER = (source) => `${indent}<script src="${source}"></script>\n`;
        const CSS_MAPER = (source) => `${indent}<link rel="stylesheet" href="${source}">\n`;

        const replaceSource = (fileContent,match,mapper,source)=>{
            match = fileContent.substring(match,fileContent.indexOf("\n",match) + 1 ); // Isolating the matched section
            indent = match.substring(0,match.indexOf("<")); // Isolating the indentation

            regexp = new RegExp(
                match.substring(
                    match.indexOf("[")+1,
                    match.lastIndexOf("]")
                ),
                "g"
            ); // Creating the regexp to match the filenames

            return fileContent.replace(
                match,
                source.filter(FILTER).map(mapper).join("")
            ); // Replacing the matched section with the new content
        };
        
        let content = "", match = 0, indent = "", regexp = null, filename;
        
        // We iterate through the html files and replace the sources tag with the asked sources.
        for(let file of HTML_SOURCES){
            BUFFER.push(`[INFO] processing ${file}`);

            await fs.promises.access(file,fs.constants.R_OK);
            content = await fs.promises.readFile(file,"utf8");

            // Replacing the js sources tag with the asked sources.
            match = content.search(/[\t ]*<!-- SCRIPTS \[.*\] -->/);
            if(match !== -1){
                BUFFER.push(`[INFO][${file}] extracting script regexp`);
                content = replaceSource(content,match,JS_MAPER,JS_SOURCES);

            } else {
                BUFFER.push(`[INFO] ${file} does not contain SCRIPTS directive`);
            }

            // Replacing the css sources tag with the asked sources.
            match = content.search(/[\t ]*<!-- STYLES \[.*\] -->/);
            if(match !== -1){
                BUFFER.push(`[INFO][${file}] extracting stylesheet regexp`);
                content = replaceSource(content,match,CSS_MAPER,CSS_SOURCES);

            } else {
                BUFFER.push(`[INFO] ${file} does not contain STYLES directive`);
            }

            // Writing the new file.
            filename = path.join(DEV_DIR ,path.relative(process.argv[2],file));

            // Ensuring that the directory exists.
            await fs.promises.mkdir(path.dirname(filename),{ recursive: true });

            await fs.promises.writeFile(
                filename,
                content
            );
        }

        // Copying all the files to the build folder
        let pending = [];
        
        JS_SOURCES.forEach(source => {
            pending.push(
                fs.promises.copyFile(
                    path.join(process.argv[3],source),
                    path.join(DEV_DIR,source)
                )
            );
        });

        CSS_SOURCES.forEach(source => {
            pending.push(
                fs.promises.copyFile(
                    path.join(process.argv[4],source),
                    path.join(DEV_DIR,source)
                )
            );
        });

        await Promise.all(pending);

    } catch(e) {
        console.error(e);
        LOG.write(BUFFER.join("\n"));
        LOG.write("\nUnexpected error while producing dev env\n ");
        LOG.write(e.stack);
        process.exit(1);
    }

    LOG.write(BUFFER.join("\n"));
    let last = "\nSuccessfully builded dev env in " + (Date.now() - START) + "ms\n";
    console.log(last);
    LOG.write(last);

})(); // IIFE to avoid global scope pollution and being able to use await