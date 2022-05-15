const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const parseNQL = require("../db/NQLParser.js");

INDEX.add(
    {
        "type"   : "get",
        "handler": (req, res) => {
            const AST = parseNQL(req.query.query);

            res.status(200).json({
                to_parse: req.query.query,
                hash    : crypto
                    .createHash("sha256")
                    .update(req.query.query)
                    .digest("hex"),
                "parsed": AST
            });
        },
        "route": "/parse"
    }
);