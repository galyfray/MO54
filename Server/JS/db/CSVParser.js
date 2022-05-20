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

        while (!(this._isEndOfLine(this._char_stream.peek()) || this._char_stream.eof())) {
            header.push(prefix + this._readUntil(this._isBroadSeparator));
            if (this._isSeparator(this._char_stream.peek())) {
                this._char_stream.next();
            }
        }

        this._skipWhile(this._isWhiteSpace);

        while (!this._char_stream.eof()) {
            row = {};
            for (let i = 0;i < header.length;i++) {
                if (this._isQuote(this._char_stream.peek())) {
                    row[header[i]] = this._readUntil(this._isQuote);
                    this._char_stream.next();
                } else {
                    row[header[i]] = this._readUntil(this._isBroadSeparator);
                    if (this._isSeparator(this._char_stream.peek())) {
                        this._char_stream.next();
                    } else {
                        this._skipWhile(this._isWhiteSpace);
                    }
                }
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
        return char == ";";
    }

    _isBroadSeparator(char) {
        return char == ";" || char == "\n";
    }

    _isWhiteSpace(char) {
        return " \t\n\r".indexOf(char) > -1;
    }

    _isEndOfLine(char) {
        return "\n\r".indexOf(char) > -1;
    }

    _skipWhile(predicate) {
        while (this._char_stream.peek() && predicate(this._char_stream.peek())) {
            this._char_stream.next();
        }
    }

    _readUntil(predicate) {
        let value = "";
        let char;
        while ((char = this._char_stream.peek()) != null && !predicate(char)) {
            value += this._char_stream.next();
        }
        return value;
    }
}


module.exports = CSVParser;