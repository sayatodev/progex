import styles from "@/app/styles.module.css";

type NormalizedProgramCardProps = {
    normalizedProgram: string;
};

export default function NormalizedProgramCard({
    normalizedProgram,
}: NormalizedProgramCardProps) {
    return (
        <section className="w-full max-w-7xl bg-white rounded-lg shadow-md p-4 text-sm text-gray-600">
            <p>Normalized program:</p>
            <pre
                className={`${styles.firacode} mt-2 overflow-x-auto rounded-md bg-gray-50 p-4 text-xs text-gray-700 border border-gray-200`}
            >
                {normalizedProgram}
            </pre>
        </section>
    );
}
