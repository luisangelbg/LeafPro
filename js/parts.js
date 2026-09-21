/* LeafPro — interactive "parts of the leaf" diagrams.
   Two labelled scenes share one mechanism: a drawing in a fixed coordinate
   system plus a list of labels; clicking or hovering a label shows its
   definition in the info panel beside the figure. */

(function () {
  const P = {
    /* ---- complete dicot leaf ---- */
    lamina: { es: 'Lámina (limbo)', en: 'Blade (lamina)', lat: 'lamina',
      d: { es: 'La parte plana y expandida de la hoja; su tejido verde realiza la fotosíntesis. Su forma, margen y nervadura son los caracteres estrella del atlas.',
           en: 'The flat, expanded part of the leaf; its green tissue performs photosynthesis. Its shape, margin and venation are the star characters of the atlas.' } },
    apice: { es: 'Ápice', en: 'Apex', lat: 'apex',
      d: { es: 'La punta de la lámina, opuesta a la base. Puede ser agudo, acuminado, obtuso, emarginado… (Bloque 5).',
           en: 'The tip of the blade, opposite the base. It may be acute, acuminate, obtuse, emarginate… (Block 5).' } },
    margen: { es: 'Margen', en: 'Margin', lat: 'margo',
      d: { es: 'El borde de la lámina: entero, aserrado, crenado, lobado… Aquí se dibujó aserrado.',
           en: 'The edge of the blade: entire, serrate, crenate, lobed… Here it is drawn serrate.' } },
    venamedia: { es: 'Vena media', en: 'Midrib', lat: 'costa',
      d: { es: 'La vena central, continuación del pecíolo; da soporte y conduce agua y azúcares.',
           en: 'The central vein, a continuation of the petiole; it supports the blade and conducts water and sugars.' } },
    venassec: { es: 'Venas secundarias', en: 'Secondary veins', lat: 'nervi laterales',
      d: { es: 'Las ramas de la vena media. Su patrón (llegar al margen, arquearse, unirse en festones) define la nervadura.',
           en: 'The branches of the midrib. Their pattern (reaching the margin, arching, looping) defines the venation.' } },
    base: { es: 'Base', en: 'Base', lat: 'basis',
      d: { es: 'El extremo de la lámina que recibe al pecíolo: cuneada, redondeada, cordada, oblicua…',
           en: 'The end of the blade that meets the petiole: cuneate, rounded, cordate, oblique…' } },
    peciolo: { es: 'Pecíolo', en: 'Petiole', lat: 'petiolus',
      d: { es: 'El tallito de la hoja: sostiene la lámina, la orienta hacia la luz y la comunica con el tallo. Si falta, la hoja es sésil.',
           en: 'The stalk of the leaf: it holds the blade, turns it to the light and connects it with the stem. When missing, the leaf is sessile.' } },
    estipulas: { es: 'Estípulas', en: 'Stipules', lat: 'stipulae',
      d: { es: 'Par de apéndices en la base del pecíolo. Pueden ser hojosas (rosa, chícharo), espinosas (mezquite) o caer temprano dejando cicatriz (amate).',
           en: 'A pair of appendages at the base of the petiole. They can be leafy (rose, pea), spiny (mesquite) or fall early leaving a scar (figs).' } },
    yema: { es: 'Yema axilar', en: 'Axillary bud', lat: 'gemma axillaris',
      d: { es: 'La yema en el ángulo (axila) entre la hoja y el tallo. Es la pista infalible para saber dónde empieza una hoja: hay yema en la axila de la hoja, nunca en la de un folíolo.',
           en: 'The bud in the angle (axil) between leaf and stem. It is the infallible clue to where a leaf begins: there is a bud in the axil of a leaf, never in that of a leaflet.' } },
    nudo: { es: 'Nudo', en: 'Node', lat: 'nodus',
      d: { es: 'El punto del tallo donde se inserta la hoja.',
           en: 'The point of the stem where the leaf is attached.' } },
    entrenudo: { es: 'Entrenudo', en: 'Internode', lat: 'internodium',
      d: { es: 'El tramo de tallo entre dos nudos consecutivos.',
           en: 'The stretch of stem between two consecutive nodes.' } },
    tallo: { es: 'Tallo', en: 'Stem', lat: 'caulis',
      d: { es: 'El eje que sostiene hojas y yemas. La hoja es un órgano lateral del tallo.',
           en: 'The axis bearing leaves and buds. The leaf is a lateral organ of the stem.' } },
    /* ---- grass leaf ---- */
    laminag: { es: 'Lámina', en: 'Blade', lat: 'lamina',
      d: { es: 'En los pastos la lámina es linear, con venas paralelas, y se dobla hacia afuera a la altura de la lígula.',
           en: 'In grasses the blade is linear, parallel-veined, and bends outwards at the level of the ligule.' } },
    vaina: { es: 'Vaina', en: 'Sheath', lat: 'vagina',
      d: { es: 'La base de la hoja, enrollada como un tubo alrededor del tallo (caña). Sustituye al pecíolo.',
           en: 'The base of the leaf, rolled like a tube around the stem (culm). It replaces the petiole.' } },
    ligula: { es: 'Lígula', en: 'Ligule', lat: 'ligula',
      d: { es: 'Membranita o hilera de pelos en la cara interna, justo donde la lámina se separa de la vaina. Su forma ayuda a identificar pastos sin flores.',
           en: 'A small membrane or row of hairs on the inner face, right where the blade parts from the sheath. Its shape helps identify grasses without flowers.' } },
    auriculas: { es: 'Aurículas', en: 'Auricles', lat: 'auriculae',
      d: { es: 'Dos proyecciones como orejitas que abrazan la caña en la unión de lámina y vaina; presentes en cebada, ausentes en avena.',
           en: 'Two ear-like projections clasping the culm at the junction of blade and sheath; present in barley, absent in oat.' } },
    nudog: { es: 'Nudo', en: 'Node', lat: 'nodus',
      d: { es: 'En los pastos los nudos son macizos y abultados; los entrenudos suelen ser huecos.',
           en: 'In grasses the nodes are solid and swollen; the internodes are usually hollow.' } },
    culmo: { es: 'Caña (culmo)', en: 'Culm', lat: 'culmus',
      d: { es: 'El tallo de los pastos: cilíndrico y con frecuencia hueco entre nudos.',
           en: 'The grass stem: cylindrical and often hollow between nodes.' } },
  };

  /* label positions: [key, xPoint, yPoint, xText, yText, anchor] */
  const DICOT_LABELS = [
    ['apice', 0, -104, 26, -112, 'start'],
    ['margen', 27, -46, 52, -58, 'start'],
    ['lamina', -14, -58, -58, -84, 'end'],
    ['venamedia', 0, -30, 40, -22, 'start'],
    ['venassec', -16, -72, -58, -52, 'end'],
    ['base', -8, -6, -52, -12, 'end'],
    ['peciolo', 1, 24, 34, 24, 'start'],
    ['estipulas', -9, 40, -50, 40, 'end'],
    ['yema', 8, 48, 42, 46, 'start'],
    ['nudo', 3, 52, 42, 60, 'start'],
    ['entrenudo', 1, 84, 40, 84, 'start'],
    ['tallo', -1, 106, -40, 104, 'end'],
  ];
  const GRASS_LABELS = [
    ['laminag', 40, -78, 64, -88, 'start'],
    ['ligula', 6, -19, 46, -30, 'start'],
    ['auriculas', -6, -14, -52, -22, 'end'],
    ['vaina', -7, 18, -48, 22, 'end'],
    ['nudog', 0, 52, 40, 54, 'start'],
    ['culmo', 2, 84, 42, 86, 'start'],
  ];

  function dicotScene() {
    const leaf = Leaf.svg({ shape: 'ovada', margin: 'aserrado', venation: 'craspedodroma', base: 'redondeada', apex: 'agudo', stipules: true, petiole: 0.45 }, {});
    const inner = leaf.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `
      <path class="lf-stem" d="M-2.5,34 L-2.5,118 L4.5,118 L4.5,34 Z" fill="var(--border-strong)"/>
      <circle cx="1" cy="52" r="3.4" fill="var(--border-strong)" stroke="var(--text-muted)" stroke-width=".8"/>
      <ellipse cx="7" cy="47" rx="3" ry="4.6" transform="rotate(24 7 47)" fill="var(--lfStipule)" stroke="var(--lfOutline)" stroke-width=".8"/>
      ${inner}`;
  }
  function grassScene() {
    return `
      <rect x="-6" y="-20" width="12" height="126" rx="5" fill="var(--border-strong)"/>
      <ellipse cx="0" cy="52" rx="7.6" ry="4.4" fill="var(--lfPetiole)" opacity=".9"/>
      <path d="M-8,50 C -9,20 -8,-6 -7,-18 L7,-18 C 8,-6 9,20 8,50 C 3,54 -3,54 -8,50 Z" fill="var(--lfBlade2)" opacity=".92"/>
      <path d="M-7,-18 L7,-18 M-7.6,0 L7.6,0 M-8,20 L8,20" stroke="var(--lfVein)" stroke-width=".7" opacity=".5" fill="none"/>
      <path d="M-6,-16 q 6,-4 12,0 l 0,3 q -6,-4 -12,0 Z" fill="var(--card-bg)" stroke="var(--lfOutline)" stroke-width=".7"/>
      <path d="M-7,-14 q -5,2 -6,6 M7,-14 q 5,2 6,6" stroke="var(--lfExtra)" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M6,-18 C 14,-40 30,-62 44,-76 C 52,-84 58,-88 60,-88 C 58,-80 52,-70 44,-58 C 34,-42 20,-26 8,-16 Z" fill="var(--lfBlade1)" stroke="var(--lfOutline)" stroke-width="1.2"/>
      <path d="M8,-19 C 22,-40 40,-64 57,-86 M12,-20 C 26,-38 42,-58 54,-74 M9,-17 C 20,-30 32,-44 44,-58" stroke="var(--lfVein)" stroke-width=".8" fill="none" opacity=".8"/>`;
  }

  function render(stageEl, infoEl, which) {
    const labels = which === 'grass' ? GRASS_LABELS : DICOT_LABELS;
    const scene = which === 'grass' ? grassScene() : dicotScene();
    const vb = which === 'grass' ? '-110 -120 240 240' : '-120 -128 250 260';
    const lab = labels.map(([k, x, y, tx, ty, an]) => `
      <g class="part-label" data-part="${k}">
        <line x1="${x}" y1="${y}" x2="${tx + (an === 'start' ? -3 : 3)}" y2="${ty - 3}"/>
        <circle cx="${x}" cy="${y}" r="2" fill="currentColor" opacity=".55"/>
        <text x="${tx}" y="${ty}" text-anchor="${an === 'end' ? 'end' : 'start'}">${T(P[k].es, P[k].en)}</text>
      </g>`).join('');
    stageEl.innerHTML = `<svg viewBox="${vb}" role="img" class="leaf">${scene}${lab}</svg>`;
    const show = k => {
      els('.part-label', stageEl).forEach(g => g.classList.toggle('on', g.dataset.part === k));
      const p = P[k];
      infoEl.innerHTML = `<h3>${T(p.es, p.en)}</h3><div class="p-lat">${p.lat}</div><p>${T(p.d.es, p.d.en)}</p>`;
    };
    els('.part-label', stageEl).forEach(g => {
      g.addEventListener('mouseenter', () => show(g.dataset.part));
      g.addEventListener('click', () => show(g.dataset.part));
    });
    show(which === 'grass' ? 'vaina' : 'lamina');
  }

  window.Parts = { render, DEFS: P };
})();
