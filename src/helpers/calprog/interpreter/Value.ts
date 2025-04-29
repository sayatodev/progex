import Decimal from "decimal.js";
import * as dMath from "../math";

Decimal.set({
    precision: 15,
    maxE: 99,
    minE: -99,
    toExpNeg: -10,
    toExpPos: 10,
    rounding: Decimal.ROUND_FLOOR
});

export class Value {
    value: Decimal;

    constructor(value: Decimal) {
        this.value = value;
    }

    static from(value: number | string): Value {
        return new Value(new Decimal(value));
    }

    /* Comparisons */
    lessThan(other: Value): boolean {
        return this.value.lessThan(other.value);
    }
    greaterThan(other: Value): boolean {
        return this.value.greaterThan(other.value);
    }
    lessThanOrEqual(other: Value): boolean {
        return this.value.lessThanOrEqualTo(other.value);
    }
    greaterThanOrEqual(other: Value): boolean {
        return this.value.greaterThanOrEqualTo(other.value);
    }
    equal(other: Value): boolean {
        return this.value.equals(other.value);
    }
    notEqual(other: Value): boolean {
        return !this.value.equals(other.value);
    }

    /* Arithmetic */
    add(other: Value): Value {
        return new Value(this.value.add(other.value));
    }
    sub(other: Value): Value {
        return new Value(this.value.sub(other.value));
    }
    mul(other: Value): Value {
        return new Value(this.value.mul(other.value));
    }
    div(other: Value): Value {
        return new Value(this.value.div(other.value));
    }

    /* Trigonometric */
    sin(mode: "DEG" | "RAD"): Value {
        const rads =
            mode === "DEG"
                ? this.value.mul(Decimal.acos(-1).div(180))
                : this.value;
        return new Value(rads.sin());
    }
    cos(mode: "DEG" | "RAD"): Value {
        const rads =
            mode === "DEG"
                ? this.value.mul(Decimal.acos(-1).div(180))
                : this.value;
        return new Value(rads.cos());
    }
    tan(mode: "DEG" | "RAD"): Value {
        const rads =
            mode === "DEG"
                ? this.value.mul(Decimal.acos(-1).div(180))
                : this.value;
        return new Value(rads.tan());
    }
    asin(mode: "DEG" | "RAD"): Value {
        const result = this.value.asin();
        const rads =
            mode === "DEG"
                ? result.mul(180).div(Decimal.acos(-1))
                : result;
        return new Value(rads);
    }
    acos(mode: "DEG" | "RAD"): Value {
        const result = this.value.acos();
        const rads =
            mode === "DEG"
                ? result.mul(180).div(Decimal.acos(-1))
                : result;
        return new Value(rads);
    }
    atan(mode: "DEG" | "RAD"): Value {
        const result = this.value.atan();
        const rads =
            mode === "DEG"
                ? result.mul(180).div(Decimal.acos(-1))
                : result;
        return new Value(rads);
    }

    /* Indicies */
    sqrt(): Value {
        return new Value(this.value.sqrt());
    }
    cbrt(): Value {
        return new Value(this.value.cbrt());
    }
    x_root(other: Value): Value {
        return new Value(this.value.pow(new Decimal(1).div(other.value)));
    }
    pow(other: Value): Value {
        return new Value(this.value.pow(other.value));
    }
    square(): Value {
        return new Value(this.value.pow(2));
    }
    cube(): Value {
        return new Value(this.value.pow(3));
    }
    inverse(): Value {
        return new Value(this.value.pow(-1));
    }
    log_x(base: Value): Value {
        return new Value(this.value.log(base.value));
    }
    ln(): Value {
        return new Value(this.value.ln());
    }
    log(): Value {
        return new Value(this.value.log(10));
    }

    /* Others */
    abs(): Value {
        return new Value(this.value.abs());
    }
    negated(): Value {
        return new Value(this.value.negated());
    }
    toRadians(): Value {
        return new Value(this.value.mul(Decimal.acos(-1).div(180)));
    }
    factorial(): Value {
        if (this.value.lessThan(0))
            throw new Error("Factorial is not defined for negative numbers.");
        if (this.value.greaterThan(69))
            throw new Error("Factorial is too large to compute."); // 70! exceeds 1e100.
        return new Value(dMath.factorial(this.value));
    }
    percent(): Value {
        return new Value(this.value.div(100));
    }
    permutation(other: Value): Value {
        if (other.greaterThan(this))
            throw new Error("Permutation is not defined for negative numbers.");
        return new Value(dMath.permutation(this.value, other.value));
    }
    combination(other: Value): Value {
        if (other.greaterThan(this))
            throw new Error("Combination is not defined for negative numbers.");
        return new Value(dMath.combination(this.value, other.value));
    }
    exp(other: Value): Value {
        return this.mul(Value.from(10).pow(other));
    }

    /* Display */
    toString(): string {
        if (this.value.lt(1) && this.value.gt(-1))
            return this.value.toPrecision(8).toString();
        return this.value.toPrecision(10).toString();
    }
}
