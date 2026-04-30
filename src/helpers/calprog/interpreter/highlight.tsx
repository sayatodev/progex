import type { ReactNode } from "react";
import Scanner from "./Scanner";
import { TokenType } from "./enums";

export type HighlightTokenKind =
    | "number"
    | "variable"
    | "constant"
    | "function"
    | "keyword"
    | "operator"
    | "delimiter"
    | "display"
    | "input"
    | "error"
    | "plain";

export type HighlightSegment = {
    text: string;
    kind: HighlightTokenKind;
};

const FUNCTION_TOKENS = new Set<TokenType>([
    TokenType.SQRT,
    TokenType.LOG,
    TokenType.LN,
    TokenType.SIN,
    TokenType.COS,
    TokenType.TAN,
    TokenType.CUBE_ROOT,
    TokenType.X_ROOT,
    TokenType.TEN_X_POWER,
    TokenType.E_X_POWER,
    TokenType.ARC_SIN,
    TokenType.ARC_COS,
    TokenType.ARC_TAN,
    TokenType.ABS,
    TokenType.POLAR,
    TokenType.REC,
    TokenType.RND,
    TokenType.ARGUMENT,
    TokenType.CONJUGATE,
]);

const KEYWORD_TOKENS = new Set<TokenType>([
    TokenType.IF,
    TokenType.THEN,
    TokenType.ELSE,
    TokenType.IF_END,
    TokenType.FOR,
    TokenType.TO,
    TokenType.STEP,
    TokenType.NEXT,
    TokenType.BREAK,
    TokenType.WHILE,
    TokenType.WHILE_END,
    TokenType.GOTO,
    TokenType.LABEL,
    TokenType.CLR_MEMORY,
    TokenType.CLR_STAT,
    TokenType.FREQ_ON,
    TokenType.DT,
    TokenType.EXECUTE,
]);

const OPERATOR_TOKENS = new Set<TokenType>([
    TokenType.EXP,
    TokenType.NEGATIVE,
    TokenType.M_PLUS,
    TokenType.M_MINUS,
    TokenType.TO_POLAR,
    TokenType.TO_COMPLEX,
    TokenType.DEGREE,
    TokenType.PLUS,
    TokenType.MINUS,
    TokenType.MULTIPLY,
    TokenType.DIVIDE,
    TokenType.FRACTION,
    TokenType.INVERSE,
    TokenType.SQUARE,
    TokenType.CUBE,
    TokenType.X_POWER,
    TokenType.FACTORIAL,
    TokenType.COMPLEX_ARGUMENT,
    TokenType.PERCENT,
    TokenType.PERMUTATION,
    TokenType.COMBINATION,
    TokenType.ASSIGN,
    TokenType.GTE,
    TokenType.LTE,
    TokenType.GT,
    TokenType.LT,
    TokenType.ARROW,
    TokenType.EQ,
    TokenType.NEQ,
]);

const DELIMITER_TOKENS = new Set<TokenType>([
    TokenType.COMMA,
    TokenType.SEMICOLON,
    TokenType.COLON,
    TokenType.LEFT_PARENTHESIS,
    TokenType.RIGHT_PARENTHESIS,
]);

export function normalizeEditorProgram(program: string): string {
    return program.replace(/\r\n/g, "\n");
}

function classify(type: TokenType): HighlightTokenKind {
    if (type === TokenType.NUMBER) return "number";
    if (type === TokenType.VARIABLE || type === TokenType.STAT_VARIABLE) {
        return "variable";
    }
    if (type === TokenType.CONSTANT) return "constant";
    if (type === TokenType.INPUT) return "input";
    if (type === TokenType.DISPLAY) return "display";
    if (FUNCTION_TOKENS.has(type)) return "function";
    if (KEYWORD_TOKENS.has(type)) return "keyword";
    if (OPERATOR_TOKENS.has(type)) return "operator";
    if (DELIMITER_TOKENS.has(type)) return "delimiter";
    return "plain";
}

export function tokenizeCalculatorProgram(program: string): HighlightSegment[] {
    const normalized = normalizeEditorProgram(program);
    const lines = normalized.split("\n");
    const segments: HighlightSegment[] = [];

    const tokenizeLine = (line: string): HighlightSegment[] => {
        const lineSegments: HighlightSegment[] = [];

        try {
            const tokens = new Scanner(line).scan();
            let cursor = 0;

            for (const token of tokens) {
                if (token.type === TokenType.EOP) {
                    break;
                }

                const lexeme = token.lexeme.toString();
                const start = line.indexOf(lexeme, cursor);
                if (start === -1) {
                    continue;
                }

                if (start > cursor) {
                    lineSegments.push({
                        text: line.slice(cursor, start),
                        kind: "plain",
                    });
                }

                lineSegments.push({
                    text: lexeme,
                    kind: classify(token.type),
                });
                cursor = start + lexeme.length;
            }

            if (cursor < line.length) {
                lineSegments.push({
                    text: line.slice(cursor),
                    kind: "plain",
                });
            }

            return lineSegments;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unrecognized token";
            const match = message.match(/Unexpected character: (.+)$/);
            const badText = match?.[1]?.trim();

            if (!badText) {
                return [{ text: line, kind: "plain" }];
            }

            const index = line.indexOf(badText[0]);
            if (index === -1) {
                return [{ text: line, kind: "plain" }];
            }

            const before = line.slice(0, index);
            const invalid = line[index];
            const after = line.slice(index + invalid.length);

            return [
                ...(before ? [{ text: before, kind: "plain" as const }] : []),
                { text: invalid, kind: "error" as const },
                ...(after ? [{ text: after, kind: "plain" as const }] : []),
            ];
        }
    };

    lines.forEach((line, index) => {
        segments.push(...tokenizeLine(line));
        if (index < lines.length - 1) {
            segments.push({ text: "\n", kind: "plain" });
        }
    });

    if (!segments.length) {
        return [{ text: "", kind: "plain" }];
    }

    return segments;
}

export function highlightCalculatorProgram(
    program: string,
    classMap: Record<HighlightTokenKind, string>
): ReactNode[] {
    return tokenizeCalculatorProgram(program).map((segment, index) => {
        if (segment.text === "\n") {
            return "\n";
        }

        return (
            <span
                key={`${segment.kind}-${index}-${segment.text}`}
                className={classMap[segment.kind]}
            >
                {segment.text}
            </span>
        );
    });
}
