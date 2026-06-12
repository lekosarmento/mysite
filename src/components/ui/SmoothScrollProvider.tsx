"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  // Use state to prevent hydration mismatch for lenis integration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      orientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  if (!mounted) return <>{children}</>;

  return <>{children}</>;
}
