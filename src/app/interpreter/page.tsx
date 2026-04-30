"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";
import Footer from "../footer";
import {
    buildExampleConfig,
    DEFAULT_PROGRAM,
    EXAMPLES,
} from "./constants";
import type { ExecutionSnapshot, InterpreterExample } from "./types";
import {
    buildSnapshot,
    formatError,
    formatProgram,
    normalizeProgram,
} from "./runtime";
import Scanner from "@/helpers/calprog/interpreter/Scanner";
import type {
    AngleMode,
    ExecutionConfig,
    ExecutionMode,
    RegressionMode,
} from "@/helpers/calprog/interpreter/runtime";
import ExamplesCard from "./components/ExamplesCard";
import ExecutionCard from "./components/ExecutionCard";
import InputsCard from "./components/InputsCard";
import InterpreterHeader from "./components/InterpreterHeader";
import MemoryCard from "./components/MemoryCard";
import ProgramEditorCard from "./components/ProgramEditorCard";
import StatisticsCard from "./components/StatisticsCard";

export default function InterpreterPage() {
    const [program, setProgram] = useState<string>(DEFAULT_PROGRAM);
    const [inputs, setInputs] = useState<string[]>([]);
    const [executionMode, setExecutionMode] = useState<ExecutionMode>("AUTO");
    const [angleMode, setAngleMode] = useState<AngleMode>("DEG");
    const [frequencyEnabled, setFrequencyEnabled] = useState(false);
    const [regressionMode, setRegressionMode] = useState<RegressionMode | "NONE">(
        "NONE"
    );
    const [snapshot, setSnapshot] = useState<ExecutionSnapshot | null>(null);
    const [error, setError] = useState<string | null>(null);

    const deferredProgram = useDeferredValue(program);
    const deferredInputs = useDeferredValue(inputs);
    const deferredExecutionMode = useDeferredValue(executionMode);
    const deferredAngleMode = useDeferredValue(angleMode);
    const deferredFrequencyEnabled = useDeferredValue(frequencyEnabled);
    const deferredRegressionMode = useDeferredValue(regressionMode);

    useEffect(() => {
        try {
            const normalizedProgram = normalizeProgram(program);
            const inputLength = Scanner.getInputLength(
                new Scanner(normalizedProgram).scan()
            );
            setInputs((previous) =>
                Array.from({ length: inputLength }, (_, index) => {
                    return previous[index] ?? "0";
                })
            );
        } catch {
            setInputs((previous) => previous);
        }
    }, [program]);

    useEffect(() => {
        const config: ExecutionConfig = {
            executionMode: deferredExecutionMode,
            angleMode: deferredAngleMode,
            emitFinalResult: true,
            stats: {
                frequencyEnabled: deferredFrequencyEnabled,
                regressionMode:
                    deferredRegressionMode === "NONE"
                        ? null
                        : deferredRegressionMode,
            },
        };

        try {
            const nextSnapshot = buildSnapshot(
                deferredProgram,
                deferredInputs,
                config
            );
            startTransition(() => {
                setSnapshot(nextSnapshot);
                setError(null);
            });
        } catch (caughtError) {
            startTransition(() => {
                setSnapshot(null);
                setError(formatError(caughtError));
            });
        }
    }, [
        deferredAngleMode,
        deferredExecutionMode,
        deferredFrequencyEnabled,
        deferredInputs,
        deferredProgram,
        deferredRegressionMode,
    ]);

    function handleInputChange(index: number, value: string): void {
        setInputs((previous) => {
            const next = [...previous];
            next[index] = value;
            return next;
        });
    }

    function handleExampleSelect(example: InterpreterExample): void {
        const nextConfig = buildExampleConfig(example.config);
        setProgram(example.program);
        setInputs(example.inputs);
        setExecutionMode(nextConfig.executionMode);
        setAngleMode(nextConfig.angleMode);
        setFrequencyEnabled(nextConfig.frequencyEnabled);
        setRegressionMode(nextConfig.regressionMode);
    }

    function handleFormatProgram(): void {
        setProgram((previous) => formatProgram(previous));
    }

    return (
        <main className="flex min-h-screen flex-col items-center gap-5 p-4 md:p-24">
            <div className="w-full max-w-7xl">
                <Link href="/">Back</Link>
            </div>

            <InterpreterHeader
                executionMode={snapshot?.executionMode ?? executionMode}
                angleMode={snapshot?.angleMode ?? angleMode}
            />

            <ExamplesCard
                examples={EXAMPLES}
                onSelect={handleExampleSelect}
                onFormat={handleFormatProgram}
            />

            <div className="grid w-full max-w-7xl gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
                <ProgramEditorCard
                    program={program}
                    tokenCount={snapshot?.tokenCount ?? 0}
                    executionMode={executionMode}
                    angleMode={angleMode}
                    regressionMode={regressionMode}
                    frequencyEnabled={frequencyEnabled}
                    onProgramChange={setProgram}
                    onExecutionModeChange={setExecutionMode}
                    onAngleModeChange={setAngleMode}
                    onRegressionModeChange={setRegressionMode}
                    onFrequencyEnabledChange={setFrequencyEnabled}
                />

                <div className="grid gap-6">
                    <InputsCard
                        inputs={inputs}
                        inputLabels={snapshot?.inputLabels ?? []}
                        onInputChange={handleInputChange}
                    />
                    <ExecutionCard
                        error={error}
                        finalResult={snapshot?.finalResult ?? "0"}
                        finalResultLabel={snapshot?.finalResultLabel ?? "Ans="}
                        outputs={snapshot?.outputs ?? []}
                        outputLabels={snapshot?.outputLabels ?? []}
                        emitFinalResult={true}
                    />
                </div>
            </div>

            <div className="grid w-full max-w-7xl gap-6 lg:grid-cols-2">
                <MemoryCard
                    variables={snapshot?.variables ?? []}
                    remainingInputs={snapshot?.remainingInputs ?? []}
                />
                <StatisticsCard
                    stats={
                        snapshot?.stats ?? {
                            frequencyEnabled,
                            regressionMode:
                                regressionMode === "NONE"
                                    ? null
                                    : regressionMode,
                            data: [],
                        }
                    }
                />
            </div>
            <Footer />
        </main>
    );
}
