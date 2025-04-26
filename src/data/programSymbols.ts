import { SYMBOLS } from "./_programSymbolsData.json";

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

export const PROGRAM_SYMBOL_EXTENSIONS = {
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
export const PROGRAM_MENU_SYMBOLS: Record<CalculatorMenuName, string[]> = {
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

export const PROGRAM_SYMBOL_MODES = {
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
        PROGRAM_MENU_SYMBOLS.PROG,
    ],
};

export enum SymbolName {
    "ONE" = "ONE",
    "TWO" = "TWO",
    "THREE" = "THREE",
    "FOUR" = "FOUR",
    "FIVE" = "FIVE",
    "SIX" = "SIX",
    "SEVEN" = "SEVEN",
    "EIGHT" = "EIGHT",
    "NINE" = "NINE",
    "ZERO" = "ZERO",
    "DECIMAL" = "DECIMAL",
    "EXPRESSION" = "EXPRESSION",
    "NEGATIVE" = "NEGATIVE",
    "COMMA" = "COMMA",
    "M_PLUS" = "M_PLUS",
    "M_MINUS" = "M_MINUS",
    "TO_POLAR" = "TO_POLAR",
    "TO_COMPLEX" = "TO_COMPLEX",
    "RANDOM" = "RANDOM",
    "SEMICOLON" = "SEMICOLON",
    "INPUT" = "INPUT",
    "COLON" = "COLON",
    "DISPLAY" = "DISPLAY",
    "ANSWER" = "ANSWER",
    "A" = "A",
    "B" = "B",
    "C" = "C",
    "D" = "D",
    "X" = "X",
    "Y" = "Y",
    "M" = "M",
    "PI" = "PI",
    "E" = "E",
    "EXECUTE" = "EXECUTE",
    "DEGREE" = "DEGREE",
    "PLUS" = "PLUS",
    "MINUS" = "MINUS",
    "MULTIPLY" = "MULTIPLY",
    "DIVIDE" = "DIVIDE",
    "FRACTION" = "FRACTION",
    "INVERSE" = "INVERSE",
    "SQUARE" = "SQUARE",
    "CUBE" = "CUBE",
    "X_POWER" = "X_POWER",
    "FACTORIAL" = "FACTORIAL",
    "COMPLEX_ARGUMENT" = "COMPLEX_ARGUMENT",
    "PERCENT" = "PERCENT",
    "PERMUTATION" = "PERMUTATION",
    "COMBINATION" = "COMBINATION",
    "ASSIGN" = "ASSIGN",
    "SQRT" = "SQRT",
    "LOG" = "LOG",
    "LN" = "LN",
    "SIN" = "SIN",
    "COS" = "COS",
    "TAN" = "TAN",
    "CUBE_ROOT" = "CUBE_ROOT",
    "X_ROOT" = "X_ROOT",
    "TEN_X_POWER" = "TEN_X_POWER",
    "E_X_POWER" = "E_X_POWER",
    "ARC_SIN" = "ARC_SIN",
    "ARC_COS" = "ARC_COS",
    "ARC_TAN" = "ARC_TAN",
    "ABS" = "ABS",
    "POLAR" = "POLAR",
    "REC" = "REC",
    "RND" = "RND",
    "ARGUMENT" = "ARGUMENT",
    "CONJUGATE" = "CONJUGATE",
    "LEFT_PARENTHESIS" = "LEFT_PARENTHESIS",
    "RIGHT_PARENTHESIS" = "RIGHT_PARENTHESIS",
    "IF" = "IF",
    "THEN" = "THEN",
    "ELSE" = "ELSE",
    "IF_END" = "IF_END",
    "FOR" = "FOR",
    "TO" = "TO",
    "STEP" = "STEP",
    "NEXT" = "NEXT",
    "BREAK" = "BREAK",
    "WHILE" = "WHILE",
    "WHILE_END" = "WHILE_END",
    "GOTO" = "GOTO",
    "LABEL" = "LABEL",
    "GTE" = "GTE",
    "LTE" = "LTE",
    "GT" = "GT",
    "LT" = "LT",
    "ARROW" = "ARROW",
    "EQ" = "EQ",
    "NEQ" = "NEQ",
}
export enum SymbolValue {
    "ONE" = "1",
    "TWO" = "2",
    "THREE" = "3",
    "FOUR" = "4",
    "FIVE" = "5",
    "SIX" = "6",
    "SEVEN" = "7",
    "EIGHT" = "8",
    "NINE" = "9",
    "ZERO" = "0",
    "DECIMAL" = ".",
    "EXPRESSION" = "ᴇ",
    "NEGATIVE" = "﹣",
    "COMMA" = ",",
    "M_PLUS" = "M+",
    "M_MINUS" = "M-",
    "TO_POLAR" = "▶r∠θ",
    "TO_COMPLEX" = "▶a+b𝒾",
    "RANDOM" = "Ran#",
    "SEMICOLON" = ";",
    "INPUT" = "?",
    "COLON" = ":",
    "DISPLAY" = "◢",
    "ANSWER" = "Ans",
    "A" = "A",
    "B" = "B",
    "C" = "C",
    "D" = "D",
    "X" = "X",
    "Y" = "Y",
    "M" = "M",
    "PI" = "π",
    "E" = "𝓮",
    "I" = "𝒾",
    "EXECUTE" = "EXE",
    "DEGREE" = "°",
    "PLUS" = "+",
    "MINUS" = "-",
    "MULTIPLY" = "×",
    "DIVIDE" = "÷",
    "FRACTION" = "┘",
    "INVERSE" = "⁻¹",
    "SQUARE" = "²",
    "CUBE" = "³",
    "X_POWER" = "^(",
    "FACTORIAL" = "!",
    "COMPLEX_ARGUMENT" = "∠",
    "PERCENT" = "%",
    "PERMUTATION" = "𝐏",
    "COMBINATION" = "𝐂",
    "ASSIGN" = "→",
    "SQRT" = "√(",
    "LOG" = "log(",
    "LN" = "ln(",
    "SIN" = "sin(",
    "COS" = "cos(",
    "TAN" = "tan(",
    "CUBE_ROOT" = "∛(",
    "X_ROOT" = "ˣ√(",
    "TEN_X_POWER" = "₁₀^(",
    "E_X_POWER" = "𝓮^(",
    "ARC_SIN" = "sin⁻¹(",
    "ARC_COS" = "cos⁻¹(",
    "ARC_TAN" = "tan⁻¹(",
    "ABS" = "Abs(",
    "POLAR" = "Pol(",
    "REC" = "Rec(",
    "RND" = "Rnd(",
    "ARGUMENT" = "arg(",
    "CONJUGATE" = "Conjg(",
    "LEFT_PARENTHESIS" = "(",
    "RIGHT_PARENTHESIS" = ")",
    "IF" = "If",
    "THEN" = "Then",
    "ELSE" = "Else",
    "IF_END" = "IfEnd",
    "FOR" = "For",
    "TO" = "To",
    "STEP" = "Step",
    "NEXT" = "Next",
    "BREAK" = "Break",
    "WHILE" = "While",
    "WHILE_END" = "WhileEnd",
    "GOTO" = "Goto",
    "LABEL" = "Lbl",
    "GTE" = "≥",
    "LTE" = "≤",
    "GT" = ">",
    "LT" = "<",
    "ARROW" = "=>",
    "EQ" = "=",
    "NEQ" = "≠",
}

export const ALL_SYMBOLS: SymbolValue[] = Object.values(SYMBOLS).reduce(
    (acc, category) => {
        return acc.concat(Object.values(category) as SymbolValue[]);
    },
    [] as SymbolValue[]
);

export const MAX_SYMBOL_LENGTH = ALL_SYMBOLS.reduce((max, symbol) => {
    const length = symbol.length;
    return length > max ? length : max;
}, 1);

// export function _getAllSymbols() {
//     const result = [];
//     //@ts-expect-error test
//     const _allNames = Object.keys(SYMBOLS).reduce((acc, category) => {
//         const symbolNames = Object.keys(
//             SYMBOLS[category as keyof typeof SYMBOLS]
//         ).map((name) => {
//             return `${category}.${name}`;
//         });
//         return (acc as string[]).concat(symbolNames);
//     }, []);
//     console.log(_allNames);

//     type SymbolCategory = keyof typeof SYMBOLS;
//     for (const [category, symbolMap] of Object.entries(SYMBOLS) as Array<
//         [SymbolCategory, (typeof SYMBOLS)[SymbolCategory]]
//     >) {
//         // Process each symbol in the category

//         for (const [name, value] of Object.entries(symbolMap) as Array<
//             [keyof typeof symbolMap, string]
//         >) {
//             // Look for specific modes for the symbol

//             let mode = 0;
//             for (const [modeNumber, symbols] of Object.entries(
//                 PROGRAM_SYMBOL_MODES
//             )) {
//                 if (symbols.includes(value)) {
//                     mode = Number(modeNumber);
//                     break;
//                 }
//             }

//             // Look for specific parent menu
//             let parentMenu = null;
//             for (const [menu, symbols] of Object.entries(
//                 PROGRAM_MENU_SYMBOLS
//             )) {
//                 if (symbols.includes(value)) {
//                     parentMenu = menu;
//                     break;
//                 }
//             }

//             result.push({
//                 value,
//                 name,
//                 category,
//                 shift: PROGRAM_SYMBOL_EXTENSIONS.SHIFT.includes(value),
//                 alpha: PROGRAM_SYMBOL_EXTENSIONS.ALPHA.includes(value),
//                 mode,
//                 parentMenu,
//                 inputs: INPUTS[category]?.[name] ?? [],
//             });
//         }
//     }

//     return result;
// }
