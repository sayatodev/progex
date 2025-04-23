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
                    tokens.push({
                        value: token.value,
                        name: token.name,
                        category: token.category,
                        shift: token.shift,
                        alpha: token.alpha,
                        mode: token.mode,
                        parentMenu: token.parentMenu,
                    });
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
            });
            cursor++;
        }

        return tokens;
    }
}
