import Token from "./Token";
import type { BinaryOperator, UnaryOperator } from "./types";

export abstract class Expr {
    abstract accept<R>(visitor: Visitor<R>): R;
    abstract toString(): string;
}

export interface Visitor<R> {
    visitAssignExpr(expr: Assign): R;
    visitBinaryExpr(expr: Binary): R;
    visitGroupingExpr(expr: Grouping): R;
    visitNumberExpr(expr: NumberLiteral): R;
    visitUnaryExpr(expr: Unary): R;
    visitVariableExpr(expr: Variable): R;
}

export class Assign extends Expr {
    name: Token;
    value: Expr;

    constructor(name: Token, value: Expr) {
        super();
        this.name = name;
        this.value = value;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitAssignExpr(this);
    }

    toString(): string {
        return `(Assign ${this.name.lexeme} = ${this.value.toString()})`;
    }
}

export class Binary extends Expr {
    left: Expr;
    operator: Token<BinaryOperator>;
    right: Expr;

    constructor(left: Expr, operator: Token<BinaryOperator>, right: Expr) {
        super();
        this.left = left;
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitBinaryExpr(this);
    }

    toString(): string {
        return `(Binary ${this.left.toString()} ${
            this.operator.lexeme
        } ${this.right.toString()})`;
    }
}

export class Grouping extends Expr {
    expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitGroupingExpr(this);
    }

    toString(): string {
        return `(Grouping (${this.expression.toString()}))`;
    }
}

export class NumberLiteral extends Expr {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitNumberExpr(this);
    }

    toString(): string {
        return `(NumberLiteral ${this.value})`;
    }
}

export class Unary extends Expr {
    operator: Token<UnaryOperator>;
    right: Expr;

    constructor(operator: Token<UnaryOperator>, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }

    toString(): string {
        return `(Unary ${this.operator.lexeme} ${this.right.toString()})`;
    }
}

export class Variable extends Expr {
    name: Token;

    constructor(name: Token) {
        super();
        this.name = name;
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitVariableExpr(this);
    }

    toString(): string {
        return `(Variable ${this.name.lexeme})`;
    }
}
