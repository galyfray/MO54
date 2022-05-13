const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const fs = require('fs');
const {resolve} = require('../utils/utils.js');
const env = {
    abort: (message, filename, line, column) => {
        throw new Error(`${message} in ${filename} at ${line}:${column}`);
    }
};

module.exports = fs.promises.readFile(resolve('parser.wasm')).then(buffer => {

    return WebAssembly.instantiate(buffer, {env: env}).then(wasmModule => {
        // Exported function live under instance.exports
        // eslint-disable-next-line no-unused-vars
        const parser = wasmModule.instance.exports;
        const stream = parser.charStream("'" + "a" * 999 + "'");
        const tokenS_1 = parser.tokenStream(
            stream,
            parser.getDummyPredicate(),
            [parser.stringTokenizer()]
        );

        const tokenS_2 = parser.tokenStream(
            parser.charStream("'" + "a" * 999 + "'"),
            {eval: () => false},
            [parser.stringTokenizer_2()]
        );

        const warmer = () => {
            let i = 0;
            while (i < 1000000) {
                i++;
                i--;
                i++;
                i--;
                i++;
                i--;
                i++;
            }
        };

        const benchmark = (f, ...args) => {
            warmer();
            const start = Date.now();
            f(...args);
            const end = Date.now();
            return end - start;
        };

        const tokenS_1_time = benchmark(tokenS_1.next);
        const tokenS_2_time = benchmark(tokenS_2.next);

        INDEX.add(
            {
                "type"   : "get",
                "handler": (req, res) => {
                    res.status(200).json({
                        to_parse: req.query.query,
                        hash    : crypto.createHash("sha256").update(req.query.query)
                            .digest("hex"),
                        "parsed": {
                            "tokenS_1": tokenS_1_time,
                            "tokenS_2": tokenS_2_time
                        }
                    });
                },
                "route": "/parse"
            }
        );
    });
});

