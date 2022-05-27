const fs = require("fs");
const CharStream = require("./CharStream.js");

class CSVParser {

    constructor() {
        this._char_stream = null;
    }

    /**
     * This method will read and parse a CSV file returning an array of all its rows
     * @param {string} file the filename of the CSV file to parse
     * @param {string} prefix a prefix to prepend to the header's names.
     * @returns {Promise<Object[]>} An array of rows. each row is an object where
     *  the keys are the name of a columns and the value the associated value.
     */
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

    /**
     * Predicate function to detect quotes. Only double quotes are detected.
     * @param {string} char the char to evaluate
     * @returns {boolean} true if the char is assimilated to a quote false otherwise.
     */
    _isQuote(char) {
        return char == '"';
    }


    /**
     * Predicate function to detect separators between two entries.
     * @param {string} char the char to evaluate
     * @returns {boolean} true if the char is assimilated to a separator false otherwise.
     */
    _isSeparator(char) {
        return char == ";";
    }

    /**
     * This predicate aims to detect separators between two entries in a broad way.
     * This mean that either separtor as defined in {@link _isSeparator} or ends of lines
     * as defined in {@link _isEndOfLine} will trigger this function
     * @param {string} char the char to evaluate
     * @returns {boolean} true if the char is assimilated to a separator false otherwise.
     */
    _isBroadSeparator(char) {
        return this._isSeparator(char) || this._isEndOfLine(char);
    }

    /**
     * Predicate function to detect whitespace. White space includes ends of lines by default
     * @param {string} char the char to evaluate
     * @returns {boolean} true if the char is assimilated to a white space false otherwise.
     */
    _isWhiteSpace(char) {
        return " \t\n\r".indexOf(char) > -1;
    }

    /**
     * Predicate function to detect end of lines
     * @param {string} char the char to evaluate
     * @returns {boolean} true if the char is assimilated to an end of line false otherwise.
     */
    _isEndOfLine(char) {
        return "\n\r".indexOf(char) > -1;
    }

    /**
     * This Helper function will skip chars from the internal stream while the predicate is true.
     * @param {*} predicate the predicate that will determine if the function should skip the next char from the stream
     */
    _skipWhile(predicate) {
        predicate = predicate.bind(this);
        while (this._char_stream.peek() && predicate(this._char_stream.peek())) {
            this._char_stream.next();
        }
    }

    /**
     * Helper function that will read the stream until the predicate became true and then return the readed string
     * @param {*} predicate the predicate which will determine when the fuction should stop reading.
     * @returns {string} the value read
     */
    _readUntil(predicate) {
        predicate = predicate.bind(this);
        let value = "";
        let char;
        while ((char = this._char_stream.peek()) != null && !predicate(char)) {
            value += this._char_stream.next();
        }
        return value;
    }
}


module.exports = CSVParser;