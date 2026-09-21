/* LeafPro — Block 8: classroom mode.
   A full-screen presentation that asks before revealing, and printable
   study sheets built from the atlas. */

(function () {
  const ALL_CATS = ['forma', 'apice', 'base', 'margen', 'nervadura', 'compo', 'filotaxia', 'union', 'superficie'];
  const sel = { cats: ['forma', 'apice', 'base', 'margen'], n: 12, order: 'random' };
  const pres = { items: [], i: 0, revealed: false };

  function art(term) {
    return term.compound ? Leaf.compound(term.compound, {})
      : term.phyllo ? `<div style="display:flex; gap:10px; align-items:center; justify-content:center">${B4.sideView(term.phyllo)}${B4.topView(term.phyllo)}</div>`
      : Leaf.svg(term.model, { highlight: term.hl, skin: term.skin });
  }
  function qText(term) {
    const ch = CHARS[term.cat];
    return T(`¿Cómo se llama ${({ forma: 'esta forma', apice: 'este ápice', base: 'esta base', margen: 'este margen', nervadura: 'esta nervadura', compo: 'este tipo de hoja', filotaxia: 'esta filotaxia', union: 'esta inserción', superficie: 'esta superficie' })[term.cat]}?`,
             `What is this ${ch.one.en} called?`);
  }

  /* ---------- setup ---------- */
  function renderSetup() {
    const box = el('p8Setup');
    box.innerHTML = `
      <div class="card">
        <h3 style="margin-top:0">🖥️ ${T('Presentación para proyectar', 'Presentation to project')}</h3>
        <p class="hint">${T('LeafPro muestra la lámina en grande y espera; el grupo propone el término y con «Revelar» (o la barra espaciadora) aparece la respuesta en español e inglés.',
          'LeafPro shows the plate full size and waits; the class proposes the term and “Reveal” (or the space bar) shows the answer in Spanish and English.')}</p>
        <b>${T('Caracteres:', 'Characters:')}</b>
        <div class="chips" style="margin:8px 0">${ALL_CATS.map(c =>
          `<button class="chip${sel.cats.includes(c) ? ' on' : ''}" data-c="${c}">${T(CHARS[c].es, CHARS[c].en)}</button>`).join('')}</div>
        <div class="b6-row" style="grid-template-columns:120px 1fr">
          <label>${T('N.º de láminas', 'No. of plates')}</label>
          <div class="range-row"><input type="range" id="p8N" min="4" max="40" step="1" value="${sel.n}"><b>${sel.n}</b></div>
        </div>
        <div style="margin-top:12px"><button class="btn btn-primary btn-lg" id="p8Start">▶ ${T('Empezar la presentación', 'Start the presentation')}</button></div>
      </div>
      <div class="card">
        <h3 style="margin-top:0">🖨️ ${T('Fichas para imprimir', 'Printable sheets')}</h3>
        <p class="hint">${T('Genera hojas de estudio con las láminas del atlas (dibujo, término y definición) de los caracteres elegidos arriba, listas para imprimir o guardar como PDF. También puedes imprimir una versión de examen, sin los nombres.',
          'Generate study sheets with the atlas plates (drawing, term and definition) of the characters chosen above, ready to print or save as PDF. You can also print an exam version, without the names.')}</p>
        <div class="hero-cta">
          <button class="btn btn-secondary" id="p8PrintBtn">${T('Fichas de estudio', 'Study sheets')}</button>
          <button class="btn btn-ghost" id="p8PrintExam">${T('Versión de examen (sin nombres)', 'Exam version (no names)')}</button>
        </div>
      </div>`;
    els('.chip[data-c]', box).forEach(ch => ch.addEventListener('click', () => {
      const c = ch.dataset.c;
      sel.cats.includes(c) ? sel.cats = sel.cats.filter(x => x !== c) : sel.cats.push(c);
      if (!sel.cats.length) sel.cats = [c];
      renderSetup();
    }));
    el('p8N').addEventListener('input', e => { sel.n = Number(e.target.value); e.target.nextElementSibling.textContent = sel.n; });
    el('p8Start').addEventListener('click', startPres);
    el('p8PrintBtn').addEventListener('click', () => printSheets(false));
    el('p8PrintExam').addEventListener('click', () => printSheets(true));
  }

  /* ---------- presentation ---------- */
  function pool() {
    let terms = [];
    for (const c of sel.cats) terms = terms.concat(MORPH.byCat(c));
    for (let i = terms.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [terms[i], terms[j]] = [terms[j], terms[i]]; }
    return terms.slice(0, sel.n);
  }
  function startPres() {
    pres.items = pool(); pres.i = 0; pres.revealed = false;
    el('clFull').classList.add('on');
    document.body.style.overflow = 'hidden';
    showSlide();
  }
  function showSlide() {
    const term = pres.items[pres.i];
    el('clQ').innerHTML = qText(term);
    el('clFig').innerHTML = art(term);
    const svg = el('clFig').querySelector('svg');
    el('clA').innerHTML = pres.revealed
      ? `${T(term.es, term.en)} <span class="cl-en">· ${T(term.en, term.es)}</span><div style="font-size:.42em; font-weight:500; color:var(--text-muted); max-width:760px; margin:4px auto 0">${T(term.def.es, term.def.en)}</div>`
      : `<span style="opacity:.35">· · ·</span>`;
    el('clCount').textContent = `${pres.i + 1} / ${pres.items.length}`;
    el('clReveal').style.display = pres.revealed ? 'none' : '';
  }
  function reveal() { pres.revealed = true; showSlide(); }
  function next() {
    if (!pres.revealed) return reveal();
    if (pres.i < pres.items.length - 1) { pres.i++; pres.revealed = false; showSlide(); }
    else exitPres();
  }
  function prev() { if (pres.i > 0) { pres.i--; pres.revealed = true; showSlide(); } }
  function exitPres() {
    el('clFull').classList.remove('on');
    document.body.style.overflow = '';
  }

  /* ---------- printable sheets ---------- */
  function printSheets(exam) {
    let terms = [];
    for (const c of sel.cats) terms = terms.concat(MORPH.byCat(c));
    const win = window.open('', '_blank');
    if (!win) return;
    const cs = getComputedStyle(document.documentElement);
    const v = n => cs.getPropertyValue(n).trim();
    const cards = terms.map((term, i) => `
      <div class="fi">
        ${art(term)}
        <div class="fi-t">${exam ? `<span class="fi-line">${i + 1}. ____________________</span>` : `<b>${T(term.es, term.en)}</b> <i>· ${T(term.en, term.es)}</i>`}</div>
        ${exam ? '' : `<div class="fi-d">${T(term.def.es, term.def.en)}</div>`}
      </div>`).join('');
    const key = exam ? `<div class="key"><h2>${T('Clave de respuestas', 'Answer key')}</h2><ol>${terms.map(term => `<li>${T(term.es, term.en)}</li>`).join('')}</ol></div>` : '';
    win.document.write(`<!DOCTYPE html><html lang="${I18N.lang}"><head><meta charset="utf-8">
      <title>LeafPro — ${exam ? T('examen de láminas', 'plate exam') : T('fichas de estudio', 'study sheets')}</title>
      <style>
        body { font-family: system-ui, sans-serif; color: #1c241a; margin: 14mm; }
        h1 { font-size: 15pt; } h2 { page-break-before: always; }
        .g { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; }
        .fi { border: 0.4pt solid #999; border-radius: 3mm; padding: 3mm; text-align: center; break-inside: avoid; }
        .fi svg { height: 30mm; max-width: 100%; }
        .fi-t { font-size: 9.5pt; margin-top: 1.5mm; } .fi-d { font-size: 7.6pt; color: #444; margin-top: 1mm; }
        .fi-line { letter-spacing: .5px; }
        .key ol { columns: 3; font-size: 9pt; }
        svg .lf-blade{fill:${v('--lfBlade1') || '#8fc26e'}} svg .lf-wings{fill:${v('--lfBlade1') || '#8fc26e'}}
        svg .lf-underside{fill:#dde5cf;stroke:#2e5a25}
        svg .lf-outline{fill:none;stroke:#2e5a25;stroke-width:1.6}
        svg .lf-mid{stroke:#3e7031;stroke-width:2.1} svg .lf-sec{stroke:#3e7031;stroke-width:1.1;opacity:.85;fill:none}
        svg .lf-ter{stroke:#3e7031;stroke-width:.7;opacity:.5} svg .lf-mid,svg .lf-sec{fill:none}
        svg .lf-petiole,svg .lf-rachis{stroke:#7a9c52;fill:none;stroke-width:3.4;stroke-linecap:round}
        svg .lf-rachis.thin{stroke-width:1.8}
        svg .lf-sheath{fill:#7a9c52;opacity:.85} svg .lf-ligule{stroke:#8a6d3b;fill:none}
        svg .lf-stipule{fill:#a5c47e;stroke:#2e5a25} svg .lf-stem{fill:#c3cfb4}
        svg .lf-spine,svg .lf-arista{stroke:#8a6d3b;stroke-width:1.6;fill:none}
        svg .lf-hair,svg .lf-fuzz{stroke:#3e7031;stroke-width:.7;opacity:.5;fill:none}
        svg .lf-mucro{fill:#8a6d3b} svg .lf-pelt{fill:#7a9c52;stroke:#2e5a25} svg .lf-joint{fill:#7a9c52}
        svg .lf-rolled{stroke:#2e5a25;stroke-width:4.5;opacity:.35;fill:none}
        svg .lf-hl{fill:none;stroke-width:3} svg .hl-apice{stroke:#c8741a} svg .hl-base{stroke:#2a7fb8}
        svg .hl-margen{stroke:#c84a6f} svg .hl-forma{stroke:#3f8f4a;stroke-width:2}
        svg.hl-veins .lf-mid, svg.hl-veins .lf-sec{stroke:#8a5cc6}
        text { fill: #1c241a; }
      </style></head><body>
      <h1>LeafPro · ${exam ? T('Identifica cada lámina', 'Identify each plate') : T('Fichas de estudio', 'Study sheets')} — ${sel.cats.map(c => T(CHARS[c].es, CHARS[c].en)).join(', ')}</h1>
      <div class="g">${cards}</div>${key}
      <script>window.print()<\/script></body></html>`);
    win.document.close();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('p8Setup')) return;
    let built = false;
    const build = () => { if (!built) { renderSetup(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 8) build(); });
    if (location.hash === '#b8') build();
    document.addEventListener('langchange', () => { if (built) renderSetup(); });
    el('clReveal').addEventListener('click', reveal);
    el('clNext').addEventListener('click', next);
    el('clExit').addEventListener('click', exitPres);
    document.addEventListener('keydown', e => {
      if (!el('clFull').classList.contains('on')) return;
      if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); reveal(); }
      else if (e.key === 'ArrowRight' || e.key === 'PageDown') next();
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') prev();
      else if (e.key === 'Escape') exitPres();
    });
  });
})();
