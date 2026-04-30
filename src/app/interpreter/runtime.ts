import { RuntimeError } from "@/helpers/calprog/interpreter/Errors";
import { Interpreter } from "@/helpers/calprog/interpreter/Interpreter";
import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { TokenType } from "@/helpers/calprog/interpreter/enums";
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
        if (!isLastLine && !line.endsWith(":")) {
            segments.push(":");
        }
    });

    return segments.join("");
}

export function formatProgram(program: string): string {
    return normalizeProgram(program).replace(/:/g, ":\n").trimEnd();
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
