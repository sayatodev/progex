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
    VarStmt,
    WhileStmt,
} from "./Stmt";
import { CalcSyntaxError, MathError, RuntimeError } from "./Errors";
import type {
    AssignExpr,
    BinaryExpr,
    Expr,
    GroupingExpr,
    NumberLiteralExpr,
    UnaryExpr,
    VariableExpr,
    ExprVisitor,
} from "./Expr";
import type Token from "./Token";
import type { ErrorName } from "./types";

type Value = number | null;

export class Interpreter implements ExprVisitor<Value>, StmtVisitor<void> {
    constructor() {}

    private evaluate(expr: Expr): Value {
        return expr.accept(this);
    }

    private execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    private error(name:ErrorName, token: Token, message: string): never {
        throw new RuntimeError(name, token, message);
    }

    /* Checkers */
    private checkNumberOperand(
        operator: Token,
        operand: Value
    ): asserts operand is number {
        if (typeof operand === "number") return;
        throw new CalcSyntaxError(operator, "Operand must be a number.");
    }

    /* Expr Visitors */

    visitNumberExpr(expr: NumberLiteralExpr): number {
        return expr.value;
    }

    visitGroupingExpr(expr: GroupingExpr): Value {
        return this.evaluate(expr.expression);
    }

    visitUnaryExpr(expr: UnaryExpr): Value {
        const right = this.evaluate(expr.right);
        this.checkNumberOperand(expr.operator, right);

        switch (expr.operator.type) {
            case TokenType.MINUS:
            case TokenType.NEGATIVE:
                return -right;
            case TokenType.PLUS:
                return right;
        }
    }

    visitBinaryExpr(expr: BinaryExpr): Value {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

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
            /* Unreachable */
            default:
                throw new CalcSyntaxError(
                    expr.operator,
                    "Invalid operator: " + expr.operator.lexeme
                );
        }
    }

    visitAssignExpr(expr: AssignExpr): Value {
        void expr;
        console.debug("Assigning", expr.name.lexeme, "to", expr.value);
        throw new Error("Not implemented yet.");
    }

    visitVariableExpr(expr: VariableExpr): Value {
        void expr;
        console.debug("Getting variable", expr.name.lexeme);
        throw new Error("Not implemented yet.");
    }

    /* Stmt Visitors */

    visitExpressionStmt(stmt: ExpressionStmt): void {
        this.evaluate(stmt.expression);
    }

    visitDisplayStmt(stmt: DisplayStmt): void {
        const value = this.evaluate(stmt.expression);
        console.log("DISPLAY->", value);
    }

    visitVarStmt(stmt: VarStmt): void {
        const value = stmt.initializer ? this.evaluate(stmt.initializer) : null;
        console.debug("Declaring variable", stmt.name.lexeme, "=", value);
        throw new Error("Not implemented yet.");
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
        }
    }
}
