const Tokenizer = require("./Tokenizer");

class stringTokenizer extends Tokenizer {

    constructor() {
        super("string");
    }

    canTokenize(char) {
        return char === "'";
    }

    _canContinueTokenization(char) {
        return !this.canTokenize(char);
    }

    tokenize(charStream) {
        charStream.next();
        return super.tokenize(charStream);
    }
}

class numberTokenizer extends Tokenizer {

    constructor() {
        super("int");
        this._isFloat = false;
    }

    canTokenize(char) {
        return char >= "0" && char <= "9";
    }

    _canContinueTokenization(char) {
        return this.canTokenize(char) || char === "." && !this._isFloat && (this._isFloat = true);
    }

    tokenize(charStream) {
        this._isFloat = false;
        let value = super.tokenize(charStream);

        if (this._isFloat) {
            return {
                value: parseFloat(value.value),
                type : "float"
            };
        } else {
            return {
                value: parseInt(value.value),
                type : "int"
            };
        }
    }
}

class identifierTokenizer extends Tokenizer {

    constructor() {
        super("identifier");
    }

    canTokenize(char) {
        return char >= "a" && char <= "z" || char >= "A" && char <= "Z" || char === "_";
    }

    _canContinueTokenization(char) {
        return this.canTokenize(char) || char == ".";
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

    constructor() {
        super("operator");
    }

    canTokenize(char) {
        //TODO check if we can make this faster
        return char == "+" || char == "-" || char == "*" || char == "/" || char == "=" || char == ">" || char == "<" || char == "!";
    }

}

module.exports = {
    stringTokenizer,
    numberTokenizer,
    identifierTokenizer,
    keywordTokenizer,
    OperatorTokenizer
};