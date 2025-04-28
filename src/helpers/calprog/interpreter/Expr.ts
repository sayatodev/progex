import Token from "./Token";
import type { BinaryOperator, UnaryOperator } from "./types";

export abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
    abstract toString(): string;
}

export interface ExprVisitor<R> {
    visitAssignExpr(expr: AssignExpr): R;
    visitBinaryExpr(expr: BinaryExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitNumberExpr(expr: NumberLiteralExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
}

export class AssignExpr extends Expr {
    name: Token;
    value: Expr;

    constructor(name: Token, value: Expr) {
        super();
        this.name = name;
        this.value = value;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

    toString(): string {
        return `(Assign ${this.name.lexeme} = ${this.value.toString()})`;
    }
}

export class BinaryExpr extends Expr {
    left: Expr;
    operator: Token<BinaryOperator>;
    right: Expr;

    constructor(left: Expr, operator: Token<BinaryOperator>, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }

    toString(): string {
        return `(Binary ${this.left.toString()} ${
            this.operator.lexeme
        } ${this.right.toString()})`;
    }
}

export class GroupingExpr extends Expr {
    expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }

    toString(): string {
        return `(Grouping (${this.expression.toString()}))`;
    }
}

export class NumberLiteralExpr extends Expr {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitNumberExpr(this);
    }

    toString(): string {
        return `(NumberLiteral ${this.value})`;
    }
}

export class UnaryExpr extends Expr {
    operator: Token<UnaryOperator>;
    right: Expr;

    constructor(operator: Token<UnaryOperator>, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }

    toString(): string {
        return `(Unary ${this.operator.lexeme} ${this.right.toString()})`;
    }
}

export class VariableExpr extends Expr {
    name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }

    toString(): string {
        return `(Variable ${this.name.lexeme})`;
    }
}
