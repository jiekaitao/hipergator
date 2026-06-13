// Particle shader — used only for the gator-formation stage of the hero.
// The earth globe is rendered separately by the cobe library.

export const particleVertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aRandom;

  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;

  varying vec3 vColor;
  varying float vAlpha;

  // -- simplex noise (Ashima/Stefan Gustavson) -----------------------
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  vec3 curl(vec3 p) {
    float e = 0.12;
    float n1, n2;
    n1 = snoise(vec3(p.x, p.y + e, p.z));
    n2 = snoise(vec3(p.x, p.y - e, p.z));
    float dx = (n1 - n2) / (2.0 * e);
    n1 = snoise(vec3(p.x, p.y, p.z + e));
    n2 = snoise(vec3(p.x, p.y, p.z - e));
    float dy = (n1 - n2) / (2.0 * e);
    n1 = snoise(vec3(p.x + e, p.y, p.z));
    n2 = snoise(vec3(p.x - e, p.y, p.z));
    float dz = (n1 - n2) / (2.0 * e);
    return vec3(dy - dz, dz - dx, dx - dy);
  }
  // -- end noise -----------------------------------------------------

  void main() {
    // Single-stage timeline: scattered particles converge into the gator silhouette.
    //   0.0 – 0.6s : convergence (30% slower than the prior tight pacing)
    //   0.6+       : settled, gentle breathing
    float toGator   = smoothstep(0.0, 0.6, uTime);
    float settled   = smoothstep(0.6, 1.1, uTime);

    // Initial position gets a small curl-noise drift that fades as we converge.
    vec3 startPos = position;
    vec3 cn = curl(startPos * 0.15 + vec3(uTime * 0.2));
    startPos += cn * 0.45 * (1.0 - toGator);

    vec3 pos = mix(startPos, aTarget, toGator);

    // Breathing once settled
    float breathe = sin(uTime * 1.8 + aRandom * 6.2831) * 0.012;
    pos.z += breathe * settled;
    pos.y += sin(uTime * 1.2 + aRandom * 4.0) * 0.005 * settled;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    // Point size: bigger while scattered, smaller once on the gator
    float sizeMix = mix(1.05, 0.65, toGator);
    float pSize = uSize * sizeMix * (135.0 / -mvPosition.z) * (0.55 + aRandom * 0.55);
    // NVIDIA stencil particles are rendered MUCH smaller so the 16x16 bitmap
    // reads as crisp pixels instead of a glowing blob.
    float isNvidiaSize = step(0.30, aTarget.z);
    pSize *= mix(1.0, 0.32, isNvidiaSize);
    gl_PointSize = pSize * uPixelRatio;

    // Palette by destination, by aTarget.z layer:
    //   gator body (orange/amber)  : aTarget.z  < 0.13
    //   server frame & LEDs (cyan) : 0.13 ≤ aTarget.z < 0.30
    //   NVIDIA stencil (green)     : aTarget.z ≥ 0.30
    vec3 cOrange = vec3(0.980, 0.275, 0.086);
    vec3 cAmber  = vec3(1.000, 0.720, 0.230);
    vec3 cCyan   = vec3(0.412, 0.878, 1.000);
    vec3 cGreen  = vec3(0.060, 0.380, 0.000); // green-dominant: red stays low so additive sums don't blow to white
    vec3 cWhite  = vec3(1.0);

    float isServer = step(0.13, aTarget.z);
    float isNvidia = step(0.30, aTarget.z);

    // Particles in flight start warm (so the orange palette is present
    // throughout the convergence) and snap to their destination color.
    vec3 inflight = mix(cOrange, cAmber, smoothstep(0.0, 0.5, toGator) * 0.4);

    vec3 gatorSettled  = mix(cOrange, cAmber, 0.30);
    vec3 serverSettled = cCyan;
    vec3 nvidiaSettled = cGreen;
    vec3 targetCol = mix(gatorSettled, serverSettled, isServer);
    targetCol = mix(targetCol, nvidiaSettled, isNvidia);

    vec3 c2 = mix(inflight, targetCol, toGator);

    // LED flash after settle
    float ledBoost = step(0.18, aTarget.z) * (1.0 - isNvidia) * settled;
    float flicker = step(0.985, fract(sin(aRandom * 91.3) * 43758.5 + uTime * 0.5));
    vColor = mix(c2, cWhite, ledBoost * flicker);

    // Alpha: low while in flight, full when settled
    vAlpha = mix(0.22, 0.42, toGator) * (0.55 + aRandom * 0.45);
    // NVIDIA stencil at slightly reduced alpha so green stays green
    vAlpha *= mix(1.0, 0.85, isNvidia * toGator);
  }
`;

export const particleFragmentShader = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 uv = gl_PointCoord.xy - 0.5;
    float d = length(uv);
    if (d > 0.5) discard;

    float core = smoothstep(0.5, 0.0, d);
    float glow = smoothstep(0.5, 0.28, d);

    vec3 col = vColor * (0.55 + core * 0.55);
    float a = glow * vAlpha;

    gl_FragColor = vec4(col, a);
  }
`;
