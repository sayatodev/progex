type ExecutionCardProps = {
    error: string | null;
    finalResult: string;
    finalResultLabel: string;
    outputs: string[];
    outputLabels: string[];
    emitFinalResult: boolean;
};

export default function ExecutionCard({
    error,
    finalResult,
    finalResultLabel,
    outputs,
    outputLabels,
    emitFinalResult,
}: ExecutionCardProps) {
    const finalResultAlreadyDisplayed =
        emitFinalResult &&
        outputs.length > 0 &&
        outputs[outputs.length - 1] === finalResult;

    return (
        <section className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Execution</h2>
            {error ? (
                <pre className="mt-4 overflow-x-auto p-4 rounded-md bg-red-50 text-sm text-red-700 border border-red-200">
                    {error}
                </pre>
            ) : (
                <>
                    <div className="mt-4 space-y-3">
                        {outputs.length ? (
                            outputs.map((output, index) => (
                                <div
                                    key={`${output}-${index}`}
                                    className="rounded-md border border-gray-200 bg-gray-50 p-3"
                                >
                                    <p className="text-xs text-gray-500">
                                        {outputLabels[index] ?? "Ans="}
                                    </p>
                                    <p className="mt-1 break-all text-sm text-gray-900">
                                        {output}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500">
                                Nothing has been displayed yet.
                            </p>
                        )}
                    </div>
                    {!finalResultAlreadyDisplayed && (
                        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">
                                {finalResultLabel}
                            </p>
                            <p className="mt-1 break-all text-sm text-gray-900">
                                {finalResult}
                            </p>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
