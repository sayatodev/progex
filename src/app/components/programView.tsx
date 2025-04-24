import Program from "@/helpers/program";
import styles from "./programView.module.css";

const defaultClass =
    "z-2 inline-block m-1 px-2.5 py-0.5 rounded-md text-lg font-mono whitespace-pre-wrap break-word";
const getStyles = (token: ProgramTokenProps) => {
    const results = [defaultClass];
    if (token.mode === 2) results.push("bg-purple-600 text-white");
    if (token.mode === 3) results.push("bg-green-200 text-white");
    if (token.mode === 4) results.push("bg-blue-200 text-white");
    if (token.mode === 5)
        results.push("bg-black text-white dark:bg-gray-800 dark:text-white");
    if (token.parentMenu === "PROG") results.push("bg-orange-500 text-white");

    if (token.shift) {
        switch (token.mode) {
            case 2:
                results.push("bg-purple-200 text-yellow-300");
                break;
            case 4:
                results.push("bg-blue-200 text-yellow-300");
                break;
            case 5:
                results.push("bg-black text-yellow-300");
                break;
            default:
                results.push("bg-yellow-600 text-white");
        }
    }
    if (token.alpha) {
        switch (token.mode) {
            case 2:
                results.push("bg-purple-200 text-red-300");
                break;
            case 4:
                results.push("bg-blue-200 text-red-300");
                break;
            case 5:
                results.push("bg-black text-red-300");
                break;
            default:
                results.push("bg-red-600 text-white");
        }
    }

    if (results.length === 1) results.push("bg-gray-800 text-white"); // Default style
    return results.join(" ");
};
const programInputStyles: Record<CalculatorInputTheme, string> = {
    light: "bg-gray-500 text-white",
    dark: "bg-gray-800 text-white",
    orange: "bg-orange-500 text-white",
    replay: "bg-gray-500 text-white rounded-xl",
};

interface IProgramProps {
    program: Program;
}

export default function ProgramView({ program }: IProgramProps) {
    const tokens = program.getTokens();
    const tokenElements = tokens.map((token, index) => {
        return (
            <div key={`token_${index}`} className="group relative">
                <div className="relative">
                    <span className={styles.byteCount}>{index}</span>
                    <span className={getStyles(token)}>{token.value}</span>
                </div>
                <div className="z-3 whitespace-nowrap rounded bg-black px-2 py-1 text-white absolute mb-3 bottom-1/2 left-1/2 -translate-x-1/2 before:content-[''] before:absolute before:-translate-x-1/2 before:left-1/2 before:top-full before:border-4 before:border-transparent before:border-t-black opacity-0 group-hover:opacity-100 transition pointer-events-none group-focus:opacity-100">
                    <div className="text-sm">
                        <p className="font-sans font-bold">
                            {token.name}{" "}
                            <span className="text-xs font-normal italic">
                                {token.category}
                            </span>
                        </p>
                        {token.mode !== undefined && (
                            <p className="text-xs font-sans">
                                ({Program.getModeName(token.mode)}
                                {" Mode"})
                            </p>
                        )}
                        {token.inputs.length > 0 && (
                            <p>
                                {token.shift && (
                                    <span className="text-xs mr-1 text-yellow-500">
                                        Shift
                                    </span>
                                )}
                                {token.alpha && (
                                    <span className="text-xs mr-1 text-red-500">
                                        Alpha
                                    </span>
                                )}
                                {token.inputs.map((input, i) => (
                                    <span
                                        key={i}
                                        className={`${defaultClass} text-xs mr-1 ml-0 px-2 ${
                                            programInputStyles[input.theme]
                                        } `}
                                    >
                                        {input.value}
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className="text-md font-mono flex flex-wrap ml-[30px]">
            {tokenElements}
        </div>
    );
}
