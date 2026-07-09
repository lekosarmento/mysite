import { Navbar } from "@/components/ui/Navbar";
import { MobileCTA } from "@/components/ui/MobileCTA";
import { PageShell } from "@/components/ui/PageShell";
import { Deck } from "@/components/deck/Deck";
import { AgentHost } from "@/components/agent/AgentHost";
import { SpotlightGlow } from "@/components/agent/SpotlightGlow";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col">
      <Navbar />
      <PageShell>
        <Deck />
      </PageShell>
      <SpotlightGlow />
      <MobileCTA />
      <AgentHost />
    </main>
  );
}
