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
} from "./Expr";
import type Token from "./Token";
import type { ErrorName, Value } from "./types";
import { Environment } from "./Environment";
import {
    combination,
    cos,
    factorial,
    permutation,
    sin,
    tan,
} from "@/helpers/math";

export class Interpreter implements ExprVisitor<Value>, StmtVisitor<void> {
    private readonly environment: Environment = new Environment();

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
        console.log("DISPLAY->", result);
    }

    /* Checkers */
    private checkNumberOperand(
        operator: Token,
        operand: Value
    ): asserts operand is number {
        if (typeof operand === "number") return;
        throw new CalcSyntaxError(operator, "Operand must be a number.");
    }

    private checkPositiveInteger(
        operator: Token,
        operand: Value
    ): asserts operand is number {
        if (
            typeof operand === "number" &&
            operand >= 0 &&
            Number.isInteger(operand)
        )
            return;
        throw new MathError(operator, "Operand must be a positive integer.");
    }

    private checkArgumentsCount(args: Value[], expected: number): void {
        if (args.length !== expected) {
            throw new CalcSyntaxError(
                null,
                `Expected ${expected} arguments, but got ${args.length}.`
            );
        }
    }

    /* Expr Visitors */

    visitNumberExpr(expr: NumberLiteralExpr): number {
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
                return -right;
            case TokenType.PLUS:
                return right;
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Unexpected operator: " + expr.operator.lexeme
                );
        }
    }

    visitFunctionCallExpr(expr: FunctionCallExpr): number {
        const values = expr.args.map((arg) => this.evaluate(arg));
        const type = expr.fn.type;

        switch (type) {
            case TokenType.ABS:
                this.checkArgumentsCount(values, 1);
                return Math.abs(values[0]);
            case TokenType.POLAR:
                this.checkArgumentsCount(values, 2);
                return Math.sqrt(values[0] ** 2 + values[1] ** 2);
            case TokenType.SIN:
                this.checkArgumentsCount(values, 1);
                return sin(this.environment.setup, values[0]);
            case TokenType.COS:
                this.checkArgumentsCount(values, 1);
                return cos(this.environment.setup, values[0]);
            case TokenType.TAN:
                this.checkArgumentsCount(values, 1);
                return tan(this.environment.setup, values[0]);
            default:
                throw new CalcSyntaxError(
                    expr.fn,
                    "Unexpected function: " + expr.fn.lexeme
                );
        }
    }

    visitUnaryExpr(expr: UnaryExpr): number {
        const value = this.evaluate(expr.expression);
        this.checkNumberOperand(expr.operator, value);

        switch (expr.operator.type) {
            case TokenType.INVERSE:
                return 1 / value;
            case TokenType.SQUARE:
                return Math.pow(value, 2);
            case TokenType.CUBE:
                return Math.pow(value, 3);
            case TokenType.FACTORIAL:
                this.checkPositiveInteger(expr.operator, value);
                return factorial(value);
            case TokenType.PERCENT:
                return value / 100;
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
            if (typeof left !== "number" || typeof right !== "number") {
                throw new CalcSyntaxError(null, "Operands must be numbers.");
            }
            return left * right;
        }

        this.checkNumberOperand(expr.operator, left);
        this.checkNumberOperand(expr.operator, right);

        switch (expr.operator.type) {
            /* Term arithmetic operators */
            case TokenType.PLUS:
                return left + right;
            case TokenType.MINUS:
                return left - right;
            /* Other arithmetic operators */
            case TokenType.MULTIPLY:
                return left * right;
            case TokenType.DIVIDE:
                if (right === 0) {
                    throw new MathError(expr.operator, "Division by zero");
                }
                return left / right;
            case TokenType.FRACTION:
                if (right === 0) {
                    throw new MathError(expr.operator, "Division by zero");
                }
                // todo: fraction type
                return left / right;
            /* Comparison operators */
            case TokenType.GT:
                return left > right ? 1 : 0;
            case TokenType.GTE:
                return left >= right ? 1 : 0;
            case TokenType.LT:
                return left < right ? 1 : 0;
            case TokenType.LTE:
                return left <= right ? 1 : 0;
            /* Equality operators */
            case TokenType.EQ:
                return left === right ? 1 : 0;
            case TokenType.NEQ:
                return left !== right ? 1 : 0;
            /* Combinatorial operators */
            case TokenType.PERMUTATION:
                this.checkPositiveInteger(expr.operator, left);
                this.checkPositiveInteger(expr.operator, right);
                return permutation(left, right);
            case TokenType.COMBINATION:
                this.checkPositiveInteger(expr.operator, left);
                this.checkPositiveInteger(expr.operator, right);
                return combination(left, right);
            /* Unreachable */
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Invalid operator: " + expr.operator.lexeme
                );
        }
    }

    visitExponentialExpr(expr: ExponentialExpr): number {
        return expr.factor * 10 ** expr.exponent;
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
            } else if (error instanceof CalcSyntaxError) {
                console.error(error.message);
            }
        } finally {
            this.display();
        }
    }
}
