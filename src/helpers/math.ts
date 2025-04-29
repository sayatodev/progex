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