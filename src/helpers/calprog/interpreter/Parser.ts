import { TokenType } from "./enums";
import {
    AssignmentExpr,
    Expr,
    BinaryExpr,
    ComplexLiteralExpr,
    ExponentialExpr,
    FunctionCallExpr,
    GroupingExpr,
    InputExpr,
    NumberLiteralExpr,
    SignedExpr,
    UnaryExpr,
    VariableExpr,
} from "./Expr";
import {
    AssignmentStmt,
    BreakStmt,
    ConditionalJumpStmt,
    DataEntryStmt,
    ElseStmt,
    ExpressionStmt,
    ForStmt,
    GotoStmt,
    IfEndStmt,
    IfStmt,
    LabelStmt,
    MemoryControlStmt,
    NextStmt,
    NoopStmt,
    Stmt,
    SystemCommandStmt,
    ThenStmt,
    WhileEndStmt,
    WhileStmt,
} from "./Stmt";
import Token from "./Token";
import {
    CombinatorialOperator,
    EqualityOperator,
    FunctionIdentifier,
    Identifier,
    IdentifierToken,
    SignedOperator,
    VariableName,
} from "./types";
import { ComplexValue, Value } from "./Value";

const FUNCTIONS = [
    TokenType.ABS,
    TokenType.POLAR,
    TokenType.REC,
    TokenType.RND,
    TokenType.ARGUMENT,
    TokenType.CONJUGATE,
    TokenType.SIN,
    TokenType.COS,
    TokenType.TAN,
    TokenType.ARC_SIN,
    TokenType.ARC_COS,
    TokenType.ARC_TAN,
    TokenType.LOG,
    TokenType.LN,
    TokenType.SQRT,
    TokenType.CUBE_ROOT,
    TokenType.TEN_X_POWER,
    TokenType.E_X_POWER,
] as const;

const IMPLICIT_STATEMENT_CLOSERS = [
    TokenType.ASSIGN,
    TokenType.M_PLUS,
    TokenType.M_MINUS,
] as const;

export default class Parser {
    private readonly tokens: Token[];
    private current = 0;
    private contextualBoundaries: TokenType[][] = [];

