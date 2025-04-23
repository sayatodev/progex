import Program from "@/helpers/program";
import styles from "./programView.module.css";

const defaultClass =
    "z-2 inline-block m-1 px-2.5 py-0.5 rounded-md text-lg font-mono whitespace-pre-wrap break-words";
const getStyles = (token: ProgramTokenProps) => {
    const results = [defaultClass];
    switch (true) {
        case token.shift:
            results.push("bg-yellow-600 text-white");
            break;
        case token.alpha:
            results.push("bg-red-700 text-white");
            break;
        case token.mode === 2:
            results.push("bg-purple-600 text-white");
            break;
        case token.mode === 3:
            results.push("bg-green-200 text-white");
            break;
        case token.mode === 4:
            results.push("bg-blue-200 text-white");
            break;
        case token.mode === 5:
            results.push("bg-black text-white");
            break;
        case token.parentMenu === "PROG":
            results.push("bg-orange-500 text-white");
            break;
        default:
            results.push("bg-gray-900 text-white");
            break;
    }
    return results.join(" ");
};

interface IProgramProps {
    program: Program;
}

export default function ProgramView({ program }: IProgramProps) {
    const tokens = program.getTokens();
    const tokenElements = tokens.map((token, index) => {
        return (
            <div key={`token_${index}`} style={{ position: "relative" }}>
                <span className={styles.byteCount}>{index}</span>
                <span className={getStyles(token)}>{token.value}</span>
            </div>
        );
    });

    return (
        <div className="text-md font-mono flex flex-wrap ml-[30px]">{tokenElements}</div>
    );
}
