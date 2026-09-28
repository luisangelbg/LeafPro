/* LeafPro — parametric leaf engine.
   One engine draws every leaf in the app (atlas plates, builder, quizzes,
   compound leaves, phyllotaxy sprigs) from a small model:

     { shape, apex, base, margin, lobing, venation, petiole, falcate,
       oblique, stipules, sheath }

   The blade is built as a half outline sampled from the base (y = 0) to the
   apex (y = -L on screen; internally t goes 0 → 1), mirrored, decorated with
   marginal teeth along the local normals, and closed. Veins are clipped to
   the blade with an SVG clipPath, so every venation pattern fits every
   outline. Colours are CSS variables, so the drawings follow the theme. */

(function () {
  const TAU = Math.PI * 2;
  let UID = 0;
  /* a drawing inlined more than once in the same figure gets fresh clip ids on
     every copy, so no id is repeated in the page and each url(#…) finds its own */
  let COPY = 0;
  const fresh = s => { const k = ++COPY; return s.replace(/(id="|url\(#)(lf\d+c)(?=[")])/g, "$1$2_" + k); };

  /* ---------------- width profiles (half-width along the midrib) ----------------
     beta(t) is a smooth bump: 1 at the widest point tp, 0 at both ends.
     m = sharpness (higher → narrower blade ends); plateau flattens the middle
     (oblong, linear). ar = length / width of the blade. */
  function beta(t, tp, m) {
    t = Math.min(0.9999, Math.max(0.0001, t));
    const a = 1 + tp * m, b = 1 + (1 - tp) * m;
    const f = Math.pow(t, a - 1) * Math.pow(1 - t, b - 1);
    const fm = Math.pow(tp, a - 1) * Math.pow(1 - tp, b - 1) || 1;
    return f / fm;
  }
  function plateau(f, k) { if (!k) return f; const s = 1 + k * 7; return Math.tanh(s * f) / Math.tanh(s); }

  /* Blade shapes. ar = length/width, tp = widest point (0 base … 1 apex),
     m = sharpness, pl = plateau. Some shapes preset a base or apex or extras. */
  const SHAPES = {
    acicular:     { ar: 14,  tp: 0.45, m: 2.2, pl: 0.55 },
    linear:       { ar: 8,   tp: 0.5,  m: 1.6, pl: 0.75 },
    oblonga:      { ar: 2.4, tp: 0.5,  m: 2.2, pl: 0.8 },
    eliptica:     { ar: 2.0, tp: 0.5,  m: 2.6 },
    ovada:        { ar: 1.7, tp: 0.34, m: 2.6 },
    obovada:      { ar: 1.7, tp: 0.66, m: 2.6 },
    lanceolada:   { ar: 3.6, tp: 0.3,  m: 2.4 },
    oblanceolada: { ar: 3.6, tp: 0.7,  m: 2.4 },
    espatulada:   { ar: 2.6, tp: 0.78, m: 3.2, base: 'atenuada', apex: 'redondeado' },
    orbicular:    { ar: 1.05, tp: 0.5, m: 3.4, apex: 'redondeado', base: 'redondeada' },
    romboidal:    { ar: 1.6, tp: 0.5,  m: 1.05 },
    deltoide:     { ar: 1.15, tp: 0.12, m: 1.15, base: 'truncada' },
    cordiforme:   { ar: 1.25, tp: 0.3, m: 2.8, base: 'cordada' },
    obcordada:    { ar: 1.3, tp: 0.72, m: 3.0, apex: 'emarginado', base: 'cuneada' },
    reniforme:    { ar: 0.72, tp: 0.5, m: 3.6, base: 'cordada', apex: 'redondeado' },
    sagitiforme:  { ar: 1.7, tp: 0.25, m: 2.2, base: 'sagitada' },
    hastiforme:   { ar: 1.8, tp: 0.25, m: 2.0, base: 'hastada' },
    falcada:      { ar: 4.2, tp: 0.4,  m: 2.4, falcate: 0.55 },
    flabelada:    { ar: 0.95, tp: 0.86, m: 3.6, base: 'cuneada', apex: 'truncado', venation: 'dicotomica' },
    panduriforme: { ar: 2.1, tp: 0.72, m: 2.8, waist: { at: 0.42, depth: 0.42, width: 0.22 }, base: 'redondeada' },
    lirada:       { ar: 2.3, tp: 0.8,  m: 2.8, lobing: { mode: 'pinnati', n: 3, depth: 0.62, sharp: 0.25, from: 0.06, to: 0.62 }, base: 'truncada' },
    runcinada:    { ar: 2.8, tp: 0.75, m: 2.4, lobing: { mode: 'pinnati', n: 4, depth: 0.72, sharp: 0.85, lean: -0.65, from: 0.05, to: 0.8 } },
    espatula_ancha: { ar: 1.9, tp: 0.8, m: 3.4, base: 'atenuada', apex: 'redondeado' },
    oval:         { ar: 1.35, tp: 0.5, m: 2.9 },
    trulada:      { ar: 1.5, tp: 0.32, m: 1.05, base: 'cuneada' },
    obtrulada:    { ar: 1.5, tp: 0.68, m: 1.05 },
    ensiforme:    { ar: 7,   tp: 0.3, m: 1.5, pl: 0.6, venation: 'paralela' },
    subulada:     { ar: 8,   tp: 0.12, m: 1.4, base: 'truncada', venation: 'uninervia' },
    filiforme:    { ar: 20,  tp: 0.5, m: 1.2, pl: 0.5, venation: 'uninervia' },
  };

  /* Apices: wf(t’) reshapes the half-width in the apex zone (t’ = 0 at the
     start of the zone, 1 at the tip); some add a notch or an appendage. */
  const APICES = {
    agudo:      { za: 0.24, wf: u => 1 - u },
    acuminado:  { za: 0.34, wf: u => Math.pow(1 - u, 0.62), tip: 0.1 },
    obtuso:     { za: 0.2,  wf: u => Math.pow(1 - u, 0.5) },
    redondeado: { za: 0.22, round: true },
    truncado:   { za: 0.1,  trunc: 0.86 },
    emarginado: { za: 0.16, notch: 0.14, round: true },
    retuso:     { za: 0.12, notch: 0.05, round: true },
    mucronado:  { za: 0.2,  round: true, mucro: 0.055 },
    apiculado:  { za: 0.2,  round: true, mucro: 0.09, soft: true },
    cuspidado:  { za: 0.26, wf: u => Math.pow(1 - u, 0.35), tip: 0.12 },
    aristado:   { za: 0.2,  wf: u => Math.pow(1 - u, 0.75), arista: 0.2 },
    caudado:    { za: 0.4,  wf: u => Math.pow(1 - u, 0.5), tip: 0.24 },
    pungente:   { za: 0.24, wf: u => Math.pow(1 - u, 0.85), spineTip: true },
    bilobado:   { za: 0.2,  notch: 0.28, round: true },
  };

  /* Bases: either reshape the width near the base, or add basal lobes that
     hang below the insertion. zb = length of the basal zone (as t). */
  const BASES = {
    cuneada:    { zb: 0.22, wf: u => u * (2 - u) * 0.5 + u * 0.5 },      /* almost straight wedge */
    atenuada:   { zb: 0.34, wf: u => Math.pow(u, 1.7) },
    decurrente: { zb: 0.3,  wf: u => Math.pow(u, 1.5), wings: true },
    obtusa:     { zb: 0.18, wf: u => Math.pow(u, 0.62) },
    redondeada: { zb: 0.18, round: true },
    truncada:   { zb: 0.08, trunc: 0.82 },
    oblicua:    { zb: 0.2,  wf: u => Math.pow(u, 0.7), oblique: 0.6 },
    cordada:    { zb: 0.16, lobe: { depth: 0.16, width: 0.62, out: 0.12, round: 1 } },
    auriculada: { zb: 0.14, lobe: { depth: 0.1, width: 0.34, out: 0.05, round: 1 } },
    sagitada:   { zb: 0.16, lobe: { depth: 0.24, width: 0.4, out: -0.05, round: 0.15 } },
    hastada:    { zb: 0.16, lobe: { depth: 0.06, width: 0.55, out: 0.65, round: 0.15 } },
    amplexicaule: { zb: 0.14, lobe: { depth: 0.13, width: 0.5, out: 0.1, round: 1 }, stem: true },
    peltada:    { zb: 0.18, round: true, peltate: true },
    envainadora: { zb: 0.1, wf: u => Math.pow(u, 0.8), sheath: true },
  };

  /* Margins: a tooth waveform cut into the outline. per = tooth period as a
     fraction of the blade length; amp = tooth depth relative to the local
     half-width; f(u) = 0 (sinus) … 1 (tooth apex) over one period.
     lean > 0 tilts the tooth apex towards the leaf apex (serrate). */
  const MARGINS = {
    entero:       null,
    ondulado:     { per: 0.16, amp: 0.055, wave: true },
    sinuado:      { per: 0.3, amp: 0.14, wave: true },
    crenado:      { per: 0.11, amp: 0.09, f: u => Math.sqrt(Math.max(0, Math.sin(Math.PI * u))) },
    crenulado:    { per: 0.055, amp: 0.045, f: u => Math.sqrt(Math.max(0, Math.sin(Math.PI * u))) },
    dentado:      { per: 0.11, amp: 0.11, f: u => 1 - Math.abs(2 * u - 1) },
    denticulado:  { per: 0.05, amp: 0.05, f: u => 1 - Math.abs(2 * u - 1) },
    aserrado:     { per: 0.1, amp: 0.11, lean: 0.72 },
    serrulado:    { per: 0.045, amp: 0.05, lean: 0.72 },
    biserrado:    { per: 0.13, amp: 0.13, lean: 0.7, minor: { per: 0.045, amp: 0.05 } },
    espinoso:     { per: 0.17, amp: 0.13, f: u => Math.pow(1 - Math.abs(2 * u - 1), 2.6), spines: true },
    ciliado:      { per: 0.045, amp: 0, hairs: true },
    revoluto:     { per: 0, amp: 0, rolled: true },
    eroso:        { per: 0.06, amp: 0.055, f: u => 0.5 + 0.5 * Math.sin(TAU * (u + 0.4 * Math.sin(TAU * u * 3.7) + 0.2 * Math.sin(TAU * u * 7.3))) },
  };

  /* Venations */
  const VENATIONS = ['uninervia', 'hifodroma', 'pinnada', 'craspedodroma', 'semicraspedodroma',
    'camptodroma', 'broquidodroma', 'palmada', 'paralela', 'transversa', 'curvinervia',
    'campilodroma', 'dicotomica'];

  /* ---------------- outline construction ---------------- */

  function bezier(p0, p1, p2, p3, n, out) {
    for (let i = 1; i <= n; i++) {
      const u = i / n, v = 1 - u;
      out.push([
        v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
        v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
      ]);
    }
  }

  /* Half outline for side s = +1 (right) or -1 (left); y grows towards the
     apex (screen flip happens at the end). Returns array of [x, y, t]. */
  function halfOutline(md, s, L, W) {
    const sh = SHAPES[md.shape] || SHAPES.eliptica;
    const ap = APICES[md.apex] || APICES.agudo;
    const ba = BASES[md.base] || BASES.cuneada;
    const W2 = W / 2;
    const zb = ba.zb || 0.16, za = ap.za || 0.2;
    const lob = md.lobing || sh.lobing || null;
    const waist = sh.waist || null;
    const N = 150;

    /* raw half-width at t */
    function w(t) {
      let f = plateau(beta(t, sh.tp, sh.m), sh.pl || 0);
      if (waist) {
        const d = (t - waist.at) / waist.width;
        f *= 1 - waist.depth * Math.exp(-d * d * 3);
      }
      if (lob && lob.mode === 'pinnati') {
        const from = lob.from ?? 0.08, to = lob.to ?? 0.9;
        if (t > from && t < to) {
          let u = (t - from) / (to - from);
          u += (lob.lean || 0) * 0.5 * Math.sin(Math.PI * u) / lob.n;
          const c = 0.5 - 0.5 * Math.cos(TAU * (lob.n - 0.5) * u); /* 0 at lobe apex, 1 at sinus */
          const sharp = lob.sharp ?? 0.4;
          const cut = Math.pow(c, 1 - 0.6 * sharp);
          const fade = Math.sin(Math.PI * Math.min(1, u * 1.15));
          f *= 1 - lob.depth * cut * fade;
        }
      }
      return W2 * Math.max(f, 0.015);
    }

    const pts = [];
    /* --- basal zone --- */
    const yb = zb * L, wb = w(zb);
    if (ba.lobe) {
      const lo = ba.lobe, ld = lo.depth * L, lw = lo.width * W2, lo2 = lo.out * W2;
      /* from the insertion point down and out into the lobe, then up to the blade */
      const tipX = lw + lo2, tipY = -ld;
      if (lo.round > 0.5) {
        bezier([0, 0], [lw * 0.25, -ld * 0.9], [tipX + lw * 0.32, tipY - ld * 0.18], [tipX, tipY], 12, pts);
        bezier([tipX, tipY], [tipX + lw * 0.4, tipY + ld * 0.75], [wb * 1.06, yb * 0.28], [wb, yb], 14, pts);
      } else {
        bezier([0, 0], [lw * 0.4, -ld * 0.55], [tipX * 0.8, tipY * 0.9], [tipX, tipY], 8, pts);
        bezier([tipX, tipY], [tipX * 0.95, tipY * 0.4], [wb * 1.02, yb * 0.3], [wb, yb], 10, pts);
      }
    } else if (ba.round) {
      for (let i = 1; i <= 14; i++) {
        const u = i / 14, t = zb * u;
        const r = Math.sqrt(Math.max(0, 1 - (1 - u) * (1 - u)));
        pts.push([w(t) * Math.max(r, u * 0.4), t * L, t]);
      }
    } else if (ba.trunc) {
      pts.push([wb * ba.trunc, 0.004 * L, 0.004]);
      bezier([wb * ba.trunc, 0.004 * L], [wb * (ba.trunc + 0.1), yb * 0.3], [wb, yb * 0.7], [wb, yb], 8, pts);
    } else {
      const obq = (ba.oblique || 0) * (md.oblique ?? 1);
      const dy = s === -1 ? obq * 0.1 * L : 0; /* one side starts higher */
      for (let i = 1; i <= 16; i++) {
        const u = i / 16, t = zb * u;
        pts.push([w(t) * (ba.wf ? ba.wf(u) / (ba.wf(1) || 1) : u), dy + t * (L - dy / 1) * 1, t]);
      }
    }
    /* --- middle zone --- */
    const t1 = 1 - za;
    const steps = Math.max(30, Math.round(N * (t1 - zb)));
    for (let i = 1; i <= steps; i++) {
      const t = zb + (t1 - zb) * (i / steps);
      pts.push([w(t), t * L, t]);
    }
    /* --- apical zone --- */
    const wa = w(t1);
    if (ap.round || ap.notch != null) {
      const nd = (ap.notch || 0) * L;
      if (ap.notch != null && ap.notch > 0.02) {
        const shoulder = 0.3 * W / 2;
        bezier([wa, t1 * L], [wa * 0.96, L - nd * 0.1], [shoulder * 1.7, L + nd * 0.35], [shoulder, L], 12, pts);
        bezier([shoulder, L], [shoulder * 0.45, L - nd * 0.5], [0, L - nd * 0.8], [0, L - nd], 8, pts);
      } else {
        for (let i = 1; i <= 16; i++) {
          const u = i / 16, t = t1 + za * u;
          const r = Math.sqrt(Math.max(0, 1 - u * u));
          pts.push([w(Math.min(t, 0.999)) * Math.max(r, (1 - u) * 0.3), t * L, t]);
        }
        pts.push([0, L, 1]);
      }
    } else if (ap.trunc) {
      bezier([wa, t1 * L], [wa, L * 0.985], [wa * ap.trunc, L], [wa * ap.trunc * 0.9, L], 6, pts);
      pts.push([0, L, 1]);
    } else {
      const tipL = (ap.tip || 0) * L;
      for (let i = 1; i <= 20; i++) {
        const u = i / 20, t = t1 + za * u;
        pts.push([wa * (ap.wf ? ap.wf(u) : 1 - u) * (1 - u * 0.04), t * L + tipL * Math.pow(u, 3), t]);
      }
      pts.push([0, L + tipL, 1]);
    }
    /* attach t where missing (bezier-built points) */
    let lastT = 0;
    for (const p of pts) { if (p[2] == null) p[2] = lastT >= 0 ? Math.max(0, Math.min(1, p[1] / L)) : 0; lastT = p[2]; }
    /* mirror for the left side */
    if (s === -1) for (const p of pts) p[0] = -p[0];
    return pts;
  }

  /* Palmately lobed blades (fig, castor bean, cassava): the outline is built
     in polar coordinates around the point where the primary veins radiate.
     Returns one half (side s), from the insertion point to the apex. */
  function palmateHalf(md, s, L, W) {
    const lob = md.lobing;
    const perSide = Math.max(1, lob.n || 2);
    const thMax = 108 * Math.PI / 180;
    const dlt = thMax / (perSide + 0.5);          /* angular spacing of lobes */
    const depth = lob.depth ?? 0.5, sharp = lob.sharp ?? 0.4;
    const R = L, kx = (W / 2) / (R * 0.88);
    const pts = [[0, 0, 0]];
    const N = 110;
    for (let i = N; i >= 0; i--) {
      const th = thMax * (i / N);                  /* sweep basal → apex */
      const u = th / dlt;                          /* lobe coordinate */
      const c = 0.5 - 0.5 * Math.cos(TAU * u);     /* 0 at lobe apex, 1 at sinus */
      const cut = Math.pow(c, 1 - 0.6 * sharp);
      const taper = 1 - 0.32 * Math.pow(th / thMax, 2.2);
      const r = R * taper * (1 - depth * cut);
      const t = 1 - i / N;
      pts.push([Math.sin(th) * r * kx * s, Math.cos(th) * r, Math.max(0.02, t)]);
    }
    pts[pts.length - 1][2] = 1;
    return pts;
  }

  /* marginal teeth: displace the outline inwards along local normals */
  function applyMargin(pts, md, L, W, side) {
    const mg = MARGINS[md.margin || 'entero'];
    if (!mg || (!mg.amp && !mg.hairs)) return { pts, decor: [] };
    const per = mg.per * L, out = [], decor = [];
    /* arc length */
    let s = 0;
    const arcs = [0];
    for (let i = 1; i < pts.length; i++) {
      s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      arcs.push(s);
    }
    const total = s;
    for (let i = 0; i < pts.length; i++) {
      const [x, y, t] = pts[i];
      /* local normal */
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let nx = (b[1] - a[1]), ny = -(b[0] - a[0]);
      const nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl;
      if (side === -1) { nx = -nx; ny = -ny; }
      /* teeth only on the blade flanks, fading at base and apex */
      const fade = Math.pow(Math.sin(Math.PI * Math.min(Math.max((t - 0.03) / 0.94, 0), 1)), 0.5);
      let d = 0;
      const u0 = (arcs[i] / per) % 1;
      if (mg.amp) {
        const amp = mg.amp * W * fade;
        let u = u0;
        if (mg.lean) u = Math.pow(u, 1 - mg.lean * 0.62);          /* saw teeth lean forward */
        const prof = mg.f ? mg.f(u) : (mg.wave ? 0.5 + 0.5 * Math.sin(TAU * u) : Math.sin(Math.PI * u));
        d = mg.wave ? amp * (prof - 0.5) * 2 : -amp * (1 - prof);   /* cut sinuses inwards */
        if (mg.minor) {
          const u2 = (arcs[i] / (mg.minor.per * L)) % 1;
          d -= mg.minor.amp * W * fade * (1 - Math.pow(u2, 0.45));
        }
        if (mg.spines && prof > 0.94 && arcs[i] - (decor.spineLast || -9) > per * 0.8) {
          decor.push({ kind: 'spine', x: x + nx * 6, y: y + ny * 6, nx, ny });
          decor.spineLast = arcs[i];
        }
      }
      if (mg.hairs && fade > 0.25 && i % 4 === 0) decor.push({ kind: 'hair', x, y, nx, ny });
      out.push([x + nx * d, y + ny * d, t]);
    }
    return { pts: out, decor };
  }

  function toPath(pts, flipY) {
    return pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + (flipY ? -p[1] : p[1]).toFixed(1)).join('');
  }

  /* ---------------- venation ---------------- */
  /* find the outline x at height t on one side (after teeth) */
  function xAt(pts, t) {
    let best = null, bd = 1e9;
    for (const p of pts) { const d = Math.abs(p[2] - t); if (d < bd) { bd = d; best = p; } }
    return best;
  }

  function veinPaths(md, L, W, right, left, uid) {
    const v = md.venation || 'craspedodroma';
    const P = [];
    const mid = `M0,0 C ${(md.falcate || 0) * L * 0.1},${-L * 0.4} ${(md.falcate || 0) * L * 0.3},${-L * 0.75} ${(md.falcate || 0) * L * 0.42},${-L}`;
    const lob = md.lobing || (SHAPES[md.shape] || {}).lobing;
    if (v === 'uninervia' || v === 'hifodroma') return { mid, sec: [], ter: [] };

    if (v === 'paralela' || v === 'curvinervia' || v === 'campilodroma') {
      const n = v === 'paralela' ? 8 : v === 'campilodroma' ? 3 : 4;
      const sec = [];
      for (let k = 1; k <= n; k++) {
        for (const side of [1, -1]) {
          const f = v === 'campilodroma' ? (0.55 + 0.45 * k / n) : k / (n + 0.4);
          let dPath = 'M0,0';
          for (let i = 1; i <= 22; i++) {
            const t = i / 22;
            const o = xAt(side === 1 ? right : left, t);
            const conv = v === 'curvinervia' ? Math.sin(Math.PI * t) ** 0.8
              : v === 'campilodroma' ? Math.sin(Math.PI * t) ** 0.5
              : Math.sin(Math.PI * t) ** 0.35;
            dPath += `L${(o[0] * f * conv * 0.94).toFixed(1)},${(-t * L).toFixed(1)}`;
          }
          sec.push(dPath);
        }
      }
      return { mid, sec, ter: [] };
    }

    if (v === 'transversa') { /* penni-parallel: banana, Heliconia */
      const sec = [];
      for (let t = 0.05; t < 0.96; t += 0.05) {
        for (const side of [1, -1]) {
          const o = xAt(side === 1 ? right : left, Math.min(t + 0.06, 0.97));
          const sy = t * L;
          sec.push(`M0,${(-sy).toFixed(1)} Q ${(o[0] * 0.5).toFixed(1)},${(-(sy + (o[1] - sy) * 0.6)).toFixed(1)} ${(o[0] * 0.97).toFixed(1)},${(-o[1]).toFixed(1)}`);
        }
      }
      return { mid, sec, ter: [] };
    }

    if (v === 'dicotomica') {
      const sec = [];
      const branch = (x, y, ang, len, depth) => {
        const x2 = x + Math.sin(ang) * len, y2 = y + Math.cos(ang) * len;
        sec.push(`M${x.toFixed(1)},${(-y).toFixed(1)}L${x2.toFixed(1)},${(-y2).toFixed(1)}`);
        if (depth <= 0) return;
        branch(x2, y2, ang - 0.16 - 0.05 * depth, len * 0.78, depth - 1);
        branch(x2, y2, ang + 0.16 + 0.05 * depth, len * 0.78, depth - 1);
      };
      branch(0, 0, -0.5, L * 0.22, 4);
      branch(0, 0, 0.5, L * 0.22, 4);
      branch(0, 0, 0, L * 0.26, 4);
      return { mid: '', sec, ter: [] };
    }

    if (v === 'palmada') {
      const sec = [], ter = [];
      let angs = [0, 0.42, -0.42, 0.85, -0.85];
      let palmKx = null;
      if (lob && lob.mode === 'palmati') {   /* one primary into each lobe */
        const perSide = Math.max(1, lob.n || 2);
        const dlt = (108 * Math.PI / 180) / (perSide + 0.5);
        angs = [];
        for (let k = -perSide; k <= perSide; k++) angs.push(k * dlt);
        palmKx = (W / 2) / (L * 0.88);
      }
      for (const a of angs) {
        let reach = a === 0 ? 1 : 1 - Math.abs(a) * 0.42;
        let ex, ey;
        if (palmKx != null) {
          const taper = 1 - 0.32 * Math.pow(Math.abs(a) / (108 * Math.PI / 180), 2.2);
          ex = Math.sin(a) * L * taper * palmKx * 0.96; ey = Math.cos(a) * L * taper * 0.96;
        } else {
          ex = Math.sin(a) * W * 0.52 * reach; ey = Math.cos(a) * L * reach;
        }
        sec.push(`M0,0 Q ${ex * 0.35},${-ey * 0.55} ${ex.toFixed(1)},${(-ey).toFixed(1)}`);
        for (let j = 1; j <= 3; j++) {
          const f = j / 4;
          const bx = ex * f, by = ey * f;
          const off = (a >= 0 ? 1 : -1) * W * 0.13 * (1 - f);
          ter.push(`M${bx.toFixed(1)},${(-by).toFixed(1)} q ${off},${(-L * 0.06).toFixed(1)} ${off * 1.7},${(-L * 0.1).toFixed(1)}`);
        }
      }
      return { mid: '', sec, ter };
    }

    /* pinnate family: craspedódroma (to the margin), camptódroma (arching,
       not reaching it), broquidódroma (loops) */
    const sec = [], ter = [];
    const loops = v === 'broquidodroma';
    const semi = v === 'semicraspedodroma';
    const campto = v === 'camptodroma' || loops;
    const n = lob ? (lob.n || 5) : 7;
    const prevEnd = { 1: null, '-1': null };
    const prevMid = { 1: null, '-1': null };
    for (let k = 0; k < n; k++) {
      for (const side of [1, -1]) {
        let t0, tEnd;
        if (lob) {  /* one secondary into each lobe apex */
          const from = lob.from ?? 0.08, to = lob.to ?? 0.9;
          const uLobe = (k + 0.02) / (lob.n - 0.5);
          tEnd = from + (to - from) * uLobe;
          if (tEnd > 0.97) continue;
          t0 = Math.max(0.04, tEnd - 0.2);
        } else {
          t0 = 0.08 + 0.8 * (k / n) + (side === -1 ? 0.4 / n : 0);
          tEnd = t0 + 0.14;
          if (t0 > 0.88) continue;
        }
        const o = xAt(side === 1 ? right : left, Math.min(tEnd, 0.98));
        const reach = campto ? 0.78 : 0.985;
        const ex = o[0] * reach, ey = o[1] * 1;
        const sx = 0, sy = t0 * L;
        sec.push(`M${sx},${(-sy).toFixed(1)} Q ${(ex * 0.42).toFixed(1)},${(-(sy + (ey - sy) * 0.62)).toFixed(1)} ${ex.toFixed(1)},${(-ey).toFixed(1)}`);
        if (loops && prevEnd[side]) {
          const p = prevEnd[side];
          sec.push(`M${p[0].toFixed(1)},${(-p[1]).toFixed(1)} Q ${((p[0] + ex) / 2 * 1.16).toFixed(1)},${(-(p[1] + ey) / 2).toFixed(1)} ${ex.toFixed(1)},${(-ey).toFixed(1)}`);
        }
        /* semicraspedodromous: the secondary reaches a tooth AND sends a
           branch that loops to the next secondary */
        const mx = ex * 0.78, my = sy + (ey - sy) * 0.8;
        if (semi && prevMid[side]) {
          const p = prevMid[side];
          sec.push(`M${p[0].toFixed(1)},${(-p[1]).toFixed(1)} Q ${((p[0] + mx) / 2 * 1.14).toFixed(1)},${(-(p[1] + my) / 2).toFixed(1)} ${mx.toFixed(1)},${(-my).toFixed(1)}`);
        }
        prevMid[side] = [mx, my];
        prevEnd[side] = [ex, ey];
        if (!lob && k % 2 === 0 && k < n - 1) { /* faint tertiary cross-links */
          const f = 0.55;
          ter.push(`M${(ex * f).toFixed(1)},${(-(sy + (ey - sy) * f * 0.9)).toFixed(1)} l ${(o[0] * 0.16).toFixed(1)},${(L * 0.05).toFixed(1)}`);
        }
      }
    }
    return { mid, sec, ter };
  }

  /* ---------------- assembling the SVG ---------------- */

  function bladeGeometry(md, L, W) {
    const palm = md.lobing && md.lobing.mode === 'palmati';
    let right = palm ? palmateHalf(md, 1, L, W) : halfOutline(md, 1, L, W);
    let left = palm ? palmateHalf(md, -1, L, W) : halfOutline(md, -1, L, W);
    const mR = applyMargin(right, md, L, W, 1);
    const mL = applyMargin(left, md, L, W, -1);
    right = mR.pts; left = mL.pts;
    /* falcate: bend everything sideways */
    const fal = md.falcate ?? (SHAPES[md.shape] || {}).falcate ?? 0;
    if (fal) {
      const bend = p => { p[0] += fal * L * 0.42 * Math.pow(p[1] / L, 2); };
      right.forEach(bend); left.forEach(bend);
    }
    return { right, left, decor: [...mR.decor, ...mL.decor], fal };
  }

  /* public: full svg string for a simple leaf */
  function leafSVG(md, opts) {
    opts = opts || {};
    const size = opts.size || 260;
    const uid = 'lf' + (++UID);
    const sh = SHAPES[md.shape] || SHAPES.eliptica;
    md = Object.assign({}, { apex: sh.apex || 'agudo', base: sh.base || 'cuneada', margin: 'entero', venation: sh.venation || 'craspedodroma', petiole: 0.28 }, md);
    if (md.base === 'peltada') md.peltate = true;
    const L = 100;
    let W = L / (md.ar || sh.ar || 2);
    if (md.lobing && md.lobing.mode === 'palmati') W = Math.max(W, L / 1.25);
    const g = bladeGeometry(md, L, W);
    const blade = toPath(g.right, true) + toPath([...g.left].reverse(), true).replace(/^M/, 'L') + 'Z';
    const veins = veinPaths(md, L, W, g.right, g.left, uid);
    const ap = APICES[md.apex] || {};
    const petL = (md.petiole ?? 0.28) * L;
    const tipY = -(L + (ap.tip || 0) * L);
    const falX = g.fal ? g.fal * L * 0.42 : 0;

    /* view box */
    const xs = [...g.right, ...g.left].map(p => p[0]);
    const minX = Math.min(...xs, -W * 0.55) - 6, maxX = Math.max(...xs, W * 0.55) + 6;
    let minY = tipY - 8, maxY = petL + 10;
    const ba = BASES[md.base] || {};
    if (ba.lobe) maxY = Math.max(maxY, ba.lobe.depth * L + petL + 8);
    if (ap.arista) minY -= ap.arista * L;
    if (md.sheath || ba.sheath) maxY += L * 0.3;

    const parts = [];
    /* petiole (or sheath) */
    const petW = Math.max(2.6, W * 0.045);
    if (md.peltate) {
      const py = -L * 0.38;
      parts.push(`<path class="lf-petiole" d="M0,${petL} C ${-petW * 2},${petL * 0.4} ${petW},${py * 0.5} 0,${py}" fill="none" stroke-width="${petW}" stroke-linecap="round"/>`);
    } else if (md.sheath || ba.sheath) {
      parts.push(`<path class="lf-sheath" d="M${-petW * 2.6},${petL + L * 0.28} L${-petW * 1.4},0 L${petW * 1.4},0 L${petW * 2.6},${petL + L * 0.28} Z"/>`);
      if (md.ligule) parts.push(`<path class="lf-ligule" d="M${-petW * 1.5},1 q ${petW * 1.5},-5 ${petW * 3},0" fill="none"/>`);
    } else if ((md.petiole ?? 0.28) > 0.02) {
      parts.push(`<path class="lf-petiole" d="M0,0 C ${-petW * 0.8},${petL * 0.4} ${petW * 0.9},${petL * 0.7} ${petW * 0.4},${petL}" fill="none" stroke-width="${petW}" stroke-linecap="round"/>`);
      if (ba.wings) parts.push(`<path class="lf-blade lf-wings" d="M${-petW * 1.9},2 L${-petW * 0.6},${petL * 0.85} L${petW * 1.2},${petL * 0.85} L${petW * 2.3},2 Z" opacity="0.85"/>`);
    }
    if (md.stipules) {
      parts.push(`<path class="lf-stipule" d="M${-petW},${petL * 0.92} q ${-W * 0.22},2 ${-W * 0.3},${-L * 0.13} q ${W * 0.2},${L * 0.02} ${W * 0.28},${L * 0.11} Z"/>`);
      parts.push(`<path class="lf-stipule" d="M${petW},${petL * 0.92} q ${W * 0.22},2 ${W * 0.3},${-L * 0.13} q ${-W * 0.2},${L * 0.02} ${-W * 0.28},${L * 0.11} Z"/>`);
    }
    if (ba.stem) parts.push(`<rect class="lf-stem" x="${-petW * 1.6}" y="${-L * 0.05}" width="${petW * 3.2}" height="${L * 0.28}" rx="${petW * 1.4}"/>`);

    /* blade (discolorous surfaces show the pale underside behind, twisted) */
    if ((opts.skin || md.skin) === 'discolora')
      parts.push(`<g transform="translate(${(W * 0.55).toFixed(1)},6) rotate(14)"><path class="lf-underside" d="${blade}"/></g>`);
    parts.push(`<path class="lf-blade" d="${blade}"/>`);
    if ((MARGINS[md.margin] || {}).rolled) {
      parts.push(`<path class="lf-rolled" d="${blade}" fill="none"/>`);
    }
    /* veins clipped to the blade */
    const vparts = [];
    if (veins.mid) vparts.push(`<path class="lf-mid" d="${veins.mid}" fill="none"/>`);
    for (const d of veins.ter) vparts.push(`<path class="lf-ter" d="${d}" fill="none"/>`);
    for (const d of veins.sec) vparts.push(`<path class="lf-sec" d="${d}" fill="none"/>`);
    parts.push(`<clipPath id="${uid}c"><path d="${blade}"/></clipPath>`);
    parts.push(`<g class="lf-veins" clip-path="url(#${uid}c)">${vparts.join('')}</g>`);
    /* hairy or dotted surfaces: strokes scattered over the blade, clipped to it */
    const skin = opts.skin || md.skin;
    if (skin === 'pubescente' || skin === 'tomentosa' || skin === 'hirsuta' || skin === 'escabrosa') {
      const hp = [];
      const hl2 = skin === 'hirsuta' ? 5 : skin === 'tomentosa' ? 3.2 : skin === 'escabrosa' ? 1.2 : 2.6;
      const step = skin === 'tomentosa' ? 7 : 9;
      let r = 7;
      for (let yy = -L + 4; yy < -2; yy += step) {
        for (let xx = minX + 4; xx < maxX - 4; xx += step) {
          r = (r * 16807) % 2147483647; const j1 = (r / 2147483647 - 0.5) * step;
          r = (r * 16807) % 2147483647; const j2 = (r / 2147483647 - 0.5) * step;
          hp.push(`M${(xx + j1).toFixed(1)},${(yy + j2).toFixed(1)} l ${(j1 * 0.2).toFixed(1)},${(-hl2).toFixed(1)}`);
        }
      }
      parts.push(`<path class="lf-fuzz" d="${hp.join(' ')}" clip-path="url(#${uid}c)" fill="none"/>`);
    }
    /* dotted surfaces (glands, scales) and wrinkles, clipped to the blade */
    if (skin === 'glandulosa' || skin === 'lepidota') {
      const dots = [];
      const rr = skin === 'lepidota' ? 1.7 : 0.9;
      let r = 11;
      for (let yy = -L + 5; yy < -3; yy += 8) {
        for (let xx = minX + 4; xx < maxX - 4; xx += 8) {
          r = (r * 16807) % 2147483647; const j1 = (r / 2147483647 - 0.5) * 7;
          r = (r * 16807) % 2147483647; const j2 = (r / 2147483647 - 0.5) * 7;
          dots.push(`<circle cx="${(xx + j1).toFixed(1)}" cy="${(yy + j2).toFixed(1)}" r="${rr}"/>`);
        }
      }
      parts.push(`<g class="lf-dots ${skin}" clip-path="url(#${uid}c)">${dots.join('')}</g>`);
    }
    if (skin === 'rugosa') {
      const wr = [];
      let r = 5;
      for (let yy = -L + 8; yy < -6; yy += 10) {
        for (let xx = minX + 6; xx < maxX - 6; xx += 12) {
          r = (r * 16807) % 2147483647; const j1 = (r / 2147483647 - 0.5) * 8;
          r = (r * 16807) % 2147483647; const j2 = (r / 2147483647 - 0.5) * 8;
          wr.push(`M${(xx + j1).toFixed(1)},${(yy + j2).toFixed(1)} q 3,-2.4 6,0 q 3,2.2 6,0`);
        }
      }
      parts.push(`<path class="lf-wrinkle" d="${wr.join(' ')}" clip-path="url(#${uid}c)" fill="none"/>`);
    }
    if (skin === 'lustrosa') {
      parts.push(`<ellipse class="lf-gloss" cx="${(-W * 0.18).toFixed(1)}" cy="${(-L * 0.62).toFixed(1)}" rx="${(W * 0.14).toFixed(1)}" ry="${(L * 0.2).toFixed(1)}" transform="rotate(-14 ${(-W * 0.18).toFixed(1)} ${(-L * 0.62).toFixed(1)})" clip-path="url(#${uid}c)"/>`);
    }
    parts.push(`<path class="lf-outline" d="${blade}" fill="none"/>`);

    /* decorations: spines, hairs, mucro, arista */
    for (const d of g.decor) {
      if (d.kind === 'spine') parts.push(`<path class="lf-spine" d="M${d.x.toFixed(1)},${(-d.y).toFixed(1)} l ${(d.nx * 5).toFixed(1)},${(-d.ny * 5).toFixed(1)}" fill="none"/>`);
      if (d.kind === 'hair') parts.push(`<path class="lf-hair" d="M${d.x.toFixed(1)},${(-d.y).toFixed(1)} l ${(d.nx * 3.4).toFixed(1)},${(-d.ny * 3.4).toFixed(1)}" fill="none"/>`);
    }
    if (ap.mucro) parts.push(`<path class="lf-mucro${ap.soft ? ' soft' : ''}" d="M${falX.toFixed(1)},${tipY} l -1.6,1.2 l 1.6,${(-ap.mucro * L).toFixed(1)} l 1.6,${(ap.mucro * L - 1.2).toFixed(1)} Z"/>`);
    if (ap.arista) parts.push(`<path class="lf-arista" d="M${falX.toFixed(1)},${tipY} q 2,${(-ap.arista * L * 0.5).toFixed(1)} 0.6,${(-ap.arista * L).toFixed(1)}" fill="none"/>`);
    if (ap.spineTip) parts.push(`<path class="lf-spine" d="M${falX.toFixed(1)},${tipY + 3} l 0,-6" fill="none"/>`);
    if (md.peltate) parts.push(`<circle class="lf-pelt" cx="0" cy="${-L * 0.38}" r="${petW * 1.1}"/>`);

    /* highlight overlays for atlas plates */
    if (opts.highlight) {
      const hl = opts.highlight;
      if (hl === 'apice') {
        const seg = g.right.filter(p => p[2] > 0.8);
        const segL = g.left.filter(p => p[2] > 0.8).reverse();
        parts.push(`<path class="lf-hl hl-apice" d="${toPath([...segL, ...[...seg].reverse()], true)}" fill="none"/>`);
      } else if (hl === 'base') {
        const seg = g.right.filter(p => p[2] < 0.2);
        const segL = g.left.filter(p => p[2] < 0.2).reverse();
        parts.push(`<path class="lf-hl hl-base" d="${toPath([...seg], true)}" fill="none"/><path class="lf-hl hl-base" d="${toPath([...segL].reverse(), true)}" fill="none"/>`);
      } else if (hl === 'margen') {
        parts.push(`<path class="lf-hl hl-margen" d="${blade}" fill="none"/>`);
      } else if (hl === 'forma') {
        parts.push(`<path class="lf-hl hl-forma" d="${blade}" fill="none"/>`);
      }
      /* venation highlight is handled with CSS (class on the svg) */
    }

    const vb = `${minX.toFixed(0)} ${minY.toFixed(0)} ${(maxX - minX).toFixed(0)} ${(maxY - minY).toFixed(0)}`;
    const hlClass = (opts.highlight === 'nervadura' ? ' hl-veins' : '') + (skin ? ' skin-' + skin : '');
    return `<svg class="leaf${hlClass}${opts.class ? ' ' + opts.class : ''}" viewBox="${vb}" ${opts.width ? `width="${opts.width}"` : ''} preserveAspectRatio="xMidYMid meet" role="img" ${opts.label ? `aria-label="${esc(opts.label)}"` : ''}><g>${parts.join('')}</g></svg>`;
  }

  /* ---------------- compound leaves ----------------
     type: imparipinnada | paripinnada | bipinnada | trifoliolada |
           palmaticompuesta | unifoliolada | interrumpidamente
     leaflet: model for one leaflet. */
  function compoundSVG(cd, opts) {
    opts = opts || {};
    const uid = 'cp' + (++UID);
    const lm = Object.assign({ shape: 'eliptica', margin: 'entero', venation: 'camptodroma', petiole: 0.06 }, cd.leaflet || {});
    const leaflet = leafSVG(lm, { size: 90 });
    /* CSS variables do not always survive into <use> shadow trees, so each
       leaflet is inlined as a transformed group instead */
    const inner = leaflet.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    const parts = [];
    const defs = '';
    const use = (x, y, ang, s) =>
      `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${s.toFixed(3)})">${fresh(inner)}</g>`;

    const type = cd.type || 'imparipinnada';
    let W = 200, H = 260;
    if (type === 'trifoliolada') {
      parts.push(`<path class="lf-rachis" d="M0,120 L0,28" />`);
      parts.push(use(0, 26, 0, 0.62));
      parts.push(`<path class="lf-rachis" d="M0,60 L-30,48 M0,60 L30,48"/>`);
      parts.push(use(-30, 48, -52, 0.5));
      parts.push(use(30, 48, 52, 0.5));
      W = 190; H = 220;
    } else if (type === 'palmaticompuesta') {
      parts.push(`<path class="lf-rachis" d="M0,130 L0,66"/>`);
      const n = cd.n || 5;
      for (let i = 0; i < n; i++) {
        const a = -70 + (140 / (n - 1)) * i;
        parts.push(use(Math.sin(a * Math.PI / 180) * 6, 64 - Math.abs(Math.cos(a * Math.PI / 180)) * 2, a, 0.52 - Math.abs(a) * 0.0012));
      }
      W = 210; H = 220;
    } else if (type === 'unifoliolada') {
      parts.push(`<path class="lf-rachis" d="M0,120 L0,95"/>`);
      parts.push(`<circle class="lf-joint" cx="0" cy="95" r="2.6"/>`);
      parts.push(use(0, 92, 0, 0.8));
      W = 160; H = 230;
    } else if (type === 'bipinnada' || type === 'tripinnada') {
      const pairs = cd.n || 4;
      parts.push(`<path class="lf-rachis" d="M0,150 L0,-96"/>`);
      for (let k = 0; k <= pairs; k++) {
        const y = 118 - k * (196 / pairs) - 16;
        const len = 52 * (1 - 0.4 * Math.abs(k / pairs - 0.35));
        for (const s of (k === pairs ? [0] : [1, -1])) {
          const ang = k === pairs ? -90 : (s === 1 ? -38 : 218);
          const dx = Math.cos(ang * Math.PI / 180), dy = Math.sin(ang * Math.PI / 180);
          const px = 0, py = k === pairs ? y - 8 : y;
          parts.push(`<path class="lf-rachis thin" d="M${px},${py} l ${(dx * len).toFixed(1)},${(dy * len).toFixed(1)}"/>`);
          const nl = 5;
          for (let j = 1; j <= nl; j++) {
            const f = j / nl;
            for (const t of [1, -1]) {
              parts.push(use(px + dx * len * f + -dy * t * 3, py + dy * len * f + dx * t * 3,
                (Math.atan2(dy, dx) * 180 / Math.PI + 90) + t * 55, 0.16));
            }
          }
        }
      }
      W = 240; H = 300;
    } else { /* pinnada: imparipinnada / paripinnada / interrumpida */
      const pairs = cd.n || 4;
      const odd = type !== 'paripinnada';
      parts.push(`<path class="lf-rachis" d="M0,132 C 2,80 -2,0 0,${odd ? -78 : -92}"/>`);
      for (let k = 0; k < pairs; k++) {
        const y = 96 - k * (172 / pairs);
        let s1 = 0.5 * (1 - 0.28 * Math.abs(k / pairs - 0.5));
        if (type === 'interrumpida' && k % 2 === 1) s1 *= 0.45;
        parts.push(use(-4, y, -58, s1));
        parts.push(use(4, y - 10, 58, s1));
      }
      if (odd) parts.push(use(0, -76, 0, 0.5));
      W = 210; H = 280;
    }
    return `<svg class="leaf compound${opts.class ? ' ' + opts.class : ''}" viewBox="${-W / 2} ${-H / 2 - 20} ${W} ${H + 40}" preserveAspectRatio="xMidYMid meet" role="img">${defs}${parts.join('')}</svg>`;
  }

  /* ---------------- special drawings ----------------
     Hand-drawn figures the parametric engine cannot produce: modified
     leaves, leaf duration, scale leaves. Colours use CSS variables with
     print-safe fallbacks. */
  const inner2 = md => leafSVG(md, {}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  const C = {
    blade: 'var(--lfBlade1, #8fc26e)', blade2: 'var(--lfBlade2, #5a9c47)',
    out: 'var(--lfOutline, #2e5a25)', pet: 'var(--lfPetiole, #7a9c52)',
    vein: 'var(--lfVein, #3e7031)', extra: 'var(--lfExtra, #8a6d3b)',
    red: 'var(--cM, #c84a6f)', gold: 'var(--gold, #d9a51d)', brown: '#b08850',
    dry: '#c2a06a', bg: 'var(--card-bg, #ffffff)', stem: 'var(--border-strong, #c3cfb4)',
    sky: 'var(--cB, #2a7fb8)',
  };
  function spiral(x, y, s, turns) {
    let d = `M${x},${y}`, r = s, a = -Math.PI / 2;
    let cx = x, cy = y;
    for (let i = 0; i < turns * 10; i++) {
      a += Math.PI / 5; r *= 0.93;
      cx += Math.cos(a) * r; cy += Math.sin(a) * r;
      d += `L${cx.toFixed(1)},${cy.toFixed(1)}`;
    }
    return d;
  }
  const SPECIALS = {
    /* pea leaf: leaflets below, tendrils instead of the upper leaflets */
    zarcillo() {
      const lf = (x, y, a, s) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})">${''}<ellipse cx="0" cy="-16" rx="10" ry="16" fill="${C.blade}" stroke="${C.out}" stroke-width="1.4"/><path d="M0,-3 L0,-29" stroke="${C.vein}" stroke-width="1.2" fill="none"/></g>`;
      return `<svg class="leaf special" viewBox="-110 -150 220 290" role="img">
        <path d="M0,130 C 2,60 -2,-20 0,-92" stroke="${C.pet}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
        ${lf(-16, 66, -62, 1)}${lf(16, 56, 62, 1)}${lf(-16, 8, -62, 0.94)}${lf(16, -2, 62, 0.94)}
        <path d="${spiral(-32, -118, 12, 2.4)}" stroke="${C.pet}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="${spiral(34, -128, 13, 2.4)}" stroke="${C.pet}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="${spiral(6, -142, 10, 2.2)}" stroke="${C.pet}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="M0,-92 C -10,-104 -24,-112 -32,-118 M0,-92 C 12,-106 26,-120 34,-128 M0,-92 C 2,-112 4,-130 6,-142" stroke="${C.pet}" stroke-width="2" fill="none"/>`
        + `</svg>`;
    },
    /* barberry: spine leaves on the long shoot, normal leaves on the short shoot */
    espina() {
      const spine = (x, y, a) => `<g transform="translate(${x},${y}) rotate(${a})" stroke="${C.extra}" stroke-width="2.4" stroke-linecap="round" fill="none"><path d="M0,0 L0,-26"/><path d="M0,-4 L-14,-20"/><path d="M0,-4 L14,-20"/></g>`;
      const lf = (x, y, a, s) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})"><ellipse cx="0" cy="-15" rx="9" ry="15" fill="${C.blade}" stroke="${C.out}" stroke-width="1.3"/><path d="M0,-2 L0,-27" stroke="${C.vein}" stroke-width="1.1" fill="none"/></g>`;
      return `<svg class="leaf special" viewBox="-110 -140 220 280" role="img">
        <rect x="-4" y="-120" width="8" height="250" rx="4" fill="${C.stem}"/>
        ${spine(-4, 60, 28)}${spine(4, -10, -28)}${spine(-4, -80, 24)}
        <circle cx="3" cy="52" r="4" fill="${C.pet}"/><circle cx="-3" cy="-18" r="4" fill="${C.pet}"/>
        ${lf(12, 46, 40, 0.9)}${lf(20, 58, 74, 0.8)}${lf(-12, -22, -40, 0.9)}${lf(-20, -12, -74, 0.8)}${lf(-16, -34, -12, 0.8)}
      </svg>`;
    },
    /* poinsettia: red bracts around tiny true flowers */
    bractea() {
      const br = (a, len, w, col) => `<g transform="rotate(${a})"><path d="M0,-12 C ${-w},${-12 - len * 0.35} ${-w * 0.7},${-12 - len * 0.85} 0,${-12 - len} C ${w * 0.7},${-12 - len * 0.85} ${w},${-12 - len * 0.35} 0,-12 Z" fill="${col}" stroke="${C.out}" stroke-width="1"/><path d="M0,-14 L0,${-8 - len}" stroke="${col === C.blade ? C.vein : '#8f2f4a'}" stroke-width="1" opacity=".7" fill="none"/></g>`;
      let g = '';
      for (let i = 0; i < 7; i++) g += br(i * 51.4, 92, 24, C.blade);
      for (let i = 0; i < 6; i++) g += br(25 + i * 60, 66, 20, C.red);
      let fl = '';
      for (let i = 0; i < 5; i++) { const a = i * 72 * Math.PI / 180; fl += `<circle cx="${(Math.cos(a) * 9).toFixed(1)}" cy="${(Math.sin(a) * 9).toFixed(1)}" r="4.6" fill="${C.gold}" stroke="${C.out}" stroke-width="0.8"/>`; }
      return `<svg class="leaf special" viewBox="-115 -115 230 230" role="img">${g}${fl}<circle r="4" fill="${C.gold}" stroke="${C.out}" stroke-width="0.8"/></svg>`;
    },
    /* calla lily: white spathe wrapped around the yellow spadix */
    espata() {
      return `<svg class="leaf special" viewBox="-100 -140 200 280" role="img">
        <path d="M0,132 C -2,60 -1,20 0,-10" stroke="${C.pet}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <path d="M2,-34 L2,-98" stroke="${C.gold}" stroke-width="9" stroke-linecap="round"/>
        <path d="M2,-98 l 0,-4" stroke="${C.gold}" stroke-width="5" stroke-linecap="round"/>
        <path d="M0,-8 C -44,-24 -58,-70 -46,-104 C -38,-124 -18,-134 6,-128 C -8,-108 -6,-70 0,-8 Z" fill="${C.bg}" stroke="${C.out}" stroke-width="1.6"/>
        <path d="M0,-8 C 36,-28 48,-72 38,-104 C 32,-122 18,-130 6,-128 C 22,-104 16,-56 0,-8 Z" fill="${C.bg}" stroke="${C.out}" stroke-width="1.6" opacity="0.94"/>
        <path d="M6,-128 C 22,-104 16,-56 0,-8 C -6,-70 -8,-108 6,-128 Z" fill="#eef0e4" stroke="${C.out}" stroke-width="1"/>
        <path d="M0,132 C 30,110 52,96 58,66 C 40,64 12,84 0,110 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.4"/>
      </svg>`;
    },
    /* onion bulb in longitudinal section: fleshy storage cataphylls */
    catafilo() {
      const ring = (rx, ry, col) => `<path d="M0,60 C ${-rx},52 ${-rx},${-ry * 0.4} 0,${-ry} C ${rx},${-ry * 0.4} ${rx},52 0,60 Z" fill="${col}" stroke="${C.out}" stroke-width="1.2"/>`;
      return `<svg class="leaf special" viewBox="-110 -150 220 290" role="img">
        <path d="M-30,66 q -8,26 -20,38 M0,70 q 0,28 -3,44 M30,66 q 10,26 20,38 M-14,69 q -4,30 -10,42 M16,69 q 6,28 12,42" stroke="${C.extra}" stroke-width="1.6" fill="none"/>
        ${ring(58, 74, '#e8d9b8')}${ring(46, 62, '#f2e6c8')}${ring(34, 52, '#f7eed6')}${ring(23, 42, '#fbf4e2')}${ring(13, 34, '#f2e6c8')}
        <path d="M0,-30 C -8,-52 -6,-88 0,-124 C 6,-88 8,-52 0,-30 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.4"/>
        <path d="M0,-34 C -18,-52 -24,-80 -18,-102 C -8,-80 -4,-56 0,-34 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.2"/>
        <path d="M0,-34 C 18,-54 26,-78 20,-100 C 8,-78 4,-56 0,-34 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.2"/>
      </svg>`;
    },
    /* Nepenthes: blade, tendril and pitcher with its lid */
    jarra() {
      return `<svg class="leaf special" viewBox="-120 -140 240 290" role="img">
        <g transform="translate(-58,-52) rotate(-18)"><ellipse cx="0" cy="0" rx="26" ry="52" fill="${C.blade}" stroke="${C.out}" stroke-width="1.6"/><path d="M0,50 L0,-50 M0,20 Q -14,10 -20,-2 M0,20 Q 14,10 20,-2 M0,-6 Q -12,-16 -17,-26 M0,-6 Q 12,-16 17,-26" stroke="${C.vein}" stroke-width="1.2" fill="none"/></g>
        <path d="M-58,2 C -40,40 -10,52 12,44" stroke="${C.pet}" stroke-width="2.6" fill="none"/>
        <path d="${spiral(12, 44, 9, 1.6)}" stroke="${C.pet}" stroke-width="2" fill="none"/>
        <path d="M22,52 C -6,66 -10,110 8,132 C 24,148 52,148 66,130 C 80,112 76,72 56,56 C 44,47 32,47 22,52 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.8"/>
        <path d="M30,58 C 18,76 18,110 28,128" stroke="${C.vein}" stroke-width="1.4" fill="none" opacity=".65"/>
        <path d="M44,54 C 36,76 36,112 44,134" stroke="${C.vein}" stroke-width="1.4" fill="none" opacity=".65"/>
        <ellipse cx="42" cy="55" rx="22" ry="7" fill="#3d5c30" stroke="${C.out}" stroke-width="1.4"/>
        <path d="M22,50 C 18,30 34,20 52,26 C 66,31 70,44 62,52 C 52,44 34,44 22,50 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.5"/>
        <path d="M64,128 q 12,-4 14,-14" stroke="${C.out}" stroke-width="1.2" fill="none"/>
      </svg>`;
    },
    /* Venus flytrap: two-lobed snap trap fringed with cilia */
    venus() {
      const teeth = s => { let d = ''; for (let i = 0; i <= 10; i++) { const t = i / 10; const x = s * (18 + 40 * Math.sin(Math.PI * t)); const y = -20 - 92 * t; d += `M${x.toFixed(1)},${y.toFixed(1)} l ${(s * 10).toFixed(1)},${(-4 - 3 * Math.sin(Math.PI * t)).toFixed(1)}`; } return d; };
      const dots = s => { let d = ''; for (let i = 0; i < 3; i++) d += `<circle cx="${s * (14 + i * 9)}" cy="${-46 - i * 18}" r="1.8" fill="#8f2f4a"/>`; return d; };
      return `<svg class="leaf special" viewBox="-110 -140 220 280" role="img">
        <path d="M0,130 C -4,96 -22,88 -34,70 L-12,60 C -6,80 -2,64 0,44 C 2,64 6,80 12,60 L34,70 C 22,88 4,96 0,130 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.5"/>
        <path d="M0,44 C -34,30 -62,-8 -58,-56 C -55,-92 -34,-112 -2,-114 L0,-20 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.6"/>
        <path d="M0,44 C 34,30 62,-8 58,-56 C 55,-92 34,-112 2,-114 L0,-20 Z" fill="#d98a9e" stroke="${C.out}" stroke-width="1.6"/>
        <path d="M0,44 L0,-114" stroke="${C.out}" stroke-width="2"/>
        <path d="${teeth(-1)}" stroke="${C.extra}" stroke-width="2" fill="none" stroke-linecap="round"/>
        <path d="${teeth(1)}" stroke="${C.extra}" stroke-width="2" fill="none" stroke-linecap="round"/>
        ${dots(-1)}${dots(1)}
      </svg>`;
    },
    /* water lily pad floating on water */
    flotante() {
      let veins = '';
      for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; veins += `<path d="M0,4 L${(Math.cos(a) * 74).toFixed(1)},${(4 + Math.sin(a) * 52).toFixed(1)}" stroke="${C.vein}" stroke-width="1.1" opacity=".6" fill="none"/>`; }
      return `<svg class="leaf special" viewBox="-120 -110 240 220" role="img">
        <path d="M-116,58 q 14,-8 28,0 q 14,8 28,0 q 14,-8 28,0 q 14,8 28,0 q 14,-8 28,0 q 14,8 28,0" stroke="${C.sky}" stroke-width="2.2" fill="none" opacity=".7"/>
        <path d="M-98,78 q 14,-8 28,0 q 14,8 28,0 q 14,-8 28,0 q 14,8 28,0 q 14,-8 28,0" stroke="${C.sky}" stroke-width="2" fill="none" opacity=".45"/>
        <g clip-path="none"><path d="M8,-66 A 82 58 0 1 0 30,-58 L 0,4 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.8" transform="translate(0,-14)"/>
        <g transform="translate(0,-14)">${veins}</g>
        <circle cx="0" cy="-10" r="3.4" fill="${C.pet}" stroke="${C.out}" stroke-width="1"/></g>
      </svg>`;
    },
    /* two opposite leaves fused around the stem (connate-perfoliate) */
    connata() {
      return `<svg class="leaf special" viewBox="-120 -110 240 220" role="img">
        <rect x="-5" y="-104" width="10" height="90" rx="5" fill="${C.stem}"/>
        <path d="M0,-16 C -52,-24 -96,-4 -104,28 C -96,58 -50,66 -8,52 C -3,40 -3,-4 0,-16 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.6"/>
        <path d="M0,-16 C 52,-24 96,-4 104,28 C 96,58 50,66 8,52 C 3,40 3,-4 0,-16 Z" fill="${C.blade}" stroke="${C.out}" stroke-width="1.6"/>
        <path d="M-8,20 C -40,12 -70,16 -98,28 M8,20 C 40,12 70,16 98,28" stroke="${C.vein}" stroke-width="1.6" fill="none" opacity=".8"/>
        <path d="M-8,20 q -26,-14 -48,-22 M-8,24 q -30,10 -56,26 M8,20 q 26,-14 48,-22 M8,24 q 30,10 56,26" stroke="${C.vein}" stroke-width="1" fill="none" opacity=".55"/>
        <ellipse cx="0" cy="8" rx="13" ry="20" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.2"/>
        <rect x="-5" y="8" width="10" height="96" rx="5" fill="${C.stem}"/>
      </svg>`;
    },
    /* cypress branchlet clothed in tiny imbricate scale leaves */
    escamiforme() {
      const scale = (x, y, a, s) => `<g transform="translate(${x},${y}) rotate(${a}) scale(${s})"><path d="M0,0 C -5,-3 -6,-10 0,-15 C 6,-10 5,-3 0,0 Z" fill="${C.blade2}" stroke="${C.out}" stroke-width="0.9"/></g>`;
      let g = '';
      const branch = (bx, by, ang, n) => {
        for (let i = 0; i < n; i++) {
          const t = i / n;
          const x = bx + Math.sin(ang) * 92 * t, y = by - Math.cos(ang) * 92 * t;
          g += scale(x, y, (ang * 180 / Math.PI), 1 - t * 0.35);
          if (i % 2 === 0 && i > 0) {
            g += scale(x - 8 * Math.cos(ang), y - 8 * Math.sin(ang), ang * 180 / Math.PI - 38, 0.8 - t * 0.3);
            g += scale(x + 8 * Math.cos(ang), y + 8 * Math.sin(ang), ang * 180 / Math.PI + 38, 0.8 - t * 0.3);
          }
        }
      };
      branch(0, 96, 0, 12);
      branch(-4, 60, -0.55, 9);
      branch(4, 40, 0.55, 9);
      return `<svg class="leaf special" viewBox="-110 -110 220 220" role="img"><path d="M0,100 L0,20 M0,52 L-38,-8 M0,34 L38,-14" stroke="${C.pet}" stroke-width="2.4" fill="none"/>${g}</svg>`;
    },
    /* leaf-duration trees */
    _tree(crown, extra) {
      return `<svg class="leaf special" viewBox="-110 -120 220 240" role="img">
        <path d="M-6,112 C -4,60 -4,20 -2,-8 L2,-8 C 4,20 4,60 6,112 Z" fill="#8a6d4b" stroke="#5c4630" stroke-width="1.2"/>
        <path d="M-2,-4 C -20,-18 -34,-34 -40,-52 M0,-6 C 2,-30 6,-48 14,-62 M2,-4 C 18,-20 30,-34 36,-50 M-1,-6 C -8,-32 -10,-52 -8,-70" stroke="#5c4630" stroke-width="2.4" fill="none"/>
        ${crown}${extra || ''}
        <path d="M-90,112 L90,112" stroke="${C.stem}" stroke-width="2"/>
      </svg>`;
    },
    arbol_caduca() {
      let leaves = '';
      const pos = [[-58, 40], [-30, 76], [22, 60], [52, 88], [70, 30]];
      for (const [x, y] of pos) leaves += `<ellipse cx="${x}" cy="${y}" rx="5" ry="8" transform="rotate(40 ${x} ${y})" fill="${C.dry}" stroke="#8a6d4b" stroke-width="0.8"/>`;
      return SPECIALS._tree('', leaves);
    },
    arbol_perenne() {
      const crown = `<ellipse cx="0" cy="-56" rx="74" ry="52" fill="${C.blade2}" stroke="${C.out}" stroke-width="1.6"/>
        <ellipse cx="-38" cy="-34" rx="34" ry="26" fill="${C.blade}" stroke="${C.out}" stroke-width="1.2"/>
        <ellipse cx="36" cy="-40" rx="30" ry="24" fill="${C.blade}" stroke="${C.out}" stroke-width="1.2"/>`;
      return SPECIALS._tree(crown);
    },
    arbol_marcescente() {
      const crown = `<ellipse cx="0" cy="-52" rx="70" ry="50" fill="${C.dry}" stroke="#8a6d4b" stroke-width="1.6"/>
        <ellipse cx="-34" cy="-30" rx="30" ry="22" fill="#d4b57e" stroke="#8a6d4b" stroke-width="1.2"/>
        <ellipse cx="34" cy="-36" rx="26" ry="20" fill="#d4b57e" stroke="#8a6d4b" stroke-width="1.2"/>`;
      return SPECIALS._tree(crown);
    },
    /* one plant, two leaf forms (juvenile lobed, adult entire) */
    heterofilia() {
      const juv = inner2({ shape: 'obovada', lobing: { mode: 'pinnati', n: 3, depth: 0.55, sharp: 0.25 }, venation: 'craspedodroma', petiole: 0.2 });
      const ad = inner2({ shape: 'lanceolada', venation: 'camptodroma', petiole: 0.15 });
      return `<svg class="leaf special" viewBox="-120 -150 240 290" role="img">
        <path d="M0,132 C 1,60 -1,-30 0,-120" stroke="${C.pet}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <g transform="translate(-4,110) rotate(-64) scale(0.62)">${fresh(juv)}</g>
        <g transform="translate(4,74) rotate(64) scale(0.62)">${fresh(juv)}</g>
        <g transform="translate(-4,36) rotate(-64) scale(0.6)">${fresh(juv)}</g>
        <g transform="translate(4,-24) rotate(58) scale(0.62)">${fresh(ad)}</g>
        <g transform="translate(-4,-58) rotate(-58) scale(0.62)">${fresh(ad)}</g>
        <g transform="translate(3,-92) rotate(52) scale(0.58)">${fresh(ad)}</g>
        <g transform="translate(-2,-120) rotate(-40) scale(0.55)">${fresh(ad)}</g>
      </svg>`;
    },
  };
  function specialSVG(name, opts) {
    const fn = SPECIALS[name];
    if (!fn || name.startsWith('_')) return `<svg class="leaf special" viewBox="0 0 10 10"></svg>`;
    let svg = fn();
    if (opts && opts.class) svg = svg.replace('class="leaf special"', `class="leaf special ${opts.class}"`);
    return svg;
  }

  window.Leaf = {
    SHAPES, APICES, BASES, MARGINS, VENATIONS,
    svg: leafSVG, compound: compoundSVG, special: specialSVG, fresh,
    SPECIAL_NAMES: Object.keys(SPECIALS).filter(k => !k.startsWith('_')),
    _beta: beta, _halfOutline: halfOutline, _veinPaths: veinPaths, _bladeGeometry: bladeGeometry,
  };
})();
