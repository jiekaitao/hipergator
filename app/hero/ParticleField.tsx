"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  generateGatorTargets,
  generateInitialPositions,
  generateRandoms,
} from "@/lib/gatorTarget";
import { particleVertexShader, particleFragmentShader } from "@/lib/shaders";

const COUNT = 28000;

interface Props {
  /**
   * When false, the WebGL clock for the gator formation is paused at 0.
   * Flipped to true by the parent once the COBE globe begins to fade out so
   * the particle convergence starts in sync with the crossfade.
   */
  active: boolean;
}

export function ParticleField({ active }: Props) {
  const matRef = useRef<THREE.ShaderMaterial | null>(null);
  const startRef = useRef<number | null>(null);

  const { geometry, uniforms } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const initial = generateInitialPositions(COUNT);
    const targets = generateGatorTargets(COUNT);
    const randoms = generateRandoms(COUNT);

    geometry.setAttribute("position", new THREE.BufferAttribute(initial, 3));
    geometry.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 1.0 },
      uPixelRatio: {
        value:
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1,
      },
    };

    return { geometry, uniforms };
  }, []);

  useFrame((state) => {
    if (!active) {
      // Hold at t=0 until we're activated
      if (matRef.current) matRef.current.uniforms.uTime.value = 0;
      startRef.current = null;
      return;
    }
    if (startRef.current === null) startRef.current = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - startRef.current;
    if (matRef.current) matRef.current.uniforms.uTime.value = t;
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
