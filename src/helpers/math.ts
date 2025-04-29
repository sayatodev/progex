export function factorial(n: number): number {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

export function permutation(n: number, r: number): number {
    if (r > n) return 0;
    return factorial(n) / factorial(n - r);
}

export function combination(n: number, r: number): number {
    if (r > n) return 0;
    return factorial(n) / (factorial(r) * factorial(n - r));
}

export function sin(setup: "RAD" | "DEG", angle: number): number {
    if (setup === "RAD") return Math.sin(angle);
    return Math.sin((angle * Math.PI) / 180);
}

export function cos(setup: "RAD" | "DEG", angle: number): number {
    if (setup === "RAD") return Math.cos(angle);
    return Math.cos((angle * Math.PI) / 180);
}

export function tan(setup: "RAD" | "DEG", angle: number): number {
    if (setup === "RAD") return Math.tan(angle);
    return Math.tan((angle * Math.PI) / 180);
}

export function arcsin(setup: "RAD" | "DEG", value: number): number {
    if (setup === "RAD") return Math.asin(value);
    return (Math.asin(value) * 180) / Math.PI;
}

export function arccos(setup: "RAD" | "DEG", value: number): number {
    if (setup === "RAD") return Math.acos(value);
    return (Math.acos(value) * 180) / Math.PI;
}

export function arctan(setup: "RAD" | "DEG", value: number): number {
    if (setup === "RAD") return Math.atan(value);
    return (Math.atan(value) * 180) / Math.PI;
}

export function log(value: number): number; // Default log base 10
export function log(base: number, value: number): number;
export function log(arg1: number, arg2?: number) {
    if (arg2 === undefined) return Math.log10(arg1);
    return Math.log(arg2) / Math.log(arg1);
}

export function ln(value: number): number {
    return Math.log(value);
}

export function sqrt(value: number): number {
    return Math.sqrt(value);
}
