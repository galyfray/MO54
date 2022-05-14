const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const CharStream = require("../db/CharStream.js");
const tokenizers = require("../db/tokenizers.js");
const TokenStream = require("../db/TokenStream.js");

INDEX.add(
    {
        "type"   : "get",
        "handler": (req, res) => {
            const tokenStream = new TokenStream(
                new CharStream(req.query.query),
                char => " \t\n\r".indexOf(char) !== -1,
                new tokenizers.stringTokenizer(),
                new tokenizers.numberTokenizer(),
                new tokenizers.keywordTokenizer([
                    "SELECT",
                    "FROM",
                    "WHERE",
                    "AND",
                    "OR",
                    "NOT",
                    "LIKE",
                    "IN"
                ]),
                new tokenizers.OperatorTokenizer()

            );
            let tokens = [];

            while (!tokenStream.eof()) {
                tokens.push(tokenStream.next());
            }

            res.status(200).json({
                to_parse: req.query.query,
                hash    : crypto
                    .createHash("sha256")
                    .update(req.query.query)
                    .digest("hex"),
                "parsed": tokens
            });
        },
        "route": "/parse"
    }
);