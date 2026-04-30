import type { Value } from "./Value";

export type ExecutionMode =
    | "AUTO"
    | "COMP"
    | "CMPLX"
    | "BASE"
    | "SD"
    | "REG";

export type AngleMode = "DEG" | "RAD";

export type RegressionMode = "LIN";

export type StatisticsState = {
    frequencyEnabled: boolean;
    regressionMode: RegressionMode | null;
    data: Array<{
        x: string | Value;
        y: string | Value | null;
        frequency: string | Value;
    }>;
};

export type ExecutionConfig = {
    executionMode?: ExecutionMode;
    angleMode?: AngleMode;
    stats?: Partial<StatisticsState>;
    emitFinalResult?: boolean;
};
