const CharStream = require("./CharStream.js");
const TokenStream = require("./TokenStream.js");
const tokenizers = require("./tokenizers.js");

class UnexpectedTokenError extends Error {}

class NQLParser {

    constructor() {
        this._char_stream = null;
        this._query = "";
        this._token_stream = null;
        this._tokenizers = [];
    }

    /**
     * Parsing function. This function parse the NQL query and return an AST.
     * @param {String} query the query to parse
     * @returns {*} an AST
     * @throws {UnexpectedTokenError} if the query is not valid.
     */
    parse(query) {
        this._query = query;
        this._char_stream = new CharStream(query);

        this._token_stream = new TokenStream(
            this._char_stream,
            this._isWhiteSpace,
            ...NQLParser.TOKENIZERS
        );
        if (this._token_stream.eof()) {
            return {};
        }

        const AST = {};

        if (this._token_stream.peek().value.toUpperCase() !== "SELECT") {
            this._throw(this._token_stream.next(), "SELECT");
        }

        AST.SELECT = this._parse_select();

        if (this._token_stream.peek().value.toUpperCase() !== "FROM") {
            this._throw(this._token_stream.next(), "FROM");
        }

        this._token_stream.next(); // Skip FROM

        if (this._token_stream.peek().type !== "identifier") {
            this._throw(this._token_stream.next(), "a table identifier");
        }

        AST.FROM = this._token_stream.next().value;
        if (!this._token_stream.eof()) {
            // TODO : support JOIN
            if (this._token_stream.peek().value.toUpperCase() !== "WHERE") {
                this._throw(this._token_stream.next(), "WHERE");
            }

            AST.WHERE = this._parse_where();

            if (!this._token_stream.eof()) {
                this._throw(this._token_stream.next(), "end of query");
            }
        }

        return AST;
    }

    //=====// Main parsing functions //=====//

    /**
     * This function parse the column identifier of the SELECT clause.
     * @returns {object[]} the parsed identifiers
     */
    _parse_select() {
        this._token_stream.next(); // Skip SELECT
        let limit = null;
        if (this._token_stream.peek().value.toUpperCase() == "LIMIT") {
            this._token_stream.next(); // Skip LIMIT
            if (this._token_stream.peek().type == "int") {
                limit = this._token_stream.next().value;
            } else {
                this._throw(this._token_stream.next(), "an integer");
            }
        }
        let select = [];
        while (this._token_stream.peek().type == "identifier") {
            select.push(this._parse_identifier(this._token_stream.next().value));
        }
        if (select.length == 0) {
            this._throw(this._token_stream.next(), "a column identifier");
        }
        return {ids: select, limit: limit};
    }

    _parse_where() {
        this._token_stream.next(); // Skip WHERE
        return this._parse_binary_expression(this._token_stream);
    }

    //=====// Generic parsing functions //=====//

    /**
     * Helper to parse an identifier
     * @param {string} value the identifier to parse
     * @returns {object} the parsed identifier
     */
    _parse_identifier(value) {
        if (value.indexOf(".") > -1) {
            value = value.split(".");
            return {
                type  : NQLParser.TYPES.IDENTIFIER,
                column: value.pop(),
                table : value.shift()
            };
        } else {
            return {
                type  : NQLParser.TYPES.IDENTIFIER,
                column: value,
                table : null
            };
        }
    }

    /**
     * Helper function that parse the content of a parenthesis.
     * @returns the parsed element found in the parenthesis, wrapped in an object.
     */
    _parse_parenthesis() {
        if (this._token_stream.peek().value != "(") {
            this._throw(this._token_stream.next(), "(");
        }
        let value = this._parse_binary_expression();
        let token = this._token_stream.next();
        if (token.value != ")") {
            this._throw(token, ")");
        }
        value = {
            type : NQLParser.TYPES.PARENTHESIS,
            value: value
        };
        return value;
    }

    /**
     * Helper function that parse the side of a simple binary expression.
     * @returns the parsed side.
     */
    _parse_side() {
        let token = this._token_stream.next();
        if (token.type == "identifier") {
            return this._parse_identifier(token.value);
        } else if (token.type == "int" || token.type == "float" || token.type == "string") {
            return token;
        } else if (token.type == NQLParser.TYPES.FUNCTION) {
            return this._parse_function(token);
        }
        this._throw(token, "an identifier, a number or a string");
    }

    _parse_function(token) {
        if (token.value.toUpperCase() == "UPPER_CASE") {
            if (this._token_stream.peek().value != "(") {
                this._throw(this._token_stream.next(), "(");
            }
            this._token_stream.next(); // Skip (
            if (this._token_stream.peek().type != "identifier") {
                this._throw(this._token_stream.next(), "an identifier");
            }
            let value = this._parse_identifier(this._token_stream.next().value);
            if (this._token_stream.peek().value != ")") {
                this._throw(this._token_stream.next(), ")");
            }
            this._token_stream.next(); // Skip )
            return {
                type : NQLParser.TYPES.FUNCTION,
                value: token.value.toUpperCase(),
                args : [value]
            };
        }
    }

