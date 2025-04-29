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
    FunctionCallExpr,
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
    CombinatorialOperator,
    EqualityOperator,
    ExponentOperator,
    FunctionIdentifier,
    Identifier,
    IdentifierToken,
    SignedOperator,
    VariableName,
} from "./types";

const FUNCTIONS = [
    ...[TokenType.ABS, TokenType.POLAR],
    ...[TokenType.SIN, TokenType.COS, TokenType.TAN],
    ...[TokenType.ARC_SIN, TokenType.ARC_COS, TokenType.ARC_TAN],
    ...[TokenType.LOG, TokenType.LN, TokenType.SQRT, TokenType.CUBE_ROOT],
];

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
                /* Chainable symbols (Treated as multiplication) */
                ...[TokenType.VARIABLE, TokenType.CONSTANT],
                ...FUNCTIONS,
                ...[TokenType.X_POWER, TokenType.X_ROOT]
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
                /* Chaining identifiers */
                case TokenType.VARIABLE:
                case TokenType.CONSTANT:
                    expr = new BinaryExpr(expr, null, this.signed());
                    break;
                /* Chaining function calls */
                case TokenType.ABS:
                case TokenType.POLAR:
                case TokenType.SIN:
                case TokenType.COS:
                case TokenType.TAN:
                case TokenType.ARC_SIN:
                case TokenType.ARC_COS:
                case TokenType.ARC_TAN:
                case TokenType.LOG:
                case TokenType.LN:
                case TokenType.SQRT:
                case TokenType.CUBE_ROOT:
                    expr = new BinaryExpr(expr, null, this.signed());
                    break;
                /* Custom Indices */
                case TokenType.X_POWER:
                case TokenType.X_ROOT:
                    const x_operator = this.consume(
                        [TokenType.X_POWER, TokenType.X_ROOT],
                        "Expect ^ operator"
                    );
                    expr = new BinaryExpr(expr, x_operator, this.signed());
                    this.consume(TokenType.RIGHT_PARENTHESIS, "Expect )");
                    break;
                /* Supposedly unreachable */
                default:
                    throw this.create_error(
                        this.peek(),
                        `Unexpected token #${this.peek().type} for factor.`
                    );
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

        return this.combinatorial();
    }

    private combinatorial(): Expr {
        let expr = this.unary();
        while (this.match(TokenType.COMBINATION, TokenType.PERMUTATION)) {
            const operator = this.previous() as Token<CombinatorialOperator>;
            const right = this.unary();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private unary(): Expr {
        let expr = this.functionCall();
        while (
            this.match(
                ...[TokenType.INVERSE, TokenType.SQUARE, TokenType.CUBE],
                ...[TokenType.FACTORIAL, TokenType.PERCENT]
            )
        ) {
            const operator = this.previous() as Token<ExponentOperator>;
            expr = new UnaryExpr(expr, operator);
        }

        return expr;
    }

    private functionCall(): Expr {
        if (this.match(...FUNCTIONS)) {
            const fn = this.previous() as Token<FunctionIdentifier>;
            const args: Expr[] = [];
            while (
                !this.check(TokenType.RIGHT_PARENTHESIS) &&
                !this.isAtEnd()
            ) {
                do {
                    args.push(this.expression());
                } while (this.match(TokenType.COMMA));
            }

            this.consume(
                TokenType.RIGHT_PARENTHESIS,
                `Expect ')' after function arguments.`
            );
            return new FunctionCallExpr(fn, args);
        }
        return this.primary();
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
