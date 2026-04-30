type InputsCardProps = {
    inputs: string[];
    inputLabels: string[];
    onInputChange: (index: number, value: string) => void;
};

export default function InputsCard({
    inputs,
    inputLabels,
    onInputChange,
}: InputsCardProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Inputs</h2>
            <div className="mt-4 space-y-3">
                {inputs.length ? (
                    inputs.map((value, index) => (
                        <label
                            key={index}
                            className="block text-sm text-gray-700"
                        >
                            <span className="mb-1 block text-xs text-gray-500">
                                {inputLabels[index] ?? `Input ${index + 1}=`}
                            </span>
                            <input
                                type="text"
                                value={value}
                                onChange={(event) =>
                                    onInputChange(index, event.target.value)
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </label>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No `?` tokens were detected in the current program.
                    </p>
                )}
            </div>
        </section>
    );
}
