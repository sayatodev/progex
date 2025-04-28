import { TokenType } from "./enums";
import { CalcSyntaxError, MathError, RuntimeError } from "./Errors";
import {
    Assign,
    Binary,
    Expr,
    Grouping,
    NumberLiteral,
    Unary,
    Variable,
    Visitor,
} from "./Expr";
import Token from "./Token";

type Value = number | null;

export class Interpreter implements Visitor<Value> {
    constructor() {}

    private evaluate(expr: Expr): Value {
        return expr.accept(this);
    }

    /* Checkers */
    private checkNumberOperand(
        operator: Token,
        operand: Value
    ): asserts operand is number {
        if (typeof operand === "number") return;
        throw new CalcSyntaxError(operator, "Operand must be a number.");
    }

    /* Visitors */

    visitNumberExpr(expr: NumberLiteral): number {
        return expr.value;
    }

    visitGroupingExpr(expr: Grouping): Value {
        return this.evaluate(expr.expression);
    }

    visitUnaryExpr(expr: Unary): Value {
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

    visitBinaryExpr(expr: Binary): Value {
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

    visitAssignExpr(expr: Assign): Value {
        void expr;
        console.debug("Assigning", expr.name.lexeme, "to", expr.value);
        throw new Error("Not implemented yet.");
    }

    visitVariableExpr(expr: Variable): Value {
        void expr;
        console.debug("Getting variable", expr.name.lexeme);
        throw new Error("Not implemented yet.");
    }

    interpret(expr: Expr): Error | Value {
        try {
            return this.evaluate(expr);
        } catch (error) {
            if (error instanceof RuntimeError) {
                return error;
            } else {
                throw error;
            }
        }
    }
}
