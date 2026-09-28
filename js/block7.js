/* LeafPro — Block 7: self-assessment.
   Three practice modes, all generated from the atlas and the engine:
   A) figure → term, B) term → figure, C) describe a random leaf.
   Ten questions per round, instant correction with the atlas definition. */

(function () {
  const QUIZ_CATS = ['forma', 'apice', 'base', 'margen', 'nervadura', 'compo', 'filotaxia', 'modificada'];
  const run = { mode: null, cats: [], qs: [], i: 0, score: 0 };

  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function shuffle(a) { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  function art(term) {
    if (term.phyllo) return `<div style="display:inline-flex; gap:4px; align-items:center; max-width:340px">${B4.sideView(term.phyllo)}${B4.topView(term.phyllo)}</div>`;
    return termArt(term);
  }

  /* ---------- question builders ---------- */
  function qFigureToTerm(cats) {
    const cat = pick(cats);
    const terms = MORPH.byCat(cat);
    const answer = pick(terms);
    const options = shuffle([answer, ...shuffle(terms.filter(x => x !== answer)).slice(0, 3)]);
    const ch = CHARS[cat];
    return {
      prompt: T(`¿Qué término describe ${cat === 'filotaxia' ? 'esta filotaxia' : cat === 'compo' ? 'esta hoja' : cat === 'modificada' ? 'esta hoja modificada' : cat === 'duracion' ? 'este follaje' : 'este carácter resaltado'}? <span style="color:var(--${ch.v})">(${T(ch.es, ch.en).toLowerCase()})</span>`,
                `Which term describes ${cat === 'filotaxia' ? 'this phyllotaxy' : cat === 'compo' ? 'this leaf' : cat === 'modificada' ? 'this modified leaf' : cat === 'duracion' ? 'this foliage' : 'the highlighted character'}? <span style="color:var(--${ch.v})">(${T(ch.es, ch.en).toLowerCase()})</span>`),
      fig: art(answer),
      options: options.map(o => ({ txt: T(o.es, o.en), ok: o === answer })),
      exp: `<b>${T(answer.es, answer.en)}:</b> ${T(answer.def.es, answer.def.en)} <i>${T(answer.ex.es, answer.ex.en)}</i>`,
    };
  }

  function qTermToFigure(cats) {
    const cat = pick(cats);
    const terms = MORPH.byCat(cat);
    const answer = pick(terms);
    const options = shuffle([answer, ...shuffle(terms.filter(x => x !== answer)).slice(0, 3)]);
    return {
      prompt: T(`¿Cuál de estas hojas es <b>${answer.es.toLowerCase()}</b>?`,
                `Which of these leaves is <b>${answer.en.toLowerCase()}</b>?`),
      figOptions: options.map(o => ({ fig: art(o), ok: o === answer })),
      exp: `<b>${T(answer.es, answer.en)}:</b> ${T(answer.def.es, answer.def.en)}`,
    };
  }

  /* one random leaf, several sub-questions about it */
  const DESCRIBE_POOL = {
    forma: ['eliptica', 'ovada', 'obovada', 'lanceolada', 'oblonga', 'cordiforme', 'orbicular', 'espatulada', 'linear', 'reniforme'],
    apice: ['agudo', 'acuminado', 'obtuso', 'redondeado', 'emarginado', 'mucronado', 'truncado', 'aristado'],
    base: ['cuneada', 'atenuada', 'redondeada', 'truncada', 'cordada', 'oblicua', 'auriculada', 'hastada'],
    margen: ['entero', 'aserrado', 'crenado', 'dentado', 'sinuado', 'biserrado', 'espinoso'],
  };
  function qDescribe() {
    const md = {
      shape: pick(DESCRIBE_POOL.forma), apex: pick(DESCRIBE_POOL.apice),
      base: pick(DESCRIBE_POOL.base), margin: pick(DESCRIBE_POOL.margen),
      venation: pick(['craspedodroma', 'camptodroma', 'broquidodroma']), petiole: 0.25,
    };
    const paramOf = { forma: 'shape', apice: 'apex', base: 'base', margen: 'margin' };
    const cat = pick(Object.keys(paramOf));
    const value = md[paramOf[cat]];
    const terms = MORPH.byCat(cat).filter(x => !x.model.lobing && !x.compound && x.model[paramOf[cat]]);
    const answer = terms.find(x => x.model[paramOf[cat]] === value);
    if (!answer) return qDescribe();
    const options = shuffle([answer, ...shuffle(terms.filter(x => x !== answer)).slice(0, 3)]);
    const ch = CHARS[cat];
    return {
      prompt: T(`Observa la hoja completa (sin resaltados). ¿Cómo es su <b style="color:var(--${ch.v})">${CHARS[cat].one.es}</b>?`,
                `Look at the whole leaf (no highlights). What is its <b style="color:var(--${ch.v})">${CHARS[cat].one.en}</b>?`),
      fig: Leaf.svg(md, {}),
      options: options.map(o => ({ txt: T(o.es, o.en), ok: o === answer })),
      exp: `<b>${T(answer.es, answer.en)}:</b> ${T(answer.def.es, answer.def.en)}`,
    };
  }

  /* ---------- round control ---------- */
  function start(mode, cats) {
    run.mode = mode; run.cats = cats; run.i = 0; run.score = 0; run.qs = [];
    for (let i = 0; i < 10; i++) {
      run.qs.push(mode === 'a' ? qFigureToTerm(cats) : mode === 'b' ? qTermToFigure(cats) : qDescribe());
    }
    el('q7Modes').style.display = 'none';
    el('q7End').style.display = 'none';
    el('q7Run').style.display = '';
    show();
  }

  function show() {
    const q = run.qs[run.i];
    const box = el('q7Run');
    const opts = q.figOptions
      ? `<div class="q-opts">${q.figOptions.map((o, i) => `<button class="q-opt" data-i="${i}" style="text-align:center">${o.fig.replace('<svg ', '<svg style="height:150px; max-width:100%" ')}</button>`).join('')}</div>`
      : `<div class="q-opts">${q.options.map((o, i) => `<button class="q-opt" data-i="${i}">${o.txt}</button>`).join('')}</div>`;
    box.innerHTML = `
      <div class="q-head">
        <button class="btn btn-ghost btn-sm" id="q7Quit">✕ ${T('Salir', 'Quit')}</button>
        <div class="q-prog"><div style="width:${(run.i / 10) * 100}%"></div></div>
        <span class="q-score">${run.score} / ${run.i}</span>
      </div>
      <div class="card">
        <p style="font-size:1.05rem; margin:2px 0 8px">${T('Pregunta', 'Question')} ${run.i + 1} ${T('de', 'of')} 10 · ${q.prompt}</p>
        ${q.fig ? `<div class="q-fig">${q.fig}</div>` : ''}
        ${opts}
        <div id="q7Exp"></div>
        <div style="text-align:right; margin-top:10px"><button class="btn btn-primary" id="q7Next" style="display:none">${run.i === 9 ? T('Ver resultado', 'See result') : T('Siguiente →', 'Next →')}</button></div>
      </div>`;
    el('q7Quit').addEventListener('click', endModes);
    els('.q-opt', box).forEach(b => b.addEventListener('click', () => answer(Number(b.dataset.i))));
  }

  function answer(i) {
    const q = run.qs[run.i];
    const list = q.figOptions || q.options;
    const ok = list[i].ok;
    if (ok) run.score++;
    els('#q7Run .q-opt').forEach((b, j) => {
      b.disabled = true;
      if (list[j].ok) b.classList.add('good');
      else if (j === i) b.classList.add('bad');
    });
    el('q7Exp').innerHTML = `<div class="q-exp">${ok ? '✅ ' : '❌ '} ${q.exp}</div>`;
    /* the correction is read aloud to screen readers */
    if (window.LABG) LABG.messageRole(el('q7Exp').firstElementChild, 'info');
    const nx = el('q7Next');
    nx.style.display = '';
    nx.focus();
    nx.addEventListener('click', () => { run.i++; run.i >= 10 ? end() : show(); });
  }

  function end() {
    el('q7Run').style.display = 'none';
    const box = el('q7End');
    box.style.display = '';
    const pct = run.score * 10;
    const msg = pct >= 90 ? T('¡Dominio de herbario! 🌿', 'Herbarium mastery! 🌿')
      : pct >= 70 ? T('Muy bien: ya lees hojas con soltura.', 'Very good: you read leaves fluently.')
      : pct >= 50 ? T('Vas a la mitad: repasa el atlas y vuelve.', 'Half-way there: review the atlas and come back.')
      : T('Toca repasar el atlas con calma; las hojas no se van.', 'Time to review the atlas calmly; the leaves are not going anywhere.');
    box.innerHTML = `
      <div class="q-big">${run.score}/10</div>
      <p style="font-size:1.1rem">${msg}</p>
      <div class="hero-cta" style="justify-content:center">
        <button class="btn btn-primary" id="q7Again">${T('Otra ronda', 'Another round')}</button>
        <button class="btn btn-ghost" id="q7Back">${T('Elegir otro modo', 'Choose another mode')}</button>
      </div>`;
    el('q7Again').addEventListener('click', () => start(run.mode, run.cats));
    el('q7Back').addEventListener('click', endModes);
  }

  function endModes() {
    el('q7Run').style.display = 'none';
    el('q7End').style.display = 'none';
    el('q7Modes').style.display = '';
  }

  /* ---------- mode chooser ---------- */
  let selCats = [...QUIZ_CATS];
  function renderModes() {
    const box = el('q7Modes');
    const chips = QUIZ_CATS.map(c => `<button class="chip${selCats.includes(c) ? ' on' : ''}" data-c="${c}" style="${selCats.includes(c) ? `border-color:var(--${CHARS[c].v}); color:var(--${CHARS[c].v})` : ''}">${T(CHARS[c].es, CHARS[c].en)}</button>`).join('');
    box.innerHTML = `
      <div class="card" style="grid-column:1/-1">
        <b>${T('Caracteres a practicar:', 'Characters to practise:')}</b>
        <div class="chips" style="margin-top:8px">${chips}</div>
      </div>
      <div class="q-mode" data-m="a"><h3>🔎 ${T('¿Qué término es?', 'Which term is it?')}</h3>
        <p>${T('LeafPro dibuja una hoja con un carácter resaltado y tú eliges el término correcto entre cuatro.', 'LeafPro draws a leaf with one character highlighted and you choose the right term out of four.')}</p></div>
      <div class="q-mode" data-m="b"><h3>🍃 ${T('Encuentra la hoja', 'Find the leaf')}</h3>
        <p>${T('Te damos el término y eliges, entre cuatro dibujos, la hoja que lo cumple.', 'You get the term and choose, among four drawings, the leaf that matches it.')}</p></div>
      <div class="q-mode" data-m="c"><h3>📝 ${T('Describe la hoja', 'Describe the leaf')}</h3>
        <p>${T('Una hoja al azar, sin pistas: identifica su forma, ápice, base o margen, como frente a una planta real.', 'A random leaf, no hints: identify its shape, apex, base or margin, as with a real plant.')}</p></div>`;
    els('.chip[data-c]', box).forEach(ch => ch.addEventListener('click', () => {
      const c = ch.dataset.c;
      selCats.includes(c) ? selCats = selCats.filter(x => x !== c) : selCats.push(c);
      if (!selCats.length) selCats = [c];
      renderModes();
    }));
    els('.q-mode', box).forEach(m => m.addEventListener('click', () =>
      start(m.dataset.m, m.dataset.m === 'c' ? ['forma'] : selCats)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('q7Modes')) return;
    let built = false;
    const build = () => { if (!built) { renderModes(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 7) build(); });
    if (location.hash === '#b7') build();
    document.addEventListener('langchange', () => { if (built && el('q7Modes').style.display !== 'none') renderModes(); });
  });

  window.B7 = { qFigureToTerm, qTermToFigure, qDescribe };
})();
