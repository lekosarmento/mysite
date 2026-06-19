"use client";

import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { useLoading } from "@/lib/LoadingContext";
import { useMenu } from "@/lib/MenuContext";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Use state to prevent hydration mismatch for lenis integration
  const [mounted, setMounted] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const { loading } = useLoading();
  const { open: menuOpen } = useMenu();

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Trava o scroll: preloader (volta ao topo) ou menu aberto (mantém a posição)
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (loading) {
      lenis.scrollTo(0, { immediate: true });
      lenis.stop();
    } else if (menuOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [loading, menuOpen, mounted]);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
