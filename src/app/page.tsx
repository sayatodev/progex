import Link from "next/link";
import Footer from "./footer";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center gap-5 p-24">
        <h1 className="text-4xl font-bold">Progex</h1>
        <Link href="/view/preset">
          <h2 className="text-2xl font-bold">-&gt; Preset Programs</h2>
        </Link>
        <Footer />
      </main>
    </>
  );
}
