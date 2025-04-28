import SymbolsData from "./generatedData";

export const PROGRAM_SYMBOL_EXTENSIONS: Record<CalculatorFlag, string[]> = {
    SHIFT: SymbolsData.filter((symbol) => symbol.category === "SHIFT").map(
        (symbol) => symbol.name
    ),
    ALPHA: SymbolsData.filter((symbol) => symbol.category === "ALPHA").map(
        (symbol) => symbol.name
    ),
};

type CalculatorMode = number;
export const PROGRAM_SYMBOL_MODES: Record<CalculatorMode, string[]> =
    Object.fromEntries(
        [0, 1, 2, 3, 4, 5, 6].map((mode) => {
            return SymbolsData.filter((symbol) => symbol.mode === mode).map(
                (symbol) => symbol.name
            );
        })
    );

export const MAX_SYMBOL_LENGTH = SymbolsData.reduce((max, symbol) => {
    const length = symbol.name.length;
    return length > max ? length : max;
}, 1);
