const CharStream = require("./CharStream.js");
const TokenStream = require("./TokenStream.js");
const tokenizers = require("./tokenizers.js");

function getPosition(stream, token) {
    return `line ${stream.getLine()}, column ${stream.getColumn() - token.length}`;
}

function parseSelect(token_stream) {
    let token = token_stream.next();
    let select = [];
    let current_select;
    while (token.type == "identifier") {
        if (token.value.indexOf(".") > -1) {
            current_select = token.value.split(".");
            current_select = {
                column: current_select.pop(),
                table : current_select.shift()
            };
        } else {
            current_select = {
                column: token.value,
                table : null
            };
        }
        select.push(current_select);
        token = token_stream.next();
    }
    if (select.length == 0) {
        unexpectedToken(token_stream, token.value);
    }
    return {select, token};
}

function unexpectedToken(stream, token) {
    throw new Error("Unexpected token: " + token.value + " at " + getPosition(stream, token.value));
}

function parseNQL(nql) {
    let char_stream = new CharStream(nql);
    let token_stream = new TokenStream(
        char_stream,
        char => " \t\n\r".indexOf(char) !== -1,
        new tokenizers.stringTokenizer(),
        new tokenizers.numberTokenizer(),
        new tokenizers.keywordTokenizer([
            "SELECT",
            "FROM",
            "WHERE",
            "AND",
            "OR",
            "NOT",
            "LIKE",
            "IN"
        ],
        (kw, list) => {
            return tokenizers.keywordTokenizer.DEFAULT_PREDICATE(kw.toUpperCase(), list);
        }
        ),
        new tokenizers.OperatorTokenizer()
    );
    if (token_stream.eof()) {
        return {};
    }
    const AST = {};
    let token = token_stream.next();
    if (token.value.toUpperCase() !== "SELECT") {
        unexpectedToken(token_stream, token.value);
    }

    token = parseSelect(token_stream);
    AST.SELECT = token.select;
    token = token.token;
    if (token.value.toUpperCase() !== "FROM") {
        unexpectedToken(token_stream, token.value);
    }

    token = token_stream.next();
    if (token.type !== "identifier") {
        unexpectedToken(token_stream, token.value);
    }

    AST.FROM = token.value;
    AST.WHERE = [];

    while (!token_stream.eof()) {
        AST.WHERE.push(token_stream.next());
    }

    return AST;

}

module.exports = parseNQL;