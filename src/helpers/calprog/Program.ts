import CalprogInterpreter from "./CalprogInterpreter";
import type Symbol from "./Symbol";

export default class Program {
    public code: string;
    private tokens: Symbol[];

    constructor(code: string) {
        this.code = code;
        this.tokens = CalprogInterpreter.parseSymbols(code);
    }

    getSymbols(): Symbol[] {
        return this.tokens;
    }

    setCode(code: string): void {
        this.code = code;
        this.tokens = CalprogInterpreter.parseSymbols(code);
    }

    static getModeName(mode: number | string): string {
        mode = Number(mode); // Ensure mode is a number
        const MODES = ["ANY", "COMP", "COMPLEX", "BASE", "SD", "REG", "PROG"];
        return MODES[mode] || "UNKNOWN";
    }
}
