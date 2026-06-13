// Procedural gator-biting-server silhouette.
// Side profile, facing right, mouth open, server wedged in the jaws.
// Coordinates are scene-space; final extent roughly x ∈ [-7.5, 6.8], y ∈ [-1.7, 1.7].

type Pt = [number, number];

// Outline traced counterclockwise starting at tail tip, around top of body,
// out along upper jaw, INTO the mouth, back out along lower jaw, under belly,
// past legs, along the tail underside, and back to start.
const GATOR_OUTLINE: Pt[] = [
  // Tail tip (left) and top of tail
  [-7.2, 0.05], [-6.8, 0.22], [-6.4, 0.38], [-6.0, 0.52],
  [-5.5, 0.68], [-5.0, 0.82], [-4.5, 0.95], [-4.0, 1.06], [-3.6, 1.14],

  // Back ridges — jagged sawtooth scutes
  [-3.3, 1.38], [-3.15, 1.18],
  [-2.9, 1.45], [-2.72, 1.22],
  [-2.45, 1.50], [-2.25, 1.25],
  [-2.0, 1.52], [-1.78, 1.27],
  [-1.5, 1.55], [-1.27, 1.30],
  [-1.0, 1.58], [-0.76, 1.32],
  [-0.5, 1.58], [-0.25, 1.33],
  [0.0, 1.57], [0.25, 1.32],
  [0.5, 1.55], [0.74, 1.30],
  [1.0, 1.50], [1.22, 1.25],

  // Head transition
  [1.5, 1.18], [1.78, 1.05], [2.0, 0.92],

  // Eye bump
  [2.22, 0.98], [2.4, 1.04], [2.58, 1.00],

  // Top of snout, sloping down
  [2.85, 0.88], [3.15, 0.78], [3.45, 0.72], [3.75, 0.70],
  [4.05, 0.72], [4.35, 0.78], [4.6, 0.86], [4.85, 0.96],

  // Upper jaw tip with small upcurl
  [5.0, 1.03], [5.12, 1.0], [5.18, 0.92],

  // BACK along inside roof of mouth toward the hinge
  [4.9, 0.78], [4.55, 0.62], [4.18, 0.50], [3.85, 0.42],

  // Hinge of jaw (back of mouth)
  [3.65, 0.30], [3.62, 0.15],

  // Forward along inside floor of mouth (tongue line)
  [3.85, 0.05], [4.18, -0.02], [4.55, -0.08], [4.9, -0.15],

  // Lower jaw tip
  [5.12, -0.20], [5.18, -0.28], [5.05, -0.34],

  // Back along outside bottom of lower jaw
  [4.78, -0.36], [4.45, -0.40], [4.10, -0.46], [3.78, -0.52],

  // Chin / throat
  [3.42, -0.58], [3.05, -0.62], [2.70, -0.67], [2.35, -0.70],

  // Underside / chest
  [2.00, -0.74], [1.65, -0.78],

  // Front leg
  [1.45, -0.82],
  [1.42, -1.30], [1.45, -1.50],
  [1.58, -1.60], [1.78, -1.62], [1.95, -1.55],
  [1.92, -1.45], [1.80, -1.42],
  [1.78, -1.30], [1.78, -0.88],
  [1.55, -0.86],

  // Belly
  [1.10, -0.88], [0.65, -0.90], [0.20, -0.90],
  [-0.25, -0.88], [-0.70, -0.85], [-1.15, -0.82],
  [-1.45, -0.80],

  // Back leg
  [-1.62, -0.82],
  [-1.65, -1.32], [-1.55, -1.55],
  [-1.40, -1.62], [-1.20, -1.60], [-1.05, -1.50],
  [-1.10, -1.40], [-1.22, -1.38],
  [-1.30, -1.28], [-1.30, -0.88],
  [-1.60, -0.84],

  // Tail underside back to tail tip
  [-2.00, -0.78], [-2.45, -0.72], [-2.95, -0.65], [-3.45, -0.55],
  [-3.95, -0.45], [-4.45, -0.36], [-4.95, -0.27], [-5.45, -0.18],
  [-5.95, -0.10], [-6.40, -0.05], [-6.80, -0.02],
];

// Server rectangle — partially clamped inside the gator's jaws.
// Left edge starts BEHIND the upper jaw tip; extends right.
const SERVER = { x1: 3.95, y1: -0.08, x2: 6.55, y2: 0.58 };

// Eye position
const EYE = { cx: 2.38, cy: 0.78, r: 0.06 };

