import Token from "./Token";
import type {
    BinaryOperator,
    Identifier,
    IdentifierName,
    UnaryOperator,
} from "./types";

export abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
    abstract toString(): string;
}

export interface ExprVisitor<R> {
    visitBinaryExpr(expr: BinaryExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitNumberExpr(expr: NumberLiteralExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
}

export class BinaryExpr extends Expr {
    left: Expr;
    operator: Token<BinaryOperator> | null; // Null would mean multiplication
    right: Expr;

    constructor(left: Expr, operator: Token<BinaryOperator> | null, right: Expr) {
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
            this.operator?.lexeme ?? "null"
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
    name: Token<Identifier>;
    identifier: IdentifierName;

    constructor(name: Token<Identifier>, identifier: IdentifierName) {
        super();
        this.name = name;
        this.identifier = identifier;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitVariableExpr(this);
    }

    toString(): string {
        return `(Variable ${this.name.lexeme})`;
    }
}
