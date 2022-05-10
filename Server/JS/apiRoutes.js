const INDEX = require("./utils/Index.js");
const ROUTER = require("express")();
const fs = require("fs");
const path = require("path");
const utils = require("./utils/utils.js");

function requireDir(dir) {
    let resolved = utils.resolve(dir);
    return fs.promises.readdir(resolved).then(files => {
        files.forEach(file => {
            require(path.join(resolved, file));
        });
    });
}

const PENDINGS = [
    requireDir("get"),
    requireDir("post")
];

const POPULATE = () => {
    for (let element of INDEX.index) {
        switch (element.type) {
        case "get":
            ROUTER.get(element.route, element.handler);
            break;
        case "post":
            ROUTER.post(element.route, element.handler);
            break;
        case "put":
            ROUTER.put(element.route, element.handler);
            break;
        case "delete":
            ROUTER.delete(element.route, element.handler);
            break;
        default:
            throw new SyntaxError(`Invalid route type: ${element.type}`);
        }
    }
    return ROUTER;
};

module.exports = Promise.all(PENDINGS).then(POPULATE);