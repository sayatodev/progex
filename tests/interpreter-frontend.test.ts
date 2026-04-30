import { strict as assert } from "node:assert";
import { buildSnapshot, formatProgram } from "../src/app/interpreter/runtime";
import { tokenizeCalculatorProgram } from "../src/helpers/calprog/interpreter/highlight";

let failures = 0;

function runTest(name: string, fn: () => void): void {
    try {
        fn();
        console.log(`PASS ${name}`);
    } catch (error) {
        failures++;
        console.error(`FAIL ${name}`);
        console.error(error);
    }
}

runTest("formatProgram splits colon-delimited statements onto separate lines", () => {
    const formatted = formatProgram("?→A:?→B:A+B◢");
    assert.equal(formatted, "?→A:\n?→B:\nA+B◢");
});

runTest("formatProgram preserves an existing colon terminator at line end", () => {
    const formatted = formatProgram("?→A:\n?→B:\nA+B◢");
    assert.equal(formatted, "?→A:\n?→B:\nA+B◢");
});

runTest("buildSnapshot appends the last expression label for emitFinalResult", () => {
    const snapshot = buildSnapshot("?→A:A+3→M", ["2"], {
        emitFinalResult: true,
    });

    assert.deepEqual(snapshot.outputs, ["5.000000000"]);
    assert.deepEqual(snapshot.outputLabels, ["A+3→M="]);
    assert.equal(snapshot.finalResultLabel, "A+3→M=");
});

runTest("buildSnapshot keeps explicit display labels and final result label", () => {
    const snapshot = buildSnapshot("?→A:A+3◢:A+4", ["2"], {
        emitFinalResult: true,
    });

    assert.deepEqual(snapshot.outputs, ["5.000000000", "6.000000000"]);
    assert.deepEqual(snapshot.outputLabels, ["A+3◢=", "A+4="]);
    assert.equal(snapshot.finalResultLabel, "A+4=");
});

runTest("tokenizeCalculatorProgram preserves formatted colons without duplicating them", () => {
    const formatted = formatProgram("?→A:?→B:A+B◢");
    const reconstructed = tokenizeCalculatorProgram(formatted)
        .map((segment) => segment.text)
        .join("");

    assert.equal(formatted, "?→A:\n?→B:\nA+B◢");
    assert.equal(reconstructed, formatted);
    assert.ok(!reconstructed.includes("::"));
});

if (failures > 0) {
    process.exitCode = 1;
}
