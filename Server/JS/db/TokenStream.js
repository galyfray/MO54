class TokenStream {

    /**
     * This class represent a stream of tokens extracted from a stream of character.
     * @param {charStream} charStream the stream of characters to tokenize.
     * @param {*} whitespacePredicate the predicate to use to determine if a character is a whitespace.
     * @param  {...any} tokenizers the tokenizers to use to tokenize the stream.
     */
    constructor(charStream, whitespacePredicate, ...tokenizers) {
        this.charStream = charStream;
        this.isWhitespace = whitespacePredicate;
        this.tokenizers = tokenizers;
        if (this.tokenizers === null) {
            throw new Error("tokenizers can't be null");
        }
    }

    /**Private method.
     * Read the stream until the predicate is false.
     * @param {*} predicate the predicate used to determine if the function continue to read.
     */
    _readWhile(predicate) {
        while (!this.charStream.eof() && predicate(this.charStream.peek())) {
            this.charStream.next();
        }
    }

    /**
     * Get the next token in the stream, return null if the stream is at the end.
     * this method consume the token.
     * @returns {Token} the next token in the stream.
     */
    next() {

        this._readWhile(this.isWhitespace);

        if (this.charStream.eof()) {
            return null;
        }

        for (const tokenizer of this.tokenizers) {
            if (tokenizer.canTokenize(this.charStream.peek())) {
                return tokenizer.tokenize(this.charStream);
            }
        }

        throw new Error("unable to tokenize character " + this.charStream.peek());
    }

    /**
     * Test if the stream is at the end.
     * @returns {Boolean} true if the stream is at the end, false otherwise.
     */
    eof() {
        return this.charStream.eof();
    }

    getColumn() {
        return this.charStream.getColumn();
    }

    getLine() {
        return this.charStream.getLine();
    }

}

module.exports = TokenStream;