    _parse_operator_expression() {
        let value = {
            type    : NQLParser.TYPES.OPERATOR_EXPRESSION,
            left    : this._parse_side(),
            operator: this._token_stream.next()
        };

        if (!value.operator) {
            this._throw(null, "an operator");
        }

        // TODO : support IN
        if (value.operator.type == "operator") {
            value.right = this._parse_side();
            value.operator = value.operator.value;
            return value;
        } else {
            this._throw(value.operator, "an operator");
        }
    }

    _parse_binary_expression() {
        let value;

        // TODO : support NOT
        if (this._token_stream.peek().type == NQLParser.TYPES.PARENTHESIS) {
            value = this._parse_parenthesis();
        } else {
            value = this._parse_operator_expression();
        }

        if (this._token_stream.eof()) {
            return value;
        }

        if (this._token_stream.peek().type == "operator") {
            this._throw(this._token_stream.next());
        }
        if (this._token_stream.peek().type == "keyword") {
            if (this._token_stream.peek().value.toUpperCase() == "AND" || this._token_stream.peek().value.toUpperCase() == "OR") {
                value = {
                    type    : NQLParser.TYPES.BINARY_EXPRESSION,
                    left    : value,
                    operator: this._token_stream.next().value.toUpperCase(),
                    right   : this._parse_binary_expression()
                };

                // The aims of those following lines is to ensure that the operators will be interprated in the right order.
                value.precedence = NQLParser.PRECEDENCE[value.operator];
                if (value.right.precedence && value.precedence > value.right.precedence) {
                    value.right.left = {
                        type    : NQLParser.TYPES.BINARY_EXPRESSION,
                        left    : value.left,
                        operator: value.operator,
                        right   : value.right.left
                    };
                    value = value.right;
                }
            }
        }
        return value;
    }

    //=====// Generic helpers //=====//

    /**
     * Helper function that build an error message an then throw an {@link UnexpectedTokenError}
     * @param {object} token the unexpected token, can be null.
     * @param {string} expected optional string that contains the expected tokens if known.
     */
    _throw(token, expected = null) {
        let message;
        if (token) {
            let column = this._char_stream.getColumn() - token.value.length;

            message = `Unexpected token ${token.value} at` +
                ` line ${this._char_stream.getLine()} column ${this._char_stream.getColumn()}`;

            if (expected) {
                message += `, expected ${expected}`;
            }

            message += "\n" + this._query.split("\n")[this._char_stream.getLine() - 1] + "\n";

            for (let i = 0;i < column - 1;i++) {
                message += " ";
            }
            for (let i = 0;i < token.value.length;i++) {
                message += "^";
            }

            throw new UnexpectedTokenError(message);
        } else {
            message = `Unexpected end of query at` +
                `line ${this._char_stream.getLine()} column ${this._char_stream.getColumn()}`;

            if (expected) {
                message += `, expected ${expected}`;
            }

            throw new UnexpectedTokenError(message);
        }
    }

    _isWhiteSpace(char) {
        // TODO : benchmark this function
        return char == " " || char == "\t" || char == "\n" || char == "\r";
    }

}

NQLParser.PRECEDENCE = {
    "OR" : 2,
    "AND": 3
};

NQLParser.TYPES = {
    IDENTIFIER         : "identifier",
    PARENTHESIS        : "parenthesis",
    BINARY_EXPRESSION  : "binary_expression",
    OPERATOR_EXPRESSION: "operator",
    FUNCTION           : "FUNCTION"
};

NQLParser.TOKENIZERS = [
    new tokenizers.stringTokenizer(),
    new tokenizers.numberTokenizer(),
    new tokenizers.keywordTokenizer(
        [
            "SELECT",
            "FROM",
            "WHERE",
            "AND",
            "OR",
            "LIMIT"
        ],
        (kw, list) => {
            return tokenizers.keywordTokenizer.DEFAULT_PREDICATE(kw.toUpperCase(), list);
        }
    ),
    new tokenizers.keywordTokenizer(
        ["UPPER_CASE"],
        (kw, list) => {
            return tokenizers.keywordTokenizer.DEFAULT_PREDICATE(kw.toUpperCase(), list);
        },
        NQLParser.TYPES.FUNCTION
    ),
    new tokenizers.OperatorTokenizer(),
    new tokenizers.ParenthesisTokenizer()
];


//TODO :
// - benchmark
// - add tests
// - support JOINS
// - support IN

module.exports = {NQLParser, UnexpectedTokenError};