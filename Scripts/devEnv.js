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

const {ESLint} = require("eslint");
const fs = require("fs");
const path = require("path");


/** This function will find every file in the given directory and his subdirectories and return an array of all the file names.
 *
 * @param {String} dir the name of the directory to iterate through.
 */
async function getAllFiles(dir) {
    return fs.promises.readdir(dir).then(async files => {
        const allFiles = [];

        // For each element we check if it is a directory or a file.
        // If it is a file then we add it to the array and return nothing, the promise.all will stop at the enclosing .then.
        // If it is a directory we call the function again with the new directory
        // We then return the new promise which once resolved will add all files to the array.
        await Promise.all(
            files.map(file => {
                return fs.promises.stat(path.join(dir, file))
                    .then(stats => stats.isDirectory())
                    .then(isDir => {
                        if (isDir) {
                            return getAllFiles(path.join(dir, file)).then(files => allFiles.push(...files));
                        } else {
                            allFiles.push(path.join(dir, file));
                        }
                    });
            })
        );

        return allFiles;
    });
}

/**
 * @typedef {Object} DirOutput
 * @property {fs.promises.FileHandle} LOG The log file.
 * @property {String} WEB_DIR The relative path to the web directory.
 * @property {String} SERVER_DIR The relative path to the server directory.
 */
/**
 * @param {number} START The time at which the script started.
 * @param {string} scope the scope of the process must be either "web", "server" or "all".
 * @returns {DirOutput} An object containing the log file, the web directory and the server directory.
 */
async function buildDirs(START, scope) {

    // Making all the paths relative to this file.
    const BUILD_DIR = "build";
    const LOG_DIR = path.join(BUILD_DIR, "log");
    const DEV_DIR = path.join(BUILD_DIR, "dev");
    const WEB_DIR = path.join(DEV_DIR, "web");
    const SERVER_DIR = path.join(DEV_DIR, "server");

    try {
        if (scope === "all") {
            await fs.promises.access(DEV_DIR, fs.constants.F_OK).then(() => {
                fs.promises.rm(DEV_DIR, {recursive: true});
            });
        } else if (scope === "web") {
            await fs.promises.access(WEB_DIR, fs.constants.F_OK).then(() => {
                fs.promises.rm(WEB_DIR, {recursive: true});
            });
        } else if (scope === "server") {
            await fs.promises.access(SERVER_DIR, fs.constants.F_OK).then(() => {
                fs.promises.rm(SERVER_DIR, {recursive: true});
            });
        }
    } catch (e) {
        // Do nothing
    }

    await Promise.all([
        fs.promises.mkdir(LOG_DIR, {recursive: true}),
        fs.promises.mkdir(WEB_DIR, {recursive: true}),
        fs.promises.mkdir(SERVER_DIR, {recursive: true})
    ]);

    const LOG = await fs.promises.open(
        path.join(
            LOG_DIR,
            new Date(START)
                .toISOString()
                .replace(/:/g, "_") +
                "_dev_env_setup.log"),
        "w"
    );

    return {
        LOG,
        WEB_DIR,
        SERVER_DIR
    };
}

/**
 * Lint the given files with eslint and applies all posssible fixes.
 * @param {Array} BUFFER a buffer to push the logs to.
 * @param  {...string} files the files to lint.
 */
async function lintFiles(BUFFER, ...files) {
    BUFFER.push("[INFO][LINT] Linting files ...");

    try {
        const LINTER = new ESLint({fix: true});
        const FORMATTER = await LINTER.loadFormatter("compact");

        const LINT_RESULTS = await LINTER.lintFiles(files);

        BUFFER.push("[INFO][LINT] Linting results:");
        BUFFER.push(
            ("[INFO][LINT] " + FORMATTER.format(LINT_RESULTS))
                .trim()
                .replace(/\n/g, "\n[INFO][LINT] ")
        );

        await ESLint.outputFixes(LINT_RESULTS);

        if (
            LINT_RESULTS.some(result => {
                return result.fatalErrorCount > 0 ||
                    result.warningCount > result.fixableWarningCount ||
                    result.errorCount > result.fixableErrorCount;
            })
        ) {
            BUFFER.push("[ERROR][LINT] Linting failed.");
            console.log("[ERROR][LINT] Linter failed to fix all problem, see log file for details.");
            throw new Error("Linting failed");
        } else {
            BUFFER.push("[INFO][LINT] Linting successful.");
        }
    } catch (e) {
        BUFFER.push("[ERROR][LINT] Linting failed due to an unexpected error.");
        throw e;
    }
}

