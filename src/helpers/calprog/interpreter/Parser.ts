import { TokenType } from "./enums";
import {
    Expr,
    BinaryExpr,
    GroupingExpr,
    NumberLiteralExpr,
    SignedExpr,
    VariableExpr,
    ExponentialExpr,
    UnaryExpr,
} from "./Expr";
import {
    AssignmentStmt,
    DisplayStmt,
    ExpressionStmt,
    MemoryControlStmt,
    Stmt,
} from "./Stmt";
import Token from "./Token";
import {
    EqualityOperator,
    ExponentOperator,
    Identifier,
    IdentifierToken,
    SignedOperator,
    VariableName,
} from "./types";

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

    private consume<T extends TokenType>(
        types: T | T[],
        message: string
    ): Token<T> {
        if (!Array.isArray(types)) types = [types];
        if (this.check(...types)) return this.advance() as Token<T>;
        throw this.create_error(this.peek(), message);
    }

    private create_error(token: Token, message: string) {
        return new Error(
            `Error at ${token.segment}: ${message} (${token.lexeme})`
        );
    }

    /* Parsing methods */
    private expression(): Expr {
        return this.equality();
    }

    private equality(): Expr {
        let expr = this.comparison();

        while (this.match(TokenType.EQ, TokenType.NEQ)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.comparison();
            expr = new BinaryExpr(expr, operator, right);
        }

        return expr;
    }

    private comparison(): Expr {
        let expr = this.term();

        while (
            this.match(TokenType.GT, TokenType.GTE, TokenType.LT, TokenType.LTE)
        ) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.term();
            expr = new BinaryExpr(expr, operator, right);
        }

        return expr;
    }

    private term(): Expr {
        let expr = this.factor();

        while (this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.factor();
            expr = new BinaryExpr(expr, operator, right);
        }

        return expr;
    }

    private factor(): Expr {
        let expr = this.signed();

        while (
            this.check(
                ...[TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.FRACTION],
                ...[TokenType.VARIABLE, TokenType.CONSTANT]
            )
        ) {
            const type = this.peek().type;
            switch (type) {
                case TokenType.MULTIPLY:
                case TokenType.DIVIDE:
                case TokenType.FRACTION:
                    const operator = this.consume(
                        [
                            TokenType.MULTIPLY,
                            TokenType.DIVIDE,
                            TokenType.FRACTION,
                        ],
                        "Expect factor operator"
                    );
                    expr = new BinaryExpr(expr, operator, this.signed());
                    break;
                case TokenType.VARIABLE:
                case TokenType.CONSTANT:
                    expr = new BinaryExpr(expr, null, this.signed() as Expr);
                    break;
            }
        }

        return expr;
    }

    private signed(): Expr {
        if (this.match(TokenType.MINUS, TokenType.PLUS, TokenType.NEGATIVE)) {
            const operator = this.previous() as Token<SignedOperator>;
            const right = this.signed();
            return new SignedExpr(operator, right);
        }

        return this.unary();
    }

    private unary(): Expr {
        let expr = this.primary();

        while (
            this.match(TokenType.INVERSE, TokenType.SQUARE, TokenType.CUBE)
        ) {
            const operator = this.previous() as Token<ExponentOperator>;
            expr = new UnaryExpr(expr, operator);
        }

        return expr;
    }

    private primary(): Expr {
        if (this.match(TokenType.NUMBER)) {
            const literal = this.previous().literal as number;
            if (this.match(TokenType.EXP)) {
                const exponent = this.consume(
                    TokenType.NUMBER,
                    "Expect exponent after EXP"
                );
                return new ExponentialExpr(literal, exponent.literal as number);
            }
            return new NumberLiteralExpr(literal as number);
        }

        if (this.match(TokenType.VARIABLE, TokenType.CONSTANT)) {
            const identifier = this.previous() as IdentifierToken;
            return new VariableExpr(identifier, identifier.lexeme);
        }

        if (this.match(TokenType.LEFT_PARENTHESIS)) {
            const expr = this.expression();
            this.consume(
                TokenType.RIGHT_PARENTHESIS,
                "Expect ')' after expression."
            );
            return new GroupingExpr(expr);
        }

        throw this.create_error(
            this.peek(),
            "Unexpected token for expression."
        );
    }

    private statement(): Stmt {
        const expression = this.expression();
        if (this.match(TokenType.ASSIGN)) {
            const variable = this.consume(
                TokenType.VARIABLE,
                "Expect variable name." + this.current
            ) as Token<Identifier, VariableName>; // Literal is a VariableName

            if (this.isAtEnd()) {
                return new AssignmentStmt(
                    variable,
                    expression,
                    this.peek() as Token<TokenType.EOP>
                );
            }

            const terminator = this.consume(
                [TokenType.COLON, TokenType.DISPLAY],
                "Expect statement terminator."
            );
            return new AssignmentStmt(variable, expression, terminator);
        }

        type MemoryControlToken = Token<TokenType.M_PLUS | TokenType.M_MINUS>;
        if (this.match(TokenType.M_PLUS, TokenType.M_MINUS)) {
            const operator = this.previous() as MemoryControlToken;
            const stmt = new MemoryControlStmt(expression, operator);

            if (this.isAtEnd()) return stmt;
            const terminator = this.consume(
                [TokenType.COLON, TokenType.DISPLAY],
                "Expect statement terminator."
            );
            if (terminator.type === TokenType.DISPLAY) {
                return new DisplayStmt(stmt);
            }
            return stmt;
        }
        if (this.match(TokenType.DISPLAY)) {
            return new DisplayStmt(new ExpressionStmt(expression));
        }
        if (this.match(TokenType.COLON)) {
            return new ExpressionStmt(expression);
        }
        if (this.isAtEnd()) {
            return new ExpressionStmt(expression);
        }

        throw this.create_error(
            this.peek(),
            `Unexpected token #${this.peek().type} for statement.`
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
