// Geometric intermediate state: a stylized globe of Earth with great-circle arcs
// converging on Gainesville, FL (orange). Drawn with rough continent silhouettes
// and a handful of source-city → Gainesville arcs. The whole thing rotates in the
// shader during the hold phase.

const GAINESVILLE = { lat: 29.65, lon: -82.32 };

// Source cities for arcs converging on Gainesville. Kept to a tight set of 5
// so the staggered drawing reads clearly — 4 US (NYC, Chicago, Seattle, SF)
// plus London to show transatlantic reach.
const SOURCES = [
  { lat: 40.71, lon: -74.00 },   // New York
  { lat: 41.88, lon: -87.63 },   // Chicago
  { lat: 47.61, lon: -122.33 },  // Seattle
  { lat: 37.77, lon: -122.42 },  // San Francisco
  { lat: 51.51, lon: -0.13 },    // London
];

// Rough continent silhouettes in [lon, lat] points (counterclockwise).
// Hand-drawn polygons — recognizable as Earth at particle density.
type LonLat = [number, number];
const CONTINENTS: LonLat[][] = [
  // North America
  [
    [-167, 65], [-140, 70], [-95, 70], [-75, 55], [-58, 48],
    [-65, 44], [-80, 30], [-96, 28], [-105, 22], [-115, 22],
    [-125, 35], [-130, 50], [-150, 58], [-167, 60],
  ],
  // Central America (small bridge)
  [
    [-105, 22], [-92, 18], [-85, 12], [-80, 9], [-77, 8], [-95, 16], [-105, 22],
  ],
  // South America
  [
    [-80, 12], [-70, 12], [-55, 6], [-38, -5], [-35, -22],
    [-50, -35], [-65, -42], [-72, -54], [-72, -45], [-78, -10], [-80, 0], [-80, 12],
  ],
  // Africa
  [
    [-17, 33], [10, 38], [33, 32], [42, 18], [50, 12],
    [51, -2], [41, -15], [37, -28], [22, -35], [12, -10],
    [8, 4], [-7, 5], [-17, 14], [-17, 33],
  ],
  // Europe
  [
    [-10, 38], [5, 43], [12, 45], [25, 40], [30, 47],
    [40, 50], [50, 55], [40, 65], [25, 70], [10, 65],
    [-5, 60], [-10, 50], [-10, 38],
  ],
  // Asia
  [
    [30, 47], [50, 50], [70, 55], [90, 60], [120, 55],
    [140, 55], [145, 45], [135, 35], [120, 22], [105, 12],
    [95, 18], [80, 22], [70, 28], [60, 30], [50, 35], [40, 38], [30, 47],
  ],
  // India peninsula
  [
    [68, 23], [80, 22], [88, 22], [89, 12], [80, 8], [73, 14], [68, 23],
  ],
  // Southeast Asia (rough)
  [
    [100, 12], [110, 5], [120, 0], [118, -8], [105, -7], [100, 1], [100, 12],
  ],
  // Australia
  [
    [113, -13], [128, -12], [142, -10], [152, -25], [148, -38], [128, -35], [115, -33], [113, -25], [113, -13],
  ],
  // Greenland
  [
    [-50, 60], [-35, 60], [-22, 70], [-25, 82], [-45, 82], [-55, 75], [-50, 60],
  ],
];

