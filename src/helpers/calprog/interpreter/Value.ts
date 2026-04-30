import Decimal from "decimal.js";
import * as dMath from "../math";

Decimal.set({
    precision: 15,
    maxE: 99,
    minE: -99,
    toExpNeg: -10,
    toExpPos: 10,
    rounding: Decimal.ROUND_FLOOR,
});

const COMPLEX_EPSILON = new Decimal("1e-12");

export class Value {
    value: Decimal;

    constructor(value: Decimal) {
        this.value = value;
    }

    static from(value: number | string | Decimal): Value {
        return new Value(value instanceof Decimal ? value : new Decimal(value));
    }

    clone(): Value {
        return new Value(new Decimal(this.value));
    }

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
        if (this.value.lessThan(0)) {
            throw new Error("Factorial is not defined for negative numbers.");
        }
        if (this.value.greaterThan(69)) {
            throw new Error("Factorial is too large to compute.");
        }
        return new Value(dMath.factorial(this.value));
    }

    percent(): Value {
        return new Value(this.value.div(100));
    }

    permutation(other: Value): Value {
        if (other.greaterThan(this)) {
            throw new Error("Permutation is not defined for negative numbers.");
        }
        return new Value(dMath.permutation(this.value, other.value));
    }

    combination(other: Value): Value {
        if (other.greaterThan(this)) {
            throw new Error("Combination is not defined for negative numbers.");
        }
        return new Value(dMath.combination(this.value, other.value));
    }

    exp(other: Value): Value {
        return this.mul(Value.from(10).pow(other));
    }

    round(): Value {
        return new Value(this.value.toDecimalPlaces(0, Decimal.ROUND_HALF_UP));
    }

    isZero(): boolean {
        return this.value.eq(0);
    }

    isInteger(): boolean {
        return this.value.isInteger();
    }

    toNumber(): number {
        return this.value.toNumber();
    }

    toString(): string {
        const displayDigits = this.value.abs().lt(1) ? 9 : 10;
        const guardDigits = displayDigits + 3;
        const normalized = this.value.toSignificantDigits(
            guardDigits,
            Decimal.ROUND_HALF_UP
        );
        return normalized.toPrecision(displayDigits).toString();
    }
}

export class ComplexValue {
    real: Value;
    imaginary: Value;

    constructor(real: Value, imaginary: Value) {
        this.real = real;
        this.imaginary = imaginary;
    }

    static fromReal(value: Value): ComplexValue {
        return new ComplexValue(value, Value.from(0));
    }

    clone(): ComplexValue {
        return new ComplexValue(this.real.clone(), this.imaginary.clone());
    }

    add(other: ComplexValue): ComplexValue {
        return new ComplexValue(
            this.real.add(other.real),
            this.imaginary.add(other.imaginary)
        );
    }

    sub(other: ComplexValue): ComplexValue {
        return new ComplexValue(
            this.real.sub(other.real),
            this.imaginary.sub(other.imaginary)
        );
    }

    mul(other: ComplexValue): ComplexValue {
        const ac = this.real.mul(other.real);
        const bd = this.imaginary.mul(other.imaginary);
        const ad = this.real.mul(other.imaginary);
        const bc = this.imaginary.mul(other.real);
        return new ComplexValue(ac.sub(bd), ad.add(bc));
    }

    div(other: ComplexValue): ComplexValue {
        const denominator = other.real.square().add(other.imaginary.square());
        const numerator = this.mul(other.conjugate());
        return new ComplexValue(
            numerator.real.div(denominator),
            numerator.imaginary.div(denominator)
        );
    }

    conjugate(): ComplexValue {
        return new ComplexValue(this.real.clone(), this.imaginary.negated());
    }

    abs(): Value {
        return this.real.square().add(this.imaginary.square()).sqrt();
    }

    argument(mode: "DEG" | "RAD"): Value {
        const angle = Decimal.atan2(
            this.imaginary.value,
            this.real.value
        );
        if (mode === "RAD") {
            return Value.from(angle);
        }
        return Value.from(angle.mul(180).div(Decimal.acos(-1)));
    }

    square(): ComplexValue {
        return this.mul(this);
    }

    cube(): ComplexValue {
        return this.mul(this).mul(this);
    }

    sqrt(): ComplexValue {
        if (this.imaginary.isZero()) {
            if (this.real.value.gte(0)) {
                return new ComplexValue(this.real.sqrt(), Value.from(0));
            }
            return new ComplexValue(
                Value.from(0),
                this.real.negated().sqrt()
            );
        }
        const r = this.abs();
        const half = Value.from(0.5);
        const realTerm = r.add(this.real).mul(half);
        const imagTerm = r.sub(this.real).mul(half);
        const normalizeNearZero = (value: Value): Value => {
            if (value.value.abs().lte(COMPLEX_EPSILON)) {
                return Value.from(0);
            }
            return value;
        };
        const real = normalizeNearZero(realTerm).sqrt();
        const imagMagnitude = normalizeNearZero(imagTerm).sqrt();
        const imaginary = this.imaginary.value.isNegative()
            ? imagMagnitude.negated()
            : imagMagnitude;
        return new ComplexValue(real, imaginary);
    }

    cbrt(): ComplexValue {
        const magnitude = this.abs().cbrt();
        const angle = this.argument("RAD").div(Value.from(3));
        return new ComplexValue(
            magnitude.mul(angle.cos("RAD")),
            magnitude.mul(angle.sin("RAD"))
        );
    }

    inverse(): ComplexValue {
        return ComplexValue.fromReal(Value.from(1)).div(this);
    }

    negated(): ComplexValue {
        return new ComplexValue(this.real.negated(), this.imaginary.negated());
    }

    isReal(): boolean {
        return this.imaginary.isZero();
    }

    equal(other: ComplexValue): boolean {
        return (
            this.real.equal(other.real) &&
            this.imaginary.equal(other.imaginary)
        );
    }

    notEqual(other: ComplexValue): boolean {
        return !this.equal(other);
    }

    toString(): string {
        if (this.imaginary.isZero()) {
            return this.real.toString();
        }
        const imag = this.imaginary.toString();
        const sign = this.imaginary.value.isNegative() ? "" : "+";
        return `${this.real.toString()}${sign}${imag}i`;
    }
}

export type RuntimeValue = Value | ComplexValue;

export function isComplexValue(value: RuntimeValue): value is ComplexValue {
    return value instanceof ComplexValue;
}

export function asComplex(value: RuntimeValue): ComplexValue {
    if (value instanceof ComplexValue) {
        return value;
    }
    return ComplexValue.fromReal(value);
}
