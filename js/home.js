/* LeafPro — Block 1: home. Hero showcase, parts diagram, character cards,
   feature grid, theory and references. */

(function () {
  /* ---------- hero: a slow parade of leaves drawn by the engine ---------- */
  const SHOW = [
    { m: { shape: 'ovada', margin: 'aserrado', venation: 'craspedodroma', base: 'redondeada' },
      c: { es: 'ovada · margen aserrado · craspedódroma', en: 'ovate · serrate margin · craspedodromous' } },
    { m: { shape: 'cordiforme', apex: 'acuminado', venation: 'palmada' },
      c: { es: 'cordada · ápice acuminado · palmatinervia', en: 'cordate · acuminate apex · palmate-veined' } },
    { m: { shape: 'obovada', lobing: { mode: 'pinnati', n: 4, depth: 0.45, sharp: 0.1 }, venation: 'craspedodroma' },
      c: { es: 'pinnatilobada, como un encino', en: 'pinnately lobed, like an oak' } },
    { m: { shape: 'linear', venation: 'paralela', base: 'envainadora', petiole: 0, ligule: true },
      c: { es: 'linear · paralelinervia, como el maíz', en: 'linear · parallel-veined, like maize' } },
    { m: { shape: 'panduriforme', venation: 'camptodroma' },
      c: { es: 'panduriforme, como Ficus lyrata', en: 'pandurate, like Ficus lyrata' } },
    { m: { shape: 'flabelada', petiole: 0.5 },
      c: { es: 'flabelada · dicotómica, como Ginkgo', en: 'flabellate · dichotomous, like Ginkgo' } },
    { m: { shape: 'sagitiforme', venation: 'palmada' },
      c: { es: 'sagitada, como la flecha de agua', en: 'sagittate, like arrowhead' } },
    { m: { shape: 'eliptica', margin: 'espinoso', apex: 'pungente' },
      c: { es: 'margen espinoso, como el acebo', en: 'spiny margin, like holly' } },
    { cmp: { type: 'imparipinnada', n: 4, leaflet: { shape: 'eliptica', margin: 'aserrado' } },
      c: { es: 'imparipinnada, como la rosa', en: 'odd-pinnate, like a rose' } },
    { cmp: { type: 'palmaticompuesta', n: 6, leaflet: { shape: 'oblanceolada' } },
      c: { es: 'palmaticompuesta, como la ceiba', en: 'palmately compound, like kapok' } },
    { m: { shape: 'oval', apex: 'bilobado', base: 'cordada', venation: 'palmada' },
      c: { es: 'ápice bilobado, como la pata de vaca', en: 'bilobed apex, like Bauhinia' } },
    { sp: 'jarra',
      c: { es: 'hoja jarra de Nepenthes: una trampa', en: 'Nepenthes pitcher leaf: a trap' } },
    { m: { shape: 'oblonga', venation: 'transversa', apex: 'redondeado', base: 'redondeada' },
      c: { es: 'penniparalela, como el plátano', en: 'pinnate-parallel, like banana' } },
  ];
  let showI = 0, showTimer = null;
  function heroDraw() {
    const box = el('heroLeaf'), cap = el('heroCaption');
    if (!box) return;
    const s = SHOW[showI % SHOW.length];
    box.style.opacity = 0;
    setTimeout(() => {
      box.innerHTML = s.sp ? Leaf.special(s.sp, { class: 'hero-leaf' })
        : s.cmp ? Leaf.compound(s.cmp, { class: 'hero-leaf' })
        : Leaf.svg(s.m, { class: 'hero-leaf' });
      const svg = box.querySelector('svg');
      if (svg) { svg.style.height = '320px'; svg.style.width = 'auto'; svg.style.margin = '0 auto'; }
      cap.textContent = T(s.c.es, s.c.en);
      box.style.transition = 'opacity .6s'; box.style.opacity = 1;
    }, 350);
    showI++;
  }

  /* ---------- character cards ---------- */
  function charCards() {
    const g = el('charGrid');
    if (!g) return;
    g.innerHTML = MORPH.cats.map(c => {
      const ch = CHARS[c.key];
      const n = MORPH.byCat(c.key).length;
      return `<div class="char-card" data-cat="${c.key}" style="--ch:var(--${ch.v})">
        <h3>${T(ch.es, ch.en)}</h3>
        <p>${T(c.sub.es, c.sub.en).split('.')[0]}.</p>
        <div class="ch-count">${n} ${T('términos', 'terms')}</div>
      </div>`;
    }).join('');
    els('.char-card', g).forEach(c => c.addEventListener('click', () => {
      goStep(5);
      setTimeout(() => { const h = document.getElementById('atcat-' + c.dataset.cat); if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 350);
    }));
  }

  /* ---------- feature grid ---------- */
  const FEATURES = [
    { n: 2, es: ['Partes de la hoja', 'La hoja por fuera y por dentro: dicotiledónea, pasto, haz y envés, el corte anatómico interactivo y la inserción en el tallo.'],
      en: ['Parts of the leaf', 'The leaf outside and inside: dicot, grass, upper and lower faces, the interactive cross-section and the attachment to the stem.'] },
    { n: 3, es: ['Simple y compuesta', 'Folíolos, raquis y el truco de la yema axilar para no confundir nunca hoja con folíolo.'],
      en: ['Simple and compound', 'Leaflets, rachis and the axillary-bud trick to never confuse a leaf with a leaflet.'] },
    { n: 4, es: ['Filotaxia', 'Alterna, opuesta, verticilada, en roseta… y un simulador del ángulo de oro de 137.5°.'],
      en: ['Phyllotaxy', 'Alternate, opposite, whorled, rosette… and a simulator of the 137.5° golden angle.'] },
    { n: 5, es: ['Atlas morfológico', 'Más de 140 términos ilustrados: formas, ápices, bases, márgenes, nervaduras, hojas modificadas y más.'],
      en: ['Morphology atlas', 'Over 140 illustrated terms: shapes, apices, bases, margins, venations, modified leaves and more.'] },
    { n: 6, es: ['Arma una hoja', 'Combina caracteres y mira la hoja dibujarse con su descripción botánica redactada.'],
      en: ['Build a leaf', 'Combine characters and watch the leaf drawn with its written botanical description.'] },
    { n: 7, es: ['Autoevaluación', 'Preguntas generadas por el motor: nunca se repiten las mismas hojas.'],
      en: ['Self-assessment', 'Questions generated by the engine: the same leaves never repeat.'] },
    { n: 8, es: ['Modo clase', 'Proyecta láminas preguntando antes de revelar, e imprime fichas de estudio.'],
      en: ['Classroom', 'Project plates asking before revealing, and print study sheets.'] },
  ];
  function featureGrid() {
    const g = el('featureGrid');
    if (!g) return;
    g.innerHTML = FEATURES.map(f => `<div class="feature" data-go="${f.n}">
      <span class="f-num">${f.n}</span>
      <h3>${L2(f.es[0], f.en[0])}</h3><p>${L2(f.es[1], f.en[1])}</p></div>`).join('');
    els('.feature', g).forEach(b => b.addEventListener('click', () => goStep(b.dataset.go)));
  }

  /* ---------- theory ---------- */
  function theory() {
    const box = el('theory');
    if (!box) return;
    const Q = [
      ['¿Qué es una hoja?', 'What is a leaf?',
       'La hoja es el órgano lateral del tallo especializado en la fotosíntesis: una superficie plana que captura luz y CO₂ y transpira agua. Nace en un nudo, lleva una yema en su axila y suele constar de lámina, pecíolo y, en muchas familias, estípulas. Su enorme variedad de formas es materia prima de la identificación de plantas.',
       'The leaf is the lateral organ of the stem specialised in photosynthesis: a flat surface that captures light and CO₂ and transpires water. It arises at a node, bears a bud in its axil and usually consists of blade, petiole and, in many families, stipules. Its enormous variety of shapes is raw material for plant identification.'],
      ['¿Por qué describimos la hoja por caracteres separados?', 'Why describe the leaf by separate characters?',
       'Porque los caracteres varían de forma independiente: hay hojas ovadas con margen entero y hojas ovadas aserradas; cordadas pecioladas y cordadas sésiles. Separar forma, ápice, base, margen, nervadura, composición y filotaxia permite combinar unos cuantos términos para describir miles de especies, igual que unas cuantas letras forman todas las palabras.',
       'Because characters vary independently: there are ovate leaves with entire margins and serrate ovate leaves; petiolate cordate leaves and sessile ones. Separating shape, apex, base, margin, venation, composition and phyllotaxy lets a few terms combine to describe thousands of species, just as a few letters form every word.'],
      ['¿La forma de la hoja identifica a la especie?', 'Does leaf shape identify the species?',
       'Ayuda, pero rara vez basta y hay que usarla con cuidado: muchas especies tienen hojas juveniles y adultas distintas (eucalipto), hojas de sol y de sombra, o heterofilia franca (una misma planta con varios tipos de hoja). Por eso las claves combinan caracteres foliares con flores y frutos. Aun así, con hojas se reconocen familias y géneros enteros: paralelinervia sugiere monocotiledónea; opuesta decusada con tallos cuadrados, una labiada.',
       'It helps, but rarely suffices, and must be used carefully: many species have distinct juvenile and adult leaves (eucalypts), sun and shade leaves, or outright heterophylly (one plant with several leaf types). That is why keys combine leaf characters with flowers and fruits. Even so, whole families and genera can be recognised by leaves: parallel venation suggests a monocot; decussate opposite leaves on square stems, a mint.'],
      ['¿Para qué tantos términos?', 'Why so many terms?',
       'Los términos son un lenguaje compartido y preciso: “lámina obovada de base atenuada, margen biserrado y nervadura craspedódroma” dibuja la hoja en la mente de cualquier botánico del mundo, sin ambigüedad y sin foto. Las floras, las claves y los artículos taxonómicos están escritos en este idioma; aprenderlo es aprender a leerlos.',
       'The terms are a shared, precise language: “obovate blade with attenuate base, biserrate margin and craspedodromous venation” draws the leaf in the mind of any botanist in the world, unambiguously and without a photo. Floras, keys and taxonomic papers are written in this language; learning it is learning to read them.'],
    ];
    box.innerHTML = Q.map(([es, en, des, den]) => `<details class="card" style="margin-bottom:10px">
      <summary style="cursor:pointer; font-weight:700">${L2(es, en)}</summary>
      <p class="muted" style="margin:8px 0 2px">${L2(des, den)}</p></details>`).join('');
  }

  function refs() {
    const r = el('refs');
    if (!r) return;
    r.innerHTML = [
      'Ellis, B., Daly, D. C., Hickey, L. J., Johnson, K. R., Mitchell, J. D., Wilf, P. y Wing, S. L. (2009). <i>Manual of Leaf Architecture</i>. Cornell University Press.',
      'Harris, J. G. y Harris, M. W. (2001). <i>Plant Identification Terminology: An Illustrated Glossary</i> (2.ª ed.). Spring Lake Publishing.',
      'Hickey, L. J. (1973). Classification of the architecture of dicotyledonous leaves. <i>American Journal of Botany, 60</i>(1), 17–33.',
      'Moreno, N. P. (1984). <i>Glosario botánico ilustrado</i>. Instituto Nacional de Investigaciones sobre Recursos Bióticos, Xalapa.',
      'Simpson, M. G. (2019). <i>Plant Systematics</i> (3.ª ed.). Academic Press.',
      'Beentje, H. (2016). <i>The Kew Plant Glossary: An Illustrated Dictionary of Plant Terms</i> (2.ª ed.). Kew Publishing.',
      'Font Quer, P. (2001). <i>Diccionario de botánica</i> (2.ª ed.). Península.',
      'Bell, A. D. (2008). <i>Plant Form: An Illustrated Guide to Flowering Plant Morphology</i>. Timber Press.',
      'Evert, R. F. y Eichhorn, S. E. (2013). <i>Raven Biology of Plants</i> (8.ª ed.). W. H. Freeman. [Anatomía de la hoja]',
    ].map(x => `<li>${x}</li>`).join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    heroDraw();
    showTimer = setInterval(heroDraw, 4200);
    charCards();
    featureGrid();
    theory();
    refs();
    Parts.render(el('partsStage'), el('partsInfo'), 'dicot');
    const gp = el('goParts');
    if (gp) gp.addEventListener('click', () => { const h = el('parts'); if (h) h.scrollIntoView({ behavior: 'smooth' }); });
    document.addEventListener('langchange', () => {
      charCards(); featureGrid();
      Parts.render(el('partsStage'), el('partsInfo'), 'dicot');
    });
    /* about dialog */
    const dlg = el('aboutDlg');
    el('aboutBtn').addEventListener('click', e => { e.preventDefault(); dlg.showModal(); });
    el('aboutClose').addEventListener('click', () => dlg.close());
    el('aboutCopy').addEventListener('click', () => {
      const txt = el('aboutCite').textContent.replace(/\s+/g, ' ').trim();
      navigator.clipboard && navigator.clipboard.writeText(txt);
    });
  });
})();
