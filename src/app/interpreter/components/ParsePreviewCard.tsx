import styles from "@/app/styles.module.css";
import type { TokenPreview } from "../types";
import PreviewList from "./PreviewList";

type ParsePreviewCardProps = {
    statements: string[];
    tokens: TokenPreview[];
};

export default function ParsePreviewCard({
    statements,
    tokens,
}: ParsePreviewCardProps) {
    return (
        <section className="bg-white rounded-lg shadow-md p-4 xl:col-span-1">
            <h2 className="text-xl font-semibold text-gray-800">
                Parse preview
            </h2>
            <div className="mt-4">
                <p className="text-sm text-gray-500">Statements</p>
                <PreviewList
                    items={statements}
                    empty="No statements parsed."
                />
            </div>
            <div className="mt-4">
                <p className="text-sm text-gray-500">Tokens</p>
                <div className="mt-2 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {tokens.length ? (
                        tokens.map((token, index) => (
                            <div
                                key={`${token.segment}-${token.type}-${index}`}
                                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                            >
                                <span className="font-semibold text-gray-900">
                                    {token.type}
                                </span>{" "}
                                <span className="text-gray-500">
                                    seg {token.segment}
                                </span>{" "}
                                <span className={styles.firacode}>
                                    {token.lexeme}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">
                            No tokens available.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
