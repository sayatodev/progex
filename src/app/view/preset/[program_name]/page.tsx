import ProgramView from "@/app/components/programView";
import Program from "@/helpers/program";
import { Metadata } from "next";
import Link from "next/link";
import { CopyProgramCodeButton } from "./copyCodeButton";
import Footer from "@/app/footer";

interface Props {
    params: Promise<{ program_name: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { program_name } = await params;
    return {
        openGraph: {
            title: "Progex - " + program_name,
            description: "Progex - " + program_name,
            url: "https://progex.com/view/preset/" + program_name,
            siteName: "Progex",
        },
    };
}

export default async function Home({ params }: Props) {
    try {
        const { program_name } = await params;
        const data: ProgramData = await import(
            "@/data/preset_programs/" + program_name + ".json"
        );
        const program = new Program(data.program);

        return (
            <main className="flex min-h-screen flex-col items-center gap-3 p-4 md:p-24">
                <Link href="/view/preset">Back</Link>
                <h1 className="text-4xl font-bold">{data.title}</h1>
                <div className="text-xl flex flex-col items-center gap-2">
                    <p>
                        {Program.getModeName(data.mode)} Mode /{" "}
                        {program.getTokens().length} Bytes
                    </p>
                </div>
                <ProgramView program={program} />
                <CopyProgramCodeButton code={program.code} />

                <Footer />
            </main>
        );
    } catch (error) {
        console.error("Error loading data:", error);
        return (
            <main className="flex min-h-screen flex-col items-center gap-3 p-24">
                <h1 className="text-4xl font-bold">Error</h1>
                <p>Data not found</p>
                <Footer />
            </main>
        );
    }
}
