"use client";

import { Interpreter } from "@/helpers/calprog/interpreter/Interpreter";
import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

function debug() {
    // const program = "5×-44×(B×C)×(π┘2)";
    const program = "5×-44×(.5┘2)";
    console.log("Parsing", program);
    const tokens = new Scanner(program).scan();
    console.log("Tokens:", tokens);
    const parser = new Parser(tokens);
    const expression = parser.parse();
    console.log(`${expression}`);
    if (!expression) {
        console.debug("No expression found.");
        throw new Error("No expression found.");
    }
    const interpreter = new Interpreter();
    const result = interpreter.interpret(expression);
    console.log("Result:", result);
    console.log("Debugging complete.");
}

export default function DebugPage() {
    if (process.env.NODE_ENV !== "development") notFound();
    useEffect(() => {
        setTimeout(debug, 500);
    }, []);
    const logCallback = console.log;
    const debugCallback = console.debug;
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
                    Logs
                </h2>
                <LogsViewer
                    logCallback={logCallback}
                    debugCallback={debugCallback}
                />
            </div>
        </div>
    );
}

function LogsViewer({
    logCallback,
    debugCallback,
}: {
    logCallback?: (message: string) => void;
    debugCallback?: (message: string) => void;
}) {
    const [logs, setLogs] = useState<string[]>([]);
    const [level, setLevel] = useState<"log" | "debug">("log");
    console.log = (...messages) => {
        const logMessage = messages.join(" ");
        setLogs((prevLogs: string[]) => [...prevLogs, logMessage]);
        logCallback?.(logMessage);
    };
    console.debug = (...messages) => {
        const logMessage = messages.join(" ");
        setLogs((prevLogs: string[]) => [...prevLogs, "[DEBUG] " + logMessage]);
        debugCallback?.(logMessage);
    };
    useEffect(() => {
        setLogs([]); // Clear logs on mount
    }, []);
    return (
        <div className="flex flex-col">
            <div className="flex items-center mb-4">
                <label className="mr-2 text-gray-600 dark:text-gray-400">
                    Log Level:
                </label>
                <select
                    value={level}
                    onChange={(e) =>
                        setLevel(e.target.value as "log" | "debug")
                    }
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="log">Log</option>
                    <option value="debug">Debug</option>
                </select>
            </div>
            <div className="overflow-y-auto h-full">
                {logs
                    .filter((i) => {
                        if (level === "log") return !i.startsWith("[DEBUG]");
                        return true;
                    })
                    .map((log, index) => (
                        <p
                            key={index}
                            className="text-gray-800 dark:text-white"
                        >
                            {log}
                        </p>
                    ))}
            </div>
        </div>
    );
}
