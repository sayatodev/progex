"use client";

import { RuntimeError } from "@/helpers/calprog/interpreter/Errors";
import { Interpreter } from "@/helpers/calprog/interpreter/Interpreter";
import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { Value } from "@/helpers/calprog/interpreter/Value";
import { useEffect, useState } from "react";
import Footer from "../footer";
import Link from "next/link";

import styles from "@/app/styles.module.css";

function runProgram(
    program: string,
    inputs: string[] = [],
    displayCallback: (result: Value) => void
) {
    console.debug("Parsing", program);

    const tokens = new Scanner(program).scan();
    console.debug("Tokens", tokens);

    const parser = new Parser(tokens);
    const statements = parser.parse();
    console.debug("Expression", statements);

    const interpreter = new Interpreter();
    interpreter.environment.config({
        inputs,
        displayCallback,
    });

    interpreter.interpret(statements);
}

export default function DebugPage() {
    const [program, setProgram] = useState<string>(
        "?→A:?→B:?→C:?→D:?→X:?→Y:AX-DB→M:(CX-YB)┘M→X◢(AY-DC)┘M→Y"
    );
    const [inputs, setInputs] = useState<string[]>([]);
    const [results, setResults] = useState<Value[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setResults([]); // Clear previous results
        setError(null); // Clear previous errors
        try {
            runProgram(
                program.replaceAll("\n", ""),
                inputs,
                (result: Value) => {
                    setResults((prevResults) => [...prevResults, result]);
                }
            );
        } catch (error) {
            if (error instanceof RuntimeError) {
                setError(
                    `${error.name}: ${error.message}\n` +
                        `at Segment ${error.token?.segment ?? "unknown"}` +
                        `(${error.token?.lexeme})`
                );
            } else {
                setError(`${error}`);
            }
        }
    }, [program, inputs]);

    useEffect(() => {
        try {
            const tokens = new Scanner(program.replaceAll("\n", "")).scan();
            const inputLength = Scanner.getInputLength(tokens);

            setInputs(Array(inputLength).fill(0));
        } catch (error) {
            console.warn("Failed to initialize inputs:", error);
        }
    }, [program]);

    return (
        <main className="flex min-h-screen flex-col items-center gap-5 p-4 md:p-24">
            <Link href="/">Back</Link>
            <h1 className="text-4xl font-bold text-center">
                Progex Interpreter (Beta)
            </h1>

            <div className="flex flex-row w-full flex-wrap mt-4 gap-2">
                <div className="min-w-full md:min-w-0 flex-7 mt-4 flex flex-col min-h-[25em] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 font-mono">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Program
                    </h2>
                    <textarea
                        value={program}
                        onChange={(e) => setProgram(e.target.value)}
                        className={`${styles.firacode} w-full h-full p-2 border border-gray-300 rounded-md font-mono`}
                    />
                </div>
                <div className="flex-3 mt-4 max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Inputs
                    </h2>
                    {inputs.map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            value={inputs[index]}
                            placeholder={`Input ${index + 1}`}
                            onChange={(e) => {
                                const newInputs = [...inputs];
                                newInputs[index] = e.target.value;
                                setInputs(newInputs);
                            }}
                            className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />
                    ))}
                </div>
                <div className="min-w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-y-auto h-[25em]">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        Results
                    </h2>
                    <ul className="">
                        {results.map((result, index) => (
                            <li key={index} className="mb-2">
                                {result.toString().replace(/\.?0+$/, "")}
                            </li>
                        ))}
                        {error && <li className="text-red-500">{error}</li>}
                    </ul>
                </div>
            </div>
            <Footer />
        </main>
    );
}
