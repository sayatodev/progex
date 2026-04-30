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
    assert.equal(formatted, "? → A:\n? → B:\nA + B ◢");
});

runTest("formatProgram preserves an existing colon terminator at line end", () => {
    const formatted = formatProgram("?→A:\n?→B:\nA+B◢");
    assert.equal(formatted, "? → A:\n? → B:\nA + B ◢");
});

runTest("formatProgram adds spaces around control-flow and comparison tokens", () => {
    const formatted = formatProgram("For 1→A To 10 Step 2:A≥3=>A◢");
    assert.equal(formatted, "For 1 → A To 10 Step 2:\nA ≥ 3 => A ◢");
});

runTest("formatProgram adds a newline after display tokens", () => {
    const formatted = formatProgram("?→A:A + 3◢B + 4");
    assert.equal(formatted, "? → A:\nA + 3 ◢\nB + 4");
});

runTest("formatProgram does not insert a colon after display-ended lines", () => {
    const once = formatProgram("?→A:A+3◢B+4");
    const twice = formatProgram(once);

    assert.equal(once, "? → A:\nA + 3 ◢\nB + 4");
    assert.equal(twice, once);
    assert.ok(!twice.includes("◢:"));
});

runTest("formatProgram adds spaces around assignment operators", () => {
    const formatted = formatProgram("A+3→M");
    assert.equal(formatted, "A + 3 → M");
});

runTest("formatProgram adds one space after comma and semicolon", () => {
    const formatted = formatProgram("X,Y;5DT");
    assert.equal(formatted, "X, Y; 5DT");
});

runTest("formatProgram keeps unary leading minus compact at expression start", () => {
    const formatted = formatProgram("Pol(A-C,B-D)◢-2A◢-2B");
    assert.equal(formatted, "Pol(A - C, B - D) ◢\n-2A ◢\n-2B");
});

runTest("formatProgram keeps unary minus compact after parenthesis and arithmetic operators", () => {
    const formatted = formatProgram("(-M):(A┘-2):(B×-3):(C÷-4):(D+-5)");
    assert.equal(formatted, "(-M):\n(A ┘-2):\n(B ×-3):\n(C ÷-4):\n(D +-5)");
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

    assert.equal(formatted, "? → A:\n? → B:\nA + B ◢");
    assert.equal(reconstructed, formatted);
    assert.ok(!reconstructed.includes("::"));
});

runTest("tokenizeCalculatorProgram colors matching function closing parenthesis as function", () => {
    const segments = tokenizeCalculatorProgram("Pol(A-C,B-D)");
    const closing = segments.findLast((segment) => segment.text === ")");

    assert.ok(closing);
    assert.equal(closing.kind, "function");
});

runTest("WebCal 4_centre_circle sample executes with expected outputs", () => {
    const snapshot = buildSnapshot(
        "FreqOn:?→A:?→B:?→C:?→D:?→X:?→Y:X,Y;Pol(A-C,B-D)DT:Pol(C-maxX,D-maxY):√((A-maxX)²+(B-maxY)²→Y:(AX+CY+Σx)┘(X+Y+n)◢(BX+DY+Σy)┘(X+Y+n)◢(A+C+maxX)┘3◢(B+D+maxY)┘3◢(maxX-A)┘(B-maxY)→M:D-MC→X:(C-A)┘(B-D):(maxY-AnsmaxX-X)┘(M-Ans)→Y◢YM+X→M◢(A+C+maxX-Y)┘2→A◢(B+D+maxY-M)┘2→B◢Pol(A-C,B-D)◢-2A◢-2B◢A²+B²-X²",
        ["4", "3", "0", "0", "4", "0"],
        { executionMode: "REG", emitFinalResult: true }
    );

    assert.deepEqual(snapshot.outputs, [
        "3.000000000",
        "1.000000000",
        "2.666666666",
        "1.000000000",
        "4.000000000",
        "0.00000000",
        "2.000000000",
        "1.500000000",
        "2.500000000",
        "-4.000000000",
        "-3.000000000",
        "0.00000000",
    ]);
});

if (failures > 0) {
    process.exitCode = 1;
}
