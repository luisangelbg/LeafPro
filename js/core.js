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
  const btn = document.querySelector('.step-btn[data-step="' + n + '"]');
  if (btn && btn.scrollIntoView) btn.scrollIntoView({ block: 'nearest', inline: 'nearest' });
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
