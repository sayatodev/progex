import { TOKENS, INPUTS } from "../data/programTokensData.json";

const {
    // NUMBER,
    SPECIAL,
    VARIABLE,
    CONSTANT,
    // GENERAL,
    OPERATOR,
    FUNCTION,
    // BRACKET,
    LOGIC,
} = TOKENS;

export const PROGRAM_TOKEN_EXTENSIONS = {
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
export const PROGRAM_MENU_TOKENS: Record<CalculatorMenuName, string[]> = {
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

export const PROGRAM_TOKEN_MODES = {
    2: [
        OPERATOR.COMPLEX_ARGUMENT,
        FUNCTION.ARGUMENT,
        FUNCTION.CONJUGATE,
        SPECIAL.TO_COMPLEX,
        SPECIAL.TO_POLAR,
    ],
    6: PROGRAM_MENU_TOKENS.PROG,
};

// All tokens
function getAllTokens() {
    const result: ProgramTokenProps[] = [];

    type TokenCategory = keyof typeof TOKENS;
    for (const [category, tokenMap] of Object.entries(TOKENS) as Array<
        [TokenCategory, (typeof TOKENS)[TokenCategory]]
    >) {
        // Process each token in the category

        for (const [name, value] of Object.entries(tokenMap) as Array<
            [keyof typeof tokenMap, string]
        >) {
            // Look for specific modes for the token

            let mode = 0;
            for (const [modeNumber, tokens] of Object.entries(
                PROGRAM_TOKEN_MODES
            )) {
                if (tokens.includes(value)) {
                    mode = Number(modeNumber);
                    break;
                }
            }

            // Look for specific parent menu
            let parentMenu = null;
            for (const [menu, tokens] of Object.entries(PROGRAM_MENU_TOKENS)) {
                if (tokens.includes(value)) {
                    parentMenu = menu;
                    break;
                }
            }

            result.push({
                value,
                name,
                category,
                shift: PROGRAM_TOKEN_EXTENSIONS.SHIFT.includes(value),
                alpha: PROGRAM_TOKEN_EXTENSIONS.ALPHA.includes(value),
                mode,
                parentMenu,
                inputs:
                    INPUTS[category]?.[name] ?? [],
            });
        }
    }

    return result;
}

export const PROGRAM_TOKENS = getAllTokens();
