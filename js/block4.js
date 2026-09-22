/* LeafPro — Block 4: phyllotaxy.
   Each arrangement is drawn in side view (a leafy shoot) and top view
   (a divergence diagram), plus the golden-angle simulator. */

(function () {
  let leafInner = null, needleInner = null;
  function inner(md) {
    return Leaf.svg(md, {}).replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
  }
  function ensureArt() {
    if (!leafInner) leafInner = inner({ shape: 'eliptica', petiole: 0.16, venation: 'camptodroma' });
    if (!needleInner) needleInner = inner({ shape: 'acicular', petiole: 0.02, venation: 'uninervia' });
  }

  /* a leaf placed at (x, y), pointing `deg` away from vertical, scaled */
  function put(x, y, deg, s, art) {
    return `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${deg.toFixed(1)}) scale(${s.toFixed(3)})">${art || leafInner}</g>`;
  }

  /* ---------- side views ---------- */
  function sideView(ph) {
    ensureArt();
    const P = [];
    const stem = (x0, y0, y1, w) => `<rect x="${x0 - w / 2}" y="${y1}" width="${w}" height="${y0 - y1}" rx="${w / 2}" fill="var(--border-strong)"/>`;
    if (ph.mode === 'spiral') {
      P.push(stem(0, 128, -120, 7));
      const nodes = 6;
      for (let k = 0; k < nodes; k++) {
        const y = 108 - k * 42;
        const az = (90 + k * ph.angle) % 360;
        const sx = Math.sin(az * Math.PI / 180);
        const fore = Math.abs(sx);
        if (fore < 0.12) { /* pointing at or away from the viewer: a stub */
          P.push(`<ellipse cx="0" cy="${y - 4}" rx="7" ry="11" fill="var(--lfBlade2)" stroke="var(--lfOutline)"/>`);
        } else {
          P.push(put(0, y, sx > 0 ? 62 + (1 - fore) * 20 : -62 - (1 - fore) * 20, 0.42 * (0.55 + 0.45 * fore)));
        }
      }
    } else if (ph.mode === 'opposite') {
      P.push(stem(0, 128, -120, 7));
      for (let k = 0; k < 3; k++) {
        const y = 96 - k * 74;
        const flat = !ph.decussate || k % 2 === 0;
        if (flat) { P.push(put(0, y, 64, 0.42)); P.push(put(0, y, -64, 0.42)); }
        else {
          P.push(`<ellipse cx="0" cy="${y - 6}" rx="8" ry="13" fill="var(--lfBlade2)" stroke="var(--lfOutline)"/>`);
          P.push(`<ellipse cx="0" cy="${y - 2}" rx="6" ry="10" fill="var(--lfBlade1)" stroke="var(--lfOutline)"/>`);
        }
      }
    } else if (ph.mode === 'whorl') {
      P.push(stem(0, 128, -120, 7));
      for (let k = 0; k < 2; k++) {
        const y = 84 - k * 88;
        for (let j = 0; j < ph.n; j++) {
          const az = (j / ph.n) * 360 + 20;
          const sx = Math.sin(az * Math.PI / 180);
          if (Math.abs(sx) < 0.15) continue;
          P.push(put(0, y, sx > 0 ? 58 + 14 * (1 - Math.abs(sx)) : -58 - 14 * (1 - Math.abs(sx)), 0.4 * (0.5 + 0.5 * Math.abs(sx))));
        }
      }
    } else if (ph.mode === 'rosette') {
      P.push(`<ellipse cx="0" cy="122" rx="60" ry="8" fill="var(--bg-soft)" stroke="var(--border-strong)"/>`);
      for (let j = 0; j < 9; j++) {
        const a = -78 + j * 19.5;
        P.push(put(0, 120, a, 0.5 - 0.16 * Math.abs(Math.sin(a * Math.PI / 90))));
      }
    } else if (ph.mode === 'fascicle') {
      P.push(`<path d="M-4,128 L-2,-40 L4,-40 L6,128 Z" fill="var(--border-strong)"/>`);
      for (const [bx, by] of [[0, -30], [1, 24], [-1, 78]]) {
        P.push(`<circle cx="${bx}" cy="${by}" r="4.6" fill="var(--cC)" opacity=".7"/>`);
        for (const a of [-26, 0, 26]) P.push(put(bx, by, a + 40, 0.62, needleInner));
      }
    } else if (ph.mode === 'equitant') {
      /* a fan of folded, sword-shaped leaves in one plane (Iris) */
      const sword = (a, len, w, dark) => `<g transform="translate(0,118) rotate(${a})">
        <path d="M0,0 C ${-w},${-len * 0.3} ${-w * 0.8},${-len * 0.72} 0,${-len} C ${w * 0.8},${-len * 0.72} ${w},${-len * 0.3} 0,0 Z"
          fill="${dark ? 'var(--lfBlade2)' : 'var(--lfBlade1)'}" stroke="var(--lfOutline)" stroke-width="1.3"/>
        <path d="M0,-4 L0,${-len + 5}" stroke="var(--lfVein)" stroke-width="1" opacity=".65" fill="none"/></g>`;
      const fan = [[-56, 120], [56, 118], [-38, 160], [38, 158], [-19, 195], [19, 192], [0, 215]];
      fan.forEach(([a, len], i) => P.push(sword(a, len, 10, i % 2 === 0)));
      P.push(`<ellipse cx="0" cy="122" rx="26" ry="9" fill="var(--lfPetiole)" stroke="var(--lfOutline)" stroke-width="1"/>`);
    }
    return `<svg viewBox="-110 -150 220 300" class="leaf" role="img">${P.join('')}</svg>`;
  }

  /* ---------- top views (divergence diagram) ---------- */
  function petal(az, r0, len, w, k) {
    const a = az * Math.PI / 180;
    const x = Math.sin(a), y = -Math.cos(a);
    const cx = x * (r0 + len / 2), cy = y * (r0 + len / 2);
    return `<g transform="translate(${cx.toFixed(1)},${cy.toFixed(1)}) rotate(${az.toFixed(1)})">
      <ellipse rx="${w}" ry="${len / 2}" fill="var(--lfBlade1)" fill-opacity="0.62" stroke="var(--lfOutline)" stroke-width="1"/>
      ${k != null ? `<text y="${(-len / 2 - 5).toFixed(0)}" text-anchor="middle" font-size="10" fill="var(--text-muted)" transform="rotate(${-az}) translate(0,0)"></text>` : ''}
    </g>`;
  }
  function topView(ph) {
    const P = [`<circle r="9" fill="var(--border-strong)" stroke="var(--text-muted)" stroke-width="1"/>`];
    if (ph.mode === 'spiral') {
      for (let k = 5; k >= 0; k--) P.push(petal(k * ph.angle, 10, 52 - k * 5, 14 - k * 1.2, k));
    } else if (ph.mode === 'opposite') {
      const levels = ph.decussate ? [[0, 52], [90, 40]] : [[0, 52], [0, 38]];
      for (const [off, len] of levels) { P.push(petal(off + 90, 10, len, 13)); P.push(petal(off + 270, 10, len, 13)); }
    } else if (ph.mode === 'whorl') {
      for (let j = 0; j < ph.n; j++) P.push(petal((j / ph.n) * 360, 10, 50, 12));
      for (let j = 0; j < ph.n; j++) P.push(petal((j / ph.n) * 360 + 180 / ph.n, 10, 36, 10));
    } else if (ph.mode === 'rosette') {
      for (let k = 12; k >= 0; k--) P.push(petal(k * 137.5, 6, 54 - k * 3.2, 12 - k * 0.5));
    } else if (ph.mode === 'fascicle') {
      for (const g of [0, 120, 240]) for (const a of [-14, 0, 14]) P.push(petal(g + a, 12, 46, 3.2));
    } else if (ph.mode === 'equitant') {
      /* seen from above the fan is a single flattened row */
      for (let i = 3; i >= 0; i--) {
        P.push(petal(90, 6 + i * 13, 13, 4 - i * 0.5));
        P.push(petal(270, 6 + i * 13, 13, 4 - i * 0.5));
      }
    }
    return `<svg viewBox="-90 -90 180 180" class="leaf" role="img">${P.join('')}</svg>`;
  }

  function renderTypes() {
    const box = el('b4Types');
    const terms = MORPH.byCat('filotaxia');
    box.innerHTML = `<div class="ph-grid">` + terms.map(term => `
      <div class="ph-card">
        <div style="display:flex; gap:4px; align-items:center">
          <div style="flex:1.15">${sideView(term.phyllo)}</div>
          <div style="flex:1">${topView(term.phyllo)}</div>
        </div>
        <h4>${T(term.es, term.en)}</h4>
        <p>${T(term.def.es, term.def.en)}</p>
        <p style="margin-top:4px"><b>${T('Ej.:', 'E.g.:')}</b> ${T(term.ex.es, term.ex.en)}</p>
      </div>`).join('') + '</div>';
  }

  /* ---------- golden-angle simulator ---------- */
  const sim = { angle: 137.5, n: 24 };
  function repeatInfo(angle) {
    /* does leaf k sit on top of leaf 0? (within 1.5°) */
    for (let k = 1; k <= 60; k++) {
      const d = (k * angle) % 360;
      if (Math.min(d, 360 - d) < 1.5) return k;
    }
    return null;
  }
  function renderSim() {
    const box = el('b4Sim');
    if (!box) return;
    const P = [`<circle r="8" fill="var(--border-strong)"/>`];
    for (let k = sim.n - 1; k >= 0; k--) {
      const az = k * sim.angle;
      const len = 62 - k * (44 / sim.n);
      const w = 15 - k * (9 / sim.n);
      P.push(petal(az, 8, Math.max(10, len), Math.max(3.5, w)));
    }
    const rep = repeatInfo(sim.angle);
    const msg = rep
      ? T(`Con ${sim.angle}°, la hoja ${rep + 1} queda encima de la hoja 1: se forman columnas que se dan sombra.`,
          `At ${sim.angle}°, leaf ${rep + 1} sits right above leaf 1: columns form and shade each other.`)
      : T(`Con ${sim.angle}°, ninguna de las primeras 60 hojas queda encima de otra: máxima captación de luz.`,
          `At ${sim.angle}°, none of the first 60 leaves sits above another: maximum light capture.`);
    box.innerHTML = `
      <div>
        <div class="b6-row" style="--ch:var(--cP); grid-template-columns:130px 1fr">
          <label>${T('Ángulo de divergencia', 'Divergence angle')}</label>
          <div class="range-row"><input type="range" id="b4Ang" min="60" max="200" step="0.5" value="${sim.angle}"><b style="min-width:52px">${sim.angle}°</b></div>
        </div>
        <div class="b6-row" style="--ch:var(--cP); grid-template-columns:130px 1fr">
          <label>${T('Número de hojas', 'Number of leaves')}</label>
          <div class="range-row"><input type="range" id="b4N" min="5" max="40" step="1" value="${sim.n}"><b style="min-width:52px">${sim.n}</b></div>
        </div>
        <div class="chips" style="margin:10px 0">
          ${[90, 120, 137.5, 144, 180].map(a => `<button class="chip${a === sim.angle ? ' on' : ''}" data-a="${a}">${a}°${a === 137.5 ? ' ★' : ''}</button>`).join('')}
        </div>
        <p class="hint">${msg}</p>
        <p class="hint">${T('El ángulo de oro 137.5° = 360° × (1 − 1/φ), donde φ es la razón áurea; las fracciones de la serie 1/2, 1/3, 2/5, 3/8, 5/13… (Fibonacci) lo aproximan, y por eso esos números aparecen contando espirales en piñas y girasoles.',
        'The golden angle 137.5° = 360° × (1 − 1/φ), with φ the golden ratio; the fractions 1/2, 1/3, 2/5, 3/8, 5/13… (Fibonacci) approximate it, which is why those numbers appear when counting spirals in pine cones and sunflowers.')}</p>
      </div>
      <div><svg viewBox="-100 -100 200 200" class="leaf" role="img">${P.join('')}</svg></div>`;
    el('b4Ang').addEventListener('input', e => { sim.angle = Number(e.target.value); renderSim(); });
    el('b4N').addEventListener('input', e => { sim.n = Number(e.target.value); renderSim(); });
    els('.chip[data-a]', box).forEach(c => c.addEventListener('click', () => { sim.angle = Number(c.dataset.a); renderSim(); }));
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('b4Types')) return;
    let built = false;
    const build = () => { if (!built) { renderTypes(); renderSim(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 4) build(); });
    if (location.hash === '#b4') build();
    document.addEventListener('langchange', () => { if (built) { renderTypes(); renderSim(); } });
  });

  window.B4 = { sideView, topView };
})();
