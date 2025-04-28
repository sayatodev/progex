import { TokenType } from "./enums";
import { Expr, Binary, Grouping, NumberLiteral, Unary, Variable } from "./Expr";
import Token from "./Token";
import { EqualityOperator, UnaryOperator } from "./types";

export default class Parser {
    private readonly tokens: Token[];
    private current: number = 0;

    public constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

    /* Utility methods */
    private match(...types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.current++;
                return true;
            }
        }
        return false;
    }

    private check(type: TokenType): boolean {
        if (this.isAtEnd()) return false;
        return this.peek().type === type;
    }

    private advance(): Token {
        if (!this.isAtEnd()) this.current++;
        return this.previous();
    }

    private isAtEnd(): boolean {
        return this.peek().type === TokenType.EOP;
    }

    private peek(): Token {
        return this.tokens[this.current];
    }

    private previous(): Token {
        return this.tokens[this.current - 1];
    }

    private consume(type: TokenType, message: string): Token {
        if (this.check(type)) return this.advance();
        throw this.create_error(this.peek(), message);
    }

    private create_error(token: Token, message: string) {
        return new Error(
            `Error at ${token.segment}: ${message} (${token.lexeme})`
        );
    }

    /* Parsing methods */
    private expression(): Expr {
        console.debug("Parsing expression...");
        return this.equality();
    }

    private equality(): Expr {
        console.debug("Parsing equality...");
        let expr = this.comparison();

        while (this.match(TokenType.EQ, TokenType.NEQ)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.comparison();
            expr = new Binary(expr, operator, right);
        }

        console.debug("Parsed equality expression:", expr);
        return expr;
    }

    private comparison(): Expr {
        console.debug("Parsing comparison...");
        let expr = this.term();

        while (
            this.match(TokenType.GT, TokenType.GTE, TokenType.LT, TokenType.LTE)
        ) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.term();
            expr = new Binary(expr, operator, right);
        }

        console.debug("Parsed comparison expression:", expr);
        return expr;
    }

    private term(): Expr {
        console.debug("Parsing term...");
        let expr = this.factor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.factor();
            expr = new Binary(expr, operator, right);
        }

        console.debug("Parsed term expression:", expr);
        return expr;
    }

    private factor(): Expr {
        console.debug("Parsing factor...");
        let expr = this.unary();

        while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.FRACTION)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.unary();
            console.debug("Parsed Factor", expr, operator, right);
            expr = new Binary(expr, operator, right);
        }

        console.debug("Parsed factor expression:", expr);
        return expr;
    }

    private unary(): Expr {
        console.debug("Parsing unary...");
        if (this.match(TokenType.MINUS, TokenType.PLUS, TokenType.NEGATIVE)) {
            const operator = this.previous() as Token<UnaryOperator>;
            const right = this.unary();
            return new Unary(operator, right);
        }
        
        return this.primary();
    }

    private primary(): Expr {
        console.debug("Parsing primary...");

        if (this.match(TokenType.NUMBER)) {
            console.debug("Parsed number:", this.previous().literal);
            return new NumberLiteral(this.previous().literal as number);
        }

        if (this.match(TokenType.VARIABLE) || this.match(TokenType.CONSTANT)) {
            console.debug("Parsed variable:", this.previous().literal);
            return new Variable(this.previous());
        }

        if (this.match(TokenType.LEFT_PARENTHESIS)) {
            const expr = this.expression();
            this.consume(
                TokenType.RIGHT_PARENTHESIS,
                "Expect ')' after expression."
            );
            console.debug("Parsed grouping:", expr);
            return new Grouping(expr);
        }

        throw this.create_error(this.peek(), "Unexpected token.");
    }

    /* Entry point for parsing */
    public parse(): Expr | null {
        try {
            return this.expression();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
