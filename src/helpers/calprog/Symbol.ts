import SYMBOLS from "@/data/programSymbolsData.json";

export default class ProgSymbol<N extends string = string> {
    public name: N;
    public value: string;
    public category: string;
    public flags: { shift: boolean; alpha: boolean };
    public mode: number;
    public parentMenu: string | null;
    public inputs: { theme: CalculatorInputTheme; value: string }[];

    public constructor(name: N) {
        this.name = name;
        const symbol = SYMBOLS.find((t) => t.name === name);
        if (symbol) {
            this.value = symbol.value;
            this.category = symbol.category;
            this.flags = { shift: symbol.shift, alpha: symbol.alpha };
            this.parentMenu = symbol.parentMenu || null;
            this.inputs =
                (symbol.inputs as {
                    theme: CalculatorInputTheme;
                    value: string;
                }[]) || [];
            this.mode = symbol.mode || 0;
        } else {
            this.value = name;
            this.category = "UNKNOWN";
            this.flags = { shift: false, alpha: false };
            this.parentMenu = null;
            this.inputs = [];
            this.mode = 0;
        }
    }

    public static fromValue(
        name: (typeof SYMBOLS)[number]["value"]
    ): ProgSymbol {
        const symbol = SYMBOLS.find((t) => t.value === name);
        if (symbol) {
            return new ProgSymbol(symbol.name as string);
        } else {
            return new ProgSymbol(name as string);
        }
    }
}
