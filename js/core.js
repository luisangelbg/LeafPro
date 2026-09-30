/* LeafPro — global state, navigation and shared utilities.
   No ES modules: everything hangs from window so the app also works when
   index.html is opened with a double click (file://). */

const state = {
  labels: null,        /* labels on drawings: 'on' | 'off' */
};
window.state = state;

/* the eight blocks of the app, in navigation order */
const STEPS = [
  { n: 1, es: 'Inicio', en: 'Home', ready: true },
  { n: 2, es: 'Partes de la hoja', en: 'Parts of the leaf', ready: true },
  { n: 3, es: 'Simple y compuesta', en: 'Simple and compound', ready: true },
  { n: 4, es: 'Filotaxia', en: 'Phyllotaxy', ready: true },
  { n: 5, es: 'Atlas morfológico', en: 'Morphology atlas', ready: true },
  { n: 6, es: 'Arma una hoja', en: 'Build a leaf', ready: true },
  { n: 7, es: 'Autoevaluación', en: 'Self-assessment', ready: true },
  { n: 8, es: 'Modo clase', en: 'Classroom', ready: true },
];

/* ---------------- DOM ---------------- */
function el(id) { return document.getElementById(id); }
function els(sel, root) { return [...(root || document).querySelectorAll(sel)]; }
function mk(tag, attrs, html) {
  const n = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') n.className = attrs[k];
    else if (k === 'style') n.setAttribute('style', attrs[k]);
    else if (k.startsWith('on') && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  }
  if (html != null) n.innerHTML = html;
  return n;
}
function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/* bilingual inline HTML: both spans are written, CSS shows the active one */
function L2(es, en) { return `<span data-l="es">${es}</span><span data-l="en">${en}</span>`; }
function download(content, filename, mime) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = mk('a', { href: url, download: filename });
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function slug(s) {
  return String(s || 'leafpro').normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase().slice(0, 70) || 'leafpro';
}

/* Persisted preferences */
const Prefs = {
  get(k, d) { try { const v = localStorage.getItem('leafpro:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('leafpro:' + k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
};

/* ---------------- block navigation ----------------
   The address bar keeps the block (#b4), so a teacher can share a link that
   opens the app directly on one block. */
function goStep(n, opts) {
  n = String(n);
  if (!el('panel-' + n)) n = '1';
  els('.step-panel').forEach(p => p.classList.toggle('active', p.id === 'panel-' + n));
  els('.step-btn').forEach(b => b.classList.toggle('active', b.dataset.step === n));
  document.body.classList.toggle('on-home', n === '1');
  if (!(opts && opts.keepScroll)) window.scrollTo({ top: 0, behavior: 'smooth' });
  const btn = stepBtn(n);
  if (window.LABG) {
    LABG.setCurrentStep(n);
    /* the first block shown on opening is not announced: nothing changed yet */
    if (btn && !(opts && opts.fromHash && opts.keepScroll)) LABG.announce(T('Bloque ', 'Block ') + stepName(n));
  } else if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  refreshStepFooters();
  if (!(opts && opts.fromHash)) { try { history.replaceState(null, '', '#b' + n); } catch (e) { /* file:// in some browsers */ } }
  document.dispatchEvent(new CustomEvent('stepchange', { detail: { step: Number(n) } }));
}
function buildStepper() {
  const nav = el('stepper');
  if (!nav) return;
  nav.innerHTML = STEPS.map(s => `<button class="step-btn" data-step="${s.n}"><span class="step-num">${s.n}</span>${L2(s.es, s.en)}${s.ready ? '' : ` <span class="soon">${L2('pronto', 'soon')}</span>`}</button>`).join('');
  els('.step-btn', nav).forEach(b => b.addEventListener('click', () => goStep(b.dataset.step)));
}
function stepFromHash() {
  const m = /^#b(\d)/.exec(location.hash || '');
  return m ? m[1] : '1';
}

/* ---------------- common bar of the LABG Suite ----------------
   Every call to labg-core.js is guarded: the test pages load this file
   without it.

   No block is ever marked as done: LeafPro is a teaching app in which the
   eight blocks are open from the start and none of them produces a result
   that the others need (there is no data to load, no analysis to finish),
   so a "done" tick would mean nothing. For the same reason there is no
   warning before closing the page: nothing the user does can be lost (the
   preferences are saved as they change). */
const stepBtn = n => document.querySelector('.step-btn[data-step="' + String(n) + '"]');
function stepName(n) {
  const s = STEPS.find(x => String(x.n) === String(n));
  return s ? s.n + ' · ' + T(s.es, s.en) : String(n);
}

/* Footer of every block: Previous / Next, with the name of the block. Both
   languages are written side by side (L2), so a change of language needs no
   redraw. The buttons carry data-to, not data-go: data-go is wired globally
   when the page loads. */
function refreshStepFooters() {
  if (!window.LABG) return;
  els('.step-panel').forEach(p => {
    const n = Number(p.id.replace('panel-', ''));
    const i = STEPS.findIndex(s => s.n === n);
    if (i < 0) return;
    let f = p.querySelector(':scope > .step-footer');
    if (!f) {
      f = mk('nav', { class: 'step-footer no-print' });
      f.innerHTML = '<button type="button" class="btn btn-secondary prev"></button><button type="button" class="btn btn-primary next"></button>';
      f.addEventListener('click', e => { const b = e.target.closest('button[data-to]'); if (b && !b.disabled) goStep(b.dataset.to); });
      p.appendChild(f);
    }
    f.setAttribute('aria-label', T('Bloques', 'Blocks'));
    const prev = STEPS[i - 1], next = STEPS[i + 1];
    const label = s => L2(s.n + ' · ' + s.es, s.n + ' · ' + s.en);
    const bp = f.querySelector('.prev'), bn = f.querySelector('.next');
    bp.hidden = !prev;
    if (prev) { bp.dataset.to = prev.n; bp.innerHTML = `← <span><small>${L2('Anterior', 'Previous')}</small>${label(prev)}</span>`; }
    bn.hidden = !next;
    if (next) { bn.dataset.to = next.n; bn.innerHTML = `<span><small>${L2('Siguiente', 'Next')}</small>${label(next)}</span> →`; }
  });
}

/* Theme button and block bar: labels that depend on the theme and the language */
function paintCommonBar() {
  if (!window.LABG) return;
  LABG.theme.key = 'leafpro:theme';
  LABG.theme.paint();
  const nav = el('stepper');
  if (nav) nav.setAttribute('aria-label', T('Bloques', 'Blocks'));
}

/* the suite's work window: this app has no long calculations, but the scene
   and the tips stay ready for any wait (the tests load this file without
   labg-core.js, hence the check) */
if (window.LABG && LABG.work) {
  LABG.work.scene = 'grow';
  LABG.work.tips = [
    ['Cada carácter de la hoja conserva su color en toda la app: partes, atlas, constructor y autoevaluación.',
     'Each leaf character keeps its colour throughout the app: parts, atlas, builder and self-assessment.'],
    ['En «Arma una hoja», el botón «Hoja al azar» propone una combinación nueva y «Descargar SVG» guarda el dibujo.',
     'In “Build a leaf”, the “Random leaf” button proposes a new combination and “Download SVG” saves the drawing.'],
    ['En el modo clase, las flechas del teclado pasan de una lámina a otra.',
     'In classroom mode, the arrow keys move from one plate to the next.'],
  ];
}

/* Wired after every DOMContentLoaded handler has run, so the block bar
   exists and the other modules have registered their own keys first. */
document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
  if (!window.LABG) return;
  const hb = el('helpBtn');
  if (hb) hb.addEventListener('click', () => LABG.showShortcuts());
  LABG.shortcuts([]);
  /* the classroom presentation (Block 8) keeps the arrows for itself */
  LABG.bindStepKeys(goStep);
  const cur = document.querySelector('.step-btn.active');
  LABG.setCurrentStep(cur ? cur.dataset.step : '1');
  document.addEventListener('themechange', paintCommonBar);
  document.addEventListener('langchange', paintCommonBar);
  paintCommonBar();
  refreshStepFooters();
}, 0));