// Nostril
const NOSTRIL = { cx: 4.7, cy: 0.65, r: 0.025 };

// Stylised NVIDIA logo mark — 16x16 high-res silhouette of the iconic
// green square with a carved-out swirling eye. Higher resolution = more
// recognizable as the NVIDIA brand mark when rendered as a particle stencil.
// 1 = filled (green), 0 = carved out (dark — the negative-space eye shape).
const EYE_GLYPH: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
  [1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1],
  [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// 5x5 bitmap glyphs for the NVIDIA wordmark stencil on the server front.
// 1 = lit pixel, 0 = empty
type Glyph = number[][];
const GLYPHS: Record<string, Glyph> = {
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  D: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
  ],
  A: [
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
};

function nvidiaPixelPositions(centerX: number, centerY: number, pixelSize: number, letterGap: number): Array<[number, number]> {
  const text = "NVIDIA";
  // First pass: layout widths
  const widths = text.split("").map((c) => GLYPHS[c][0].length);
  const totalWidth =
    widths.reduce((a, b) => a + b * pixelSize, 0) + (text.length - 1) * letterGap;
  let cursorX = centerX - totalWidth / 2;

  const pts: Array<[number, number]> = [];
  for (let li = 0; li < text.length; li++) {
    const g = GLYPHS[text[li]];
    const rows = g.length;
    const cols = g[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (g[r][c]) {
          const px = cursorX + c * pixelSize + pixelSize / 2;
          const py = centerY + (rows / 2 - r - 0.5) * pixelSize;
          pts.push([px, py]);
        }
      }
    }
    cursorX += cols * pixelSize + letterGap;
  }
  return pts;
}

function pointInPolygon(px: number, py: number, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function bbox(poly: Pt[]) {
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y] of poly) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, maxX, minY, maxY };
}

