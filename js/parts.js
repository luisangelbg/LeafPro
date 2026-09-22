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
    /* ---- cross-section (anatomy, from the haz down to the envés) ---- */
    cuticula: { es: 'Cutícula', en: 'Cuticle', lat: 'cuticula',
      d: { es: 'Película de cutina y ceras que sella la epidermis contra la pérdida de agua; suele ser más gruesa y brillante en el haz.',
           en: 'A film of cutin and waxes sealing the epidermis against water loss; usually thicker and shinier on the upper face.' } },
    epidermis_haz: { es: 'Epidermis del haz', en: 'Upper (adaxial) epidermis', lbl: { es: 'Epidermis del haz', en: 'Upper epidermis' }, lat: 'epidermis adaxialis',
      d: { es: 'Una capa de células transparentes y sin cloroplastos que deja pasar la luz y protege el mesófilo. En el haz suele carecer de estomas.',
           en: 'A single layer of transparent, chloroplast-free cells letting light through and protecting the mesophyll. On the upper face it usually lacks stomata.' } },
    empalizada: { es: 'Parénquima en empalizada', en: 'Palisade parenchyma', lat: 'parenchyma palisadeum',
      d: { es: 'Células alargadas y apretadas bajo el haz, repletas de cloroplastos: aquí ocurre la mayor parte de la fotosíntesis. Por eso el haz es más verde que el envés.',
           en: 'Elongated, tightly packed cells beneath the upper face, crammed with chloroplasts: most photosynthesis happens here. That is why the haz is greener than the envés.' } },
    esponjoso: { es: 'Parénquima esponjoso', en: 'Spongy parenchyma', lat: 'parenchyma spongiosum',
      d: { es: 'Células irregulares con grandes espacios de aire comunicados con los estomas: el laboratorio de intercambio de gases hacia el envés.',
           en: 'Irregular cells with large interconnected air spaces opening to the stomata: the gas-exchange workshop towards the lower face.' } },
    aire: { es: 'Espacios de aire', en: 'Air spaces', lat: 'aerenchyma',
      d: { es: 'Huecos entre las células esponjosas por donde circulan CO₂, O₂ y vapor de agua; desembocan en las cámaras subestomáticas.',
           en: 'Gaps between spongy cells where CO₂, O₂ and water vapour circulate; they open into the substomatal chambers.' } },
    haz_vascular: { es: 'Haz vascular (vena)', en: 'Vascular bundle (vein)', lbl: { es: 'Haz vascular (vena)', en: 'Vascular bundle' }, lat: 'fasciculus vascularis',
      d: { es: 'Una vena vista en corte: xilema hacia el haz y floema hacia el envés, envueltos por la vaina del haz. Es la fontanería y el esqueleto de la hoja.',
           en: 'A vein in section: xylem towards the upper face and phloem towards the lower, wrapped by the bundle sheath. The plumbing and skeleton of the leaf.' } },
    xilema: { es: 'Xilema', en: 'Xylem', lat: 'xylema',
      d: { es: 'Conductos muertos y lignificados que traen agua y minerales desde la raíz; en la vena quedan del lado del haz.',
           en: 'Dead, lignified conduits bringing water and minerals from the root; in the vein they sit towards the upper side.' } },
    floema: { es: 'Floema', en: 'Phloem', lat: 'phloema',
      d: { es: 'Células vivas que exportan los azúcares fabricados en la hoja hacia el resto de la planta; quedan del lado del envés.',
           en: 'Living cells exporting the sugars made in the leaf to the rest of the plant; they sit towards the lower side.' } },
    estoma: { es: 'Estoma', en: 'Stoma', lat: 'stoma',
      d: { es: 'Poro regulable por el que entra CO₂ y sale vapor de agua. En la mayoría de las dicotiledóneas abunda en el envés (hoja hipostomática), lejos del sol directo.',
           en: 'An adjustable pore through which CO₂ enters and water vapour leaves. In most dicots it abounds on the lower face (hypostomatic leaf), away from direct sun.' } },
    oclusivas: { es: 'Células oclusivas', en: 'Guard cells', lat: 'cellulae claudentes',
      d: { es: 'El par de células con forma de frijol que abre y cierra el estoma al hincharse o deshincharse; son las únicas células epidérmicas con cloroplastos.',
           en: 'The pair of bean-shaped cells opening and closing the stoma as they swell or deflate; the only epidermal cells with chloroplasts.' } },
    camara: { es: 'Cámara subestomática', en: 'Substomatal chamber', lat: 'camera substomatica',
      d: { es: 'El hueco de aire justo detrás del estoma, donde los gases se reparten hacia el mesófilo.',
           en: 'The air pocket right behind the stoma, where gases are distributed to the mesophyll.' } },
    epidermis_enves: { es: 'Epidermis del envés', en: 'Lower (abaxial) epidermis', lbl: { es: 'Epidermis del envés', en: 'Lower epidermis' }, lat: 'epidermis abaxialis',
      d: { es: 'La capa que cubre la cara inferior: con más estomas, cutícula más delgada y, en muchas especies, pelos.',
           en: 'The layer covering the lower face: with more stomata, a thinner cuticle and, in many species, hairs.' } },
    tricoma: { es: 'Tricoma (pelo)', en: 'Trichome (hair)', lbl: { es: 'Tricoma (pelo)', en: 'Trichome' }, lat: 'trichoma',
      d: { es: 'Pelo epidérmico: refleja el exceso de luz, frena el viento junto a los estomas y estorba a los herbívoros pequeños. Su densidad define términos como pubescente o tomentosa.',
           en: 'An epidermal hair: it reflects excess light, slows the wind near the stomata and hinders small herbivores. Its density defines terms such as pubescent or tomentose.' } },
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
  const SECTION_LABELS = [
    ['cuticula', 40, -64, 112, -66, 'start'],
    ['empalizada', 60, -30, 112, -38, 'start'],
    ['aire', 24, 14, 112, -10, 'start'],
    ['camara', 54, 26, 112, 16, 'start'],
    ['estoma', 53, 44, 112, 42, 'start'],
    ['oclusivas', 46, 39, 112, 66, 'start'],
    ['epidermis_haz', -60, -55, -112, -62, 'end'],
    ['haz_vascular', -47, -11, -112, -36, 'end'],
    ['xilema', -44, -3, -112, -10, 'end'],
    ['floema', -41, 12, -112, 12, 'end'],
    ['esponjoso', -84, 18, -112, 36, 'end'],
    ['epidermis_enves', -70, 37, -112, 62, 'end'],
    ['tricoma', -62, 56, -112, 86, 'end'],
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

  /* cross-section of the blade, from cuticle (haz) to trichomes (envés) */
  function sectionScene() {
    const S = [];
    const cell = 'fill="color-mix(in srgb, var(--card-bg) 78%, var(--lfBlade1))" stroke="var(--lfOutline)" stroke-width="0.9"';
    /* mesophyll background */
    S.push(`<rect x="-100" y="-62" width="200" height="106" rx="6" fill="color-mix(in srgb, var(--card-bg) 55%, var(--lfBlade1))" stroke="none"/>`);
    /* cuticles */
    S.push(`<rect x="-100" y="-66" width="200" height="5" rx="2.5" fill="var(--gold)" opacity="0.75"/>`);
    S.push(`<rect x="-100" y="44" width="200" height="3.4" rx="1.7" fill="var(--gold)" opacity="0.5"/>`);
    /* upper epidermis */
    for (let x = -98; x < 96; x += 16.5) S.push(`<rect x="${x}" y="-61" width="15" height="13" rx="5" ${cell}/>`);
    /* palisade */
    for (let x = -96; x < 94; x += 10) {
      S.push(`<rect x="${x}" y="-47" width="8.4" height="32" rx="3.6" fill="var(--lfBlade2)" stroke="var(--lfOutline)" stroke-width="0.9"/>`);
      S.push(`<circle cx="${x + 2.6}" cy="${-41}" r="1.3" fill="var(--lfVein)"/><circle cx="${x + 5.6}" cy="${-30}" r="1.3" fill="var(--lfVein)"/><circle cx="${x + 3}" cy="${-21}" r="1.3" fill="var(--lfVein)"/>`);
    }
    /* spongy mesophyll: irregular cells, leaving the substomatal chamber empty */
    let r = 9;
    for (let y = -8; y < 34; y += 12) {
      for (let x = -94; x < 96; x += 14) {
        r = (r * 16807) % 2147483647; const j1 = (r / 2147483647 - 0.5) * 7;
        r = (r * 16807) % 2147483647; const j2 = (r / 2147483647 - 0.5) * 6;
        const cx = x + j1, cy = y + j2;
        if (cx > 38 && cx < 70 && cy > 12) continue;              /* chamber */
        if (cx > -58 && cx < -22 && cy > -14 && cy < 20) continue; /* bundle */
        S.push(`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${(5.4 + (j1 > 0 ? 1.8 : 0)).toFixed(1)}" ry="${(4.6 + (j2 > 0 ? 1.4 : 0)).toFixed(1)}" fill="var(--lfBlade1)" stroke="var(--lfOutline)" stroke-width="0.8" opacity="0.9"/>`);
      }
    }
    /* vascular bundle */
    S.push(`<ellipse cx="-40" cy="3" rx="19" ry="17" fill="color-mix(in srgb, var(--card-bg) 70%, var(--lfPetiole))" stroke="var(--lfOutline)" stroke-width="1.2"/>`);
    for (const [dx, rr] of [[-7, 3.4], [0, 4.2], [7, 3.4]]) S.push(`<circle cx="${-40 + dx}" cy="-3" r="${rr}" fill="#e0a55c" stroke="#8a5a28" stroke-width="1"/>`);
    for (const dx of [-7.5, -2.5, 2.5, 7.5]) S.push(`<circle cx="${-40 + dx}" cy="11" r="2.2" fill="#8fb3d4" stroke="#3f608a" stroke-width="0.8"/>`);
    /* lower epidermis with the stoma */
    for (let x = -98; x < 96; x += 16.5) {
      if (x > 34 && x < 66) continue;
      S.push(`<rect x="${x}" y="32" width="15" height="12" rx="5" ${cell}/>`);
    }
    /* guard cells and pore */
    S.push(`<ellipse cx="47" cy="38" rx="4.6" ry="6.4" fill="var(--lfBlade2)" stroke="var(--lfOutline)" stroke-width="1"/>`);
    S.push(`<ellipse cx="59" cy="38" rx="4.6" ry="6.4" fill="var(--lfBlade2)" stroke="var(--lfOutline)" stroke-width="1"/>`);
    S.push(`<path d="M51.5,36 L54.5,36 M51.5,40 L54.5,40" stroke="var(--lfOutline)" stroke-width="1.2"/>`);
    /* trichome on the underside */
    S.push(`<path d="M-66,45 C -70,54 -66,62 -58,68 M-46,45 C -48,52 -45,58 -40,62" stroke="var(--lfVein)" stroke-width="1.6" fill="none" stroke-linecap="round"/>`);
    /* haz / envés banners, clear of the labels */
    S.push(`<text x="0" y="-82" text-anchor="middle" font-size="10" font-weight="800" fill="var(--primary)">${T('HAZ (cara adaxial) — mira al sol', 'HAZ — upper (adaxial) face')}</text>`);
    S.push(`<path d="M-96,-70 l 0,-6 M-96,-70 l 192,0 M96,-70 l 0,-6" stroke="var(--text-muted)" stroke-width="1" fill="none" opacity=".5"/>`);
    S.push(`<text x="0" y="90" text-anchor="middle" font-size="10" font-weight="800" fill="var(--cB)">${T('ENVÉS (cara abaxial) — mira al suelo', 'ENVÉS — lower (abaxial) face')}</text>`);
    S.push(`<path d="M-96,78 l 0,6 M-96,78 l 192,0 M96,78 l 0,6" stroke="var(--text-muted)" stroke-width="1" fill="none" opacity=".5"/>`);
    return S.join('');
  }

  /* long label names are wrapped onto several tspan lines so they never
     spill over the figure, the info panel or one another */
  function wrapLabel(name, x, y, anchor, maxChars) {
    const words = String(name).split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w; }
      else cur = cur ? cur + ' ' + w : w;
    }
    if (cur) lines.push(cur);
    const y0 = y - (lines.length - 1) * 5.5;
    return {
      html: `<text x="${x}" y="${y0}" text-anchor="${anchor === 'end' ? 'end' : 'start'}">` +
        lines.map((l, i) => `<tspan x="${x}" dy="${i ? 11 : 0}">${l}</tspan>`).join('') + '</text>',
      lines: lines.length,
    };
  }

  function render(stageEl, infoEl, which) {
    const labels = which === 'grass' ? GRASS_LABELS : which === 'section' ? SECTION_LABELS : DICOT_LABELS;
    const scene = which === 'grass' ? grassScene() : which === 'section' ? sectionScene() : dicotScene();
    const vb = which === 'grass' ? '-125 -120 260 240' : which === 'section' ? '-212 -100 424 200' : '-160 -128 300 260';
    const maxChars = which === 'section' ? 14 : 15;
    const lab = labels.map(([k, x, y, tx, ty, an]) => {
      const src = P[k].lbl || P[k];
      const w = wrapLabel(T(src.es, src.en), tx, ty, an, maxChars);
      return `
      <g class="part-label" data-part="${k}">
        <line x1="${x}" y1="${y}" x2="${tx + (an === 'start' ? -3 : 3)}" y2="${ty - 3}"/>
        <circle cx="${x}" cy="${y}" r="2" fill="currentColor" opacity=".55"/>
        ${w.html}
      </g>`;
    }).join('');
    stageEl.innerHTML = `<svg viewBox="${vb}" role="img" class="leaf parts-svg">${scene}${lab}</svg>`;
    const show = k => {
      els('.part-label', stageEl).forEach(g => g.classList.toggle('on', g.dataset.part === k));
      const p = P[k];
      infoEl.innerHTML = `<h3>${T(p.es, p.en)}</h3><div class="p-lat">${p.lat}</div><p>${T(p.d.es, p.d.en)}</p>`;
    };
    els('.part-label', stageEl).forEach(g => {
      g.addEventListener('mouseenter', () => show(g.dataset.part));
      g.addEventListener('click', () => show(g.dataset.part));
    });
    show(which === 'grass' ? 'vaina' : which === 'section' ? 'empalizada' : 'lamina');
  }

  window.Parts = { render, DEFS: P };
})();
