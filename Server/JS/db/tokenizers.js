const Tokenizer = require('./Tokenizer');

class stringTokenizer extends Tokenizer {

    constructor() {
        super();
    }

    canTokenize(char) {
        return char === "'";
    }

    tokenize(charStream) {
        charStream.next();
        return {
            value: this._readWhile(charStream, char => !this.canTokenize(char)),
            type : "string"
        };
    }
}

class numberTokenizer extends Tokenizer {

    constructor() {
        super();
    }

    canTokenize(char) {
        return char >= '0' && char <= '9';
    }

    tokenize(charStream) {
        let isFloat = false;
        let value = this._readWhile(charStream, char => this.canTokenize(char) || char === '.' && !isFloat && (isFloat = true));

        if (isFloat) {
            return {
                value: parseFloat(value),
                type : "float"
            };
        } else {
            return {
                value: parseInt(value),
                type : "int"
            };
        }
    }
}

class identifierTokenizer extends Tokenizer {

    constructor() {
        super();
    }

    canTokenize(char) {
        return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_';
    }

    tokenize(charStream) {
        return {
            value: this._readWhile(charStream, char => this.canTokenize(char)),
            type : "identifier"
        };
    }
}

class keywordTokenizer extends identifierTokenizer {

    /** This function aims to check if the given string is a keyword.
     * @callback fuzzyPredicate
     * @param {String} kw the keyword to test.
     * @param {Array} keywords the list of keywords to test against.
     * @returns {Boolean} true if the string is a keyword, false otherwise.
     */
    /**
     * @param {String[]} keywords the keywords to detect.
     * @param {fuzzyPredicate} fuzzyPredicate the predicate used to check if the string is a keyword.
     */
    constructor(keywords, fuzzyPredicate = keywordTokenizer.DEFAULT_PREDICATE, keywordType = "keyword") {
        super();
        keywords = keywords || [];
        this.keywords = keywords;
        this.fuzzyPredicate = fuzzyPredicate;
        this.keywordType = keywordType;
    }

    tokenize(charStream) {
        let token = super.tokenize(charStream);
        if (this.fuzzyPredicate(token.value, this.keywords)) {
            token.type = this.keywordType;
        }
        return token;
    }
}

keywordTokenizer.DEFAULT_PREDICATE = (kw, list) => list.includes(kw);

class OperatorTokenizer extends Tokenizer {

    canTokenize(char) {
        //TODO check if we can make this faster
        return char == '+' || char == '-' || char == '*' || char == '/' || char == '=' || char == '>' || char == '<' || char == '!';
    }

    // TODO: remove duplicated code
    tokenize(charStream) {
        return {
            value: this._readWhile(charStream, char => this.canTokenize(char)),
            type : "operator"
        };
    }

}

module.exports = {
    stringTokenizer,
    numberTokenizer,
    identifierTokenizer,
    keywordTokenizer,
    OperatorTokenizer
};