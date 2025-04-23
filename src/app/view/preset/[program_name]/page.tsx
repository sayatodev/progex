import ProgramView from "@/app/components/programView";
import Program from "@/helpers/program";
import { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(
  {params}: {params: { program_name: string }},
): Promise<Metadata> {
  return {
    openGraph: {
      title: "Progex - " + params.program_name,
      description: "Progex - " + params.program_name,
      url: "https://progex.com/view/preset/" + params.program_name,
      siteName: "Progex", 
    }
  }
}

export default async function Home({
    params,
}: {
    params: Promise<{ program_name: string }>;
}) {
    try {
        const { program_name } = await params;
        const data: ProgramData = await import(
            "@/data/preset_programs/" + program_name + ".json"
        );
        const program = new Program(data.program);

        return (
            <>
                <main className="flex min-h-screen flex-col items-center gap-3 p-24">
                    <Link href="/view/preset">Back</Link>
                    <h1 className="text-4xl font-bold">{data.title}</h1>
                    <div className="text-xl flex flex-col items-center gap-2">
                        <p>Byte Count: {program.getTokens().length}</p>
                        <p>Mode: {data.mode}</p>
                    </div>
                    <ProgramView program={program} />
                </main>
            </>
        );
    } catch (error) {
        console.error("Error loading data:", error);
        return (
            <main className="flex min-h-screen flex-col items-center gap-3 p-24">
                <h1 className="text-4xl font-bold">Error</h1>
                <p>Data not found</p>
            </main>
        );
    }
}
