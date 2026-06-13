"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleField } from "./ParticleField";
import { HeroOverlay } from "./HeroOverlay";

export function ParticleHero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-ink">
      {/* radial glow backdrop — warms the orange palette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_55%,rgba(250,70,22,0.08)_0%,rgba(10,9,7,0)_55%)]" />

      {/* Gator scene — particles bloom into the gator immediately on load. */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 14], fov: 35, near: 0.1, far: 100 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          dpr={[1, 2]}
        >
          <Suspense fallback={null}>
            <ParticleField active />
          </Suspense>
        </Canvas>
      </div>

      <HeroOverlay />
    </section>
  );
}
