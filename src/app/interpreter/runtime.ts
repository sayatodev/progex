import { RuntimeError } from "@/helpers/calprog/interpreter/Errors";
import { Interpreter } from "@/helpers/calprog/interpreter/Interpreter";
import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { TokenType } from "@/helpers/calprog/interpreter/enums";
import type Token from "@/helpers/calprog/interpreter/Token";
import type { ExecutionConfig } from "@/helpers/calprog/interpreter/runtime";
import { VARIABLE_NAMES } from "./constants";
import type { ExecutionSnapshot } from "./types";
import {
    AssignmentStmt,
    ExpressionStmt,
    MemoryControlStmt,
    type Stmt,
} from "@/helpers/calprog/interpreter/Stmt";
import { InputExpr } from "@/helpers/calprog/interpreter/Expr";

export function normalizeProgram(program: string): string {
    const lines = program
        .replace(/\r\n/g, "\n")
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    const segments: string[] = [];

    lines.forEach((line, index) => {
        segments.push(line);
        const isLastLine = index === lines.length - 1;
        if (!isLastLine && !line.endsWith(":") && !line.endsWith("◢")) {
            segments.push(":");
        }
    });

    return segments.join("");
}

export function formatProgram(program: string): string {
    const normalized = normalizeProgram(program);
    const tokens = new Scanner(normalized).scan();
    const lines: string[] = [];
    let currentLine = "";

    const append = (text: string) => {
        currentLine += text;
    };

    const pushLine = () => {
        lines.push(currentLine.trimEnd());
        currentLine = "";
    };

    const isBinarySpacingToken = (type: TokenType): boolean =>
        [
            TokenType.PLUS,
            TokenType.MINUS,
            TokenType.MULTIPLY,
            TokenType.DIVIDE,
            TokenType.FRACTION,
            TokenType.PERMUTATION,
            TokenType.COMBINATION,
            TokenType.ASSIGN,
            TokenType.GTE,
            TokenType.LTE,
            TokenType.GT,
            TokenType.LT,
            TokenType.EQ,
            TokenType.NEQ,
            TokenType.ARROW,
            TokenType.TO,
            TokenType.STEP,
        ].includes(type);

    const isUnarySignContext = (token: Token, previous: Token | null): boolean => {
        if (
            token.type !== TokenType.PLUS &&
            token.type !== TokenType.MINUS
        ) {
            return false;
        }

        if (!previous || previous.type === TokenType.COLON) {
            return true;
        }

        return [
            TokenType.DISPLAY,
            TokenType.LEFT_PARENTHESIS,
            TokenType.COMMA,
            TokenType.SEMICOLON,
            TokenType.PLUS,
            TokenType.MINUS,
            TokenType.MULTIPLY,
            TokenType.DIVIDE,
            TokenType.FRACTION,
            TokenType.X_POWER,
            TokenType.X_ROOT,
            TokenType.TO,
            TokenType.STEP,
            TokenType.GTE,
            TokenType.LTE,
            TokenType.GT,
            TokenType.LT,
            TokenType.EQ,
            TokenType.NEQ,
            TokenType.ARROW,
            TokenType.ASSIGN,
        ].includes(previous.type);
    };

    const isKeywordSpacingToken = (type: TokenType): boolean =>
        [
            TokenType.IF,
            TokenType.THEN,
            TokenType.ELSE,
            TokenType.IF_END,
            TokenType.FOR,
            TokenType.NEXT,
            TokenType.BREAK,
            TokenType.WHILE,
            TokenType.WHILE_END,
            TokenType.GOTO,
            TokenType.LABEL,
            TokenType.CLR_MEMORY,
            TokenType.CLR_STAT,
            TokenType.FREQ_ON,
        ].includes(type);

    const isPostfixSeparatorToken = (type: TokenType): boolean =>
        [TokenType.COMMA, TokenType.SEMICOLON].includes(type);

    const shouldAddLeadingSpace = (
        token: Token,
        previous: Token | null
    ): boolean => {
        if (!previous || previous.type === TokenType.COLON) {
            return false;
        }

        if (token.type === TokenType.DISPLAY) {
            return true;
        }

        if (isUnarySignContext(token, previous)) {
            return false;
        }

        if (isBinarySpacingToken(token.type) || isKeywordSpacingToken(token.type)) {
            return true;
        }

        if (
            token.type === TokenType.NUMBER &&
            previous.type === TokenType.LABEL
        ) {
            return true;
        }

        if (
            token.type === TokenType.NUMBER &&
            previous.type === TokenType.GOTO
        ) {
            return true;
        }

        return false;
    };

    const shouldAddTrailingSpace = (
        token: Token,
        previous: Token | null,
        next: Token | null
    ): boolean => {
        if (!next || next.type === TokenType.COLON || next.type === TokenType.EOP) {
            return false;
        }

        if (isUnarySignContext(next, token)) {
            return false;
        }

        if (token.type === TokenType.DISPLAY) {
            return true;
        }

        if (isUnarySignContext(token, previous)) {
            return false;
        }

        if (isBinarySpacingToken(token.type) || isKeywordSpacingToken(token.type)) {
            return true;
        }

        if (
            (token.type === TokenType.GOTO || token.type === TokenType.LABEL) &&
            next.type === TokenType.NUMBER
        ) {
            return true;
        }

        if (isPostfixSeparatorToken(token.type)) {
            return true;
        }

        return false;
    };

    for (let index = 0; index < tokens.length; index++) {
        const token = tokens[index];
        if (token.type === TokenType.EOP) {
            break;
        }

        const previous = index > 0 ? tokens[index - 1] : null;
        const next = index < tokens.length - 1 ? tokens[index + 1] : null;

        if (token.type === TokenType.COLON) {
            append(":");
            pushLine();
            continue;
        }

        if (shouldAddLeadingSpace(token, previous) && !currentLine.endsWith(" ")) {
            append(" ");
        }

        append(token.lexeme.toString());

        if (token.type === TokenType.DISPLAY) {
            pushLine();
            continue;
        }

        if (shouldAddTrailingSpace(token, previous, next)) {
            append(" ");
        }
    }

    if (currentLine.trim().length > 0) {
        pushLine();
    }

    return lines.join("\n");
}

