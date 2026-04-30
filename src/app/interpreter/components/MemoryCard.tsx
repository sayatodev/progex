import type { VariableSnapshot } from "../types";

type MemoryCardProps = {
    variables: VariableSnapshot[];
    remainingInputs: string[];
};

export default function MemoryCard({
    variables,
    remainingInputs,
}: MemoryCardProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Memory</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {variables.map((entry) => (
                    <div
                        key={entry.name}
                        className="rounded-md border border-gray-200 bg-gray-50 p-3"
                    >
                        <p className="text-xs text-gray-500">{entry.name}</p>
                        <p className="mt-2 break-all font-semibold text-gray-900">
                            {entry.value}
                        </p>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-sm text-gray-500">
                Remaining queued inputs:{" "}
                {remainingInputs.length > 0 ? remainingInputs.join(", ") : "none"}
            </p>
        </section>
    );
}
