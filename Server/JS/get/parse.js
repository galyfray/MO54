const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const {DatabaseManager} = require("../db/DatabaseManager.js");
const {resolve} = require("../utils/utils.js");

const manager = new DatabaseManager(resolve("Database"));

INDEX.add(
    {
        "type"   : "get",
        "handler": async(req, res) => {

            res.status(200).json({
                to_parse: req.query.query,
                hash    : crypto
                    .createHash("sha256")
                    .update(req.query.query)
                    .digest("hex"),
                "parsed": await manager.get(req.query.query)
            });
        },
        "route": "/parse"
    }
);

module.exports = manager.init();