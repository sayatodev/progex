import { TokenType } from "./enums";
import {
    AssignmentStmt,
    BreakStmt,
    ConditionalJumpStmt,
    DataEntryStmt,
    ElseStmt,
    ExpressionStmt,
    ForStmt,
    GotoStmt,
    IfEndStmt,
    IfStmt,
    LabelStmt,
    MemoryControlStmt,
    NextStmt,
    NoopStmt,
    Stmt,
    StmtVisitor,
    SystemCommandStmt,
    ThenStmt,
    WhileEndStmt,
    WhileStmt,
} from "./Stmt";
import { CalcSyntaxError, MathError, RuntimeError } from "./Errors";
import type {
    AssignmentExpr,
    BinaryExpr,
    ComplexLiteralExpr,
    Expr,
    ExprVisitor,
    ExponentialExpr,
    FunctionCallExpr,
    GroupingExpr,
    InputExpr,
    NumberLiteralExpr,
    SignedExpr,
    UnaryExpr,
    VariableExpr,
} from "./Expr";
import Token from "./Token";
import type { ErrorName, VariableName } from "./types";
import { Environment } from "./Environment";
import {
    asComplex,
    ComplexValue,
    isComplexValue,
    RuntimeValue,
    Value,
} from "./Value";

type LoopFrame =
    | {
          type: "while";
          startIndex: number;
          endIndex: number;
      }
    | {
          type: "for";
          startIndex: number;
          endIndex: number;
          variableName: string;
          endValue: Value;
          stepValue: Value;
      };

