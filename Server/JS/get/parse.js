const INDEX = require("../utils/Index.js");
const crypto = require("crypto");

INDEX.add(
    {
        "type"   : "get",
        "handler": (req, res) => {
            res.status(200).json({
                to_parse: req.query.query,
                hash    : crypto.createHash("sha256").update(req.query.query)
                    .digest("hex"),
                "parsed": ""
            });
        },
        "route": "/parse"
    }
);