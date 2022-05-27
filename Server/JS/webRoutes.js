const ROUTER = require("express")();
const fs = require("fs");
const path = require("path");
const {resolve} = require("./utils/utils.js");

const WEB = resolve("../web");

async function getFile(req, res) {
    try {
        await fs.promises.access(path.join(WEB, req.url), fs.constants.R_OK);
    } catch (err) {
        res.status(404).send("Not found");
        return;
    }
    res.sendFile(path.join(WEB, req.url));
}

ROUTER.get(/.*/, getFile);

module.exports = ROUTER;