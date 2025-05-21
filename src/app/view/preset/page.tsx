import Footer from "@/app/footer";
import getAllPresetPrograms from "@/helpers/allPresetPrograms";
import Link from "next/link";
import styles from "@/app/styles.module.css"

export default async function PresetProgramsList() {
    const programs = await getAllPresetPrograms();
    return (
        <>
            <main className="flex min-h-screen flex-col items-center gap-5 p-24">
                <Link href="/">Back</Link>
                <h1 className="text-4xl font-bold">Preset Programs</h1>
                <ul className="">
                    {programs.map((program) => (
                        <li key={program.name}>
                            <Link href={program.url} className={styles.button}>{program.name}</Link>
                        </li>
                    ))}
                </ul>
                <Footer />
            </main>
        </>
    );
}