export function generateGatorTargets(count: number): Float32Array {
  const positions = new Float32Array(count * 3);

  const N_OUTLINE       = Math.floor(count * 0.34);
  const N_INTERIOR      = Math.floor(count * 0.19);
  const N_SERVER_FRAME  = Math.floor(count * 0.09);
  const N_SERVER_ROWS   = Math.floor(count * 0.16);
  const N_LEDS          = Math.floor(count * 0.09);
  const N_EYE           = Math.floor(count * 0.022);
  const N_NOSTRIL       = Math.floor(count * 0.004);
  const N_NVIDIA        = Math.floor(count * 0.13);
  const N_TEETH = count - (N_OUTLINE + N_INTERIOR + N_SERVER_FRAME + N_SERVER_ROWS + N_LEDS + N_EYE + N_NOSTRIL + N_NVIDIA);

  // Segment lengths for uniform outline sampling
  const segLens: number[] = [];
  let totalLen = 0;
  for (let i = 0; i < GATOR_OUTLINE.length; i++) {
    const a = GATOR_OUTLINE[i];
    const b = GATOR_OUTLINE[(i + 1) % GATOR_OUTLINE.length];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segLens.push(l);
    totalLen += l;
  }

  // Lift the gator up in scene space so it sits above the headline copy
  const Y_OFFSET = 1.15;
  // Uniform scale-down on the whole gator + server (incl. NVIDIA stencil)
  const SCALE = 0.68;

  let idx = 0;
  const put = (x: number, y: number, z: number) => {
    positions[idx * 3] = x * SCALE;
    positions[idx * 3 + 1] = (y + Y_OFFSET) * SCALE;
    positions[idx * 3 + 2] = z * SCALE;
    idx++;
  };

  // 1) Gator outline
  for (let i = 0; i < N_OUTLINE; i++) {
    let r = Math.random() * totalLen;
    let s = 0;
    while (s < segLens.length - 1 && r > segLens[s]) {
      r -= segLens[s];
      s++;
    }
    const t = Math.random();
    const a = GATOR_OUTLINE[s];
    const b = GATOR_OUTLINE[(s + 1) % GATOR_OUTLINE.length];
    const x = a[0] + (b[0] - a[0]) * t + (Math.random() - 0.5) * 0.03;
    const y = a[1] + (b[1] - a[1]) * t + (Math.random() - 0.5) * 0.03;
    put(x, y, (Math.random() - 0.5) * 0.08);
  }

  // 2) Gator interior — rejection sampled
  const { minX, maxX, minY, maxY } = bbox(GATOR_OUTLINE);
  let filled = 0;
  let guard = 0;
  while (filled < N_INTERIOR && guard < N_INTERIOR * 60) {
    const x = minX + Math.random() * (maxX - minX);
    const y = minY + Math.random() * (maxY - minY);
    guard++;
    if (pointInPolygon(x, y, GATOR_OUTLINE)) {
      put(x, y, (Math.random() - 0.5) * 0.14);
      filled++;
    }
  }
  while (filled < N_INTERIOR) {
    const a = GATOR_OUTLINE[Math.floor(Math.random() * GATOR_OUTLINE.length)];
    put(a[0], a[1], (Math.random() - 0.5) * 0.08);
    filled++;
  }

  // 3) Server frame — drawn through the NVIDIA zone too so the rectangle
  //    outline stays continuous around the stencil (no broken gap on the
  //    bottom edge of the server under NVIDIA).
  const { x1, y1, x2, y2 } = SERVER;
  const sw = x2 - x1, sh = y2 - y1;
  const perim = 2 * (sw + sh);
  // NVIDIA exclusion zone applies to ROWS and LEDs only (keeps the cyan
  // bulk away from the wordmark while leaving the frame outline intact).
  // Bounds sized for the wordmark-only layout at wordPixel = 0.055.
  const NV_X_MIN = x1 + 0.06;
  const NV_X_MAX = x1 + 1.80;
  const NV_Y_MIN = y1 + 0.04;
  const NV_Y_MAX = y1 + 0.44;
  const inNvZone = (px: number, py: number) =>
    px >= NV_X_MIN && px <= NV_X_MAX && py >= NV_Y_MIN && py <= NV_Y_MAX;
  for (let i = 0; i < N_SERVER_FRAME; i++) {
    let p = Math.random() * perim;
    let x, y;
    if (p < sw)             { x = x1 + p;            y = y1; }
    else if (p < sw + sh)   { x = x2;                y = y1 + (p - sw); }
    else if (p < 2 * sw + sh) { x = x2 - (p - sw - sh); y = y2; }
    else                    { x = x1;                y = y2 - (p - 2 * sw - sh); }
    put(x + (Math.random() - 0.5) * 0.018, y + (Math.random() - 0.5) * 0.018, 0.15 + (Math.random() - 0.5) * 0.04);
  }

  // 4) Server horizontal rows (1U slots) — rejection sample so we always fill the slot.
  const ROWS = 14;
  let rowGuard = 0;
  for (let i = 0; i < N_SERVER_ROWS; i++) {
    let x = 0, y = 0;
    do {
      const row = Math.floor(Math.random() * ROWS);
      const rowY = y1 + (row + 0.5) / ROWS * sh;
      y = rowY + (Math.random() - 0.5) * (sh / ROWS) * 0.45;
      x = x1 + 0.04 + Math.random() * (sw - 0.08);
      rowGuard++;
    } while (inNvZone(x, y) && rowGuard < N_SERVER_ROWS * 6);
    put(x, y, 0.18 + (Math.random() - 0.5) * 0.04);
  }

  // 5) LED clusters — rejection sample around the NVIDIA exclusion zone.
  const SLOTS = 5;
  let ledGuard = 0;
  for (let i = 0; i < N_LEDS; i++) {
    let slotX = 0, rowY = 0;
    do {
      const row = Math.floor(Math.random() * ROWS);
      rowY = y1 + (row + 0.3) / ROWS * sh;
      const slot = Math.floor(Math.random() * SLOTS);
      slotX = x1 + 0.18 + (slot / (SLOTS - 1)) * (sw - 0.36);
      ledGuard++;
    } while (inNvZone(slotX, rowY) && ledGuard < N_LEDS * 6);
    put(slotX + (Math.random() - 0.5) * 0.04, rowY + (Math.random() - 0.5) * 0.025, 0.22);
  }

  // 6) Eye — dense cluster
  for (let i = 0; i < N_EYE; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * EYE.r;
    put(EYE.cx + Math.cos(a) * r, EYE.cy + Math.sin(a) * r, 0.08);
  }

  // 7) Nostril
  for (let i = 0; i < N_NOSTRIL; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * NOSTRIL.r;
    put(NOSTRIL.cx + Math.cos(a) * r, NOSTRIL.cy + Math.sin(a) * r, 0.06);
  }

  // 8) NVIDIA wordmark only — bigger pixels + small particles for a crisp
  //    bitmap read. The eye/swirl glyph is dropped: it cannot be conveyed by
  //    additive particle splats at this scale (each particle is fatter than a
  //    glyph cell, so the swirl blurs to a blob).
  const wordPixel = 0.055;
  const letterGap = 0.032;
  const textW = 26 * wordPixel + 5 * letterGap;
  const padX = 0.10;
  const padY = 0.10;
  const wordCx = x1 + padX + textW / 2;
  const vCenterY = y1 + padY + (5 * wordPixel) / 2;

  const nvidiaPx = nvidiaPixelPositions(wordCx, vCenterY, wordPixel, letterGap);
  for (let i = 0; i < N_NVIDIA; i++) {
    const p = nvidiaPx[i % nvidiaPx.length];
    const jx = (Math.random() - 0.5) * wordPixel * 0.25;
    const jy = (Math.random() - 0.5) * wordPixel * 0.25;
    put(p[0] + jx, p[1] + jy, 0.32);
  }

  // 9) Teeth — small triangular clusters along the jaw line edges
  const teethCount = Math.max(0, N_TEETH);
  for (let i = 0; i < teethCount; i++) {
    const upper = Math.random() < 0.5;
    const t = Math.random();
    if (upper) {
      const x = 3.85 + t * (5.10 - 3.85);
      const baseY = 0.05 - Math.pow(Math.abs(t - 0.5) * 2, 1.5) * 0.10;
      const tipY = baseY - 0.08 * (0.4 + Math.random() * 0.6);
      const ty = baseY + (tipY - baseY) * Math.random();
      put(x + (Math.random() - 0.5) * 0.015, ty, 0.12);
    } else {
      const x = 3.85 + t * (5.10 - 3.85);
      const baseY = -0.08 + Math.pow(Math.abs(t - 0.5) * 2, 1.5) * 0.08;
      const tipY = baseY + 0.07 * (0.4 + Math.random() * 0.6);
      const ty = baseY + (tipY - baseY) * Math.random();
      put(x + (Math.random() - 0.5) * 0.015, ty, 0.12);
    }
  }

  // Center & scale the result so it fills the canvas pleasantly
  // (no transform applied here — handled by the camera in the scene)

  return positions;
}

