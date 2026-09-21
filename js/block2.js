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
        ${B5.plateSVG(term)}
        <h4>${T(term.es, term.en)}</h4>
        <div class="p-en">${T(term.en, term.es)}</div>
      </div>`).join('') + '</div>';
    els('.plate', box).forEach(p => p.addEventListener('click', () => B5.openTerm(p.dataset.term)));
  }

  function renderAll() { renderDicot(); renderGrass(); renderUnion(); }

  document.addEventListener('DOMContentLoaded', () => {
    if (!el('b2Dicot')) return;
    let built = false;
    const build = () => { if (!built) { renderAll(); built = true; } };
    document.addEventListener('stepchange', e => { if (e.detail.step === 2) build(); });
    if (location.hash === '#b2') build();
    els('#b2Tabs button').forEach(b => b.addEventListener('click', () => {
      els('#b2Tabs button').forEach(x => x.classList.toggle('on', x === b));
      el('b2Dicot').style.display = b.dataset.tab === 'dicot' ? '' : 'none';
      el('b2Grass').style.display = b.dataset.tab === 'grass' ? '' : 'none';
      el('b2Union').style.display = b.dataset.tab === 'union' ? '' : 'none';
    }));
    document.addEventListener('langchange', () => { if (built) renderAll(); });
  });
})();
