"use client";

export function CopyProgramCodeButton({ code }: { code: string }) {
    return (
        <button
            className="border-black border rounded text-black hover:bg-amber-100 hover:opacity-80 px-4 py-2 transition duration-200 cursor-pointer"
            onClick={() => {
                navigator.clipboard.writeText(code);
                alert("Program code copied to clipboard!");
            }}
        >
            Copy raw program
        </button>
    );
}