function pointInPolygon(lon: number, lat: number, poly: LonLat[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    if (yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi + 1e-9) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function isLand(lat: number, lon: number): boolean {
  for (const poly of CONTINENTS) {
    if (pointInPolygon(lon, lat, poly)) return true;
  }
  return false;
}

function latLonToVec3(lat: number, lon: number, radius: number): [number, number, number] {
  // Standard spherical → cartesian. Y is up (north pole).
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return [x, y, z];
}

function greatCircleArc(
  startLat: number, startLon: number,
  endLat: number, endLon: number,
  t: number, radius: number, lift: number
): [number, number, number] {
  const a = latLonToVec3(startLat, startLon, 1);
  const b = latLonToVec3(endLat, endLon, 1);
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  const sinOmega = Math.sin(omega);
  if (sinOmega < 1e-6) {
    return latLonToVec3(startLat, startLon, radius);
  }
  const ca = Math.sin((1 - t) * omega) / sinOmega;
  const cb = Math.sin(t * omega) / sinOmega;
  const x = ca * a[0] + cb * b[0];
  const y = ca * a[1] + cb * b[1];
  const z = ca * a[2] + cb * b[2];
  // Arch the arc above the surface for a cleaner look
  const lf = 1 + lift * 4 * t * (1 - t);
  return [x * radius * lf, y * radius * lf, z * radius * lf];
}

export function generateEarthTargets(count: number): {
  positions: Float32Array;
  colors: Float32Array;
  arcProgress: Float32Array;
} {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  // arcProgress: 0 for non-arc particles (always visible during globe phase),
  // (0, 1] for arc particles indicating when they should appear as the
  // "drawing wavefront" sweeps from source → Gainesville over time.
  const arcProgress = new Float32Array(count);
  const radius = 2.4;

  // Allocation
  const N_GAINESVILLE = Math.floor(count * 0.012);
  const N_ARC_TOTAL  = Math.floor(count * 0.16);
  const N_OCEAN      = Math.floor(count * 0.10);
  const N_LAND       = count - N_GAINESVILLE - N_ARC_TOTAL - N_OCEAN;
  // ~22% of land particles are warm "city lights" — keeps orange present
  // during the globe phase so it doesn't disappear between swirl and gator.
  const ORANGE_LAND_FRACTION = 0.22;

  let idx = 0;
  const put = (
    x: number,
    y: number,
    z: number,
    r: number,
    g: number,
    b: number,
    arcT: number = 0
  ) => {
    if (idx >= count) return;
    positions[idx * 3] = x;
    positions[idx * 3 + 1] = y;
    positions[idx * 3 + 2] = z;
    colors[idx * 3] = r;
    colors[idx * 3 + 1] = g;
    colors[idx * 3 + 2] = b;
    arcProgress[idx] = arcT;
    idx++;
  };

  // 1) Land particles — sample sphere surface, accept only land cells.
  //    Color: pale cyan/white (terrestrial)
  let landFilled = 0;
  let attempts = 0;
  const maxAttempts = N_LAND * 12;
  while (landFilled < N_LAND && attempts < maxAttempts) {
    attempts++;
    // Uniform sphere sample
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const cosPhi = 2 * v - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const x = sinPhi * Math.cos(theta);
    const y = cosPhi;
    const z = sinPhi * Math.sin(theta);

    const lat = (Math.asin(y) * 180) / Math.PI;
    const lon = (Math.atan2(z, -x) * 180) / Math.PI;

    if (isLand(lat, lon)) {
      // Slight surface lift to make continents pop above ocean particles
      const lift = 1.012;
      // Some land particles are colored as warm "city lights" — distributes
      // orange across the globe so the warm palette never fully disappears.
      const isCity = Math.random() < ORANGE_LAND_FRACTION;
      const tint = 0.80 + Math.random() * 0.20;
      let r, g, b;
      if (isCity) {
        // UF orange / amber, slightly varied per particle
        r = (0.92 + Math.random() * 0.08) * tint;
        g = (0.30 + Math.random() * 0.18) * tint;
        b = (0.06 + Math.random() * 0.10) * tint;
      } else {
        // Pale cyan/white land
        r = 0.48 * tint;
        g = 0.78 * tint;
        b = 0.94 * tint;
      }
      put(x * radius * lift, y * radius * lift, z * radius * lift, r, g, b);
      landFilled++;
    }
  }
  // If we couldn't fill all land (unlikely), pad with dim ocean
  while (landFilled < N_LAND) {
    put(0, 0, 0, 0.05, 0.10, 0.18);
    landFilled++;
  }

  // 2) Ocean particles — sparse, dim blue-gray, on sphere surface
  for (let i = 0; i < N_OCEAN; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * Math.PI * 2;
    const cosPhi = 2 * v - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const x = sinPhi * Math.cos(theta);
    const y = cosPhi;
    const z = sinPhi * Math.sin(theta);
    put(x * radius, y * radius, z * radius, 0.10, 0.18, 0.30);
  }

  // 3) Great-circle arcs — from each source city to Gainesville. Each arc gets
  //    a staggered drawing window so the shader can sweep them in sequentially.
  const N_SOURCES = SOURCES.length;
  const N_PER_ARC = Math.floor(N_ARC_TOTAL / N_SOURCES);
  // Each arc's drawing window inside the [0, 1] progress timeline.
  //   arc i starts at i * STAGGER, takes DURATION to draw
  const DURATION = 0.34;
  const STAGGER = (1.0 - DURATION) / Math.max(1, N_SOURCES - 1);
  for (let s = 0; s < N_SOURCES; s++) {
    const src = SOURCES[s];
    const arcStart = s * STAGGER;
    for (let i = 0; i < N_PER_ARC; i++) {
      const t = i / Math.max(1, N_PER_ARC - 1);
      const [x, y, z] = greatCircleArc(
        src.lat, src.lon,
        GAINESVILLE.lat, GAINESVILLE.lon,
        t, radius, 0.22
      );
      // Color: arc gets warmer (orange) the closer it is to Gainesville
      const ramp = Math.pow(t, 1.6);
      const r = 0.55 + 0.45 * ramp;
      const g = 0.82 - 0.45 * ramp;
      const b = 1.00 - 0.85 * ramp;
      // Slight jitter
      const jx = (Math.random() - 0.5) * 0.018;
      const jy = (Math.random() - 0.5) * 0.018;
      const jz = (Math.random() - 0.5) * 0.018;
      // arcProgress encodes when this particle becomes visible: source side
      // (t=0) appears at arcStart, destination side at arcStart + DURATION.
      // Clamped to [epsilon, 1] so 0 stays reserved for "always visible".
      const visAt = Math.min(1.0, arcStart + t * DURATION + 0.001);
      put(x + jx, y + jy, z + jz, r, g, b, visAt);
    }
  }

  // 4) Gainesville cluster — bright orange, sitting just above the Florida surface
  const [gxRaw, gyRaw, gzRaw] = latLonToVec3(GAINESVILLE.lat, GAINESVILLE.lon, radius);
  // Build a small tangent-plane basis at Gainesville to keep the cluster flat on the sphere
  const nLen = Math.hypot(gxRaw, gyRaw, gzRaw);
  const nx = gxRaw / nLen, ny = gyRaw / nLen, nz = gzRaw / nLen;
  // Tangent vector 1 — choose east-ish (perpendicular to north pole and normal)
  let t1x = -nz, t1y = 0, t1z = nx;
  const t1L = Math.hypot(t1x, t1y, t1z);
  t1x /= t1L; t1y /= t1L; t1z /= t1L;
  // Tangent vector 2 — cross of normal × t1
  const t2x = ny * t1z - nz * t1y;
  const t2y = nz * t1x - nx * t1z;
  const t2z = nx * t1y - ny * t1x;
  const gLift = radius * 1.04;
  for (let i = 0; i < N_GAINESVILLE; i++) {
    const ang = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 0.10;
    const dx = Math.cos(ang) * r;
    const dy = Math.sin(ang) * r;
    const x = nx * gLift + t1x * dx + t2x * dy;
    const y = ny * gLift + t1y * dx + t2y * dy;
    const z = nz * gLift + t1z * dx + t2z * dy;
    put(x, y, z, 1.0, 0.32, 0.10); // UF orange
  }

  // Pad any remaining slots
  while (idx < count) put(0, 0, 0, 0.05, 0.10, 0.18);

  return { positions, colors, arcProgress };
}
