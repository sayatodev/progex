import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex justify-center items-center h-16">
            <Link
                href="https://github.com/sayatodev/progex"
                className="text-black dark:text-white"
            >
                View on GitHub
            </Link>
        </footer>
    );
}
