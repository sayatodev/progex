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

interface ProgramToken {
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

interface ProgramTokenProps {
    value: string;
    name: string;
    category: string;
    shift: boolean;
    alpha: boolean;
    mode: number;
    parentMenu: string | null;
    inputs: { theme: CalculatorInputTheme; value: string }[];
}
