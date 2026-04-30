import type {
    AngleMode,
    ExecutionConfig,
    ExecutionMode,
    RegressionMode,
} from "@/helpers/calprog/interpreter/runtime";
import type { VariableName } from "@/helpers/calprog/interpreter/types";
import type { InterpreterExample } from "./types";

export const DEFAULT_PROGRAM =
    "?→A:\n?→B:\n?→C:\n?→D:\n?→X:\n?→Y:\nAX-DB→M:\n(CX-YB)┘M→X◢:\n(AY-DC)┘M→Y";

export const VARIABLE_NAMES: readonly VariableName[] = [
    "A" as VariableName,
    "B" as VariableName,
    "C" as VariableName,
    "D" as VariableName,
    "X" as VariableName,
    "Y" as VariableName,
    "M" as VariableName,
];

export const EXECUTION_MODES: ExecutionMode[] = [
    "AUTO",
    "COMP",
    "CMPLX",
    "BASE",
    "SD",
    "REG",
];

export const ANGLE_MODES: AngleMode[] = ["DEG", "RAD"];

export const REGRESSION_MODES: Array<RegressionMode | "NONE"> = ["NONE", "LIN"];

export const EXAMPLES: InterpreterExample[] = [
    {
        label: "2x2 simultaneous",
        program:
            "?→A:\n?→B:\n?→C:\n?→D:\n?→X:\n?→Y:\nAX-DB→M:\nM⁻¹(CX-YB→X◢:\nM⁻¹(AY-DC→Y",
        inputs: ["1", "1", "7", "1", "-1", "1"],
        config: { executionMode: "COMP" },
    },
    {
        label: "Trapezoidal rule",
        program:
            "ClrMemory:\n?→X:\n?→Y:\n?→A:\nA⁻¹(Y-X→Y:\nFor 0→B To A:\nln(X:\nAns-.5Ans(B²=BA)M+:\nX+Y→X:\nNext:\nYM",
        inputs: ["1", "2", "10"],
        config: { executionMode: "COMP" },
    },
    {
        label: "Weighted statistics",
        program: "ClrStat:\nFreqOn:\n1,2;5DT:\nmaxX◢:\nmaxY◢:\nΣx◢:\nΣy◢:\nn",
        inputs: [],
        config: { executionMode: "REG" },
    },
    {
        label: "Circle centres",
        program:
            "FreqOn:? → A:? → B:? → C:? → D:? → X:? → Y:X, Y; Pol(A - C, B - DDT:Pol(C - maxX, D - maxY:√((A - maxX)² + (B - maxY)² → Y:(AX + CY + Σx) ┘ (X + Y + n ◢(BX + DY + Σy) ┘ (X + Y + n ◢(A + C + maxX) ┘ 3 ◢(B + D + maxY) ┘ 3 ◢(maxX - A) ┘ (B - maxY → M:D - MC → X:(C - A) ┘ (B - D:(maxY - AnsmaxX - X) ┘ (M - Ans → Y ◢YM + X → M ◢(A + C + maxX - Y) ┘ 2 → A ◢(B + D + maxY - M) ┘ 2 → B ◢Pol(A - C, B - D ◢-2A ◢-2B ◢A² + B² - X²",
        inputs: ["4", "3", "0", "0", "4", "0"],
        config: { executionMode: "SD" },
    },
];

export const editorHighlightClasses = {
    number: "text-amber-300",
    variable: "text-cyan-300",
    constant: "text-fuchsia-300",
    function: "text-emerald-300",
    keyword: "text-rose-300 font-semibold",
    operator: "text-stone-100",
    delimiter: "text-stone-500",
    display: "text-lime-300 font-semibold",
    input: "text-sky-300 font-semibold",
    error: "bg-red-500/30 text-red-100 underline decoration-red-300 decoration-wavy",
    plain: "text-amber-50",
} as const;

export type InterpreterConfigState = {
    executionMode: ExecutionMode;
    angleMode: AngleMode;
    frequencyEnabled: boolean;
    regressionMode: RegressionMode | "NONE";
};

export function buildExampleConfig(
    config?: ExecutionConfig,
): InterpreterConfigState {
    return {
        executionMode: config?.executionMode ?? "AUTO",
        angleMode: config?.angleMode ?? "DEG",
        frequencyEnabled: config?.stats?.frequencyEnabled ?? false,
        regressionMode: config?.stats?.regressionMode ?? "NONE",
    };
}
