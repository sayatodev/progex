import type { InterpreterExample } from "../types";

type ExamplesCardProps = {
    examples: InterpreterExample[];
    onSelect: (example: InterpreterExample) => void;
    onFormat: () => void;
};

export default function ExamplesCard({
    examples,
    onSelect,
    onFormat,
}: ExamplesCardProps) {
    return (
        <section className="w-full max-w-7xl bg-white rounded-lg shadow-md p-4">
            <div className="flex flex-wrap items-end gap-4">
                <label className="min-w-[16rem] text-sm text-gray-700">
                    <span className="mb-1 block font-semibold">Template</span>
                    <select
                        defaultValue=""
                        onChange={(event) => {
                            const selected = examples.find(
                                (example) => example.label === event.target.value
                            );
                            if (selected) {
                                onSelect(selected);
                            }
                            event.currentTarget.value = "";
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="" disabled>
                            Choose a program template
                        </option>
                        {examples.map((example) => (
                            <option key={example.label} value={example.label}>
                                {example.label}
                            </option>
                        ))}
                    </select>
                </label>
                <button
                    type="button"
                    onClick={onFormat}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                >
                    Format
                </button>
            </div>
        </section>
    );
}