export class Interpreter
    implements ExprVisitor<RuntimeValue>, StmtVisitor<void>
{
    readonly environment: Environment = new Environment();
    private statements: Stmt[] = [];
    private labels = new Map<number, number>();
    private cursor = 0;
    private pendingJump: number | null = null;
    private ifStateStack: Array<{ execute: boolean; elseIndex: number | null; endIndex: number }> = [];
    private whilePairs = new Map<number, number>();
    private forPairs = new Map<number, number>();
    private loopStack: LoopFrame[] = [];
    private lastStatementDisplayed = false;

    private evaluate(expr: Expr): RuntimeValue {
        return expr.accept(this);
    }

    private execute(stmt: Stmt): void {
        stmt.accept(this);
    }

    private error(name: ErrorName, token: Token | null, message: string): never {
        throw new RuntimeError(name, token, message);
    }

    private display(): void {
        this.lastStatementDisplayed = true;
        this.environment.displayCallback(this.environment.result);
    }

    private requireReal(value: RuntimeValue, token: Token | null, message: string): Value {
        if (value instanceof Value) {
            return value;
        }
        throw new MathError(token ?? new Token(TokenType.EOP, "", null, 0), message);
    }

    private truthy(value: RuntimeValue, token: Token | null): boolean {
        if (value instanceof Value) {
            return !value.isZero();
        }
        if (value.imaginary.isZero()) {
            return !value.real.isZero();
        }
        throw new MathError(token ?? new Token(TokenType.EOP, "", null, 0), "Conditional expression must be real.");
    }

    private checkPositiveInteger(operator: Token, operand: Value): void {
        if (operand.toNumber() >= 0 && operand.isInteger()) {
            return;
        }
        throw new MathError(operator, "Operand must be a positive integer.");
    }

    private checkArgumentsCount(
        token: Token,
        args: RuntimeValue[],
        expectedMin: number,
        expectedMax?: number
    ): void {
        const max = expectedMax ?? expectedMin;
        if (args.length < expectedMin || args.length > max) {
            throw new CalcSyntaxError(
                token,
                `Expected ${expectedMin}${expectedMax ? ` to ${max}` : ""} argument(s), but got ${args.length}.`
            );
        }
    }

    private findMatchingIf(startIndex: number): { elseIndex: number | null; endIndex: number } {
        let depth = 0;
        let elseIndex: number | null = null;
        for (let i = startIndex + 1; i < this.statements.length; i++) {
            const stmt = this.statements[i];
            if (stmt instanceof IfStmt) {
                depth++;
            } else if (stmt instanceof IfEndStmt) {
                if (depth === 0) {
                    return { elseIndex, endIndex: i };
                }
                depth--;
            } else if (stmt instanceof ElseStmt && depth === 0 && elseIndex === null) {
                elseIndex = i;
            }
        }
        throw new CalcSyntaxError(null, "If without matching IfEnd.");
    }

    private buildIndexes(): void {
        this.labels.clear();
        this.whilePairs.clear();
        this.forPairs.clear();

        const whileStack: number[] = [];
        const forStack: number[] = [];

        this.statements.forEach((stmt, index) => {
            if (stmt instanceof LabelStmt) {
                this.labels.set(stmt.name, index);
            } else if (stmt instanceof WhileStmt) {
                whileStack.push(index);
            } else if (stmt instanceof WhileEndStmt) {
                const start = whileStack.pop();
                if (start === undefined) {
                    throw new CalcSyntaxError(null, "WhileEnd without While.");
                }
                this.whilePairs.set(start, index);
                this.whilePairs.set(index, start);
            } else if (stmt instanceof ForStmt) {
                forStack.push(index);
            } else if (stmt instanceof NextStmt) {
                const start = forStack.pop();
                if (start === undefined) {
                    throw new CalcSyntaxError(null, "Next without For.");
                }
                this.forPairs.set(start, index);
                this.forPairs.set(index, start);
            }
        });

        if (whileStack.length || forStack.length) {
            throw new CalcSyntaxError(null, "Unterminated loop structure.");
        }
    }

    visitNumberExpr(expr: NumberLiteralExpr): RuntimeValue {
        return expr.value;
    }

    visitSystemCommandStmt(stmt: SystemCommandStmt): void {
        switch (stmt.command.type) {
            case "CLR_MEMORY":
                this.environment.resetMemory();
                return;
            case "CLR_STAT":
                this.environment.clearStatisticsData();
                return;
            case "FREQ_ON":
                this.environment.setFrequencyEnabled(true);
                return;
            case "SET_MODE":
                this.environment.setExecutionMode(stmt.command.mode);
                return;
            case "SET_REGRESSION":
                this.environment.setRegressionMode(stmt.command.regression);
                return;
        }
    }

    private setVariable(name: "X" | "Y", value: RuntimeValue): void {
        this.environment.setVariable(name as VariableName, value);
    }

    visitAssignmentExpr(expr: AssignmentExpr): RuntimeValue {
        const value = this.evaluate(expr.value);
        this.environment.assign(expr.name.lexeme as never, value);
        return value;
    }

    visitComplexLiteralExpr(expr: ComplexLiteralExpr): RuntimeValue {
        return expr.value;
    }

    visitGroupingExpr(expr: GroupingExpr): RuntimeValue {
        return this.evaluate(expr.expression);
    }

    visitSignedExpr(expr: SignedExpr): RuntimeValue {
        const right = this.evaluate(expr.right);
        switch (expr.operator.type) {
            case TokenType.MINUS:
            case TokenType.NEGATIVE:
                return isComplexValue(right) ? right.negated() : right.negated();
            case TokenType.PLUS:
                return right;
            default:
                throw new CalcSyntaxError(expr.operator, "Unexpected sign operator.");
        }
    }

    visitFunctionCallExpr(expr: FunctionCallExpr): RuntimeValue {
        const values = expr.args.map((arg) => this.evaluate(arg));
        switch (expr.fn.type) {
            case TokenType.ABS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return isComplexValue(values[0]) ? values[0].abs() : values[0].abs();
            case TokenType.POLAR: {
                this.checkArgumentsCount(expr.fn, values, 2);
                const x = this.requireReal(values[0], expr.fn, "Pol arguments must be real.");
                const y = this.requireReal(values[1], expr.fn, "Pol arguments must be real.");
                const radius = x.square().add(y.square()).sqrt();
                const theta = new ComplexValue(x, y).argument(this.environment.setup);
                this.setVariable("X", radius);
                this.setVariable("Y", theta);
                return radius;
            }
            case TokenType.REC: {
                this.checkArgumentsCount(expr.fn, values, 2);
                const r = this.requireReal(values[0], expr.fn, "Rec arguments must be real.");
                const theta = this.requireReal(values[1], expr.fn, "Rec arguments must be real.");
                const x = r.mul(theta.cos(this.environment.setup));
                const y = r.mul(theta.sin(this.environment.setup));
                this.setVariable("X", x);
                this.setVariable("Y", y);
                return x;
            }
            case TokenType.RND:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "Rnd expects a real argument.").round();
            case TokenType.ARGUMENT:
                this.checkArgumentsCount(expr.fn, values, 1);
                return asComplex(values[0]).argument(this.environment.setup);
            case TokenType.CONJUGATE:
                this.checkArgumentsCount(expr.fn, values, 1);
                return asComplex(values[0]).conjugate();
            case TokenType.SIN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "sin expects a real argument.").sin(this.environment.setup);
            case TokenType.COS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "cos expects a real argument.").cos(this.environment.setup);
            case TokenType.TAN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "tan expects a real argument.").tan(this.environment.setup);
            case TokenType.ARC_SIN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "sin^-1 expects a real argument.").asin(this.environment.setup);
            case TokenType.ARC_COS:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "cos^-1 expects a real argument.").acos(this.environment.setup);
            case TokenType.ARC_TAN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "tan^-1 expects a real argument.").atan(this.environment.setup);
            case TokenType.LOG:
                this.checkArgumentsCount(expr.fn, values, 1, 2);
                if (values.length === 1) {
                    return this.requireReal(values[0], expr.fn, "log expects a real argument.").log();
                }
                return this.requireReal(values[1], expr.fn, "log expects a real argument.").log_x(
                    this.requireReal(values[0], expr.fn, "log base must be real.")
                );
            case TokenType.LN:
                this.checkArgumentsCount(expr.fn, values, 1);
                return this.requireReal(values[0], expr.fn, "ln expects a real argument.").ln();
            case TokenType.SQRT:
                this.checkArgumentsCount(expr.fn, values, 1);
                if (isComplexValue(values[0])) {
                    return values[0].sqrt();
                }
                if (values[0].value.isNegative()) {
                    return ComplexValue.fromReal(values[0]).sqrt();
                }
                return values[0].sqrt();
            case TokenType.CUBE_ROOT:
                this.checkArgumentsCount(expr.fn, values, 1);
                return isComplexValue(values[0])
                    ? values[0].cbrt()
                    : values[0].cbrt();
            case TokenType.TEN_X_POWER:
                this.checkArgumentsCount(expr.fn, values, 1);
                return Value.from(10).pow(
                    this.requireReal(values[0], expr.fn, "10^ expects a real argument.")
                );
            case TokenType.E_X_POWER:
                this.checkArgumentsCount(expr.fn, values, 1);
                return Value.from(Math.E).pow(
                    this.requireReal(values[0], expr.fn, "e^ expects a real argument.")
                );
            default:
                throw new CalcSyntaxError(expr.fn, "Unexpected function.");
        }
    }

    visitUnaryExpr(expr: UnaryExpr): RuntimeValue {
        const value = this.evaluate(expr.expression);
        switch (expr.operator.type) {
            case TokenType.INVERSE:
                return isComplexValue(value) ? value.inverse() : value.inverse();
            case TokenType.SQUARE:
                return isComplexValue(value) ? value.square() : value.square();
            case TokenType.CUBE:
                return isComplexValue(value) ? value.cube() : value.cube();
            case TokenType.FACTORIAL: {
                const real = this.requireReal(value, expr.operator, "Factorial expects a real value.");
                this.checkPositiveInteger(expr.operator, real);
                return real.factorial();
            }
            case TokenType.PERCENT:
                return this.requireReal(value, expr.operator, "Percent expects a real value.").percent();
            case TokenType.DEGREE:
                return this.requireReal(value, expr.operator, "Degree expects a real value.");
            default:
                throw new CalcSyntaxError(expr.operator, "Unexpected unary operator.");
        }
    }

    visitBinaryExpr(expr: BinaryExpr): RuntimeValue {
        const left = this.evaluate(expr.left);
        const right = this.evaluate(expr.right);

        if (expr.operator === null) {
            if (isComplexValue(left) || isComplexValue(right)) {
                return asComplex(left).mul(asComplex(right));
            }
            return left.mul(right);
        }

        switch (expr.operator.type) {
            case TokenType.PLUS:
                if (isComplexValue(left) || isComplexValue(right)) {
                    return asComplex(left).add(asComplex(right));
                }
                return left.add(right);
            case TokenType.MINUS:
                if (isComplexValue(left) || isComplexValue(right)) {
                    return asComplex(left).sub(asComplex(right));
                }
                return left.sub(right);
            case TokenType.MULTIPLY:
                if (isComplexValue(left) || isComplexValue(right)) {
                    return asComplex(left).mul(asComplex(right));
                }
                return left.mul(right);
            case TokenType.DIVIDE:
            case TokenType.FRACTION:
                if (isComplexValue(left) || isComplexValue(right)) {
                    return asComplex(left).div(asComplex(right));
                }
                if (right.isZero()) {
                    throw new MathError(expr.operator, "Division by zero");
                }
                return left.div(right);
            case TokenType.GT:
                return Value.from(
                    this.requireReal(left, expr.operator, "Comparison expects real values.")
                        .greaterThan(
                            this.requireReal(right, expr.operator, "Comparison expects real values.")
                        )
                        ? 1
                        : 0
                );
            case TokenType.GTE:
                return Value.from(
                    this.requireReal(left, expr.operator, "Comparison expects real values.")
                        .greaterThanOrEqual(
                            this.requireReal(right, expr.operator, "Comparison expects real values.")
                        )
                        ? 1
                        : 0
                );
            case TokenType.LT:
                return Value.from(
                    this.requireReal(left, expr.operator, "Comparison expects real values.")
                        .lessThan(
                            this.requireReal(right, expr.operator, "Comparison expects real values.")
                        )
                        ? 1
                        : 0
                );
            case TokenType.LTE:
                return Value.from(
                    this.requireReal(left, expr.operator, "Comparison expects real values.")
                        .lessThanOrEqual(
                            this.requireReal(right, expr.operator, "Comparison expects real values.")
                        )
                        ? 1
                        : 0
                );
            case TokenType.EQ:
                return Value.from(
                    (isComplexValue(left) || isComplexValue(right)
                        ? asComplex(left).equal(asComplex(right))
                        : left.equal(right))
                        ? 1
                        : 0
                );
            case TokenType.NEQ:
                return Value.from(
                    (isComplexValue(left) || isComplexValue(right)
                        ? asComplex(left).notEqual(asComplex(right))
                        : left.notEqual(right))
                        ? 1
                        : 0
                );
            case TokenType.PERMUTATION: {
                const lhs = this.requireReal(left, expr.operator, "Permutation expects real values.");
                const rhs = this.requireReal(right, expr.operator, "Permutation expects real values.");
                this.checkPositiveInteger(expr.operator, lhs);
                this.checkPositiveInteger(expr.operator, rhs);
                return lhs.permutation(rhs);
            }
            case TokenType.COMBINATION: {
                const lhs = this.requireReal(left, expr.operator, "Combination expects real values.");
                const rhs = this.requireReal(right, expr.operator, "Combination expects real values.");
                this.checkPositiveInteger(expr.operator, lhs);
                this.checkPositiveInteger(expr.operator, rhs);
                return lhs.combination(rhs);
            }
            case TokenType.X_POWER:
                if (isComplexValue(left) || isComplexValue(right)) {
                    throw new CalcSyntaxError(
                        expr.operator,
                        "Complex exponentiation is not supported."
                    );
                }
                if (right.isInteger()) {
                    const exponent = right.toNumber();
                    if (Number.isInteger(exponent)) {
                        if (exponent === 0) {
                            return Value.from(1);
                        }
                        if (exponent > 0) {
                            let result: RuntimeValue = Value.from(1);
                            for (let i = 0; i < exponent; i++) {
                                result = isComplexValue(result)
                                    ? result.mul(asComplex(left))
                                    : result.mul(left);
                            }
                            return result;
                        }
                    }
                }
                return left.pow(right);
            case TokenType.X_ROOT:
                return this.requireReal(left, expr.operator, "Root expects real values.").x_root(
                    this.requireReal(right, expr.operator, "Root expects real values.")
                );
            case TokenType.SEMICOLON:
                return new ComplexValue(
                    this.requireReal(left, expr.operator, "Semicolon expects real values."),
                    this.requireReal(right, expr.operator, "Semicolon expects real values.")
                );
            case TokenType.TO_COMPLEX:
                return new ComplexValue(
                    this.requireReal(left, expr.operator, "▶a+b𝒾 expects real values."),
                    this.requireReal(right, expr.operator, "▶a+b𝒾 expects real values.")
                );
            case TokenType.TO_POLAR: {
                const x = this.requireReal(left, expr.operator, "▶r∠θ expects real values.");
                const y = this.requireReal(right, expr.operator, "▶r∠θ expects real values.");
                return new ComplexValue(
                    x.square().add(y.square()).sqrt(),
                    new ComplexValue(x, y).argument(this.environment.setup)
                );
            }
            case TokenType.COMPLEX_ARGUMENT:
                return new ComplexValue(
                    this.requireReal(left, expr.operator, "∠ expects real values."),
                    this.requireReal(right, expr.operator, "∠ expects real values.")
                );
            default:
                throw new CalcSyntaxError(expr.operator, "Invalid operator.");
        }
    }

    visitExponentialExpr(expr: ExponentialExpr): RuntimeValue {
        return expr.factor.exp(expr.exponent);
    }

    visitVariableExpr(expr: VariableExpr): RuntimeValue {
        return this.environment.get(expr.identifier);
    }

    visitInputExpr(_expr: InputExpr): RuntimeValue {
        return this.environment.getInput();
    }

    visitExpressionStmt(stmt: ExpressionStmt): void {
        const result = this.evaluate(stmt.expression);
        this.environment.result = result;
        if (stmt.display) {
            this.display();
        }
    }

    visitAssignmentStmt(stmt: AssignmentStmt): void {
        const result = this.evaluate(stmt.initializer);
        this.environment.assign(stmt.name.lexeme, result);
        if (stmt.display) {
            this.display();
        }
    }

    visitMemoryControlStmt(stmt: MemoryControlStmt): void {
        const result = this.evaluate(stmt.expression);
        if (stmt.operator.type === TokenType.M_PLUS) {
            this.environment.mIncrement(result);
        } else {
            this.environment.mDecrement(result);
        }
        this.environment.result = result;
        if (stmt.display) {
            this.display();
        }
    }

    visitDataEntryStmt(stmt: DataEntryStmt): void {
        const x = this.requireReal(
            this.evaluate(stmt.x),
            null,
            "DT x value must be real."
        );
        const y = this.requireReal(
            this.evaluate(stmt.y),
            null,
            "DT y value must be real."
        );
        const frequency = stmt.frequency
            ? this.requireReal(
                  this.evaluate(stmt.frequency),
                  null,
                  "DT frequency must be real."
              )
            : Value.from(1);

        this.environment.addStatisticsDataPoint(x, y, frequency);
        this.environment.result = frequency;
    }

    visitConditionalJumpStmt(stmt: ConditionalJumpStmt): void {
        if (this.truthy(this.evaluate(stmt.condition), null)) {
            stmt.statement.accept(this);
        }
    }

    visitIfStmt(stmt: IfStmt): void {
        const matched = this.findMatchingIf(this.cursor);
        const execute = this.truthy(this.evaluate(stmt.condition), null);
        this.ifStateStack.push({ execute, ...matched });
        if (!execute) {
            this.pendingJump = (matched.elseIndex ?? matched.endIndex) + 1;
        }
    }

    visitThenStmt(_stmt: ThenStmt): void {}

    visitElseStmt(_stmt: ElseStmt): void {
        const state = this.ifStateStack[this.ifStateStack.length - 1];
        if (!state) {
            throw new CalcSyntaxError(null, "Else without If.");
        }
        if (state.execute) {
            this.pendingJump = state.endIndex + 1;
        }
    }

    visitIfEndStmt(_stmt: IfEndStmt): void {
        if (!this.ifStateStack.pop()) {
            throw new CalcSyntaxError(null, "IfEnd without If.");
        }
    }

    visitWhileStmt(stmt: WhileStmt): void {
        const endIndex = this.whilePairs.get(this.cursor);
        if (endIndex === undefined) {
            throw new CalcSyntaxError(null, "While without WhileEnd.");
        }
        if (!this.truthy(this.evaluate(stmt.condition), null)) {
            this.pendingJump = endIndex + 1;
            return;
        }
        this.loopStack.push({
            type: "while",
            startIndex: this.cursor,
            endIndex,
        });
    }

    visitWhileEndStmt(_stmt: WhileEndStmt): void {
        const frame = this.loopStack[this.loopStack.length - 1];
        if (!frame || frame.type !== "while") {
            throw new CalcSyntaxError(null, "WhileEnd without active While.");
        }
        this.loopStack.pop();
        this.pendingJump = frame.startIndex;
    }

    visitGotoStmt(stmt: GotoStmt): void {
        const target = this.labels.get(stmt.label);
        if (target === undefined) {
            throw new RuntimeError("RuntimeError", stmt.token, `Label ${stmt.label} not found.`);
        }
        this.pendingJump = target;
    }

    visitLabelStmt(_stmt: LabelStmt): void {}

    visitForStmt(stmt: ForStmt): void {
        const endIndex = this.forPairs.get(this.cursor);
        if (endIndex === undefined) {
            throw new CalcSyntaxError(null, "For without Next.");
        }
        const initial = this.requireReal(
            this.evaluate(stmt.from),
            stmt.variable,
            "For initial value must be real."
        );
        const endValue = this.requireReal(
            this.evaluate(stmt.to),
            stmt.variable,
            "For end value must be real."
        );
        const stepValue = stmt.step
            ? this.requireReal(
                  this.evaluate(stmt.step),
                  stmt.variable,
                  "For step value must be real."
              )
            : Value.from(1);

        this.environment.assign(stmt.variable.lexeme, initial);
        const shouldRun = stepValue.value.gte(0)
            ? initial.lessThanOrEqual(endValue)
            : initial.greaterThanOrEqual(endValue);

        if (!shouldRun) {
            this.pendingJump = endIndex + 1;
            return;
        }

        this.loopStack.push({
            type: "for",
            startIndex: this.cursor,
            endIndex,
            variableName: stmt.variable.lexeme,
            endValue,
            stepValue,
        });
    }

    visitNextStmt(_stmt: NextStmt): void {
        const frame = this.loopStack[this.loopStack.length - 1];
        if (!frame || frame.type !== "for") {
            throw new CalcSyntaxError(null, "Next without active For.");
        }

        const current = this.requireReal(
            this.environment.get(frame.variableName as never),
            null,
            "For loop variable must be real."
        );
        const nextValue = current.add(frame.stepValue);
        this.environment.assign(frame.variableName as never, nextValue);

        const shouldContinue = frame.stepValue.value.gte(0)
            ? nextValue.lessThanOrEqual(frame.endValue)
            : nextValue.greaterThanOrEqual(frame.endValue);

        if (shouldContinue) {
            this.pendingJump = frame.startIndex + 1;
            return;
        }
        this.loopStack.pop();
    }

    visitBreakStmt(stmt: BreakStmt): void {
        const frame = this.loopStack.pop();
        if (!frame) {
            throw new RuntimeError("RuntimeError", stmt.token, "Break used outside of a loop.");
        }
        this.pendingJump = frame.endIndex + 1;
    }

    visitNoopStmt(_stmt: NoopStmt): void {}

    interpret(statements: Stmt[]): void {
        this.statements = statements;
        this.buildIndexes();
        this.cursor = 0;
        this.pendingJump = null;
        this.loopStack = [];
        this.ifStateStack = [];
        this.lastStatementDisplayed = false;

        try {
            while (this.cursor < this.statements.length) {
                const statement = this.statements[this.cursor];
                this.pendingJump = null;
                 this.lastStatementDisplayed = false;
                this.execute(statement);
                if (this.pendingJump !== null) {
                    this.cursor = this.pendingJump;
                } else {
                    this.cursor++;
                }
            }

            if (this.environment.emitFinalResult && !this.lastStatementDisplayed) {
                this.display();
            }
        } catch (error) {
            if (error instanceof RuntimeError) {
                this.error(error.name, error.token, error.message);
            }
            throw error;
        }
    }
}
