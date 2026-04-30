import { TokenType } from "./enums";
import { type Expr } from "./Expr";
import type Token from "./Token";
import { Identifier, VariableName } from "./types";

export abstract class Stmt {
    abstract accept<R>(visitor: StmtVisitor<R>): R;
}

export interface StmtVisitor<R> {
    visitSystemCommandStmt(stmt: SystemCommandStmt): R;
    visitExpressionStmt(stmt: ExpressionStmt): R;
    visitAssignmentStmt(stmt: AssignmentStmt): R;
    visitMemoryControlStmt(stmt: MemoryControlStmt): R;
    visitDataEntryStmt(stmt: DataEntryStmt): R;
    visitConditionalJumpStmt(stmt: ConditionalJumpStmt): R;
    visitIfStmt(stmt: IfStmt): R;
    visitThenStmt(stmt: ThenStmt): R;
    visitElseStmt(stmt: ElseStmt): R;
    visitIfEndStmt(stmt: IfEndStmt): R;
    visitWhileStmt(stmt: WhileStmt): R;
    visitWhileEndStmt(stmt: WhileEndStmt): R;
    visitGotoStmt(stmt: GotoStmt): R;
    visitLabelStmt(stmt: LabelStmt): R;
    visitForStmt(stmt: ForStmt): R;
    visitNextStmt(stmt: NextStmt): R;
    visitBreakStmt(stmt: BreakStmt): R;
    visitNoopStmt(stmt: NoopStmt): R;
}

export type SystemCommand =
    | { type: "CLR_MEMORY" }
    | { type: "CLR_STAT" }
    | { type: "FREQ_ON" }
    | { type: "SET_MODE"; mode: "COMP" | "CMPLX" | "BASE" | "SD" | "REG" }
    | { type: "SET_REGRESSION"; regression: "LIN" };

export class SystemCommandStmt extends Stmt {
    command: SystemCommand;

    constructor(command: SystemCommand) {
        super();
        this.command = command;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitSystemCommandStmt(this);
    }
}

export class ExpressionStmt extends Stmt {
    expression: Expr;
    display: boolean;

    constructor(expression: Expr, display: boolean = false) {
        super();
        this.expression = expression;
        this.display = display;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitExpressionStmt(this);
    }
}

export class AssignmentStmt extends Stmt {
    name: Token<Identifier, VariableName>;
    initializer: Expr;
    display: boolean;

    constructor(
        name: Token<Identifier, VariableName>,
        initializer: Expr,
        display: boolean = false
    ) {
        super();
        this.name = name;
        this.initializer = initializer;
        this.display = display;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitAssignmentStmt(this);
    }
}

export class MemoryControlStmt extends Stmt {
    expression: Expr;
    operator: Token<TokenType.M_PLUS | TokenType.M_MINUS>;
    display: boolean;

    constructor(
        expression: Expr,
        operator: Token<TokenType.M_PLUS | TokenType.M_MINUS>,
        display: boolean = false
    ) {
        super();
        this.expression = expression;
        this.operator = operator;
        this.display = display;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitMemoryControlStmt(this);
    }
}

export class DataEntryStmt extends Stmt {
    x: Expr;
    y: Expr;
    frequency: Expr | null;

    constructor(x: Expr, y: Expr, frequency: Expr | null = null) {
        super();
        this.x = x;
        this.y = y;
        this.frequency = frequency;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitDataEntryStmt(this);
    }
}

export class ConditionalJumpStmt extends Stmt {
    condition: Expr;
    statement: Stmt;

    constructor(condition: Expr, statement: Stmt) {
        super();
        this.condition = condition;
        this.statement = statement;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitConditionalJumpStmt(this);
    }
}

export class IfStmt extends Stmt {
    condition: Expr;

    constructor(condition: Expr) {
        super();
        this.condition = condition;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfStmt(this);
    }
}

export class ThenStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitThenStmt(this);
    }
}

export class ElseStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitElseStmt(this);
    }
}

export class IfEndStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitIfEndStmt(this);
    }
}

export class WhileStmt extends Stmt {
    condition: Expr;

    constructor(condition: Expr) {
        super();
        this.condition = condition;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileStmt(this);
    }
}

export class WhileEndStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitWhileEndStmt(this);
    }
}

export class GotoStmt extends Stmt {
    label: number;
    token: Token;

    constructor(label: number, token: Token) {
        super();
        this.label = label;
        this.token = token;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitGotoStmt(this);
    }
}

export class LabelStmt extends Stmt {
    name: number;
    token: Token;

    constructor(name: number, token: Token) {
        super();
        this.name = name;
        this.token = token;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitLabelStmt(this);
    }
}

export class ForStmt extends Stmt {
    from: Expr;
    variable: Token<Identifier, VariableName>;
    to: Expr;
    step: Expr | null;

    constructor(
        from: Expr,
        variable: Token<Identifier, VariableName>,
        to: Expr,
        step: Expr | null
    ) {
        super();
        this.from = from;
        this.variable = variable;
        this.to = to;
        this.step = step;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitForStmt(this);
    }
}

export class NextStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitNextStmt(this);
    }
}

export class BreakStmt extends Stmt {
    token: Token<TokenType.BREAK>;

    constructor(token: Token<TokenType.BREAK>) {
        super();
        this.token = token;
    }

    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitBreakStmt(this);
    }
}

export class NoopStmt extends Stmt {
    accept<R>(visitor: StmtVisitor<R>): R {
        return visitor.visitNoopStmt(this);
    }
}
