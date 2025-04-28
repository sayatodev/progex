"use client";

import Parser from "@/helpers/calprog/interpreter/Parser";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import { useState } from "react";

export function getStaticProps() {
    return {
        // Return 404 in production build
        notfound: process.env.NODE_ENV === "production",
    }
}

function debug() {
    const program = "5×-44×(B×C)×(π┘2)";
    console.log("Parsing", program);
    const tokens = new Scanner(program).scan();
    console.log("Tokens:", tokens);
    const parser = new Parser(tokens);
    const expression = parser.parse();
    console.log(`${expression}`);
}

export default function DebugPage() {
    setTimeout(debug, 500);
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
                <LogsViewer logCallback={logCallback} debugCallback={debugCallback} />
            </div>
        </div>
    );
}

function LogsViewer({logCallback, debugCallback}: {logCallback?: (message: string) => void, debugCallback?: (message: string) => void}) {
    const [logs, setLogs] = useState<string[]>([]);
    console.log = (...messages) => {
        const logMessage = messages.join(" ");
        setLogs((prevLogs: string[]) => [...prevLogs, logMessage]);
        logCallback?.(logMessage);
    };
    console.debug = (...messages) => {
        const logMessage = messages.join(" ");
        setLogs((prevLogs: string[]) => [...prevLogs, "[DEBUG] " + logMessage]);
        debugCallback?.(logMessage);
    }
    return (
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {logs.map((log, index) => (
                <div key={index}>{log}</div>
            ))}
        </pre>
    );
}
