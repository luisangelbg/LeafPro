/* LeafPro — Block 2: parts of the leaf.
   Three tabs: the complete dicot leaf, the grass leaf, and the ways a leaf
   attaches to the stem (plates from the atlas category "union"). */

(function () {
  function renderDicot() {
    const box = el('b2Dicot');
    box.innerHTML = `
      <div class="parts-wrap card">
        <div class="parts-stage" id="b2DStage"></div>
        <div class="part-info" id="b2DInfo"></div>
      </div>
      <h2 class="section-title">${T('Qué hace cada parte', 'What each part does')}</h2>
      <div class="table-wrap card"><table class="tbl">
        <thead><tr><th>${T('Parte', 'Part')}</th><th>${T('Función', 'Function')}</th><th>${T('Si falta…', 'If missing…')}</th></tr></thead>
        <tbody>
          <tr><td><b>${T('Lámina', 'Blade')}</b></td><td>${T('Fotosíntesis, transpiración e intercambio de gases.', 'Photosynthesis, transpiration and gas exchange.')}</td><td>${T('En algunas acacias la sustituye un pecíolo aplanado (filodio).', 'In some wattles a flattened petiole (phyllode) replaces it.')}</td></tr>
          <tr><td><b>${T('Pecíolo', 'Petiole')}</b></td><td>${T('Sostiene y orienta la lámina; conduce agua y fotosintatos.', 'Holds and orients the blade; conducts water and photosynthates.')}</td><td>${T('La hoja es sésil: la lámina se une directamente al tallo.', 'The leaf is sessile: the blade joins the stem directly.')}</td></tr>
          <tr><td><b>${T('Estípulas', 'Stipules')}</b></td><td>${T('Protegen la yema joven; a veces fotosintetizan (chícharo) o defienden (espinas del mezquite).', 'Protect the young bud; sometimes photosynthesise (pea) or defend (mesquite spines).')}</td><td>${T('Muchas familias no las tienen (hoja exestipulada); en otras caen dejando cicatriz.', 'Many families lack them (exstipulate leaf); in others they fall leaving a scar.')}</td></tr>
          <tr><td><b>${T('Vaina', 'Sheath')}</b></td><td>${T('Base ensanchada que abraza el tallo; da soporte en pastos y aráceas.', 'Widened base clasping the stem; supports grasses and aroids.')}</td><td>${T('Típica de monocotiledóneas; en dicotiledóneas es poco común (apiáceas).', 'Typical of monocots; uncommon in dicots (carrot family).')}</td></tr>
          <tr><td><b>${T('Yema axilar', 'Axillary bud')}</b></td><td>${T('No es parte de la hoja, pero la delata: toda hoja verdadera lleva una yema en su axila.', 'Not part of the leaf, but it betrays it: every true leaf bears a bud in its axil.')}</td><td>${T('Si un “folíolo” tuviera yema, sería en realidad una hoja.', 'If a “leaflet” had a bud, it would really be a leaf.')}</td></tr>
        </tbody>
      </table></div>`;
    Parts.render(el('b2DStage'), el('b2DInfo'), 'dicot');
  }

  function renderGrass() {
    const box = el('b2Grass');
    box.innerHTML = `
      <div class="parts-wrap card">
        <div class="parts-stage" id="b2GStage"></div>
        <div class="part-info" id="b2GInfo"></div>
      </div>
      <div class="trick"><b>${T('Para el campo:', 'For the field:')}</b> ${T(
        'lígula y aurículas identifican cereales antes de la espiga: la cebada tiene aurículas grandes que abrazan la caña, el trigo las tiene pequeñas y pilosas, y la avena no tiene aurículas pero sí una lígula grande y dentada.',
        'ligule and auricles identify cereals before heading: barley has large clasping auricles, wheat small hairy ones, and oat has no auricles but a large toothed ligule.')}</div>`;
    Parts.render(el('b2GStage'), el('b2GInfo'), 'grass');
  }

  function renderUnion() {
    const box = el('b2Union');
    const terms = MORPH.byCat('union');
    box.innerHTML = `<div class="plate-grid">` + terms.map(term => `
      <div class="plate" data-term="${term.id}" style="--ch:var(--cU)">
        ${termArt(term)}
        <h4>${T(term.es, term.en)}</h4>
        <div class="p-en">${T(term.en, term.es)}</div>
      </div>`).join('') + '</div>';
    els('.plate', box).forEach(p => p.addEventListener('click', () => B5.openTerm(p.dataset.term)));
  }

  /* ---- haz and envés: the two faces compared ---- */
  function renderFaces() {
    const box = el('b2Faces');
    const md = { shape: 'ovada', margin: 'entero', venation: 'broquidodroma', base: 'redondeada', apex: 'acuminado', petiole: 0.3 };
    const haz = Leaf.svg(md, { class: 'face-haz', skin: 'lustrosa' });
    const enves = Leaf.svg(md, { class: 'face-enves', skin: 'pubescente' });
    const row = (es, en, h, e) => `<tr><td><b>${T(es, en)}</b></td><td>${h}</td><td>${e}</td></tr>`;
    box.innerHTML = `
      <div class="faces-grid">
        <div class="face-card card">
          <h3 style="color:var(--primary-text)">${T('Haz (cara adaxial)', 'Haz — upper (adaxial) face')}</h3>
          ${haz}
          <p class="hint">${T('La cara que mira al sol y hacia el tallo cuando la hoja está en la yema.', 'The face looking at the sun, and towards the stem when the leaf sat in the bud.')}</p>
        </div>
        <div class="face-card card">
          <h3 style="color:var(--cB-text)">${T('Envés (cara abaxial)', 'Envés — lower (abaxial) face')}</h3>
          ${enves}
          <p class="hint">${T('La cara que mira al suelo; en ella resaltan las venas y suelen concentrarse estomas y pelos.', 'The face looking at the ground; veins stand out on it, and stomata and hairs usually concentrate there.')}</p>
        </div>
      </div>
      <h2 class="section-title">${T('En qué se diferencian', 'How they differ')}</h2>
      <div class="table-wrap card"><table class="tbl">
        <thead><tr><th></th><th style="color:var(--primary-text)">${T('Haz', 'Upper face')}</th><th style="color:var(--cB-text)">${T('Envés', 'Lower face')}</th></tr></thead>
        <tbody>
          ${row('Color', 'Colour', T('verde más oscuro: la empalizada, llena de cloroplastos, queda justo debajo.', 'darker green: the chloroplast-packed palisade lies right beneath.'), T('verde pálido o blanquecino: domina el tejido esponjoso, lleno de aire.', 'pale or whitish green: the air-filled spongy tissue dominates.'))}
          ${row('Brillo', 'Shine', T('cutícula más gruesa, a menudo lustrosa.', 'thicker cuticle, often lustrous.'), T('cutícula delgada, aspecto mate.', 'thin cuticle, matt look.'))}
          ${row('Venas', 'Veins', T('poco salientes, a veces hundidas (hojas rugosas).', 'barely raised, sometimes sunken (rugose leaves).'), T('prominentes y fáciles de seguir: por aquí se estudia la nervadura.', 'prominent and easy to trace: venation is studied from this side.'))}
          ${row('Estomas', 'Stomata', T('pocos o ninguno en la mayoría de las dicotiledóneas.', 'few or none in most dicots.'), T('abundantes (hoja hipostomática): pierden menos agua lejos del sol directo.', 'abundant (hypostomatic leaf): they lose less water away from direct sun.'))}
          ${row('Pelos', 'Hairs', T('generalmente escasos.', 'usually sparse.'), T('a menudo densos (tomento) para frenar el viento junto a los estomas.', 'often dense (tomentum), slowing the wind next to the stomata.'))}
        </tbody>
      </table></div>
      <div class="trick"><b>${T('Excepciones que enseñan:', 'Teaching exceptions:')}</b> ${T(
        'las hojas flotantes (nenúfar) tienen los estomas en el haz, único lado en contacto con el aire; los eucaliptos y magueyes de hoja vertical tienen las dos caras casi iguales (hoja isobilateral, anfistomática); y en el álamo blanco el envés plateado destella con el viento.',
        'floating leaves (water lilies) carry their stomata on the upper face, the only side touching air; eucalypts and agaves with vertical leaves have both faces almost alike (isobilateral, amphistomatic leaves); and the silvery underside of white poplar flashes in the wind.')}</div>`;
  }

  /* ---- inside the leaf: interactive cross-section ---- */
  function renderAnat() {
    const box = el('b2Anat');
    box.innerHTML = `
      <p class="section-sub">${T(
        'Un corte transversal de la lámina, del haz al envés. Pasa el cursor (o toca) cada etiqueta: el orden de los tejidos explica por qué las dos caras se ven y funcionan distinto.',
        'A cross-section of the blade, from the upper to the lower face. Hover over (or tap) each label: the order of the tissues explains why the two faces look and work differently.')}</p>
      <div class="parts-wrap card parts-wide">
        <div class="parts-stage" id="b2AStage"></div>
        <div class="part-info" id="b2AInfo"></div>
      </div>
      <div class="trick"><b>${T('La ruta de un carbono:', 'The route of one carbon atom:')}</b> ${T(
        'el CO₂ entra por un estoma del envés, cruza la cámara subestomática y los espacios de aire del esponjoso, se disuelve en la pared húmeda de una célula de la empalizada y ahí la fotosíntesis lo fija; el azúcar resultante sale por el floema de la vena más cercana.',
        'CO₂ enters through a stoma on the underside, crosses the substomatal chamber and the air spaces of the spongy tissue, dissolves on the moist wall of a palisade cell and is fixed there by photosynthesis; the resulting sugar leaves through the phloem of the nearest vein.')}</div>`;
    Parts.render(el('b2AStage'), el('b2AInfo'), 'section');
  }

  function renderAll() { renderDicot(); renderGrass(); renderFaces(); renderAnat(); renderUnion(); }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('b2Dicot')) return;
    let built = false;
    const build = () => { if (!built) { renderAll(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 2) build(); });
    if (location.hash === '#b2') build();
    const PANES = { dicot: 'b2Dicot', grass: 'b2Grass', faces: 'b2Faces', anat: 'b2Anat', union: 'b2Union' };
    els('#b2Tabs button').forEach(b => b.addEventListener('click', () => {
      els('#b2Tabs button').forEach(x => x.classList.toggle('on', x === b));
      for (const k in PANES) el(PANES[k]).style.display = b.dataset.tab === k ? '' : 'none';
    }));
    document.addEventListener('langchange', () => { if (built) renderAll(); });
  });
})();
