import ProgramView from "@/app/components/programView";
import Program from "@/helpers/calprog/Program";
import { Metadata } from "next";
import Link from "next/link";
import { CopyProgramCodeButton } from "./copyCodeButton";
import Footer from "@/app/footer";
import { notFound } from "next/navigation";

interface Props {
    params: Promise<{ program_name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { program_name } = await params;
    try {
        const data: ProgramData = await import(
            "@/data/presetPrograms/" + program_name + ".json"
        );
        return {
            openGraph: {
                title: "Progex - " + data.title,
                description: "Calculator program for" + data.title,
                url: "https://progex.com/view/preset/" + program_name,
                siteName: "Progex",
            },
        };
    } catch {
        return {
            openGraph: {
                title: "Progex - Not found",
                description: "Progex - Not found",
                url: "https://progex.com/view/preset/" + program_name,
                siteName: "Progex",
            },
        };
    }
}

export default async function Home({ params }: Props) {
    try {
        const { program_name } = await params;
        const data: ProgramData = await import(
            "@/data/presetPrograms/" + program_name + ".json"
        );
        if (!data) return notFound();

        const program = new Program(data.program);
        return (
            <main className="flex min-h-screen flex-col items-center gap-3 p-4 md:p-24">
                <Link href="/view/preset">Back</Link>
                <h1 className="text-4xl font-bold">{data.title}</h1>
                <div className="text-xl flex flex-col items-center gap-2">
                    <p>
                        {Program.getModeName(data.mode)} Mode /{" "}
                        {program.getSymbols().length} Bytes
                    </p>
                </div>
                <ProgramView program={program} />
                <CopyProgramCodeButton code={program.code} />

                <Footer />
            </main>
        );
    } catch (error) {
        console.error("Error loading data:", error);
        return notFound();
    }
}
