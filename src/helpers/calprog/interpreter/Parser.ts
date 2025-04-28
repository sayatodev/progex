import { TokenType } from "./enums";
import {
    Expr,
    BinaryExpr,
    GroupingExpr,
    NumberLiteralExpr,
    UnaryExpr,
    VariableExpr,
} from "./Expr";
import { DisplayStmt, ExpressionStmt, Stmt } from "./Stmt";
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

    private check(...types: TokenType[]): boolean {
        if (this.isAtEnd()) return false;
        return types.includes(this.peek().type);
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

    private consume(
        types: TokenType | Array<TokenType>,
        message: string
    ): Token {
        if (!Array.isArray(types)) types = [types];
        if (this.check(...types)) return this.advance();
        throw this.create_error(this.peek(), message);
    }

    private create_error(token: Token, message: string) {
        return new Error(
            `Error at ${token.segment}: ${message} (${token.lexeme})`
        );
    }

    private consumeStmt() {
        const terminators = [
            TokenType.COLON,
            TokenType.DISPLAY,
        ]
        this.consume(terminators, "Expect statement terminator.");
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
            expr = new BinaryExpr(expr, operator, right);
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
            expr = new BinaryExpr(expr, operator, right);
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
            expr = new BinaryExpr(expr, operator, right);
        }

        console.debug("Parsed term expression:", expr);
        return expr;
    }

    private factor(): Expr {
        console.debug("Parsing factor...");
        let expr = this.unary();

        while (
            this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.FRACTION)
        ) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.unary();
            console.debug("Parsed Factor", expr, operator, right);
            expr = new BinaryExpr(expr, operator, right);
        }

        console.debug("Parsed factor expression:", expr);
        return expr;
    }

    private unary(): Expr {
        console.debug("Parsing unary...");
        if (this.match(TokenType.MINUS, TokenType.PLUS, TokenType.NEGATIVE)) {
            const operator = this.previous() as Token<UnaryOperator>;
            const right = this.unary();
            return new UnaryExpr(operator, right);
        }

        return this.primary();
    }

    private primary(): Expr {
        console.debug("Parsing primary...");

        if (this.match(TokenType.NUMBER)) {
            console.debug("Parsed number:", this.previous().literal);
            return new NumberLiteralExpr(this.previous().literal as number);
        }

        if (this.match(TokenType.VARIABLE) || this.match(TokenType.CONSTANT)) {
            console.debug("Parsed variable:", this.previous().literal);
            return new VariableExpr(this.previous());
        }

        if (this.match(TokenType.LEFT_PARENTHESIS)) {
            const expr = this.expression();
            this.consume(
                TokenType.RIGHT_PARENTHESIS,
                "Expect ')' after expression."
            );
            console.debug("Parsed grouping:", expr);
            return new GroupingExpr(expr);
        }

        throw this.create_error(this.peek(), "Unexpected token.");
    }

    private statement(): Stmt {
        console.debug("Parsing equality...");
        const expression = this.expression();

        if (this.match(TokenType.DISPLAY)) {
            return new DisplayStmt(expression);
        }
        if (this.match(TokenType.COLON)) {
            return new ExpressionStmt(expression);
        }

        throw this.create_error(
            this.peek(),
            "Expect statement terminator."
        );
    }

    /* Entry point for parsing */
    public parse(): Stmt[] {
        const statements = [];
        while (!this.isAtEnd()) {
            statements.push(this.statement());
        }
        return statements;
    }
}
