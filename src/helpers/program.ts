import { PROGRAM_TOKENS } from "@/data/programTokens";

export default class Program {
    public code: string;
    private tokens: ProgramTokenProps[];

    constructor(code: string) {
        this.code = code;
        this.tokens = Program.tokenize(code);
    }

    getTokens(): ProgramTokenProps[] {
        return this.tokens;
    }

    setCode(code: string): void {
        this.code = code;
        this.tokens = Program.tokenize(code);
    }

    static tokenize(code: string): ProgramTokenProps[] {
        const tokens: ProgramTokenProps[] = [];
        let cursor = 0;

        // Sort tokens by length (longest first)
        PROGRAM_TOKENS.sort((a, b) => {
            return b.value.length - a.value.length; 
        });

        while (cursor < code.length) {
            let matched = false;
            for (const token of PROGRAM_TOKENS) {
                if (code[cursor] === " ") {
                    cursor++;
                    matched = true;
                    break; // Split tokens at spaces and skip it
                }
                if (
                    code[cursor] === token.value || // For single character tokens
                    code.startsWith(token.value, cursor) // For multi-character tokens
                ) {
                    tokens.push(token);
                    cursor += token.value.length;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            // If nothing matched, consider it an unknown token
            tokens.push({
                value: code[cursor],
                name: "UNKNOWN",
                category: "UNKNOWN",
                shift: false,
                alpha: false,
                mode: -1,
                parentMenu: null,
                inputs: [],
            });
            cursor++;
        }

        return tokens;
    }

    static getModeName(mode: number|string): string {
        mode = Number(mode); // Ensure mode is a number
        switch (mode) {
            case 0:
                return "ANY";
            case 1:
                return "COMP";
            case 2:
                return "COMPLEX";
            case 3:
                return "BASE";
            case 4:
                return "SD";
            case 5:
                return "REG";
            case 6:
                return "PROG";
            default:
                return "UNKNOWN";
        }
    }
}
