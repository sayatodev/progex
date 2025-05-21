"use client";
import styles from "@/app/styles.module.css"

export function CopyProgramCodeButton({ code }: { code: string }) {
    return (
        <button
            className={styles.button}
            onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Program code copied to clipboard!");
            }}
        >
            Copy raw program
        </button>
    );
}