/**
 * This function will parse the HTML file to find tags that indicate the files to include.
 * Once the tags are found, the files are included in the HTML file,
 * the tags are removed and the HTML file is saved to the destination folder.
 *
 * @param {Array} BUFFER a buffer to push the logs to.
 * @param {string[]} HTML_SOURCES the list of all the HTML source files
 * @param {string[]} CSS_SOURCES the list of all the CSS source files
 * @param {string[]} JS_SOURCES the list of all the JS source files
 * @param {string} WEB_DIR the destination folder for the parsed HTML files.
 * @param {string} WEB_HTML the source folder of the HTML files
 */
async function mapSources(BUFFER, HTML_SOURCES, CSS_SOURCES, JS_SOURCES, WEB_DIR, WEB_HTML) {
    BUFFER.push("[INFO][HTML] Mapping sources into html files...");
    try {
        const JS_MAPER = indent => {
            return source => `${indent}<script src="${source}"></script>\n`;
        };
        const CSS_MAPER = indent => {
            return source => `${indent}<link rel="stylesheet" href="${source}">\n`;
        };

        const replaceSource = (fileContent, match, mapper, source) => {
            match = fileContent.substring(match, fileContent.indexOf("\n", match) + 1); // Isolating the matched section
            let indent = match.substring(0, match.indexOf("<")); // Isolating the indentation

            // Creating the regexp to match the filenames
            let regexp = new RegExp(
                match.substring(
                    match.indexOf("[") + 1,
                    match.lastIndexOf("]")
                ),
                "g"
            );

            // Replacing the matched section with the new content
            return fileContent.replace(
                match,
                source.filter(
                    file => regexp.test(file)
                ).map(mapper(indent))
                    .join("")
            );
        };

        await Promise.all(HTML_SOURCES.map(async file => {
            BUFFER.push(`[INFO][HTML] processing ${file}`);
            return fs.promises.readFile(file, "utf8").then(fileContent => {

                // Replacing the js sources tag with the asked sources.
                let match = fileContent.search(/[\t ]*<!-- SCRIPTS \[.*\] -->/);

                if (match !== -1) {
                    BUFFER.push(`[INFO][HTML][${file}] extracting script regexp`);
                    fileContent = replaceSource(fileContent, match, JS_MAPER, JS_SOURCES);
                } else {
                    BUFFER.push(`[INFO][HTML] ${file} does not contain SCRIPTS directive`);
                }

                // Replacing the css sources tag with the asked sources.
                match = fileContent.search(/[\t ]*<!-- STYLES \[.*\] -->/);

                if (match !== -1) {
                    BUFFER.push(`[INFO][HTML][${file}] extracting stylesheet regexp`);
                    fileContent = replaceSource(fileContent, match, CSS_MAPER, CSS_SOURCES);
                } else {
                    BUFFER.push(`[INFO][HTML] ${file} does not contain STYLES directive`);
                }

                // Returning the new file content
                return fileContent;
            })
                .then(async fileContent => {
                    let filename = path.join(WEB_DIR, path.relative(WEB_HTML, file));
                    await fs.promises.mkdir(path.dirname(filename), {recursive: true});
                    return fs.promises.writeFile(filename, fileContent);
                });
        }));
        BUFFER.push("[INFO][HTML] Mapping successful.");
    } catch (e) {
        BUFFER.push("[ERROR][HTML] Unable to succesfully map the sources into the HTML files");
        throw e;
    }

}

/** This function aims to go from a source file to a destination file.
 * @callback sourceTransformerCallback
 * @param {String} file the filename to transform.
 * @returns {String} the transformed filename.
 */
/**
 * This function will copy the given files to their destination.
 * Their destination is defined by the TRANSFORM function.
 * @param {Array} BUFFER a buffer to push the logs to.
 * @param {sourceTransformerCallback} TRANSFORM the function used to transform the source filenames to the destination filenames.
 * @param  {...string} SOURCES the filenames of the files to copy.
 * @see {@link sourceTransformerCallback}
 */
