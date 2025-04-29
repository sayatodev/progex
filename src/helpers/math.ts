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
