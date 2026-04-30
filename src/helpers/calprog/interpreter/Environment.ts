import { SymbolValue } from "@/data/programSymbols/generatedEnums";
import initiateRecord from "@/helpers/initiateRecord";
import type {
    IdentifierName,
    StatVariableName,
    VariableName,
} from "./types";
import { asComplex, ComplexValue, RuntimeValue, Value } from "./Value";
import Decimal from "decimal.js";
import type {
    AngleMode,
    ExecutionConfig,
    ExecutionMode,
    StatisticsState,
} from "./runtime";

const variableNames: VariableName[] = [
    SymbolValue.A,
    SymbolValue.B,
    SymbolValue.C,
    SymbolValue.D,
    SymbolValue.X,
    SymbolValue.Y,
    SymbolValue.M,
];

type ConstantName = SymbolValue.PI | SymbolValue.E | SymbolValue.I;
const CONSTANTS: Record<ConstantName, RuntimeValue> = {
    [SymbolValue.PI]: new Value(Decimal.acos(-1)),
    [SymbolValue.E]: new Value(Decimal.exp(1)),
    [SymbolValue.I]: new ComplexValue(Value.from(0), Value.from(1)),
};

type EnvironmentConfig = ExecutionConfig & {
    inputs: string[];
    displayCallback: (value: RuntimeValue) => void;
};

type StatisticsDataPoint = {
    x: Value;
    y: Value | null;
    frequency: Value;
};

export class Environment {
    private readonly variables: Record<VariableName, RuntimeValue> =
        initiateRecord(variableNames, Value.from(0));
    private readonly constants: Record<ConstantName, RuntimeValue> = CONSTANTS;
    private statisticsData: StatisticsDataPoint[] = [];
    result: RuntimeValue = Value.from(0);
    executionMode: ExecutionMode = "AUTO";
    setup: AngleMode = "DEG";
    stats: StatisticsState = {
        frequencyEnabled: false,
        regressionMode: null,
        data: [],
    };
    emitFinalResult = false;
    inputs: RuntimeValue[] = [];
    displayCallback = (result: RuntimeValue) => {
        console.log("DISPLAY->", result.toString());
    };

    resetMemory(): void {
        for (const name of variableNames) {
            this.variables[name] = Value.from(0);
        }
        this.result = Value.from(0);
    }

    resetStatistics(): void {
        this.statisticsData = [];
        this.stats = {
            frequencyEnabled: false,
            regressionMode: null,
            data: [],
        };
    }

    clearStatisticsData(): void {
        this.statisticsData = [];
        this.stats.data = [];
    }

    setExecutionMode(mode: ExecutionMode): void {
        this.executionMode = mode;
    }

    setAngleMode(mode: AngleMode): void {
        this.setup = mode;
    }

    setFrequencyEnabled(enabled: boolean): void {
        this.stats.frequencyEnabled = enabled;
    }

    setRegressionMode(mode: StatisticsState["regressionMode"]): void {
        this.stats.regressionMode = mode;
    }

    setEmitFinalResult(enabled: boolean): void {
        this.emitFinalResult = enabled;
    }

    assign(name: VariableName, value: RuntimeValue): void {
        this.variables[name] = value;
        this.result = value;
    }

    setVariable(name: VariableName, value: RuntimeValue): void {
        this.variables[name] = value;
    }

    addStatisticsDataPoint(x: Value, y: Value | null, frequency: Value): void {
        this.statisticsData.push({
            x: x.clone(),
            y: y?.clone() ?? null,
            frequency: frequency.clone(),
        });
        this.stats.data.push({
            x: x.toString(),
            y: y?.toString() ?? null,
            frequency: frequency.toString(),
        });
    }

    private getStatisticsAccumulator(): {
        count: Value;
        sumX: Value;
        sumY: Value;
    } {
        return this.statisticsData.reduce(
            (accumulator, point) => ({
                count: accumulator.count.add(point.frequency),
                sumX: accumulator.sumX.add(point.x.mul(point.frequency)),
                sumY: accumulator.sumY.add(
                    (point.y ?? Value.from(0)).mul(point.frequency)
                ),
            }),
            {
                count: Value.from(0),
                sumX: Value.from(0),
                sumY: Value.from(0),
            }
        );
    }

