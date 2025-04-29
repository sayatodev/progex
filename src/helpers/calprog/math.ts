import Decimal from "decimal.js";

// export function factorial(n: Value): Value {
//     let result = new Decimal(1);
//     for (let i = 2; i < n.value.toNumber(); i++) {
//         result = result.mul(i);
//     }
//     return new Value(result);
// }

// export function permutation(n: Value, r: Value): Value {
//     if (lt(r, n)) return new Value(new Decimal(0));
//     return factorial(n).div(factorial(n.sub(r))).value;
// }

// export function combination(n: Value, r: Value): Value {
//     if (r > n) return 0;
//     return factorial(n) / (factorial(r) * factorial(n - r));
// }

export function factorial(n: Decimal): Decimal {
    if (n.lessThan(0))
        throw new Error("Factorial is not defined for negative numbers.");
    if (n.equals(0)) return new Decimal(1);
    if (n.greaterThan(69))
        throw new Error("Factorial is too large to compute."); // 70! exceeds 1e100.
    let result = new Decimal(1);
    for (let i = 2; i <= n.toNumber(); i++) {
        result = result.mul(i);
    }
    return result;
}

export function permutation(n: Decimal, r: Decimal): Decimal {
    if (r.greaterThan(n)) return new Decimal(0);
    return factorial(n).div(factorial(n.sub(r)));
}

export function combination(n: Decimal, r: Decimal): Decimal {
    if (r.greaterThan(n)) return new Decimal(0);
    return factorial(n).div(factorial(r).mul(factorial(n.sub(r))));
}
