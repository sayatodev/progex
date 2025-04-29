import Token from "./Token";
import type {
    BinaryOperator,
    FunctionIdentifier,
    Identifier,
    IdentifierName,
    SignedOperator,
    UnaryOperator,
} from "./types";

export abstract class Expr {
    abstract accept<R>(visitor: ExprVisitor<R>): R;
    abstract toString(): string;
}

export interface ExprVisitor<R> {
    visitBinaryExpr(expr: BinaryExpr): R;
    visitUnaryExpr(expr: UnaryExpr): R;
    visitGroupingExpr(expr: GroupingExpr): R;
    visitExponentialExpr(expr: ExponentialExpr): R;
    visitNumberExpr(expr: NumberLiteralExpr): R;
    visitSignedExpr(expr: SignedExpr): R;
    visitVariableExpr(expr: VariableExpr): R;
    visitFunctionCallExpr(expr: FunctionCallExpr): R;
}

export class BinaryExpr extends Expr {
    left: Expr;
    operator: Token<BinaryOperator> | null; // Null would mean multiplication
    right: Expr;

    constructor(
        left: Expr,
        operator: Token<BinaryOperator> | null,
        right: Expr
    ) {
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

export class UnaryExpr extends Expr {
    expression: Expr;
    operator: Token<UnaryOperator>;

    constructor(expression: Expr, operator: Token<UnaryOperator>) {
        super();
        this.expression = expression;
        this.operator = operator;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitUnaryExpr(this);
    }

    toString(): string {
        return `(Unary ${this.operator.lexeme} ${this.expression.toString()})`;
    }
}

export class FunctionCallExpr extends Expr {
    fn: Token<FunctionIdentifier>;
    args: Expr[];

    constructor(name: Token<FunctionIdentifier>, args: Expr[]) {
        super();
        this.fn = name;
        this.args = args;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitFunctionCallExpr(this);
    }

    toString(): string {
        return `(FunctionCall ${this.fn.lexeme} [${this.args.join(",")}])`;
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

export class ExponentialExpr extends Expr {
    factor: number;
    exponent: number;
    constructor(factor: number, exponent: number) {
        super();
        this.factor = factor;
        this.exponent = exponent;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitExponentialExpr(this);
    }

    toString(): string {
        return `(Exponential ${this.factor})`;
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

export class SignedExpr extends Expr {
    operator: Token<SignedOperator>;
    right: Expr;

    constructor(operator: Token<SignedOperator>, right: Expr) {
        super();
        this.operator = operator;
        this.right = right;
    }

    accept<R>(visitor: ExprVisitor<R>): R {
        return visitor.visitSignedExpr(this);
    }

    toString(): string {
        return `(Signed ${this.operator.lexeme} ${this.right.toString()})`;
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
