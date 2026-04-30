import { strict as assert } from "node:assert";
import { Interpreter } from "../src/helpers/calprog/interpreter/Interpreter";
import Parser from "../src/helpers/calprog/interpreter/Parser";
import Scanner from "../src/helpers/calprog/interpreter/Scanner";
import type { ExecutionConfig } from "../src/helpers/calprog/interpreter/runtime";

type TestCase = {
    name: string;
    sourceUrl: string;
    program: string;
    inputs: string[];
    expectedOutputs: string[];
    config?: ExecutionConfig;
};

function runProgram(
    program: string,
    inputs: string[],
    config: ExecutionConfig = {}
): string[] {
    const tokens = new Scanner(program).scan();
    const statements = new Parser(tokens).parse();
    const outputs: string[] = [];

    const interpreter = new Interpreter();
    interpreter.environment.config({
        inputs,
        displayCallback: (value) => outputs.push(value.toString()),
        ...config,
    });
    interpreter.interpret(statements);

    return outputs;
}

const testCases: TestCase[] = [
    {
        name: "WebCal division_1 sample 2x^4 + x^3 + 3x^2 + 4x + 5 over x + 2",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/division_1.htm",
        program:
            "?→A:?→B:?→C:?→D:?→X:?→Y:?→M:M┘Y→M:A┘Y→A◢B┘Y-AnsM→B◢C┘Y-AnsM→C◢D┘Y-AnsM→D◢X-AnsYM→X",
        inputs: ["2", "1", "3", "4", "5", "1", "2"],
        expectedOutputs: [
            "2.000000000",
            "-3.000000000",
            "9.000000000",
            "-14.00000000",
        ],
    },
    {
        name: "WebCal simultaneous1 sample solves a 2x2 linear system",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/simultaneous1.htm",
        program:
            "?→A:?→B:?→C:?→D:?→X:?→Y:AX-DB→M:M⁻¹(CX-YB→X◢M⁻¹(AY-DC→Y",
        inputs: ["1", "1", "7", "1", "-1", "1"],
        expectedOutputs: ["4.000000000"],
        config: { executionMode: "COMP" },
    },
    {
        name: "WebCal trapezoidal sample integrates ln(x) from 1 to 2 with 10 intervals",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/trapezoidal.htm",
        program:
            "ClrMemory:?→X:?→Y:?→A:A⁻¹(Y-X→Y:For 0→B To A:ln(X:Ans-.5Ans(B²=BA)M+:X+Y→X:Next:YM",
        inputs: ["1", "2", "10"],
        expectedOutputs: ["0.385877936"],
        config: { executionMode: "COMP", emitFinalResult: true },
    },
    {
        name: "WebCal four_centre variant computes centers and circumcircle coefficients",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/four_centre.htm",
        program:
            "FreqOn:?→A:?→B:?→C:?→D:?→X:?→Y:X,Y;Pol(A-C,B-D)DT:Pol(C-maxX,D-maxY):√((A-maxX)²+(B-maxY)²→Y:(AX+CY+Σx)┘(X+Y+n)◢(BX+DY+Σy)┘(X+Y+n)◢(A+C+maxX)┘3◢(B+D+maxY)┘3◢(maxX-A)┘(B-maxY)→M:D-MC→X:(C-A)┘(B-D):(maxY-AnsmaxX-X)┘(M-Ans)→Y◢YM+X→M◢(A+C+maxX-Y)┘2→A◢(B+D+maxY-M)┘2→B◢Pol(A-C,B-D)◢-2A◢-2B◢A²+B²-X²",
        inputs: ["4", "3", "0", "0", "4", "0"],
        expectedOutputs: [
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
        ],
        config: { executionMode: "REG" },
    },
    {
        name: "REG data-entry primitives support weighted two-variable statistics",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/four_centre.htm",
        program: "ClrStat:FreqOn:1,2;5DT:maxX◢maxY◢Σx◢Σy◢n",
        inputs: [],
        expectedOutputs: [
            "1.000000000",
            "2.000000000",
            "5.000000000",
            "10.00000000",
        ],
        config: { executionMode: "REG" },
    },
    {
        name: "Assignment closes open grouping before applying statement-level store",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/trapezoidal.htm",
        program: "?→X:?→Y:?→A:A⁻¹(Y-X→Y:Y",
        inputs: ["1", "2", "10"],
        expectedOutputs: ["0.100000000"],
        config: { executionMode: "COMP", emitFinalResult: true },
    },
    {
        name: "DT semicolon closes the y expression before frequency",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/four_centre.htm",
        program: "ClrStat:FreqOn:1,2;5DT:Σx◢Σy◢n◢maxX◢maxY◢",
        inputs: [],
        expectedOutputs: [
            "5.000000000",
            "10.00000000",
            "5.000000000",
            "1.000000000",
            "2.000000000",
        ],
        config: { executionMode: "REG" },
    },
    {
        name: "Standalone M+ closes an omitted-parenthesis expression before memory update",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/cubic_equations.htm",
        program:
            "?→A:?→B:?→C:?→D:9A(BC-3AD)┘2-B³→M:√(M²+(3AC-B²)³M+:M",
        inputs: ["1", "0", "0", "-1"],
        expectedOutputs: ["27.00000000"],
        config: { executionMode: "COMP", emitFinalResult: true },
    },
    {
        name: "WebCal cubic sample returns three real roots for 2x^3-x^2-72x+36",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/cubic_equations.htm",
        program:
            "?→A:?→B:?→C:?→D:9A(BC-3AD)┘2-B³→M:√(M²+(3AC-B²)³M+:IfAns=Conjg(Ans:Then∛(M)+∛(M -2Ans:Else2∛(Abs(M))cos(3⁻¹arg(M:IfEnd:(Ans-B)┘(3A◢-B┘A-Ans→M:M┘2:Ans+√(-3Ans²-BM┘A-C┘AM-◢M",
        inputs: ["2", "-1", "-72", "36"],
        expectedOutputs: ["6.000000000", "0.500000000", "-6.000000000"],
        config: { executionMode: "COMP", emitFinalResult: true },
    },
    {
        name: "Cubic discriminant sqrt remains finite for 2x^3-x^2-72x+36",
        sourceUrl: "https://webcal.freetzi.com/casio.fx-50FH/cubic_equations.htm",
        program: "?→A:?→B:?→C:?→D:9A(BC-3AD)┘2-B³→M:√(M²+(3AC-B²)³◢",
        inputs: ["2", "-1", "-72", "36"],
        expectedOutputs: ["0.00000000+8916.597557i"],
        config: { executionMode: "COMP" },
    },
];

let failures = 0;

for (const testCase of testCases) {
    try {
        const actual = runProgram(
            testCase.program,
            testCase.inputs,
            testCase.config
        );
        assert.deepEqual(
            actual,
            testCase.expectedOutputs,
            `${testCase.name} failed.\nSource: ${testCase.sourceUrl}\nExpected: ${JSON.stringify(
                testCase.expectedOutputs
            )}\nActual: ${JSON.stringify(actual)}`
        );
        console.log(`PASS ${testCase.name}`);
    } catch (error) {
        failures++;
        console.error(`FAIL ${testCase.name}`);
        console.error(error);
    }
}

if (failures > 0) {
    process.exitCode = 1;
} else {
    console.log(`Passed ${testCases.length} WebCal interpreter test(s).`);
}
