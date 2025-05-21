import Link from "next/link";
import Footer from "./footer";
import styles from "./styles.module.css"

export default function Home() {
    return (
        <>
            <main className="flex min-h-screen flex-col items-center gap-5 p-24">
                <h1 className="text-4xl font-bold">Progex</h1>
                <p className="text-xl text-center">
                    <strong>Welcome to Progex!</strong>
                    <br />
                    The All-in-one tool for Calculator Programs. Designed for
                    Casio fx-50fh ii
                    <br />
                    (You&apos;d likely have one if you&apos;re a secondary school student
                    in Hong Kong).
                </p>
                <Link href="/view/preset">
                    <h2 className={styles.button}>
                        Preset Programs
                    </h2>
                </Link>
                <Link href="/interpreter">
                    <h2 className={styles.button}>
                        Play with the Interpreter (Beta)
                    </h2>
                </Link>
                <Footer />
            </main>
        </>
    );
}
