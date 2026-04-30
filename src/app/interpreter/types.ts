import type {
    AngleMode,
    ExecutionConfig,
    ExecutionMode,
    RegressionMode,
} from "@/helpers/calprog/interpreter/runtime";

export type InterpreterExample = {
    label: string;
    program: string;
    inputs: string[];
    config?: ExecutionConfig;
};

export type TokenPreview = {
    lexeme: string;
    type: string;
    segment: number;
};

export type VariableSnapshot = {
    name: string;
    value: string;
};

export type ExecutionSnapshot = {
    normalizedProgram: string;
    tokenCount: number;
    statementCount: number;
    inputLabels: string[];
    outputLabels: string[];
    finalResultLabel: string;
    tokens: TokenPreview[];
    statements: string[];
    outputs: string[];
    finalResult: string;
    variables: VariableSnapshot[];
    executionMode: ExecutionMode;
    angleMode: AngleMode;
    emitFinalResult: boolean;
    remainingInputs: string[];
    stats: {
        frequencyEnabled: boolean;
        regressionMode: RegressionMode | null;
        data: Array<{
            x: string;
            y: string | null;
            frequency: string;
        }>;
    };
};
