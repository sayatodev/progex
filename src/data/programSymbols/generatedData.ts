const symbols = [
    {
        "value": "1",
        "name": "ONE",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "2",
        "name": "TWO",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "3",
        "name": "THREE",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "3"
            }
        ]
    },
    {
        "value": "4",
        "name": "FOUR",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "4"
            }
        ]
    },
    {
        "value": "5",
        "name": "FIVE",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "5"
            }
        ]
    },
    {
        "value": "6",
        "name": "SIX",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "6"
            }
        ]
    },
    {
        "value": "7",
        "name": "SEVEN",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "7"
            }
        ]
    },
    {
        "value": "8",
        "name": "EIGHT",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "8"
            }
        ]
    },
    {
        "value": "9",
        "name": "NINE",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "9"
            }
        ]
    },
    {
        "value": "0",
        "name": "ZERO",
        "category": "NUMBER",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "0"
            }
        ]
    },
    {
        "value": ".",
        "name": "DECIMAL",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "."
            }
        ]
    },
    {
        "value": "ᴇ",
        "name": "EXPRESSION",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "EXP"
            }
        ]
    },
    {
        "value": "﹣",
        "name": "NEGATIVE",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "(-)"
            }
        ]
    },
    {
        "value": ",",
        "name": "COMMA",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ","
            }
        ]
    },
    {
        "value": "M+",
        "name": "M_PLUS",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "M+"
            }
        ]
    },
    {
        "value": "M-",
        "name": "M_MINUS",
        "category": "SPECIAL",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "M+"
            }
        ]
    },
    {
        "value": "▶r∠θ",
        "name": "TO_POLAR",
        "category": "SPECIAL",
        "shift": true,
        "alpha": false,
        "mode": 2,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "+"
            }
        ]
    },
    {
        "value": "▶a+b𝒾",
        "name": "TO_COMPLEX",
        "category": "SPECIAL",
        "shift": true,
        "alpha": false,
        "mode": 2,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "-"
            }
        ]
    },
    {
        "value": "Ran#",
        "name": "RANDOM",
        "category": "SPECIAL",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "."
            }
        ]
    },
    {
        "value": ";",
        "name": "SEMICOLON",
        "category": "SPECIAL",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ","
            }
        ]
    },
    {
        "value": "?",
        "name": "INPUT",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": ":",
        "name": "COLON",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "dark",
                "value": "3"
            }
        ]
    },
    {
        "value": "◢",
        "name": "DISPLAY",
        "category": "SPECIAL",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "dark",
                "value": "4"
            }
        ]
    },
    {
        "value": "Ans",
        "name": "ANSWER",
        "category": "VARIABLE",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "Ans"
            }
        ]
    },
    {
        "value": "A",
        "name": "A",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "(-)"
            }
        ]
    },
    {
        "value": "B",
        "name": "B",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "。，，，"
            }
        ]
    },
    {
        "value": "C",
        "name": "C",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "hyp"
            }
        ]
    },
    {
        "value": "D",
        "name": "D",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "sin"
            }
        ]
    },
    {
        "value": "X",
        "name": "X",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ")"
            }
        ]
    },
    {
        "value": "Y",
        "name": "Y",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ","
            }
        ]
    },
    {
        "value": "M",
        "name": "M",
        "category": "VARIABLE",
        "shift": false,
        "alpha": true,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "M+"
            }
        ]
    },
    {
        "value": "π",
        "name": "PI",
        "category": "CONSTANT",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "π"
            }
        ]
    },
    {
        "value": "𝓮",
        "name": "E",
        "category": "CONSTANT",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "ln"
            }
        ]
    },
    {
        "value": "EXE",
        "name": "EXECUTE",
        "category": "GENERAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "EXE"
            }
        ]
    },
    {
        "value": "°",
        "name": "DEGREE",
        "category": "GENERAL",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "。，，，"
            }
        ]
    },
    {
        "value": "+",
        "name": "PLUS",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "+"
            }
        ]
    },
    {
        "value": "-",
        "name": "MINUS",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "-"
            }
        ]
    },
    {
        "value": "×",
        "name": "MULTIPLY",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "×"
            }
        ]
    },
    {
        "value": "÷",
        "name": "DIVIDE",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "÷"
            }
        ]
    },
    {
        "value": "┘",
        "name": "FRACTION",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "a b/c"
            }
        ]
    },
    {
        "value": "⁻¹",
        "name": "INVERSE",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "x⁻¹"
            }
        ]
    },
    {
        "value": "²",
        "name": "SQUARE",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "x²"
            }
        ]
    },
    {
        "value": "³",
        "name": "CUBE",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "x³"
            }
        ]
    },
    {
        "value": "^(",
        "name": "X_POWER",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "^"
            }
        ]
    },
    {
        "value": "!",
        "name": "FACTORIAL",
        "category": "OPERATOR",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "x⁻¹"
            }
        ]
    },
    {
        "value": "∠",
        "name": "COMPLEX_ARGUMENT",
        "category": "OPERATOR",
        "shift": true,
        "alpha": false,
        "mode": 2,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "(-)"
            }
        ]
    },
    {
        "value": "%",
        "name": "PERCENT",
        "category": "OPERATOR",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "("
            }
        ]
    },
    {
        "value": "𝐏",
        "name": "PERMUTATION",
        "category": "OPERATOR",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "×"
            }
        ]
    },
    {
        "value": "𝐂",
        "name": "COMBINATION",
        "category": "OPERATOR",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "÷"
            }
        ]
    },
    {
        "value": "→",
        "name": "ASSIGN",
        "category": "OPERATOR",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "√(",
        "name": "SQRT",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "√"
            }
        ]
    },
    {
        "value": "log(",
        "name": "LOG",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "log"
            }
        ]
    },
    {
        "value": "ln(",
        "name": "LN",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "ln"
            }
        ]
    },
    {
        "value": "sin(",
        "name": "SIN",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "sin"
            }
        ]
    },
    {
        "value": "cos(",
        "name": "COS",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "cos"
            }
        ]
    },
    {
        "value": "tan(",
        "name": "TAN",
        "category": "FUNCTION",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "tan"
            }
        ]
    },
    {
        "value": "∛(",
        "name": "CUBE_ROOT",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "x³"
            }
        ]
    },
    {
        "value": "ˣ√(",
        "name": "X_ROOT",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "^"
            }
        ]
    },
    {
        "value": "₁₀^(",
        "name": "TEN_X_POWER",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "log"
            }
        ]
    },
    {
        "value": "𝓮^(",
        "name": "E_X_POWER",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "ln"
            }
        ]
    },
    {
        "value": "sin⁻¹(",
        "name": "ARC_SIN",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "sin"
            }
        ]
    },
    {
        "value": "cos⁻¹(",
        "name": "ARC_COS",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "cos"
            }
        ]
    },
    {
        "value": "tan⁻¹(",
        "name": "ARC_TAN",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "tan"
            }
        ]
    },
    {
        "value": "Abs(",
        "name": "ABS",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ")"
            }
        ]
    },
    {
        "value": "Pol(",
        "name": "POLAR",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "+"
            }
        ]
    },
    {
        "value": "Rec(",
        "name": "REC",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "-"
            }
        ]
    },
    {
        "value": "Rnd(",
        "name": "RND",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "dark",
                "value": "0"
            }
        ]
    },
    {
        "value": "arg(",
        "name": "ARGUMENT",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 2,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "("
            }
        ]
    },
    {
        "value": "Conjg(",
        "name": "CONJUGATE",
        "category": "FUNCTION",
        "shift": true,
        "alpha": false,
        "mode": 2,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ","
            }
        ]
    },
    {
        "value": "(",
        "name": "LEFT_PARENTHESIS",
        "category": "PARENTHESIS",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": "("
            }
        ]
    },
    {
        "value": ")",
        "name": "RIGHT_PARENTHESIS",
        "category": "PARENTHESIS",
        "shift": false,
        "alpha": false,
        "mode": 0,
        "parentMenu": null,
        "inputs": [
            {
                "theme": "light",
                "value": ")"
            }
        ]
    },
    {
        "value": "If",
        "name": "IF",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "Then",
        "name": "THEN",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "Else",
        "name": "ELSE",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "IfEnd",
        "name": "IF_END",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "For",
        "name": "FOR",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "To",
        "name": "TO",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "Step",
        "name": "STEP",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "3"
            }
        ]
    },
    {
        "value": "Next",
        "name": "NEXT",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "Break",
        "name": "BREAK",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "replay",
                "value": "←"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "While",
        "name": "WHILE",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "WhileEnd",
        "name": "WHILE_END",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "Goto",
        "name": "GOTO",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "Lbl",
        "name": "LABEL",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "≥",
        "name": "GTE",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "3"
            }
        ]
    },
    {
        "value": "≤",
        "name": "LTE",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "4"
            }
        ]
    },
    {
        "value": ">",
        "name": "GT",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "<",
        "name": "LT",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "=>",
        "name": "ARROW",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "1"
            }
        ]
    },
    {
        "value": "=",
        "name": "EQ",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "2"
            }
        ]
    },
    {
        "value": "≠",
        "name": "NEQ",
        "category": "LOGIC",
        "shift": false,
        "alpha": false,
        "mode": 6,
        "parentMenu": "PROG",
        "inputs": [
            {
                "theme": "orange",
                "value": "Prog"
            },
            {
                "theme": "replay",
                "value": "→"
            },
            {
                "theme": "dark",
                "value": "3"
            }
        ]
    }
]
export default symbols;