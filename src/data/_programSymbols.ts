import { SYMBOLS, INPUTS } from "./_programSymbolsData.json";

export const SYMBOL_VALUES = SYMBOLS;

const {
    // NUMBER,
    SPECIAL,
    VARIABLE,
    CONSTANT,
    // GENERAL,
    OPERATOR,
    FUNCTION,
    // PARENTHESIS,
    LOGIC,
} = SYMBOLS;

const PROGRAM_SYMBOL_EXTENSIONS = {
    SHIFT: [
        OPERATOR.FACTORIAL,
        FUNCTION.CUBE_ROOT,
        FUNCTION.X_ROOT,
        FUNCTION.TEN_X_POWER,
        FUNCTION.E_X_POWER,
        OPERATOR.COMPLEX_ARGUMENT,
        FUNCTION.ARC_SIN,
        FUNCTION.ARC_COS,
        FUNCTION.ARC_TAN,
        OPERATOR.PERCENT,
        FUNCTION.ARGUMENT,
        FUNCTION.ABS,
        SPECIAL.SEMICOLON,
        FUNCTION.CONJUGATE,
        SPECIAL.M_MINUS,
        OPERATOR.PERMUTATION,
        OPERATOR.COMBINATION,
        SPECIAL.TO_POLAR,
        FUNCTION.POLAR,
        SPECIAL.TO_COMPLEX,
        FUNCTION.REC,
        FUNCTION.RND,
        SPECIAL.RANDOM,
        CONSTANT.PI,
    ],
    ALPHA: [
        VARIABLE.A,
        VARIABLE.B,
        VARIABLE.C,
        VARIABLE.D,
        VARIABLE.X,
        VARIABLE.Y,
        VARIABLE.M,
    ],
};
const PROGRAM_MENU_SYMBOLS: Record<CalculatorMenuName, string[]> = {
    PROG: [
        SPECIAL.INPUT,
        SPECIAL.COLON,
        SPECIAL.DISPLAY,
        OPERATOR.ASSIGN,
        LOGIC.IF,
        LOGIC.THEN,
        LOGIC.ELSE,
        LOGIC.IF_END,
        LOGIC.FOR,
        LOGIC.TO,
        LOGIC.STEP,
        LOGIC.NEXT,
        LOGIC.BREAK,
        LOGIC.WHILE,
        LOGIC.WHILE_END,
        LOGIC.GOTO,
        LOGIC.LABEL,
        LOGIC.GTE,
        LOGIC.LTE,
        LOGIC.GT,
        LOGIC.LT,
        LOGIC.ARROW,
        LOGIC.EQ,
        LOGIC.NEQ,
    ],
    CONST: [],
    S_SUM: [],
    S_VAR: [],
    MODE: [],
    CLR: [],
    DRG: [],
};

const PROGRAM_SYMBOL_MODES = {
    2: [
        /* Complex */
        OPERATOR.COMPLEX_ARGUMENT,
        FUNCTION.ARGUMENT,
        FUNCTION.CONJUGATE,
        SPECIAL.TO_COMPLEX,
        SPECIAL.TO_POLAR,
        CONSTANT.I,
    ],
    6: [
        /* Program */
        ...PROGRAM_MENU_SYMBOLS.PROG,
    ],
};

function exportSymbols() {
    const result = [];
    //@ts-expect-error test
    const _allNames = Object.keys(SYMBOLS).reduce((acc, category) => {
        const symbolNames = Object.keys(
            SYMBOLS[category as keyof typeof SYMBOLS]
        ).map((name) => {
            return `${category}.${name}`;
        });
        return (acc as string[]).concat(symbolNames);
    }, []);
    console.log(_allNames);

    type SymbolCategory = keyof typeof SYMBOLS;
    for (const [category, symbolMap] of Object.entries(SYMBOLS) as Array<
        [SymbolCategory, (typeof SYMBOLS)[SymbolCategory]]
    >) {
        // Process each symbol in the category

        for (const [name, value] of Object.entries(symbolMap) as Array<
            [keyof typeof symbolMap, string]
        >) {
            // Look for specific modes for the symbol

            let mode = 0;
            for (const [modeNumber, symbols] of Object.entries(
                PROGRAM_SYMBOL_MODES
            )) {
                if (symbols.includes(value)) {
                    mode = Number(modeNumber);
                    break;
                }
            }

            // Look for specific parent menu
            let parentMenu = null;
            for (const [menu, symbols] of Object.entries(
                PROGRAM_MENU_SYMBOLS
            )) {
                if (symbols.includes(value)) {
                    parentMenu = menu;
                    break;
                }
            }

            result.push({
                value,
                name,
                category,
                shift: PROGRAM_SYMBOL_EXTENSIONS.SHIFT.includes(value),
                alpha: PROGRAM_SYMBOL_EXTENSIONS.ALPHA.includes(value),
                mode,
                parentMenu,
                inputs: INPUTS[category]?.[name] ?? [],
            });
        }
    }

    return result;
}
console.log(exportSymbols());
