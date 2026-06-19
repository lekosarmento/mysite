"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { SceneGraph } from "./SceneGraph";

export function HeroScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Pauses the R3F render loop when the hero leaves the viewport, freeing the GPU
  // for the rest of the page. Independent from the parallax motion.div in Hero.tsx.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Small margin so the loop resumes just before the hero re-enters on scroll-up
      // and only pauses once it is clearly out of view.
      { rootMargin: "200px 0px 200px 0px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
        failIfMajorPerformanceCaveat: false
      }}
      >
        <Suspense fallback={null}>
          <SceneGraph />
        </Suspense>
      </Canvas>
    </div>
  );
}
