/* LeafPro — Block 3: simple and compound leaves.
   The axillary-bud trick, the continuum from entire to compound, and every
   compound type drawn by the engine. */

(function () {
  /* a branch with one compound leaf, buds marked to show the trick */
  function trickSVG() {
    const leaf = Leaf.compound({ type: 'imparipinnada', n: 3, leaflet: { shape: 'eliptica', margin: 'aserrado' } }, {});
    const inner = leaf.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
    return `<svg viewBox="-150 -170 300 320" class="leaf" role="img">
      <rect x="-64" y="-160" width="9" height="310" rx="4" fill="var(--border-strong)"/>
      <g transform="translate(-58,64) rotate(58) scale(0.9)">${inner}</g>
      <circle cx="-51" cy="52" r="6" fill="var(--accent)" stroke="var(--card-bg)" stroke-width="1.6"/>
      <g class="part-label"><line x1="-46" y1="48" x2="30" y2="24"/><text x="34" y="26" font-weight="700">${T('yema axilar: aquí empieza la HOJA', 'axillary bud: the LEAF starts here')}</text></g>
      <g class="part-label"><line x1="38" y1="118" x2="70" y2="146"/><text x="6" y="160">${T('folíolos: sin yema en su base', 'leaflets: no bud at their base')}</text></g>
      <g class="part-label"><line x1="10" y1="86" x2="60" y2="86"/><text x="64" y="89">${T('raquis', 'rachis')}</text></g>
    </svg>`;
  }

  /* the continuum: entire → lobed → parted → sect → truly compound */
  function continuum() {
    const steps = [
      { es: 'Entera', en: 'Entire', md: { shape: 'eliptica', venation: 'craspedodroma' } },
      { es: 'Pinnatilobada', en: 'Pinnately lobed', md: { shape: 'eliptica', lobing: { mode: 'pinnati', n: 4, depth: 0.4, sharp: 0.2 }, venation: 'craspedodroma' } },
      { es: 'Pinnatipartida', en: 'Pinnately parted', md: { shape: 'eliptica', lobing: { mode: 'pinnati', n: 4, depth: 0.7, sharp: 0.4 }, venation: 'craspedodroma' } },
      { es: 'Pinnatisecta', en: 'Pinnatisect', md: { shape: 'eliptica', lobing: { mode: 'pinnati', n: 4, depth: 0.94, sharp: 0.55 }, venation: 'craspedodroma' } },
      { es: 'Compuesta', en: 'Compound', cmp: { type: 'imparipinnada', n: 4, leaflet: { shape: 'eliptica' } } },
    ];
    return `<div class="cmp-grid">` + steps.map((s, i) => `
      <div class="cmp-card" style="border-top-color:var(--cM)">
        ${s.cmp ? Leaf.compound(s.cmp, {}) : Leaf.svg(s.md, {})}
        <h4>${i + 1}. ${T(s.es, s.en)}</h4>
        <p>${i < 4 ? T('la lámina sigue siendo una sola pieza', 'the blade is still one piece')
                   : T('folíolos independientes articulados al raquis', 'independent leaflets jointed to the rachis')}</p>
      </div>`).join('') + '</div>';
  }

  function compoundTypes() {
    const terms = MORPH.byCat('compo');
    return `<div class="cmp-grid">` + terms.map(term => `
      <div class="cmp-card" data-term="${term.id}">
        ${B5.plateSVG(term)}
        <h4>${T(term.es, term.en)}</h4>
        <p>${T(term.ex.es, term.ex.en)}</p>
      </div>`).join('') + '</div>';
  }

  function render() {
    const box = el('b3Main');
    box.innerHTML = `
      <h2 class="section-title">${T('El truco de la yema axilar', 'The axillary-bud trick')}</h2>
      <p class="section-sub">${T(
        '¿Hoja con folíolos o rama con hojas? Busca las yemas: hay una yema en la axila de cada hoja verdadera y ninguna en la base de los folíolos. Además, todos los folíolos de una hoja están en un mismo plano, y la hoja completa cae como una sola pieza en la abscisión.',
        'A leaf with leaflets, or a twig with leaves? Look for the buds: there is a bud in the axil of every true leaf and none at the base of a leaflet. Besides, all leaflets of one leaf lie in one plane, and the whole leaf falls as a single piece at abscission.')}</p>
      <div class="card" style="max-width:660px; margin:0 auto">${trickSVG()}</div>

      <h2 class="section-title">${T('De entera a compuesta: un continuo', 'From entire to compound: a continuum')}</h2>
      <p class="section-sub">${T(
        'Las incisiones del margen se profundizan poco a poco: lobada (menos de ½), partida (más de ½), secta (hasta la vena media)… y solo cuando cada pieza se articula con el raquis hablamos de folíolos y de hoja compuesta.',
        'Marginal cuts deepen little by little: lobed (less than ½), parted (more than ½), dissected (to the midvein)… and only when each piece is jointed to the rachis do we speak of leaflets and a compound leaf.')}</p>
      ${continuum()}

      <h2 class="section-title">${T('Los tipos de hoja compuesta', 'The types of compound leaf')}</h2>
      <p class="section-sub">${T(
        'Pulsa una tarjeta para ver su lámina del atlas con definición y ejemplos.',
        'Click a card to see its atlas plate with definition and examples.')}</p>
      <div id="b3Types">${compoundTypes()}</div>

      <div class="trick"><b>${T('Vocabulario:', 'Vocabulary:')}</b> ${T(
        'el <b>raquis</b> es la continuación del pecíolo que lleva los folíolos; cada folíolo puede tener su tallito propio (<b>peciólulo</b>); en las bipinnadas el raquis lleva <b>raquillas</b> (pinnas). “Pinnada” viene de <i>pinna</i>, pluma; “digitada”, de dedos.',
        'the <b>rachis</b> is the continuation of the petiole bearing the leaflets; each leaflet may have a stalk of its own (<b>petiolule</b>); in bipinnate leaves the rachis bears <b>secondary axes</b> (pinnae). “Pinnate” comes from <i>pinna</i>, feather; “digitate”, from fingers.')}</div>`;
    els('.cmp-card[data-term]', box).forEach(c => c.addEventListener('click', () => B5.openTerm(c.dataset.term)));
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('b3Main')) return;
    let built = false;
    const build = () => { if (!built) { render(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 3) build(); });
    if (location.hash === '#b3') build();
    document.addEventListener('langchange', () => { if (built) render(); });
  });
})();
