/* LeafPro — Block 6: build a leaf.
   Every control corresponds to one character; the engine redraws instantly
   and the botanical description is written below the figure. */

(function () {
  /* option lists derived from the atlas, so names always match the plates */
  function optsFrom(cat, param) {
    const seen = new Set(), out = [];
    for (const term of MORPH.byCat(cat)) {
      const v = term.model[param];
      if (!v || seen.has(v) || term.model.lobing || term.compound) continue;
      seen.add(v);
      out.push({ v, term });
    }
    return out;
  }

  const LOBINGS = [
    { v: '', es: 'Sin lóbulos', en: 'Unlobed' },
    { v: 'pinnatilobada', es: 'Pinnatilobada', en: 'Pinnately lobed', lob: { mode: 'pinnati', depth: 0.42, sharp: 0.15 } },
    { v: 'pinnatipartida', es: 'Pinnatipartida', en: 'Pinnately parted', lob: { mode: 'pinnati', depth: 0.68, sharp: 0.4 } },
    { v: 'pinnatisecta', es: 'Pinnatisecta', en: 'Pinnatisect', lob: { mode: 'pinnati', depth: 0.93, sharp: 0.6 } },
    { v: 'palmatilobada', es: 'Palmatilobada', en: 'Palmately lobed', lob: { mode: 'palmati', depth: 0.42, sharp: 0.3 } },
    { v: 'palmatipartida', es: 'Palmatipartida', en: 'Palmately parted', lob: { mode: 'palmati', depth: 0.68, sharp: 0.55 } },
    { v: 'palmatisecta', es: 'Palmatisecta', en: 'Palmatisect', lob: { mode: 'palmati', depth: 0.92, sharp: 0.5 } },
  ];
  const COMPOS = [
    { v: 'simple', es: 'Simple', en: 'Simple' },
    { v: 'unifoliolada', es: 'Unifoliolada', en: 'Unifoliolate' },
    { v: 'trifoliolada', es: 'Trifoliolada', en: 'Trifoliolate' },
    { v: 'palmaticompuesta', es: 'Palmaticompuesta', en: 'Palmately compound' },
    { v: 'imparipinnada', es: 'Imparipinnada', en: 'Odd-pinnate' },
    { v: 'paripinnada', es: 'Paripinnada', en: 'Even-pinnate' },
    { v: 'bipinnada', es: 'Bipinnada', en: 'Bipinnate' },
    { v: 'interrumpida', es: 'Interrumpidamente pinnada', en: 'Interruptedly pinnate' },
  ];
  const st = {
    compo: 'simple', shape: 'eliptica', apex: 'agudo', base: 'cuneada',
    margin: 'entero', lobing: '', lobN: 5, venation: 'craspedodroma',
    petiole: 0.28, stipules: false, skin: '', nLeaflets: 4,
  };

  function currentModel() {
    const md = {
      shape: st.shape, apex: st.apex, base: st.base, margin: st.margin,
      venation: st.venation, petiole: st.petiole, stipules: st.stipules,
    };
    const lb = LOBINGS.find(x => x.v === st.lobing);
    if (lb && lb.lob) {
      const perSide = lb.lob.mode === 'palmati' ? Math.max(1, Math.round(st.lobN / 2)) : st.lobN;
      md.lobing = Object.assign({ n: perSide }, lb.lob);
      if (lb.lob.mode === 'palmati') { md.venation = 'palmada'; }
    }
    return md;
  }

  function draw() {
    const fig = el('b6Fig');
    if (!fig) return;
    let svg;
    if (st.compo === 'simple') {
      svg = Leaf.svg(currentModel(), { skin: st.skin || null });
    } else {
      const leaflet = currentModel();
      leaflet.petiole = 0.06; leaflet.stipules = false;
      svg = Leaf.compound({ type: st.compo, n: st.nLeaflets, leaflet }, { skin: st.skin || null });
    }
    fig.innerHTML = svg;
    describe();
  }

  /* the written description, assembled from the same terms as the atlas */
  function nameOf(cat, param, value, fallback) {
    const term = MORPH.byCat(cat).find(x => x.model[param] === value && !x.model.lobing && !x.compound);
    if (!term) return fallback || value;
    return T(term.es, term.en).replace(/\s*\(.*\)$/, '').toLowerCase();
  }
  function describe() {
    const box = el('b6Desc');
    if (!box) return;
    const compo = COMPOS.find(x => x.v === st.compo);
    const lb = LOBINGS.find(x => x.v === st.lobing);
    const forma = nameOf('forma', 'shape', st.shape);
    const apice = nameOf('apice', 'apex', st.apex);
    const base = nameOf('base', 'base', st.base);
    const margen = nameOf('margen', 'margin', st.margin);
    const nerv = nameOf('nervadura', 'venation', st.lobing.startsWith('palmat') ? 'palmada' : st.venation);
    const skin = st.skin ? (MORPH.byCat('superficie').find(x => x.skin === st.skin) || null) : null;
    const pet = st.petiole < 0.03 ? T('sésil', 'sessile') : T('peciolada', 'petiolate');
    const stip = st.stipules ? T(', con estípulas', ', stipulate') : '';
    const lobTxt = lb && lb.lob ? T(` ${lb.es.toLowerCase()} (${st.lobN} ${lb.lob.mode === 'palmati' ? 'lóbulos' : 'lóbulos por lado'}),`, ` ${lb.en.toLowerCase()},`) : '';
    const lam = st.compo === 'simple' ? T('lámina', 'blade') : T('folíolos', 'leaflets');
    const compoTxt = st.compo === 'simple' ? T('simple', 'simple') : T(compo.es.toLowerCase(), compo.en.toLowerCase());
    box.innerHTML = T(
      `<b>Descripción:</b> hoja <span class="dt" style="color:var(--cC-text)">${compoTxt}</span>, ${pet}${stip}; ${lam} <span class="dt" style="color:var(--cF-text)">${forma}</span>,${lobTxt} de ápice <span class="dt" style="color:var(--cA-text)">${apice}</span>, base <span class="dt" style="color:var(--cB-text)">${base}</span> y margen <span class="dt" style="color:var(--cM-text)">${margen}</span>; nervadura <span class="dt" style="color:var(--cN-text)">${nerv}</span>${skin ? `; superficie <span class="dt" style="color:var(--cS-text)">${skin.es.toLowerCase().replace(/\s*\(.*\)$/, '')}</span>` : ''}.`,
      `<b>Description:</b> leaf <span class="dt" style="color:var(--cC-text)">${compoTxt}</span>, ${pet}${stip}; ${lam} <span class="dt" style="color:var(--cF-text)">${forma}</span>,${lobTxt} with <span class="dt" style="color:var(--cA-text)">${apice}</span> apex, <span class="dt" style="color:var(--cB-text)">${base}</span> base and <span class="dt" style="color:var(--cM-text)">${margen}</span> margin; venation <span class="dt" style="color:var(--cN-text)">${nerv}</span>${skin ? `; surface <span class="dt" style="color:var(--cS-text)">${skin.en.toLowerCase().replace(/\s*\(.*\)$/, '')}</span>` : ''}.`
    );
  }

  /* ---------------- controls ---------------- */
  function sel(id, label, chVar, options, value, onchange) {
    return { id, label, chVar, options, value, onchange };
  }
  function buildControls() {
    const c = el('b6Ctrl');
    if (!c) return;
    const shapeOpts = optsFrom('forma', 'shape').map(o => ({ v: o.v, es: o.term.es, en: o.term.en }));
    const apexOpts = optsFrom('apice', 'apex').map(o => ({ v: o.v, es: o.term.es, en: o.term.en }));
    const baseOpts = optsFrom('base', 'base').map(o => ({ v: o.v, es: o.term.es, en: o.term.en }));
    const marginOpts = MORPH.byCat('margen').filter(x => x.model.margin && !x.model.lobing).map(x => ({ v: x.model.margin, es: x.es, en: x.en }));
    const venOpts = optsFrom('nervadura', 'venation').map(o => ({ v: o.v, es: o.term.es, en: o.term.en }));
    const skinOpts = [{ v: '', es: '— típica —', en: '— typical —' }].concat(MORPH.byCat('superficie').map(x => ({ v: x.skin, es: x.es, en: x.en })));

    const row = (key, chKey, label, options, val) => `
      <div class="b6-row" style="--ch:var(--${chKey ? CHARS[chKey].v : 'primary'})">
        <label>${label}</label>
        <select class="sel" data-k="${key}">${options.map(o =>
          `<option value="${o.v}"${String(o.v) === String(val) ? ' selected' : ''}>${T(o.es, o.en)}</option>`).join('')}</select>
      </div>`;

    c.innerHTML =
      row('compo', 'compo', T(CHARS.compo.es, CHARS.compo.en), COMPOS, st.compo) +
      row('shape', 'forma', T('Forma', 'Shape'), shapeOpts, st.shape) +
      row('apex', 'apice', T('Ápice', 'Apex'), apexOpts, st.apex) +
      row('base', 'base', T('Base', 'Base'), baseOpts, st.base) +
      row('margin', 'margen', T('Margen', 'Margin'), marginOpts, st.margin) +
      row('lobing', 'margen', T('Lobulación', 'Lobing'), LOBINGS, st.lobing) +
      `<div class="b6-row" style="--ch:var(--cM)"><label>${T('N.º de lóbulos', 'No. of lobes')}</label>
        <div class="range-row"><input type="range" data-k="lobN" min="2" max="9" step="1" value="${st.lobN}"><span id="b6LobN">${st.lobN}</span></div></div>` +
      row('venation', 'nervadura', T('Nervadura', 'Venation'), venOpts, st.venation) +
      `<div class="b6-row" style="--ch:var(--cU)"><label>${T('Pecíolo', 'Petiole')}</label>
        <div class="range-row"><input type="range" data-k="petiole" min="0" max="0.6" step="0.02" value="${st.petiole}"><span id="b6Pet">${st.petiole < 0.03 ? T('sésil', 'sessile') : ''}</span></div></div>` +
      `<div class="b6-row" style="--ch:var(--cU)"><label>${T('Estípulas', 'Stipules')}</label>
        <label class="tgl"><input type="checkbox" data-k="stipules"${st.stipules ? ' checked' : ''}> ${T('con estípulas', 'stipulate')}</label></div>` +
      `<div class="b6-row" style="--ch:var(--cC)"><label>${T('N.º de folíolos', 'No. of leaflets')}</label>
        <div class="range-row"><input type="range" data-k="nLeaflets" min="2" max="8" step="1" value="${st.nLeaflets}"><span id="b6NL">${st.nLeaflets}</span></div></div>` +
      row('skin', 'superficie', T('Superficie', 'Surface'), skinOpts, st.skin);

    els('select[data-k]', c).forEach(s => s.addEventListener('change', () => { st[s.dataset.k] = s.value; draw(); }));
    els('input[type=range][data-k]', c).forEach(r => r.addEventListener('input', () => {
      st[r.dataset.k] = Number(r.value);
      if (r.dataset.k === 'lobN') el('b6LobN').textContent = r.value;
      if (r.dataset.k === 'nLeaflets') el('b6NL').textContent = r.value;
      if (r.dataset.k === 'petiole') el('b6Pet').textContent = Number(r.value) < 0.03 ? T('sésil', 'sessile') : '';
      draw();
    }));
    els('input[type=checkbox][data-k]', c).forEach(x => x.addEventListener('change', () => { st[x.dataset.k] = x.checked; draw(); }));
  }

  function randomLeaf() {
    const pick = a => a[Math.floor(Math.random() * a.length)];
    st.compo = Math.random() < 0.75 ? 'simple' : pick(COMPOS.slice(1)).v;
    st.shape = pick(['eliptica', 'ovada', 'obovada', 'lanceolada', 'oblonga', 'cordiforme', 'orbicular', 'espatulada', 'romboidal', 'deltoide', 'linear', 'reniforme']);
    st.apex = pick(Object.keys(Leaf.APICES));
    st.base = pick(['cuneada', 'atenuada', 'obtusa', 'redondeada', 'truncada', 'cordada', 'oblicua', 'auriculada']);
    st.margin = pick(['entero', 'entero', 'aserrado', 'crenado', 'dentado', 'sinuado', 'biserrado', 'espinoso', 'ondulado']);
    st.lobing = Math.random() < 0.75 ? '' : pick(LOBINGS.slice(1)).v;
    st.lobN = 3 + Math.floor(Math.random() * 4);
    st.venation = pick(['craspedodroma', 'camptodroma', 'broquidodroma', 'pinnada', 'palmada', 'curvinervia']);
    st.petiole = Math.random() < 0.15 ? 0 : 0.15 + Math.random() * 0.3;
    st.stipules = Math.random() < 0.25;
    st.skin = '';
    st.nLeaflets = 3 + Math.floor(Math.random() * 4);
    buildControls();
    draw();
  }

  /* export the current drawing as a standalone SVG with resolved colours */
  function exportSVG() {
    const svgEl = el('b6Fig').querySelector('svg');
    if (!svgEl) return;
    const cs = getComputedStyle(document.documentElement);
    const v = name => cs.getPropertyValue(name).trim();
    const style = `<style>
      .lf-blade{fill:${v('--lfBlade1')}} .lf-wings{fill:${v('--lfBlade1')}}
      .lf-underside{fill:#dde5cf;stroke:${v('--lfOutline')};stroke-width:1}
      .lf-outline{fill:none;stroke:${v('--lfOutline')};stroke-width:1.6;stroke-linejoin:round}
      .lf-mid{stroke:${v('--lfVein')};stroke-width:2.1;stroke-linecap:round}
      .lf-sec{stroke:${v('--lfVein')};stroke-width:1.1;stroke-linecap:round;opacity:.85}
      .lf-ter{stroke:${v('--lfVeinT') || v('--lfVein')};stroke-width:.7}
      .lf-petiole,.lf-rachis{stroke:${v('--lfPetiole')};fill:none;stroke-width:3.4;stroke-linecap:round}
      .lf-rachis.thin{stroke-width:1.8}
      .lf-sheath{fill:${v('--lfPetiole')};opacity:.85} .lf-ligule{stroke:${v('--lfExtra')};stroke-width:1.4;fill:none}
      .lf-stipule{fill:${v('--lfStipule')};stroke:${v('--lfOutline')};stroke-width:.8}
      .lf-stem{fill:${v('--border-strong')}}
      .lf-spine,.lf-arista{stroke:${v('--lfExtra')};stroke-width:1.6;stroke-linecap:round;fill:none}
      .lf-hair,.lf-fuzz{stroke:${v('--lfVein')};stroke-width:.7;stroke-linecap:round;opacity:.5;fill:none}
      .lf-mucro{fill:${v('--lfExtra')}} .lf-pelt{fill:${v('--lfPetiole')};stroke:${v('--lfOutline')}}
      .lf-joint{fill:${v('--lfPetiole')}} .lf-rolled{stroke:${v('--lfOutline')};stroke-width:4.5;opacity:.35;fill:none}
      .lf-hl{display:none}
    </style>`;
    const src = svgEl.outerHTML.replace(/(<svg[^>]*>)/, `$1${style}`)
      .replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
    download(src, 'leafpro-hoja.svg', 'image/svg+xml');
  }

  function load(model, skin) {
    st.compo = 'simple';
    st.shape = model.shape || 'eliptica';
    const sh = Leaf.SHAPES[st.shape] || {};
    st.apex = model.apex || sh.apex || 'agudo';
    st.base = model.base || sh.base || 'cuneada';
    st.margin = model.margin || 'entero';
    st.venation = model.venation || sh.venation || 'craspedodroma';
    st.petiole = model.petiole ?? 0.28;
    st.stipules = !!model.stipules;
    st.skin = skin || '';
    const lob = model.lobing || sh.lobing;
    st.lobing = '';
    if (lob) {
      const mode = lob.mode || 'pinnati';
      const depth = lob.depth || 0.4;
      const lvl = depth > 0.8 ? 'secta' : depth > 0.5 ? 'partida' : 'lobada';
      st.lobing = (mode === 'palmati' ? 'palmati' : 'pinnati') + lvl;
      st.lobN = mode === 'palmati' ? (lob.n || 2) * 2 + 1 : (lob.n || 5);
    }
    buildControls();
    draw();
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('b6Ctrl')) return;
    buildControls();
    draw();
    el('b6Random').addEventListener('click', randomLeaf);
    /* the download ends in the suite's «✓ Done» on the button */
    el('b6Export').addEventListener('click', e => {
      if (window.LABG && LABG.busyButton) LABG.busyButton(e.currentTarget, exportSVG).catch(err => console.error(err));
      else exportSVG();
    });
    document.addEventListener('langchange', () => { buildControls(); draw(); });
  });

  window.B6 = { load, currentModel, LOBINGS, COMPOS };
})();