/* ---------------- the characters of the leaf ----------------
   Each character keeps one colour everywhere in the app (parts diagram,
   atlas, builder, quizzes), like the whorl colours of FloralPro. */
const CHARS = {
  forma:      { es: 'Forma de la lámina', en: 'Blade shape',     one: { es: 'forma', en: 'shape' },     v: 'cF' },
  apice:      { es: 'Ápice',              en: 'Apex',            one: { es: 'ápice', en: 'apex' },      v: 'cA' },
  base:       { es: 'Base',               en: 'Base',            one: { es: 'base', en: 'base' },       v: 'cB' },
  margen:     { es: 'Margen',             en: 'Margin',          one: { es: 'margen', en: 'margin' },   v: 'cM' },
  nervadura:  { es: 'Nervadura',          en: 'Venation',        one: { es: 'nervadura', en: 'venation' }, v: 'cN' },
  compo:      { es: 'Composición',        en: 'Composition',     one: { es: 'composición', en: 'composition' }, v: 'cC' },
  filotaxia:  { es: 'Filotaxia',          en: 'Phyllotaxy',      one: { es: 'filotaxia', en: 'phyllotaxy' }, v: 'cP' },
  union:      { es: 'Inserción en el tallo', en: 'Attachment',   one: { es: 'inserción', en: 'attachment' }, v: 'cU' },
  superficie: { es: 'Superficie y consistencia', en: 'Surface and texture', one: { es: 'superficie', en: 'surface' }, v: 'cS' },
  modificada: { es: 'Hojas modificadas', en: 'Modified leaves', one: { es: 'modificación', en: 'modification' }, v: 'cX' },
  duracion:   { es: 'Duración y variación', en: 'Duration and variation', one: { es: 'duración', en: 'duration' }, v: 'cD' },
};
function charColor(key) { const c = CHARS[key]; return c ? `var(--${c.v})` : 'var(--primary)'; }

document.addEventListener('DOMContentLoaded', () => {
  buildStepper();
  const brand = el('brand');
  if (brand) brand.addEventListener('click', () => goStep(1));
  els('[data-go]').forEach(b => b.addEventListener('click', () => goStep(b.dataset.go)));
  goStep(stepFromHash(), { fromHash: true, keepScroll: true });
  window.addEventListener('hashchange', () => goStep(stepFromHash(), { fromHash: true }));
});

Object.assign(window, { STEPS, el, els, mk, esc, L2, download, slug, Prefs, goStep, CHARS, charColor });
