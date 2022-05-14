/* eslint-disable no-unused-vars */
// abstract class definition
class Tokenizer {

    /**
     * This method check if the tokenizer can tokenize the stream starting from the given character.
     * @param {*} char the character to test
     * @returns {Boolean} true if the tokenizer can tokenize from the character, false otherwise.
     */
    canTokenize(char) {
        return false;
    }

    /**Private method.
    * Read the stream until the predicate is false.
    * @param {*} predicate the predicate used to determine if the function continue to read.
    * @returns {String} the string extracted from the stream.
    */
    _readWhile(charStream, predicate) {
        let result = "";
        while (!charStream.eof() && predicate(charStream.peek())) {
            result += charStream.next();
        }
        return result;
    }

    /**
     * @typedef {Object} Token
     * @property {String} value The value of the token.
     * @property {String} type The type of the token.
     */
    /**
     * This method tokenize the stream starting from the given character.
     * @param {charStream} charStream the stream of characters to tokenize.
     * @returns {Token} the token extracted from the stream.
    */
    tokenize(charStream) {
        throw new Error("tokenizer not implemented");
    }
}

module.exports = Tokenizer;