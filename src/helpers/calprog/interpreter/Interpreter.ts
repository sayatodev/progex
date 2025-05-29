import { TokenType } from "./enums";
import type {
    DisplayStmt,
    ExpressionStmt,
    ForStmt,
    GotoStmt,
    IfStmt,
    LabelStmt,
    Stmt,
    StmtVisitor,
    AssignmentStmt,
    WhileStmt,
    MemoryControlStmt,
} from "./Stmt";
import { CalcSyntaxError, MathError, RuntimeError } from "./Errors";
import type {
    BinaryExpr,
    Expr,
    GroupingExpr,
    NumberLiteralExpr,
    SignedExpr,
    VariableExpr,
    ExprVisitor,
    ExponentialExpr,
    UnaryExpr,
    FunctionCallExpr,
    InputExpr,
} from "./Expr";
import Token from "./Token";
import type { ErrorName } from "./types";
import { Environment } from "./Environment";
import { Value } from "./Value";

export class Interpreter implements ExprVisitor<Value>, StmtVisitor<void> {
    readonly environment: Environment = new Environment();

    constructor() {}

    private evaluate(expr: Expr): Value {
        const result = expr.accept(this);
        this.environment.result = result;
        return result;
    }

    private execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    private error(
        name: ErrorName,
        token: Token | null,
        message: string
    ): never {
        throw new RuntimeError(name, token, message);
    }

    private display(): void {
        const result = this.environment.result;
        this.environment.displayCallback(result);
    }

    /* Checkers */
    private checkNumberOperand(
        operator: Token,
        operand: Value
    ): asserts operand is Value {
        if (operand instanceof Value) return;
        throw new MathError(
            operator,
            `Operand must be a number, but got ${typeof operand}.`
        );
    }

    private checkPositiveInteger(
        operator: Token,
        operand: Value
    ): asserts operand is Value {
        if (
            typeof operand === "number" &&
            operand >= 0 &&
            Number.isInteger(operand)
        )
            return;
        throw new MathError(operator, "Operand must be a positive integer.");
    }

    private checkArgumentsCount(
        token: Token,
        args: Value[],
        expected_min: number,
        expected_max?: number
    ): void {
        const min = expected_min < 0 ? 0 : expected_min;
        const max = expected_max ?? expected_min;
        if (args.length < min || args.length > max) {
            throw new CalcSyntaxError(
                token,
                `Expected ${min} ${
                    expected_max ? ` to ${max}` : ""
                } argument(s), but got ${args.length}.`
            );
        }
    }

    /* Expr Visitors */

    visitNumberExpr(expr: NumberLiteralExpr): Value {
        return expr.value;
    }

    visitGroupingExpr(expr: GroupingExpr): Value {
        return this.evaluate(expr.expression);
    }

