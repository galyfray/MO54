const path = require("path");

function resolve(fileName) {
    return path.resolve(process.argv[1], "../" + fileName)
}

module.exports = {
    resolve
}