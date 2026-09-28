/* LeafPro — Block 5: morphology atlas.
   One plate per term, grouped by character, with search, a side navigation
   coloured by character, and a dialog with the enlarged figure. */

(function () {
  let currentTerm = null;

  function plateSVG(term, opts) {
    return termArt(term, opts);
  }

  function normalize(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  }

  function render() {
    const main = el('b5Main'), nav = el('b5Nav');
    if (!main || !nav) return;
    const q = normalize(el('b5Search').value.trim());
    let navHTML = '', mainHTML = '', any = false;
    for (const cat of MORPH.cats) {
      const ch = CHARS[cat.key];
      const terms = MORPH.byCat(cat.key).filter(term => !q ||
        normalize(term.es + ' ' + term.en + ' ' + term.def.es + ' ' + term.def.en).includes(q));
      if (!terms.length) continue;
      any = true;
      navHTML += `<div class="at-cat" style="--ch:var(--${ch.v})">${T(ch.es, ch.en)}</div>` +
        terms.map(term => `<button data-term="${term.id}" style="--ch:var(--${ch.v})">${T(term.es, term.en)}</button>`).join('');
      mainHTML += `<h3 class="at-cat-title" id="atcat-${cat.key}" style="--ch:var(--${ch.v})">${T(ch.es, ch.en)}</h3>
        <p class="at-cat-sub">${T(cat.sub.es, cat.sub.en)}</p>
        <div class="plate-grid">` +
        terms.map(term => `<div class="plate" data-term="${term.id}" style="--ch:var(--${ch.v})">
          ${plateSVG(term)}
          <h4>${T(term.es, term.en)}</h4>
          <div class="p-en">${T(term.en, term.es)}</div>
        </div>`).join('') + '</div>';
    }
    nav.innerHTML = navHTML;
    main.innerHTML = mainHTML;
    el('b5Empty').style.display = any ? 'none' : '';
    els('button[data-term]', nav).forEach(b => b.addEventListener('click', () => openTerm(b.dataset.term)));
    els('.plate', main).forEach(p => p.addEventListener('click', () => openTerm(p.dataset.term)));
  }

  function openTerm(id) {
    const term = MORPH.byId(id);
    if (!term) return;
    currentTerm = term;
    const ch = CHARS[term.cat];
    el('b5DlgTitle').innerHTML = `${T(term.es, term.en)} <span class="muted" style="font-weight:400; font-size:.8em; font-style:italic">· ${T(term.en, term.es)}</span>`;
    el('b5DlgArt').innerHTML = plateSVG(term);
    el('b5DlgText').innerHTML = `
      <p><b style="color:var(--${ch.v}-text)">${T(ch.es, ch.en)}</b></p>
      <p>${T(term.def.es, term.def.en)}</p>
      <p><b>${T('Ejemplos:', 'Examples:')}</b> ${T(term.ex.es, term.ex.en)}</p>`;
    el('b5DlgBuild').style.display = (term.compound || term.special || term.phyllo) ? 'none' : '';
    el('b5Dlg').showModal();
    /* highlight in the nav */
    els('#b5Nav button').forEach(b => b.classList.toggle('on', b.dataset.term === id));
  }

  document.addEventListener('DOMContentLoaded', () => {
    let built = false;
    const build = () => { if (!built) { render(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 5) build(); });
    if (location.hash === '#b5') build();
    el('b5Search').addEventListener('input', render);
    el('b5DlgClose').addEventListener('click', () => el('b5Dlg').close());
    el('b5Dlg').addEventListener('click', e => { if (e.target === el('b5Dlg')) el('b5Dlg').close(); });
    el('b5DlgBuild').addEventListener('click', () => {
      el('b5Dlg').close();
      if (currentTerm && window.B6) B6.load(currentTerm.model, currentTerm.skin);
      goStep(6);
    });
    document.addEventListener('langchange', () => { if (built) render(); });
    document.addEventListener('themechange', () => { /* CSS variables update automatically */ });
  });

  window.B5 = { openTerm, plateSVG };
})();
