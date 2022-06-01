const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const {DatabaseManager, InterpreterError} = require("../db/DatabaseManager.js");
const {UnexpectedTokenError} = require("../db/NQLParser.js");
const {TokenizingException} = require("../db/TokenStream.js");
const {resolve} = require("../utils/utils.js");

const manager = new DatabaseManager(resolve("Database"));

INDEX.add(
    {
        "type"   : "get",
        "handler": async(req, res) => {
            try {
                let parsed = await manager.get(req.query.query);
                res.status(200).json({
                    hash: crypto
                        .createHash("sha256")
                        .update(req.query.query)
                        .digest("hex"),
                    value: parsed
                });
            } catch (e) {
                if (e.constructor === InterpreterError ||
                    e.constructor === UnexpectedTokenError ||
                    e.constructor === TokenizingException
                ) {
                    res.status(400).json({error: e.message});
                    return;
                }
                console.error(e);
                res.status(500).json({error: e.message});
            }
        },
        "route": "/request"
    }
);

module.exports = manager.init();