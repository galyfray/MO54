const INDEX = require("../utils/Index.js");

INDEX.add(
    {
        "type"   : "get",
        "handler": (req, res) => {
            res.status(200).json({message: "dummy"});
        },
        "route": "/dummy"
    }
);