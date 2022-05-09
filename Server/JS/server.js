const Express = require("express");
const HTTPS = require("https");
const fs = require("fs");
const utils = require("./utils/utils.js");

const PORT = process.env.PORT || 8000;
const SERVER = Express();

// Configuring the server.

SERVER.use(Express.urlencoded({extended: true}));
SERVER.use(Express.json());

// API srules
SERVER.use((req, res, next) => {

    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');

    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');

    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST');
        return res.status(200).json({});
    }
    next();
});


// API routes
(async () => {
    SERVER.use("/",await require("./routes.js"));

    // Error handling
    SERVER.use((req, res, next) => {
        const error = new Error("not found");
        return res.status(404).json({
            message: error.message
        });
    });
    
    // Starting the server
    const KEY = await fs.promises.readFile(
        utils.resolve("../Ressources/server.key"),
        "utf8"
    );
    const CERT = await fs.promises.readFile(
        utils.resolve("../Ressources/server.cert"),
        "utf8"
    );
    
    HTTPS.createServer(
        {
            key: KEY,
            cert: CERT
        },
        SERVER
    )
    .listen(PORT, function () {
        console.log(`Server listening on port ${PORT}`);
    });

})();

