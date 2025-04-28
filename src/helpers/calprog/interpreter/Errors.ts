import type Token from "./Token";
import type { ErrorName } from "./types";

/* Runtime Errors */
export class RuntimeError extends Error {
    public readonly name: ErrorName;
    public readonly token: Token | null;

    constructor(name: ErrorName, token: Token | null, message: string) {
        super(message);
        this.name = name;
        this.token = token;
    }

    toString(): string {
        return `${this.name}: ${this.message}\n\tat Segment ${this.token?.segment ?? "unknown"}\n\t(${this.token?.lexeme ?? "unknown"})`;
    }
}

export class MathError extends RuntimeError {
    constructor(token: Token, message: string) {
        super("MathError", token, message);
    }
}

export class CalcSyntaxError extends RuntimeError {
    constructor(token: Token | null, message: string) {
        super("SyntaxError", token, message);
    }
}