    private getStatisticsValue(name: StatVariableName): RuntimeValue {
        const { count, sumX, sumY } = this.getStatisticsAccumulator();

        switch (name) {
            case "Σx":
                return sumX;
            case "Σy":
                return sumY;
            case "n":
                return count;
            case "meanX":
                return count.isZero() ? Value.from(0) : sumX.div(count);
            case "meanY":
                return count.isZero() ? Value.from(0) : sumY.div(count);
        }
    }

    get(name: IdentifierName): RuntimeValue {
        if (name === SymbolValue.ANSWER) {
            return this.result;
        }
        if (name === SymbolValue.RANDOM) {
            const randomValue = Math.round(Math.random() * 1000) / 1000;
            return Value.from(randomValue);
        }
        if (name in this.constants) {
            return this.constants[name as ConstantName];
        }
        if (
            name === "Σx" ||
            name === "Σy" ||
            name === "n" ||
            name === "meanX" ||
            name === "meanY"
        ) {
            return this.getStatisticsValue(name);
        }
        if (name in this.variables) {
            return this.variables[name as VariableName];
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    mIncrement(value: RuntimeValue): void {
        const current = this.get(SymbolValue.M);
        if (current instanceof ComplexValue || value instanceof ComplexValue) {
            this.variables[SymbolValue.M] = asComplex(current).add(
                asComplex(value)
            );
            return;
        }
        this.variables[SymbolValue.M] = current.add(value);
    }

    mDecrement(value: RuntimeValue): void {
        const current = this.get(SymbolValue.M);
        if (current instanceof ComplexValue || value instanceof ComplexValue) {
            this.variables[SymbolValue.M] = asComplex(current).sub(
                asComplex(value)
            );
            return;
        }
        this.variables[SymbolValue.M] = current.sub(value);
    }

    setInput(index: number, value: RuntimeValue): void {
        if (!this.inputs.length) {
            throw new Error("Inputs have not been initialized.");
        }
        if (index >= 0 && index < this.inputs.length) {
            this.inputs[index] = value;
        }
    }

    getInput(): RuntimeValue {
        if (!this.inputs.length) {
            throw new Error("Inputs have not been initialized.");
        }
        return this.inputs.shift() || Value.from(0);
    }

    setDisplayCallback(callback: (value: RuntimeValue) => void): void {
        this.displayCallback = callback;
    }

    initiateInputLength(length: number): void {
        this.inputs = Array.from({ length }, () => Value.from(0));
    }

    setInputs(inputs: RuntimeValue[]): void {
        this.inputs = inputs;
    }

    config({
        inputs,
        displayCallback,
        executionMode,
        angleMode,
        stats,
        emitFinalResult,
    }: EnvironmentConfig): void {
        this.initiateInputLength(inputs?.length || 0);
        this.setInputs(inputs.map((input) => Value.from(input)));
        this.setDisplayCallback(displayCallback);
        if (executionMode) {
            this.setExecutionMode(executionMode);
        }
        if (angleMode) {
            this.setAngleMode(angleMode);
        }
        if (stats?.frequencyEnabled !== undefined) {
            this.setFrequencyEnabled(stats.frequencyEnabled);
        }
        if (stats?.regressionMode !== undefined) {
            this.setRegressionMode(stats.regressionMode ?? null);
        }
        if (stats?.data !== undefined) {
            this.statisticsData = stats.data.map((point): StatisticsDataPoint => ({
                x: point.x instanceof Value ? point.x.clone() : Value.from(point.x),
                y:
                    point.y === null
                        ? null
                        : point.y instanceof Value
                          ? point.y.clone()
                          : Value.from(point.y),
                frequency:
                    point.frequency instanceof Value
                        ? point.frequency.clone()
                        : Value.from(point.frequency),
            }));
            this.stats.data = this.statisticsData.map((point) => ({
                x: point.x.toString(),
                y: point.y?.toString() ?? null,
                frequency: point.frequency.toString(),
            }));
        }
        if (emitFinalResult !== undefined) {
            this.setEmitFinalResult(emitFinalResult);
        }
    }
}
