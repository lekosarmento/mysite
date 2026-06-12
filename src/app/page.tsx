import { Navbar } from "@/components/ui/Navbar";
import { MobileCTA } from "@/components/ui/MobileCTA";
import { Hero } from "@/components/sections/Hero";

import { Sobre } from "@/components/sections/Sobre";
import { Products } from "@/components/sections/WhatsAppAgent";
import { Offers } from "@/components/sections/Offers";
import { HowIWork } from "@/components/sections/HowIWork";
import { Projetos } from "@/components/sections/Projetos";
import { Recruiters } from "@/components/sections/Recruiters";
import { Standalone } from "@/components/sections/Standalone";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between w-full relative">
      <Navbar />
      <Hero />
      <div className="w-full relative z-10 bg-bg-primary">

        <Sobre />
        <Products />
        <Offers />
        <HowIWork />
        <Projetos />
        <Recruiters />
        <Standalone />
        <Experience />
        <Education />
        <FinalCTA />
        <Footer />
      </div>
      <MobileCTA />
    </main>
  );
}
