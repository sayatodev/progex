import type { ExecutionSnapshot } from "../types";

type StatisticsCardProps = {
    stats: ExecutionSnapshot["stats"];
};

export default function StatisticsCard({ stats }: StatisticsCardProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200">
                    Freq {stats.frequencyEnabled ? "On" : "Off"}
                </span>
                <span className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200">
                    {stats.regressionMode ?? "No regression"}
                </span>
                <span className="px-2 py-1 rounded-md bg-gray-100 border border-gray-200">
                    {stats.data.length} data points
                </span>
            </div>
            <div className="mt-4 space-y-2">
                {stats.data.length ? (
                    stats.data.map((point, index) => (
                        <div
                            key={`${point.x}-${point.y}-${point.frequency}-${index}`}
                            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                        >
                            x={point.x}, y={point.y ?? "null"}, freq=
                            {point.frequency}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">
                        No statistics data has been captured yet.
                    </p>
                )}
            </div>
        </section>
    );
}
