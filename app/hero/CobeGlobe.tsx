"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const GAINESVILLE: [number, number] = [29.65, -82.32];

const SOURCES: { loc: [number, number]; label: string }[] = [
  { loc: [40.71, -74.0], label: "NYC" },
  { loc: [41.88, -87.63], label: "Chicago" },
  { loc: [47.61, -122.33], label: "Seattle" },
  { loc: [37.77, -122.42], label: "SF" },
  { loc: [51.51, -0.13], label: "London" },
];

// Derived from inspecting cobe's source (rotation matrix in fn `O`):
//   phi   = (-longitude * π/180) - π/2   centers that longitude on screen
//   theta = (latitude * π/180)           centers that latitude on screen
// Gainesville (29.65°N, -82.32°W) → phi ≈ -0.134, theta ≈ +0.517.
function lonLatToPhiTheta(lon: number, lat: number): [number, number] {
  const phi = -(lon * Math.PI) / 180 - Math.PI / 2;
  const theta = (lat * Math.PI) / 180;
  return [phi, theta];
}
const [TARGET_PHI, TARGET_THETA] = lonLatToPhiTheta(GAINESVILLE[1], GAINESVILLE[0]);

// Initial pose: Africa / Indian Ocean roughly facing the camera so the pan
// has a meaningful traversal before resolving on Florida.
const [INIT_PHI, INIT_THETA] = lonLatToPhiTheta(40, 5);

// Cubic-bezier easing (Apple-style ease-out). Decelerates strongly toward the
// end so the rotation doesn't abruptly stop — it asymptotically settles.
function makeBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const dx = sampleX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const d = sampleDX(t);
      if (Math.abs(d) < 1e-5) break;
      t -= dx / d;
    }
    return sampleY(t);
  };
}
// Mirror Apple's `cubic-bezier(0.22, 1, 0.36, 1)` — strong tail-off.
const easeOutSoft = makeBezier(0.22, 1, 0.36, 1);

interface Props {
  /** Globe sits still until `start` becomes true, then runs the rotation + arc draw. */
  start: boolean;
  fadeOut?: boolean;
}

export function CobeGlobe({ start, fadeOut = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!start) return; // wait until activated (e.g. when scrolled into view)
    const canvas = canvasRef.current;

    // Logical size — cobe samples at this resolution × devicePixelRatio
    const SIZE = 760;

    const startTime = performance.now();
    const ROTATE_MS = 1800;
    const ARC_FIRST_AT = 150;
    const ARC_STAGGER = 220;

    const allArcs = SOURCES.map((src) => ({
      from: src.loc,
      to: GAINESVILLE,
      color: [0.42, 0.88, 1.0] as [number, number, number],
    }));

    const arcMarker = (loc: [number, number]) => ({
      location: loc,
      size: 0.018,
      color: [0.55, 0.9, 1.0] as [number, number, number],
    });

    const markers = [
      // Gainesville — small, sharp UF orange pinpoint
      { location: GAINESVILLE, size: 0.035, color: [1.0, 0.28, 0.1] as [number, number, number] },
      ...SOURCES.map((s) => arcMarker(s.loc)),
    ];

    const globe = createGlobe(canvas, {
      devicePixelRatio: window.devicePixelRatio || 1.5,
      width: SIZE * 2,
      height: SIZE * 2,
      phi: INIT_PHI,
      theta: INIT_THETA,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 22000,
      mapBrightness: 6.2,
      baseColor: [0.32, 0.45, 0.55],
      markerColor: [1.0, 0.28, 0.1],
      glowColor: [0.05, 0.07, 0.10],
      arcColor: [0.55, 0.92, 1.0],
      arcWidth: 0.95,
      arcHeight: 0.55,
      markers,
      arcs: [],
    });

    // Interactive state — drag to rotate, slow auto-rotate when idle.
    let phi = INIT_PHI;
    let theta = INIT_THETA;
    let dragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartPhi = 0;
    let dragStartTheta = 0;
    // After the intro pan finishes, idle drift continues this many radians/ms.
    const IDLE_PHI_SPEED = 0.00018; // ~10°/sec westward drift
    let lastFrameTs = performance.now();

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartPhi = phi;
      dragStartTheta = theta;
      canvas.setPointerCapture(e.pointerId);
      canvas.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      phi = dragStartPhi - dx * 0.005;
      theta = Math.max(-1.2, Math.min(1.2, dragStartTheta + dy * 0.005));
    };
    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      try { canvas.releasePointerCapture(e.pointerId); } catch {}
      canvas.style.cursor = "grab";
    };
    canvas.style.cursor = "grab";
    canvas.style.touchAction = "none";
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerUp);

    // Drive rotation + arc reveal via rAF and globe.update()
    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const dt = now - lastFrameTs;
      lastFrameTs = now;

      if (!dragging) {
        if (elapsed < ROTATE_MS) {
          // Intro pan — eased from INIT to TARGET.
          const t = Math.min(1, elapsed / ROTATE_MS);
          const e = easeOutSoft(t);
          phi = INIT_PHI + (TARGET_PHI - INIT_PHI) * e;
          theta = INIT_THETA + (TARGET_THETA - INIT_THETA) * e;
        } else {
          // Slow idle drift around the vertical axis.
          phi -= IDLE_PHI_SPEED * dt;
        }
      }

      const visible: typeof allArcs = [];
      for (let i = 0; i < allArcs.length; i++) {
        if (elapsed >= ARC_FIRST_AT + i * ARC_STAGGER) {
          visible.push(allArcs[i]);
        }
      }
      globe.update({ phi, theta, arcs: visible });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerUp);
      globe.destroy();
    };
  }, [start]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none transition-opacity duration-[800ms] ease-out ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "min(80vmin, 760px)",
          maxHeight: "min(80vmin, 760px)",
          aspectRatio: "1 / 1",
        }}
      />
    </div>
  );
}
