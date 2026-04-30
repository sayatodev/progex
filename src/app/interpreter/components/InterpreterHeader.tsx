import type { AngleMode, ExecutionMode } from "@/helpers/calprog/interpreter/runtime";

type InterpreterHeaderProps = {
    executionMode: ExecutionMode;
    angleMode: AngleMode;
};

export default function InterpreterHeader({
    executionMode,
    angleMode,
}: InterpreterHeaderProps) {
    return (
        <div className="w-full max-w-7xl text-center">
            <h1 className="text-4xl font-bold">Progex Interpreter (Beta)</h1>
            <p className="mt-3 text-base text-gray-700">
                Write and debug your own calculator programs
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-600">
                <span>Mode: {executionMode}</span>
                <span>Angle: {angleMode}</span>
            </div>
        </div>
    );
}
