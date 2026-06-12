import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { LanguageProvider } from "@/lib/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://leko.ai"),
  title: "Leko Sarmento — Soluções com Inteligência Artificial",
  description: "Construo agentes de IA, automações e produtos digitais. 15+ anos de experiência operacional aplicados à tecnologia. João Pessoa, Brasil.",
  keywords: ["IA", "Inteligência Artificial", "Agentes de IA", "WhatsApp", "Automação", "SaaS", "Next.js", "Leko Sarmento", "João Pessoa"],
  authors: [{ name: "José Werkley Sarmento Dias" }],
  openGraph: {
    title: "Leko Sarmento — Soluções com Inteligência Artificial",
    description: "Construo agentes de IA, automações e produtos digitais. 15+ anos de experiência operacional aplicados à tecnologia.",
    siteName: "Leko Sarmento",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leko Sarmento — Soluções com Inteligência Artificial",
    description: "Construo agentes de IA, automações e produtos digitais.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://leko.ai",
    languages: {
      "pt-BR": "https://leko.ai",
      "en": "https://leko.ai/en",
      "es": "https://leko.ai/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('leko-theme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${plexMono.variable} font-sans antialiased bg-bg-primary text-text-secondary selection:bg-accent-cyan selection:text-bg-primary`}
      >
        <LanguageProvider>
          <GrainOverlay />
          <SmoothScrollProvider>
            <CustomCursor />
            {children}
            <Analytics />
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
