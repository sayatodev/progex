import { SymbolValue } from "@/data/programSymbols/generatedEnums";
import initiateRecord from "@/helpers/initiateRecord";
import type { IdentifierName, VariableName } from "./types";
import { Value } from "./Value";
import Decimal from "decimal.js";

const variableNames: VariableName[] = [
    SymbolValue.A,
    SymbolValue.B,
    SymbolValue.C,
    SymbolValue.D,
    SymbolValue.X,
    SymbolValue.Y,
    SymbolValue.M,
];

type ConstantName = SymbolValue.PI | SymbolValue.E;
const CONSTANTS: Record<ConstantName, Value> = {
    [SymbolValue.PI]: new Value(Decimal.acos(-1)),
    [SymbolValue.E]: new Value(Decimal.exp(1)),
};

export class Environment {
    private readonly variables: Record<VariableName, Value> = initiateRecord(
        variableNames,
        Value.from(0)
    );
    private readonly constants: Record<ConstantName, Value> = CONSTANTS;
    result: Value = Value.from(0);
    setup: "RAD" | "DEG" = "DEG";

    constructor() {}

    assign(name: VariableName, value: Value): void {
        this.variables[name] = value;
        this.result = value;
    }

    get(name: IdentifierName): Value {
        if (name === SymbolValue.ANSWER) {
            console.debug("ANSWER->", this.result);
            return this.result;
        }
        if (name === SymbolValue.RANDOM) {
            const randomValue = Math.round(Math.random() * 1000) / 1000;
            return Value.from(randomValue);
        }
        if (name in this.constants) {
            return this.constants[name as ConstantName];
        }
        if (name in this.variables) {
            return this.variables[name as VariableName];
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    mIncrement(value: Value): void {
        this.variables[SymbolValue.M] =
            this.variables[SymbolValue.M].add(value);
    }

    mDecrement(value: Value): void {
        this.variables[SymbolValue.M] =
            this.variables[SymbolValue.M].sub(value);
    }
}
