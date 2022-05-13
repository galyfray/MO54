
class CharStream {

    private source: string;
    private index: number;
    private line: number;
    private column: number;

    constructor(source: string) {
        this.source = source;
        this.index = 0;
        this.line = 1;
        this.column = 0;
    }

    next(): string {
        if (this.index >= this.source.length) {
            return null;
        }
        const c = this.source[this.index];
        this.index++;
        this.column++;
        if (c === '\n') {
            this.line++;
            this.column = 0;
        }
        return c;
    }

    peek():string {
        if (this.index >= this.source.length) {
            return null;
        }
        return this.source[this.index];
    }

    eof(): boolean {
        return this.index >= this.source.length;
    }

    getLine(): number {
        return this.line;
    }

    getColumn(): number {
        return this.column;
    }
}

class Predicate<T> {
    eval(value: T): boolean {
        return value === null;
    }
}

class Tokenizer {
    is_token(value: string): boolean {
        return value === null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    get_token(stream: CharStream): Token {
        return new Token(null, null);
    }
}

class TokenStream {

    private stream: CharStream;
    private whitespacePredicate: Predicate<string>;
    private tokenizers: Tokenizer[];

    constructor(stream: CharStream, isWhitespace: Predicate<string>, tokenizers: Tokenizer[] = []) {
        this.stream = stream;
        this.whitespacePredicate = isWhitespace;
        this.tokenizers = tokenizers;
    }

    next():Token {
        const c = this.stream.peek();
        if (c === null) {
            return null;
        }

        this.readWhile(this.whitespacePredicate);

        for (const tokenizer of this.tokenizers) {
            if (tokenizer.is_token(c)) {
                return tokenizer.get_token(this.stream);
            }
        }
    }

    private readWhile(predicate: Predicate<string>): void {
        while (!this.stream.eof() && predicate.eval(this.stream.peek())) {
            this.stream.next();
        }
    }
}

class Token {
    private type: string;
    private value: string;

    constructor(type: string, value: string) {
        this.type = type;
        this.value = value;
    }

    getType(): string {
        return this.type;
    }

    getValue(): string {
        return this.value;
    }
}

class StringTokenizer extends Tokenizer {
    is_token(value: string): boolean {
        return value === '"' || value === "'";
    }

    get_token(stream: CharStream): Token {
        let value = "";
        while (!stream.eof() && !this.is_token(stream.peek())) {
            value += stream.next();
        }
        stream.next();
        return new Token("string", value);
    }
}

class StringTokenizer_2 extends Tokenizer {
    is_token(value: string): boolean {
        return value === '"' || value === "'";
    }

    get_token(stream: CharStream): Token {
        const value = [];
        while (!stream.eof() && !this.is_token(stream.peek())) {
            value.push(stream.next());
        }
        stream.next();
        return new Token("string", value.join(""));
    }
}

export function charStream(source: string): CharStream {
    return new CharStream(source);
}

export function tokenStream(
    stream: CharStream,
    isWhitespace: Predicate<string>,
    tokenizers: Tokenizer[] = []
): TokenStream {
    return new TokenStream(stream, isWhitespace, tokenizers);
}

export function stringTokenizer(): Tokenizer {
    return new StringTokenizer();
}

export function stringTokenizer_2(): Tokenizer {
    return new StringTokenizer_2();
}

class DummyPredicate extends Predicate<string> {
    eval(): boolean {
        return false;
    }
}

export function getDummyPredicate(): Predicate<string> {
    return new DummyPredicate();
}