async function copyAll(BUFFER, TRANSFORM, ...SOURCES) {
    BUFFER.push("[INFO][COPY] Copying files...");
    try {
        await Promise.all(SOURCES.map(async file => {
            let filename = TRANSFORM(file);
            await fs.promises.mkdir(path.dirname(filename), {recursive: true}).then(() => {
                return fs.promises.copyFile(
                    file,
                    filename
                );
            });
        }));
        BUFFER.push("[INFO][COPY] Copying successful.");
    } catch (e) {
        BUFFER.push("[ERROR][COPY] Failed to copy all the files");
        throw e;
    }

}

/**
 * This function will do everything needed to build the web site part of the project.
 * @param {Array} BUFFER a buffer to push the logs to.
 * @param {string} WEB_DIR the destination folder for the builded web pages, scripts and CSS.
 */
async function buildWeb(BUFFER, WEB_DIR) {
    BUFFER.push("[INFO][WEB] Building web...");
    try {
        const WEB_HTML = "Web/HTML",
            WEB_CSS = "Web/CSS",
            WEB_JS = "Web/JS",
            WEB_RESSOURCE = "Web/Ressources";

        const HTML_SOURCES = await getAllFiles(WEB_HTML);

        // We use path.relative to remove the root folder from the file name.
        const JS_SOURCES = (await getAllFiles(WEB_JS)).map(file => path.relative(WEB_JS, file));
        const CSS_SOURCES = (await getAllFiles(WEB_CSS)).map(file => path.relative(WEB_CSS, file));
        const RESSOURCES = await getAllFiles(WEB_RESSOURCE);

        await lintFiles(
            BUFFER,
            WEB_HTML + "/**/*.html",
            WEB_JS + "/**/*.js"
        );

        await mapSources(
            BUFFER,
            HTML_SOURCES,
            CSS_SOURCES,
            JS_SOURCES,
            WEB_DIR,
            WEB_HTML
        );

        await copyAll(
            BUFFER,
            file => {

                if (file.includes(WEB_JS)) {

                    file = path.relative(WEB_JS, file);
                } else if (file.includes(WEB_CSS)) {

                    file = path.relative(WEB_CSS, file);
                } else if (file.includes(WEB_RESSOURCE)) {

                    file = path.relative(WEB_RESSOURCE, file);
                }

                return path.join(WEB_DIR, file);
            },
            ...JS_SOURCES.map(file => path.join(WEB_JS, file)),
            ...CSS_SOURCES.map(file => path.join(WEB_CSS, file)),
            ...RESSOURCES
        );
        BUFFER.push("[INFO][WEB] Building successful.");
    } catch (e) {
        BUFFER.push("[ERROR][WEB] Unexpected error while building the web site");
        throw e;
    }

}

/**
 * This function will do everything needed to build the server part of the project.
 * @param {Array} BUFFER a buffer to push the logs to.
 * @param {string} SERVER_DIR the destination folder for the builded server scripts.
 */
async function buildServer(BUFFER, SERVER_DIR) {
    BUFFER.push("[INFO][SERVER] Building server...");
    const SERVER_JS = "Server/JS",
        SERVER_RESSOURCE = "Server/Ressources";

    try {

        const JS_SOURCES = await getAllFiles(SERVER_JS);

        await lintFiles(
            BUFFER,
            SERVER_JS + "/**/*.js"
        );


        await copyAll(
            BUFFER,
            file => {

                if (file.includes(SERVER_JS)) {

                    file = path.relative(SERVER_JS, file);
                } else if (file.includes(SERVER_RESSOURCE)) {

                    file = path.relative(SERVER_RESSOURCE, file);
                }
                return path.join(SERVER_DIR, file);
            },
            ...JS_SOURCES,
            ...await getAllFiles(SERVER_RESSOURCE)
        );

    } catch (e) {
        BUFFER.push("[ERROR][SERVER] Unexpected error while building the server");
        throw e;
    }
}

(async() => {
    "use strict;";

    let scope = process.argv[2];

    if (" web server all ".indexOf(` ${scope} `) === -1) {
        scope = "all";
    }

    const START = Date.now();
    const {
        LOG,
        WEB_DIR,
        SERVER_DIR
    } = await buildDirs(START, scope);

    const BUFFER = [];

    try {
        if (scope === "all" || scope === "web") {
            await buildWeb(BUFFER, WEB_DIR);
        }
        if (scope === "all" || scope === "server") {
            await buildServer(BUFFER, SERVER_DIR);
        }
    } catch (e) {
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

})(); // IIFE to be able to use await
