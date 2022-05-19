const fs = require("fs");
const CharStream = require("./CharStream.js");

class CSVParser {

    constructor() {
        this._char_stream = null;
    }

    async parse(file, prefix = "") {
        const data = await fs.promises.readFile(file, "utf8");
        this._char_stream = new CharStream(data);
        let header = [];
        let rows = [];
        let row;

        while (this._char_stream.peek() != "\n") {
            header.push(prefix + this._readWhile(this._isSeparator));
            this._char_stream.next();
        }

        this._skipWhile(this._isWhiteSpace);

        while (!this._char_stream.eof()) {
            row = {};
            for (let i = 0;i < header.length;i++) {
                if (this._isQuote(this._char_stream.peek())) {
                    row[header[i]] = this._readWhile(this._isQuote);
                } else {
                    row[header[i]] = this._readWhile(this._isSeparator);
                }
                this._char_stream.next();
            }
            rows.push(row);
            this._skipWhile(this._isWhiteSpace);
        }

        return rows;

    }

    _isQuote(char) {
        return char == '"';
    }

    _isSeparator(char) {
        return char == ",";
    }

    _isWhiteSpace(char) {
        return " \t\n\r".indexOf(char) > -1;
    }

    _skipWhile(predicate) {
        while (this._char_stream.peek() && predicate(this._char_stream.peek())) {
            this._char_stream.next();
        }
    }

    _readWhile(predicate) {
        let value = "";
        let char;
        while ((char = this._char_stream.peek()) != null && predicate(char)) {
            value += this._char_stream.next();
        }
        return value;
    }
}


module.exports = CSVParser;