export function formatError(error: unknown): string {
    if (error instanceof RuntimeError) {
        return [
            `${error.name}: ${error.message}`,
            `at Segment ${error.token?.segment ?? "unknown"}`,
            `(${error.token?.lexeme ?? "unknown"})`,
        ].join("\n");
    }

    if (error instanceof Error) {
        return error.message;
    }

    return String(error);
}

function collectInputLabels(statements: Stmt[]): string[] {
    const labels: string[] = [];

    for (const statement of statements) {
        if (
            statement instanceof AssignmentStmt &&
            statement.initializer instanceof InputExpr
        ) {
            labels.push(`${statement.name.lexeme}=`);
        }
    }

    return labels;
}

function collectOutputLabels(statements: Stmt[]): string[] {
    const labels: string[] = [];

    for (const statement of statements) {
        if (statement instanceof AssignmentStmt && statement.display) {
            labels.push(`${statement.name.lexeme}=`);
            continue;
        }
        if (statement instanceof MemoryControlStmt && statement.display) {
            labels.push("Ans=");
            continue;
        }
        if (statement instanceof ExpressionStmt && statement.display) {
            labels.push("Ans=");
        }
    }

    return labels;
}

function collectDisplaySegments(program: string): string[] {
    return normalizeProgram(program)
        .split(":")
        .map((segment) => segment.trim())
        .filter((segment) => segment.endsWith("◢"))
        .map((segment) => `${segment}=`);
}

function collectFinalResultLabel(program: string): string {
    const segments = normalizeProgram(program)
        .split(":")
        .map((segment) => segment.trim())
        .filter((segment) => segment.length > 0);

    const lastSegment = segments[segments.length - 1];
    return lastSegment ? `${lastSegment}=` : "Ans=";
}

export function buildSnapshot(
    program: string,
    inputs: string[],
    config: ExecutionConfig
): ExecutionSnapshot {
    const normalizedProgram = normalizeProgram(program);
    const tokens = new Scanner(normalizedProgram).scan();
    const statements = new Parser(tokens).parse();
    const interpreter = new Interpreter();
    const outputs: string[] = [];
    const displaySegments = collectDisplaySegments(program);
    const finalResultLabel = collectFinalResultLabel(program);

    interpreter.environment.config({
        inputs,
        displayCallback: (value) => outputs.push(value.toString()),
        ...config,
    });
    interpreter.interpret(statements);

    return {
        normalizedProgram,
        tokenCount: tokens.length - 1,
        statementCount: statements.length,
        inputLabels: collectInputLabels(statements),
        finalResultLabel,
        outputLabels:
            config.emitFinalResult &&
            outputs.length === displaySegments.length + 1
                ? [...displaySegments, finalResultLabel]
                : displaySegments.length === outputs.length
                  ? displaySegments
                  : collectOutputLabels(statements),
        tokens: tokens
            .filter((token) => token.type !== TokenType.EOP)
            .map((token) => ({
                lexeme: token.lexeme.toString(),
                type: TokenType[token.type],
                segment: token.segment,
            })),
        statements: statements.map((statement) =>
            statement.constructor.name.replace(/Stmt$/, "")
        ),
        outputs,
        finalResult: interpreter.environment.result.toString(),
        variables: VARIABLE_NAMES.map((name) => ({
            name,
            value: interpreter.environment.get(name).toString(),
        })),
        executionMode: interpreter.environment.executionMode,
        angleMode: interpreter.environment.setup,
        emitFinalResult: interpreter.environment.emitFinalResult,
        remainingInputs: interpreter.environment.inputs.map((value) =>
            value.toString()
        ),
        stats: {
            frequencyEnabled: interpreter.environment.stats.frequencyEnabled,
            regressionMode: interpreter.environment.stats.regressionMode,
            data: interpreter.environment.stats.data.map((point) => ({
                x: point.x.toString(),
                y: point.y === null ? null : point.y.toString(),
                frequency: point.frequency.toString(),
            })),
        },
    };
}