    visitSignedExpr(expr: SignedExpr): Value {
        const right = this.evaluate(expr.right);
        this.checkNumberOperand(expr.operator, right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
            case TokenType.NEGATIVE:
                return right.negated();
            case TokenType.PLUS:
                return right;
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Unexpected operator: " + expr.operator.lexeme
                );
        }
    }

    visitFunctionCallExpr(expr: FunctionCallExpr): Value {
        const values = expr.args.map((arg) => this.evaluate(arg));
        values.forEach((value) => {
            this.checkNumberOperand(expr.fn, value);
        });
        const type = expr.fn.type;

        switch (type) {
            case TokenType.ABS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].abs();
            case TokenType.POLAR:
                this.checkArgumentsCount(expr.fn, values, 2);
                return values[0].square().add(values[1].square()).sqrt();
            case TokenType.SIN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].sin(this.environment.setup);
            // return calprog.sin(this.environment.setup, values[0].number());
            case TokenType.COS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].cos(this.environment.setup);
            case TokenType.TAN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].tan(this.environment.setup);
            case TokenType.ARC_SIN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].asin(this.environment.setup);
            case TokenType.ARC_COS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].acos(this.environment.setup);
            case TokenType.ARC_TAN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].atan(this.environment.setup);
            case TokenType.LOG:
                this.checkArgumentsCount(expr.fn, values, 1, 2);
                if (values.length === 1) {
                    return values[0].log();
                } else {
                    return values[1].log_x(values[0]);
                }
            case TokenType.LN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].ln();
            case TokenType.SQRT:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].sqrt();
            case TokenType.CUBE_ROOT:
                this.checkArgumentsCount(expr.fn, values, 1);
                return values[0].cbrt();
            default:
                throw new CalcSyntaxError(
                    expr.fn,
                    "Unexpected function: " + expr.fn.lexeme
                );
        }
    }

    visitUnaryExpr(expr: UnaryExpr): Value {
        const value = this.evaluate(expr.expression);
        this.checkNumberOperand(expr.operator, value);

        switch (expr.operator.type) {
            case TokenType.INVERSE:
                return value.inverse();
            case TokenType.SQUARE:
                return value.square();
            case TokenType.CUBE:
                return value.cube();
            case TokenType.FACTORIAL:
                this.checkPositiveInteger(expr.operator, value);
                return value.factorial();
            case TokenType.PERCENT:
                return value.percent();
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Unexpected operator: " + expr.operator.lexeme
                );
        }
    }

    visitBinaryExpr(expr: BinaryExpr): Value {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        if (expr.operator === null) {
            if (!(left instanceof Value && right instanceof Value)) {
                throw new CalcSyntaxError(null, "Operands must be numbers.");
            }
            return left.mul(right);
        }

        this.checkNumberOperand(expr.operator, left);
        this.checkNumberOperand(expr.operator, right);

        switch (expr.operator.type) {
            /* Term arithmetic operators */
            case TokenType.PLUS:
                return left.add(right);
            case TokenType.MINUS:
                return left.sub(right);
            /* Other arithmetic operators */
            case TokenType.MULTIPLY:
                return left.mul(right);
            case TokenType.DIVIDE:
                if (right.value.eq(0)) {
                    throw new MathError(expr.operator, "Division by zero");
                }
                return left.div(right);
            case TokenType.FRACTION:
                if (right.value.eq(0)) {
                    throw new MathError(expr.operator, "Division by zero");
                }
                // todo: fraction type
                return left.div(right);
            /* Comparison operators */
            case TokenType.GT:
                return Value.from(left.greaterThan(right) ? 1 : 0);
            case TokenType.GTE:
                return Value.from(left.greaterThanOrEqual(right) ? 1 : 0);
            case TokenType.LT:
                return Value.from(left.lessThan(right) ? 1 : 0);
            case TokenType.LTE:
                return Value.from(left.lessThanOrEqual(right) ? 1 : 0);
            /* Equality operators */
            case TokenType.EQ:
                return Value.from(left.equal(right) ? 1 : 0);
            case TokenType.NEQ:
                return Value.from(left.notEqual(right) ? 1 : 0);
            /* Combinatorial operators */
            case TokenType.PERMUTATION:
                this.checkPositiveInteger(expr.operator, left);
                this.checkPositiveInteger(expr.operator, right);
                return left.permutation(right);
            case TokenType.COMBINATION:
                this.checkPositiveInteger(expr.operator, left);
                this.checkPositiveInteger(expr.operator, right);
                return left.combination(right);
            /* Custom Indices */
            case TokenType.X_POWER:
                return left.pow(right);
            case TokenType.X_ROOT:
                return left.x_root(right);
            /* Unreachable */
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Invalid operator: " + expr.operator.lexeme
                );
        }
    }

    visitExponentialExpr(expr: ExponentialExpr): Value {
        return expr.factor.exp(expr.exponent);
    }

    visitVariableExpr(expr: VariableExpr): Value {
        const value = this.environment.get(expr.identifier);
        if (value === undefined) {
            throw new RuntimeError(
                "RuntimeError",
                expr.name,
                `Undefined variable ${expr.name.lexeme}.`
            );
        }
        return value;
    }

    visitInputExpr(_expr: InputExpr): Value {
        const value = this.environment.getInput();
        return value;
    }

    /* Stmt Visitors */

    visitExpressionStmt(stmt: ExpressionStmt): void {
        this.evaluate(stmt.expression);
    }

    visitDisplayStmt(stmt: DisplayStmt): void {
        this.visitExpressionStmt(stmt.expression);
        this.display();
    }

    visitAssignmentStmt(stmt: AssignmentStmt): void {
        const result = this.evaluate(stmt.initializer);
        this.environment.assign(stmt.name.lexeme, result);
        if (stmt.terminator.type === TokenType.DISPLAY) {
            this.display();
        }
    }

    visitMemoryControlStmt(stmt: MemoryControlStmt): void {
        const result = this.evaluate(stmt.expression);
        if (stmt.operator.type === TokenType.M_PLUS) {
            this.environment.mIncrement(result);
        } else if (stmt.operator.type === TokenType.M_MINUS) {
            this.environment.mIncrement(result);
        }
        this.environment.result = result;
    }

    visitIfStmt(stmt: IfStmt): void {
        void stmt;
        throw new Error("Not implemented yet.");
    }

    visitWhileStmt(stmt: WhileStmt): void {
        void stmt;
        throw new Error("Not implemented yet.");
    }

    visitGotoStmt(stmt: GotoStmt): void {
        void stmt;
        throw new Error("Goto statement not implemented yet.");
    }

    visitLabelStmt(stmt: LabelStmt): void {
        void stmt;
        throw new Error("Label statement not implemented yet.");
    }

    visitForStmt(stmt: ForStmt): void {
        void stmt;
        throw new Error("For statement not implemented yet.");
    }

    /* Entry point */

    interpret(expr: Stmt[]): void {
        try {
            for (const statement of expr) {
                this.execute(statement);
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                this.error(error.name, error.token, error.message);
            }
        } finally {
            this.display();
        }
    }
}