    public constructor(tokens: Token[]) {
        this.tokens = tokens;
    }

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
        if (this.isAtEnd()) {
            return false;
        }
        return types.includes(this.peek().type);
    }

    private advance(): Token {
        if (!this.isAtEnd()) {
            this.current++;
        }
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
        const list = Array.isArray(types) ? types : [types];
        if (this.check(...list)) {
            return this.advance() as Token<T>;
        }
        throw this.createError(this.peek(), message);
    }

    private createError(token: Token, message: string): Error {
        return new Error(`Error at ${token.segment}: ${message} (${token.lexeme})`);
    }

    private skipSeparators(): void {
        while (this.match(TokenType.COLON)) {
            continue;
        }
    }

    private withContextualBoundaries<T>(
        boundaries: TokenType[],
        callback: () => T
    ): T {
        this.contextualBoundaries.push(boundaries);
        try {
            return callback();
        } finally {
            this.contextualBoundaries.pop();
        }
    }

    private isContextualBoundary(): boolean {
        return this.contextualBoundaries.some((boundaries) =>
            boundaries.includes(this.peek().type)
        );
    }

    private isExpressionBoundary(): boolean {
        return (
            this.isContextualBoundary() ||
            this.check(
                TokenType.COLON,
                TokenType.DISPLAY,
                TokenType.EOP,
                TokenType.THEN,
                TokenType.ELSE,
                TokenType.IF_END,
                TokenType.WHILE_END,
                TokenType.NEXT,
                TokenType.STEP,
                TokenType.TO,
                TokenType.DT
            )
        );
    }

    private isDataEntryStatementAhead(): boolean {
        for (let i = this.current; i < this.tokens.length; i++) {
            const token = this.tokens[i];
            if (
                token.type === TokenType.COLON ||
                token.type === TokenType.DISPLAY ||
                token.type === TokenType.EOP
            ) {
                return false;
            }
            if (token.type === TokenType.DT) {
                return true;
            }
        }
        return false;
    }

    private dataEntryStatement(): Stmt {
        const x = this.withContextualBoundaries([TokenType.COMMA], () =>
            this.expression()
        );
        this.consume(TokenType.COMMA, "Expect comma in DT data entry.");
        const y = this.withContextualBoundaries([TokenType.SEMICOLON], () =>
            this.expression(false)
        );
        let frequency: Expr | null = null;
        if (this.match(TokenType.SEMICOLON)) {
            frequency = this.expression();
        }
        this.consume(TokenType.DT, "Expect DT after data entry.");
        return new DataEntryStmt(x, y, frequency);
    }

    private expression(allowAssignment = true): Expr {
        return this.assignmentExpression(allowAssignment);
    }

    private assignmentExpression(allowAssignment: boolean): Expr {
        const expr = this.conditionalConversion();
        if (allowAssignment && this.match(TokenType.ASSIGN)) {
            const variable = this.consume(
                TokenType.VARIABLE,
                "Expect variable name."
            ) as Token<Identifier, VariableName>;
            return new AssignmentExpr(variable, variable.lexeme, expr);
        }
        return expr;
    }

    private conditionalConversion(): Expr {
        let expr = this.equality();
        while (
            !this.isExpressionBoundary() &&
            this.match(
                TokenType.TO_POLAR,
                TokenType.TO_COMPLEX,
                TokenType.SEMICOLON,
                TokenType.COMPLEX_ARGUMENT
            )
        ) {
            const operator = this.previous() as Token<
                | TokenType.TO_POLAR
                | TokenType.TO_COMPLEX
                | TokenType.SEMICOLON
                | TokenType.COMPLEX_ARGUMENT
            >;
            const right = this.equality();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private equality(): Expr {
        let expr = this.comparison();
        while (!this.isExpressionBoundary() && this.match(TokenType.EQ, TokenType.NEQ)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.comparison();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private comparison(): Expr {
        let expr = this.term();
        while (
            !this.isExpressionBoundary() &&
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
        while (!this.isExpressionBoundary() && this.match(TokenType.PLUS, TokenType.MINUS)) {
            const operator = this.previous() as Token<EqualityOperator>;
            const right = this.factor();
            expr = new BinaryExpr(expr, operator, right);
        }
        return expr;
    }

    private factor(): Expr {
        let expr = this.signed();
        while (
            !this.isExpressionBoundary() &&
            this.check(
                TokenType.MULTIPLY,
                TokenType.DIVIDE,
                TokenType.FRACTION,
                TokenType.VARIABLE,
                TokenType.STAT_VARIABLE,
                TokenType.CONSTANT,
                ...FUNCTIONS,
                TokenType.X_POWER,
                TokenType.X_ROOT,
                TokenType.LEFT_PARENTHESIS,
                TokenType.INPUT
            )
        ) {
            const type = this.peek().type;
            switch (type) {
                case TokenType.MULTIPLY:
                case TokenType.DIVIDE:
                case TokenType.FRACTION: {
                    const operator = this.consume(
                        [TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.FRACTION],
                        "Expect factor operator"
                    );
                    expr = new BinaryExpr(expr, operator, this.signed());
                    break;
                }
                case TokenType.VARIABLE:
                case TokenType.STAT_VARIABLE:
                case TokenType.CONSTANT:
                case TokenType.LEFT_PARENTHESIS:
                case TokenType.INPUT:
                case TokenType.ABS:
                case TokenType.POLAR:
                case TokenType.REC:
                case TokenType.RND:
                case TokenType.ARGUMENT:
                case TokenType.CONJUGATE:
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
                case TokenType.TEN_X_POWER:
                case TokenType.E_X_POWER:
                    expr = new BinaryExpr(expr, null, this.signed());
                    break;
                case TokenType.X_POWER:
                case TokenType.X_ROOT: {
                    const xOperator = this.consume(
                        [TokenType.X_POWER, TokenType.X_ROOT],
                        "Expect index operator"
                    );
                    expr = new BinaryExpr(expr, xOperator, this.signed());
                    if (this.check(TokenType.RIGHT_PARENTHESIS)) {
                        this.advance();
                    }
                    break;
                }
                default:
                    throw this.createError(
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
            return new SignedExpr(operator, this.signed());
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
                TokenType.INVERSE,
                TokenType.SQUARE,
                TokenType.CUBE,
                TokenType.FACTORIAL,
                TokenType.PERCENT,
                TokenType.DEGREE
            )
        ) {
            expr = new UnaryExpr(
                expr,
                this.previous() as Token<
                    | TokenType.INVERSE
                    | TokenType.SQUARE
                    | TokenType.CUBE
                    | TokenType.FACTORIAL
                    | TokenType.PERCENT
                    | TokenType.DEGREE
                >
            );
        }
        return expr;
    }

    private functionCall(): Expr {
        if (this.match(...FUNCTIONS)) {
            const fn = this.previous() as Token<FunctionIdentifier>;
            const args = this.withContextualBoundaries(
                [...IMPLICIT_STATEMENT_CLOSERS],
                () => {
                    const parsedArgs: Expr[] = [];
                    while (
                        !this.check(TokenType.RIGHT_PARENTHESIS) &&
                        !this.isExpressionBoundary() &&
                        !this.isAtEnd()
                    ) {
                        do {
                            parsedArgs.push(this.expression(false));
                        } while (this.match(TokenType.COMMA));
                    }
                    return parsedArgs;
                }
            );
            if (this.check(TokenType.RIGHT_PARENTHESIS)) {
                this.advance();
            }
            return new FunctionCallExpr(fn, args);
        }
        return this.primary();
    }

    private primary(): Expr {
        if (this.match(TokenType.NUMBER)) {
            const literal = this.previous().literal as Value;
            if (this.match(TokenType.EXP)) {
                const exponent = this.consume(
                    TokenType.NUMBER,
                    "Expect exponent after EXP"
                );
                return new ExponentialExpr(literal, exponent.literal as Value);
            }
            return new NumberLiteralExpr(literal);
        }

        if (
            this.match(
                TokenType.VARIABLE,
                TokenType.STAT_VARIABLE,
                TokenType.CONSTANT
            )
        ) {
            const identifier = this.previous() as IdentifierToken;
            if (
                identifier.lexeme === "𝒾" &&
                identifier.literal === "𝒾"
            ) {
                return new ComplexLiteralExpr(
                    new ComplexValue(Value.from(0), Value.from(1))
                );
            }
            return new VariableExpr(
                identifier,
                (identifier.literal ?? identifier.lexeme) as never
            );
        }

        if (this.match(TokenType.INPUT)) {
            return new InputExpr(this.previous() as Token<TokenType.INPUT>);
        }

        if (this.match(TokenType.LEFT_PARENTHESIS)) {
            const expr = this.withContextualBoundaries(
                [...IMPLICIT_STATEMENT_CLOSERS],
                () => this.expression(false)
            );
            if (this.check(TokenType.RIGHT_PARENTHESIS)) {
                this.advance();
            }
            return new GroupingExpr(expr);
        }

        throw this.createError(this.peek(), "Unexpected token for expression.");
    }

    private parseLabelNumber(source: string, token: Token): number {
        const value = Number(source);
        if (!Number.isInteger(value) || value < 0) {
            throw this.createError(token, "Expect label number.");
        }
        return value;
    }

    private simpleStatement(): Stmt {
        if (this.match(TokenType.CLR_MEMORY)) {
            return new SystemCommandStmt({ type: "CLR_MEMORY" });
        }
        if (this.match(TokenType.CLR_STAT)) {
            return new SystemCommandStmt({ type: "CLR_STAT" });
        }
        if (this.match(TokenType.FREQ_ON)) {
            return new SystemCommandStmt({ type: "FREQ_ON" });
        }
        if (this.match(TokenType.THEN)) {
            return new ThenStmt();
        }
        if (this.match(TokenType.ELSE)) {
            return new ElseStmt();
        }
        if (this.match(TokenType.IF_END)) {
            return new IfEndStmt();
        }
        if (this.match(TokenType.WHILE_END)) {
            return new WhileEndStmt();
        }
        if (this.match(TokenType.NEXT)) {
            return new NextStmt();
        }
        if (this.match(TokenType.BREAK)) {
            return new BreakStmt(this.previous() as Token<TokenType.BREAK>);
        }
        if (this.match(TokenType.LABEL)) {
            const label = this.consume(TokenType.NUMBER, "Expect label number.");
            return new LabelStmt(
                this.parseLabelNumber(label.lexeme as string, label),
                label
            );
        }
        if (this.match(TokenType.GOTO)) {
            const label = this.consume(TokenType.NUMBER, "Expect label number.");
            return new GotoStmt(
                this.parseLabelNumber(label.lexeme as string, label),
                label
            );
        }
        if (this.match(TokenType.IF)) {
            return new IfStmt(this.expression());
        }
        if (this.match(TokenType.WHILE)) {
            return new WhileStmt(this.expression());
        }
        if (this.match(TokenType.FOR)) {
            const initializer = this.expression();
            if (!(initializer instanceof AssignmentExpr)) {
                throw this.createError(
                    this.peek(),
                    "Expect assignment in For statement."
                );
            }
            this.consume(TokenType.TO, "Expect To in For statement.");
            const to = this.expression();
            let step: Expr | null = null;
            if (this.match(TokenType.STEP)) {
                step = this.expression();
            }
            return new ForStmt(
                initializer.value,
                initializer.name as Token<Identifier, VariableName>,
                to,
                step
            );
        }

        if (this.isDataEntryStatementAhead()) {
            return this.dataEntryStatement();
        }

        const expression = this.expression();

        if (expression instanceof AssignmentExpr) {
            return new AssignmentStmt(
                expression.name as Token<Identifier, VariableName>,
                expression.value
            );
        }

        if (this.match(TokenType.M_PLUS, TokenType.M_MINUS)) {
            return new MemoryControlStmt(
                expression,
                this.previous() as Token<TokenType.M_PLUS | TokenType.M_MINUS>
            );
        }

        if (
            expression instanceof BinaryExpr &&
            expression.operator?.type === TokenType.EQ &&
            this.check(TokenType.VARIABLE)
        ) {
            const variable = this.advance() as Token<Identifier, VariableName>;
            const multiplied = new BinaryExpr(
                expression,
                null,
                new VariableExpr(variable, variable.lexeme)
            );
            if (this.match(TokenType.M_PLUS, TokenType.M_MINUS)) {
                return new MemoryControlStmt(
                    multiplied,
                    this.previous() as Token<TokenType.M_PLUS | TokenType.M_MINUS>
                );
            }
            return new ExpressionStmt(multiplied);
        }

        return new ExpressionStmt(expression);
    }

    private jumpTargetStatement(): Stmt {
        if (this.check(TokenType.DISPLAY)) {
            this.advance();
            return new ExpressionStmt(new NumberLiteralExpr(Value.from(0)), true);
        }

        const statement = this.simpleStatement();
        if (this.match(TokenType.DISPLAY)) {
            if (statement instanceof ExpressionStmt) {
                statement.display = true;
                return statement;
            }
            if (statement instanceof AssignmentStmt) {
                statement.display = true;
                return statement;
            }
            if (statement instanceof MemoryControlStmt) {
                statement.display = true;
                return statement;
            }
        }
        return statement;
    }

    private statement(): Stmt {
        if (this.check(TokenType.COLON)) {
            this.advance();
            return new NoopStmt();
        }

        const baseStatement = this.simpleStatement();

        if (this.match(TokenType.ARROW)) {
            const target = this.jumpTargetStatement();
            return new ConditionalJumpStmt(
                (baseStatement as ExpressionStmt).expression,
                target
            );
        }

        if (this.match(TokenType.DISPLAY)) {
            if (baseStatement instanceof ExpressionStmt) {
                baseStatement.display = true;
                return baseStatement;
            }
            if (baseStatement instanceof AssignmentStmt) {
                baseStatement.display = true;
                return baseStatement;
            }
            if (baseStatement instanceof MemoryControlStmt) {
                baseStatement.display = true;
                return baseStatement;
            }
            throw this.createError(
                this.previous(),
                "Display terminator only applies to evaluable statements."
            );
        }

        return baseStatement;
    }

    public parse(): Stmt[] {
        const statements: Stmt[] = [];
        this.skipSeparators();
        while (!this.isAtEnd()) {
            statements.push(this.statement());
            this.skipSeparators();
        }
        return statements;
    }
}
