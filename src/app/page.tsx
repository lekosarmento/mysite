import { Navbar } from "@/components/ui/Navbar";
import { MobileCTA } from "@/components/ui/MobileCTA";
import { PageShell } from "@/components/ui/PageShell";
import { Deck } from "@/components/deck/Deck";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <PageShell>
        <Deck />
      </PageShell>
      <MobileCTA />
    </main>
  );
}
