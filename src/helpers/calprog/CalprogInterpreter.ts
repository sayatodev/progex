import SYMBOLS from "@/data/programSymbolsData.json";
import ProgSymbol from "./Symbol";

export default class CalprogInterpreter {
    public static parseSymbols(code: string): ProgSymbol[] {
        const symbols: ProgSymbol[] = [];
        let cursor = 0;

        // Sort symbol by length (longest first)
        SYMBOLS.sort((a, b) => {
            return b.value.length - a.value.length;
        });

        while (cursor < code.length) {
            let matched = false;
            for (const symbol of SYMBOLS) {
                if (code[cursor] === " ") {
                    cursor++;
                    matched = true;
                    break; // Split symbol at spaces and skip it
                }
                if (
                    code[cursor] === symbol.value || // For single character symbol
                    code.startsWith(symbol.value, cursor) // For multi-character symbol
                ) {
                    symbols.push(ProgSymbol.fromValue(symbol.value));
                    cursor += symbol.value.length;
                    matched = true;
                    break;
                }
            }
            if (matched) continue;

            // If nothing matched, this creates a symbol with name "UNKNOWN"
            symbols.push(ProgSymbol.fromValue(code[cursor]));
            cursor++;
        }

        return symbols;
    }

    public static processSymbol(symbols: ProgSymbol[]) {
        const statements: ProgSymbol[] = [];

        let currentStatement: ProgSymbol[] = [];
        for (const symbol of symbols) {
            if (symbol.value === new ProgSymbol("COLON").value) {
                statements.push(symbol);
                currentStatement = [];
            } else {
                currentStatement.push(symbol);
            }
        }
    }

    public static processStatement(statement: ProgSymbol[]) {
        // Auto close parentheses
        let openParentheses = 0;
        for (const symbol of statement) {
            switch (symbol.name) {
                case "LEFT_PARENTHESIS":
                    openParentheses++;
                    break;
                case "RIGHT_PARENTHESIS":
                    openParentheses--;
                    break;
                case "COMMA":
                    while (openParentheses > 0) {
                        statement.push(new ProgSymbol("RIGHT_PARENTHESIS"));
                        openParentheses--;
                    }
                    break;
            }
        }
    }
}
