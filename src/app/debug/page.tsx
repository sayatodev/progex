"use client";

import { RuntimeError } from "@/helpers/calprog/interpreter/Errors";
import { Interpreter } from "@/helpers/calprog/interpreter/Interpreter";
import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { useEffect, useState } from "react";

function debug(program: string, inputs: string[] = []) {
    console.clear();
    for (const input of inputs) {
        program = program.replace("?", input);
    }
    console.log("Parsing", program);

    try {
        const tokens = new Scanner(program).scan();
        console.debug("Tokens", tokens);

        const parser = new Parser(tokens);
        const expression = parser.parse();

        const interpreter = new Interpreter();
        interpreter.interpret(expression);

        console.log("Debugging complete.");
    } catch (error) {
        if (error instanceof RuntimeError)
            console.error(`Error during debugging: ${error}`);
        else console.error("Error during debugging:", error);
    }
}

export default function DebugPage() {
    const [program, setProgram] = useState<string>(
        "?→A:?→B:?→C:?→D:?→X:?→Y:AX-DB→M:(CX-YB)┘M→X◢(AY-DC)┘M→Y"
    );
    const [inputs, setInputs] = useState<string[]>([]);

    useEffect(() => debug(program, inputs), [program, inputs]);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Debug Page
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
                This is a debug page for the calculator program.
            </p>
            <div className="mt-8 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto h-96">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Program
                </h2>
                <textarea
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full h-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="mt-4 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                    Inputs
                </h2>
                <input
                    type="text"
                    placeholder="1,2,3"
                    onChange={(e) => setInputs(e.target.value.split(","))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
        </div>
    );
}
