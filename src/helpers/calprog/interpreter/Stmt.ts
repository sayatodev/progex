import { TokenType } from "./enums";
import { type Expr } from "./Expr";
import type Token from "./Token";
import { Identifier, Terminator, VariableName } from "./types";

export abstract class Stmt {
    abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
    visitExpressionStmt(stmt: ExpressionStmt): R;
    visitDisplayStmt(stmt: DisplayStmt): R;
    visitAssignmentStmt(stmt: AssignmentStmt): R;
    visitMemoryControlStmt(stmt: MemoryControlStmt): R;
    visitIfStmt(stmt: IfStmt): R;
    visitWhileStmt(stmt: WhileStmt): R;
    visitGotoStmt(stmt: GotoStmt): R;
    visitLabelStmt(stmt: LabelStmt): R;
    visitForStmt(stmt: ForStmt): R;
}

export class ExpressionStmt extends Stmt {
    expression: Expr;

    constructor(expression: Expr) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }
}

export class DisplayStmt extends Stmt {
    expression: ExpressionStmt;

    constructor(expression: ExpressionStmt) {
        super();
        this.expression = expression;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitDisplayStmt(this);
    }
}

export class AssignmentStmt extends Stmt {
    name: Token<Identifier, VariableName>;
    initializer: Expr;
    terminator: Token<Terminator>;

    constructor(
        name: Token<Identifier, VariableName>,
        initializer: Expr,
        terminator: Token<Terminator>
    ) {
        super();
        this.name = name;
        this.initializer = initializer;
        this.terminator = terminator;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitAssignmentStmt(this);
    }
}

export class MemoryControlStmt extends Stmt {
    expression: Expr;
    operator: Token<TokenType.M_PLUS | TokenType.M_MINUS>;

    constructor(
        expression: Expr,
        operator: Token<TokenType.M_PLUS | TokenType.M_MINUS>
    ) {
        super();
        this.expression = expression;
        this.operator = operator;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitMemoryControlStmt(this);
    }
}

export class IfStmt extends Stmt {
    condition: Expr;
    thenBranch: Stmt;
    elseBranch: Stmt | null;

    constructor(condition: Expr, thenBranch: Stmt, elseBranch: Stmt | null) {
        super();
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
}

export class WhileStmt extends Stmt {
    condition: Expr;
    body: Stmt;

    constructor(condition: Expr, body: Stmt) {
        super();
        this.condition = condition;
        this.body = body;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileStmt(this);
    }
}

export class GotoStmt extends Stmt {
    label: Token;

    constructor(label: Token) {
        super();
        this.label = label;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitGotoStmt(this);
    }
}

export class LabelStmt extends Stmt {
    name: Token<TokenType.NUMBER>;

    constructor(name: Token<TokenType.NUMBER>) {
        super();
        this.name = name;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitLabelStmt(this);
    }
}

export class ForStmt extends Stmt {
    /* for to [step] next */
    from: Expr;
    to: Expr;
    body: Stmt;
    step: Expr;

    constructor(from: Expr, to: Expr, body: Stmt, step: Expr) {
        super();
        this.from = from;
        this.to = to;
        this.body = body;
        this.step = step;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}
