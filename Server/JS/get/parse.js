const INDEX = require("../utils/Index.js");
const crypto = require("crypto");
const fs = require('fs');
const {resolve} = require('../utils/utils.js');

module.exports = fs.promises.readFile(resolve('parser.wasm')).then(buffer => {

    return WebAssembly.instantiate(buffer).then(wasmModule => {
        console.log('wasm module loaded');

        // Exported function live under instance.exports
        // eslint-disable-next-line no-unused-vars
        const parser = wasmModule.instance.exports;
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
    });
});

