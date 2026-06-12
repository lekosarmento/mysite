"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { SceneGraph } from "./SceneGraph";

export function HeroScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas 
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
