const INDEX = require("../utils/Index.js");

INDEX.add(
    {
        "type"   : "post",
        "handler": (req, res) => {
            res.status(200).json({message: "you posted dummy"});
        },
        "route": "/dummy"
    }
);