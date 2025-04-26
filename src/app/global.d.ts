interface ProgramData {
    title: string;
    description: string;
    program: string;
    mode: number;
}

interface ProgramLink {
    name: string;
    url: string;
}

interface ProgramSymbol {
    type: string;
    value: string;
}

type CalculatorMenuName =
    | "PROG"
    | "CONST"
    | "S_SUM"
    | "S_VAR"
    | "MODE"
    | "CLR"
    | "DRG";

type CalculatorInputTheme = "light" | "dark" | "orange" | "replay";
