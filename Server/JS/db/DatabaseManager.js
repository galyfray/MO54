// eslint-disable-next-line no-unused-vars
const fs = require("fs");
// eslint-disable-next-line no-unused-vars
const path = require("path");

class DatabaseManager {

    constructor(folder) {
        this._folder = folder;
        this._meta = {};
        this._init = false;
    }

    async init() {
        if (this._init) {
            return;
        }

        this._meta = await this._loadMeta();

        this._init = true;
    }

    async _loadMeta() {
        //TODO: load meta from file
    }

    _join(dataSet1, dataSet2,key1,key2) {
        newSet = [];
        
    }

}

module.exports = DatabaseManager;