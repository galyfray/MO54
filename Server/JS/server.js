/**
 * @author Galyfray
 */

const Express = require("express");
const compression = require("compression");
const SPDY = require("spdy");
const fs = require("fs");
const utils = require("./utils/utils.js");

const PORT = process.env.PORT || 8000;
const SERVER = Express();

// Configuring the server.

SERVER.use(compression());
SERVER.use(Express.urlencoded({extended: true}));
SERVER.use(Express.json());

// API srules
SERVER.use((req, res, next) => {

    // Set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');

    // Set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');

    // Set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST');
        return res.status(200).json({});
    }
    next();
});


// API routes
(async() => {
    SERVER.use("/api", await require("./apiRoutes.js"));
    SERVER.use("/web", await require("./webRoutes.js"));

    // Error handling
    SERVER.use((req, res) => {
        const error = new Error("not found");
        return res.status(404).json({message: error.message});
    });

    // Starting the server
    const KEY = await fs.promises.readFile(
        utils.resolve("./server.key"),
        "utf8"
    );
    const CERT = await fs.promises.readFile(
        utils.resolve("./server.cert"),
        "utf8"
    );

    SPDY.createServer(
        {
            key : KEY,
            cert: CERT
        },
        SERVER
    ).listen(PORT, function() {
        console.log(`Server listening on port ${PORT}`);
    });

})();

