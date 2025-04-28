export default function initiateRecord<K extends string | number | symbol, V>(
    keyValues: K[],
    initialValue: V
) {
    const record = {} as Record<K, V>;
    for (const key of keyValues) {
        record[key] = initialValue;
    }
    return record as Record<K, V>;
}
