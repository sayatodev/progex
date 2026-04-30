import Editor from "react-simple-code-editor";
import styles from "@/app/styles.module.css";
import { highlightCalculatorProgram } from "@/helpers/calprog/interpreter/highlight";
import type {
    AngleMode,
    ExecutionMode,
    RegressionMode,
} from "@/helpers/calprog/interpreter/runtime";
import {
    ANGLE_MODES,
    editorHighlightClasses,
    EXECUTION_MODES,
    REGRESSION_MODES,
} from "../constants";

type ProgramEditorCardProps = {
    program: string;
    tokenCount: number;
    executionMode: ExecutionMode;
    angleMode: AngleMode;
    regressionMode: RegressionMode | "NONE";
    frequencyEnabled: boolean;
    onProgramChange: (value: string) => void;
    onExecutionModeChange: (value: ExecutionMode) => void;
    onAngleModeChange: (value: AngleMode) => void;
    onRegressionModeChange: (value: RegressionMode | "NONE") => void;
    onFrequencyEnabledChange: (value: boolean) => void;
};

export default function ProgramEditorCard({
    program,
    tokenCount,
    executionMode,
    angleMode,
    regressionMode,
    frequencyEnabled,
    onProgramChange,
    onExecutionModeChange,
    onAngleModeChange,
    onRegressionModeChange,
    onFrequencyEnabledChange,
}: ProgramEditorCardProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-gray-800">Program</h2>
                <span className="text-sm text-gray-500">{tokenCount} tokens</span>
            </div>
            <div className="mt-4 overflow-hidden rounded-md border border-gray-300 bg-stone-950 shadow-inner">
                <Editor
                    value={program}
                    onValueChange={onProgramChange}
                    highlight={(code) =>
                        highlightCalculatorProgram(code, editorHighlightClasses)
                    }
                    padding={16}
                    textareaClassName={`${styles.firacode} outline-none`}
                    preClassName={`${styles.firacode} min-h-[24rem] leading-7`}
                    className={`${styles.firacode} min-h-[24rem] text-sm text-amber-50`}
                    spellCheck={false}
                    insertSpaces={false}
                    tabSize={4}
                    style={{
                        fontFamily: '"Fira Code", monospace',
                        fontSize: 14,
                        minHeight: "24rem",
                        backgroundColor: "#0c0a09",
                        color: "#fef3c7",
                    }}
                />
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <label className="text-sm text-gray-700">
                    <span className="mb-1 block font-semibold">
                        Execution mode
                    </span>
                    <select
                        value={executionMode}
                        onChange={(event) =>
                            onExecutionModeChange(
                                event.target.value as ExecutionMode
                            )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        {EXECUTION_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="text-sm text-gray-700">
                    <span className="mb-1 block font-semibold">Angle mode</span>
                    <select
                        value={angleMode}
                        onChange={(event) =>
                            onAngleModeChange(event.target.value as AngleMode)
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        {ANGLE_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </label>
                <label className="text-sm text-gray-700">
                    <span className="mb-1 block font-semibold">Regression</span>
                    <select
                        value={regressionMode}
                        onChange={(event) =>
                            onRegressionModeChange(
                                event.target.value as RegressionMode | "NONE"
                            )
                        }
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        {REGRESSION_MODES.map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-6 text-sm text-gray-700">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={frequencyEnabled}
                        onChange={(event) =>
                            onFrequencyEnabledChange(event.target.checked)
                        }
                    />
                    Seed `FreqOn`
                </label>
            </div>
        </section>
    );
}