export function generateInitialPositions(count: number): Float32Array {
  // Tight spherical cluster — particles spawn roughly where the cobe globe
  // was sitting, then "explode" outward to form the gator silhouette during
  // the crossfade. Visual continuity: the globe collapses into a knot of
  // particles that immediately bloom into the gator.
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const u = Math.random();
    const v = Math.random();
    const w = Math.random();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(w) * 2.4; // tight cluster the size of the globe
    out[i * 3]     = Math.sin(phi) * Math.cos(theta) * r;
    out[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r * 0.9;
    out[i * 3 + 2] = Math.cos(phi) * r * 0.6;
  }
  return out;
}

export function generateRandoms(count: number): Float32Array {
  const out = new Float32Array(count);
  for (let i = 0; i < count; i++) out[i] = Math.random();
  return out;
}

// Geometric intermediate state: particles arranged on a Fibonacci sphere with
// a small subset elevated as concentric "data rings" giving it more structure.
// This sits between the swirl phase and the gator silhouette.
export function generateGeometricTargets(count: number): Float32Array {
  const out = new Float32Array(count * 3);
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const radius = 2.4;

  // 80% on a Fibonacci sphere surface
  const N_SPHERE = Math.floor(count * 0.80);
  // 20% on three orthogonal great-circle rings
  const N_RING = count - N_SPHERE;

  for (let i = 0; i < N_SPHERE; i++) {
    const y = 1 - (i / (N_SPHERE - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = goldenAngle * i;
    out[i * 3] = Math.cos(theta) * r * radius;
    out[i * 3 + 1] = y * radius;
    out[i * 3 + 2] = Math.sin(theta) * r * radius;
  }

  // Distribute ring points across three orthogonal great circles for added structure
  const ringRadius = radius * 1.04;
  for (let i = 0; i < N_RING; i++) {
    const ringIdx = i % 3;
    const t = (i / N_RING) * Math.PI * 2;
    let x = 0, y = 0, z = 0;
    if (ringIdx === 0) { x = Math.cos(t) * ringRadius; y = Math.sin(t) * ringRadius; }
    else if (ringIdx === 1) { x = Math.cos(t) * ringRadius; z = Math.sin(t) * ringRadius; }
    else { y = Math.cos(t) * ringRadius; z = Math.sin(t) * ringRadius; }
    const idx = N_SPHERE + i;
    out[idx * 3] = x + (Math.random() - 0.5) * 0.02;
    out[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.02;
    out[idx * 3 + 2] = z + (Math.random() - 0.5) * 0.02;
  }

  return out;
}
