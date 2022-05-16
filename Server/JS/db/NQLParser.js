const CharStream = require("./CharStream.js");
const TokenStream = require("./TokenStream.js");
const tokenizers = require("./tokenizers.js");

const PRECEDENCE = {
    "OR" : 2,
    "AND": 3
};

function getPosition(stream, token) {
    return `line ${stream.getLine()}, column ${stream.getColumn() - token ? token.length : 0}`;
}

function parseIdentifier(value) {
    if (value.indexOf(".") > -1) {
        value = value.split(".");
        return {
            column: value.pop(),
            table : value.shift()
        };
    } else {
        return {
            column: value,
            table : null
        };
    }
}

function parseSelect(token_stream) {
    let token = token_stream.next();
    let select = [];
    while (token.type == "identifier") {
        select.push(parseIdentifier(token.value));
        token = token_stream.next();
    }
    if (select.length == 0) {
        unexpectedToken(token_stream, token.value);
    }
    return {select, token};
}

function parseWhere(token_stream) {
    let token = token_stream.peek();
    let where = {};
    if (token.type == "parenthesis") {
        token_stream.next();
        if (token.value == "(") {
            where.right = parseParenthesis(token_stream);
        } else {
            unexpectedToken(token_stream, token.value);
        }
    } else {
        where = parseBinaryExpression(token_stream);
    }

    return where;
}

function parseParenthesis(token_stream) {
    let value = parseBinaryExpression(token_stream);
    let token = token_stream.next();
    if (token.value != ")") {
        unexpectedToken(token_stream, token.value);
    }
    value = {
        type : "parenthesis",
        value: value
    };
    return value;
}

function parseBinaryExpression(token_stream) {
    let token = token_stream.peek();
    let value;
    if (token.type == "parenthesis") {
        if (token.value == "(") {
            token_stream.next();
            value = parseParenthesis(token_stream);
        }
    }
    value = parseOperatorExpression(token_stream);

    if (token_stream.eof()) {
        return value;
    }

    token = token_stream.peek();

    if (token.type == "operator") {
        unexpectedToken(token_stream, token.value);
    }
    if (token.type == "keyword") {
        if (token.value.toUpperCase() == "AND" || token.value.toUpperCase() == "OR") {
            token_stream.next();
            value = {
                left    : value,
                operator: token.value.toUpperCase(),
                right   : parseBinaryExpression(token_stream)
            };
            value.precedence = PRECEDENCE[value.operator];
            if (value.right.precedence && value.precedence > value.right.precedence) {
                value.right.left = {
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

function parseOperatorExpression(token_stream) {
    let value = {
        left    : parseSide(token_stream),
        operator: token_stream.next()
    };

    if (!value.operator) {
        unexpectedToken(token_stream, {value: value.operator});
    }

    if (value.operator.type == "operator") {
        value.right = parseSide(token_stream);
        return value;
    } else {
        unexpectedToken(token_stream, value.operator.value);
    }
}

function parseSide(token_stream) {
    let token = token_stream.next();
    if (token.type == "identifier") {
        return parseIdentifier(token.value);
    } else if (token.type == "parenthesis") {
        if (token.value == "(") {
            return parseParenthesis(token_stream);
        } else {
            unexpectedToken(token_stream, token.value);
        }
    } else if (token.type == "int" || token.type == "float") {
        return token;
    }

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
        new tokenizers.keywordTokenizer(
            [
                "SELECT",
                "FROM",
                "WHERE",
                "AND",
                "OR",
                "NOT"
            ],
            (kw, list) => {
                return tokenizers.keywordTokenizer.DEFAULT_PREDICATE(kw.toUpperCase(), list);
            }
        ),
        new tokenizers.OperatorTokenizer(),
        new tokenizers.keywordTokenizer(
            [
                "(",
                ")"
            ],
            tokenizers.keywordTokenizer.DEFAULT_PREDICATE,
            "parenthesis"
        )
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
    token = token_stream.next();
    if (token.value.toUpperCase() !== "WHERE") {
        unexpectedToken(token_stream, token.value);
    }
    AST.WHERE = parseWhere(token_stream);

    return AST;

}

module.exports = parseNQL;