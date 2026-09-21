/* LeafPro — the morphological vocabulary of the leaf.
   Every term carries: bilingual name and definition, example species
   (with an emphasis on Mexico and crops), the model that the leaf engine
   draws, and which part of the drawing is highlighted in its plate.
   The categories reuse the character colours of core.js (CHARS). */

(function () {
  const CATS = [
    { key: 'forma', sub: {
      es: 'El contorno general de la lámina, sin contar dientes ni lóbulos. Se describe comparando el ancho con el largo y ubicando la parte más ancha.',
      en: 'The general outline of the blade, ignoring teeth and lobes. It is described by comparing width with length and locating the widest part.' } },
    { key: 'apice', sub: {
      es: 'La punta de la lámina, opuesta a la base. Su forma es independiente de la forma general: una hoja ovada puede tener ápice agudo, obtuso o emarginado.',
      en: 'The tip of the blade, opposite the base. Its shape is independent of the general outline: an ovate leaf may have an acute, obtuse or emarginate apex.' } },
    { key: 'base', sub: {
      es: 'El extremo de la lámina donde llega el pecíolo. Aquí se deciden caracteres tan visibles como los lóbulos basales o la asimetría.',
      en: 'The end of the blade where the petiole arrives. Characters as visible as the basal lobes or the asymmetry are decided here.' } },
    { key: 'margen', sub: {
      es: 'El borde de la lámina: entero, con dientes de distintas formas y tamaños, o recortado en lóbulos cada vez más profundos hasta casi dividir la hoja.',
      en: 'The edge of the blade: entire, with teeth of different shapes and sizes, or cut into lobes ever deeper until the leaf is almost divided.' } },
    { key: 'nervadura', sub: {
      es: 'El esqueleto de venas que recorre la lámina. El patrón de las venas primarias y el destino de las secundarias distinguen grandes grupos de plantas.',
      en: 'The skeleton of veins running through the blade. The pattern of the primary veins and the fate of the secondaries distinguish large plant groups.' } },
    { key: 'compo', sub: {
      es: 'Si la lámina es una sola pieza (hoja simple) o está dividida en folíolos (hoja compuesta), y cómo se disponen esos folíolos sobre el raquis.',
      en: 'Whether the blade is a single piece (simple leaf) or divided into leaflets (compound leaf), and how those leaflets sit on the rachis.' } },
    { key: 'filotaxia', sub: {
      es: 'Cómo se acomodan las hojas sobre el tallo. El patrón es constante en cada especie y es de los primeros caracteres que se revisan al identificar.',
      en: 'How the leaves are arranged on the stem. The pattern is constant within a species and is among the first characters checked during identification.' } },
    { key: 'union', sub: {
      es: 'Cómo se une la hoja al tallo: con pecíolo o sin él, abrazando el tallo, atravesada por él, o acompañada de estípulas, vainas y lígulas.',
      en: 'How the leaf joins the stem: with or without a petiole, clasping the stem, pierced by it, or accompanied by stipules, sheaths and ligules.' } },
    { key: 'superficie', sub: {
      es: 'El aspecto y la consistencia de la lámina: lampiña o con pelos, delgada o correosa, verde o cubierta de cera azulada.',
      en: 'The look and feel of the blade: hairless or hairy, thin or leathery, green or covered with bluish wax.' } },
  ];

  const T = [];
  const t = (id, cat, es, en, defEs, defEn, exEs, exEn, model, hl, extra) =>
    T.push(Object.assign({ id, cat, es, en, def: { es: defEs, en: defEn }, ex: { es: exEs, en: exEn }, model, hl }, extra || {}));

  /* ============ FORMA ============ */
  t('f-acicular', 'forma', 'Acicular', 'Acicular',
    'En forma de aguja: muy larga, delgada y rígida, de sección casi circular.',
    'Needle-shaped: very long, slender and stiff, almost circular in section.',
    'Pinos (<i>Pinus</i> spp.), oyamel (<i>Abies religiosa</i>), romero.',
    'Pines (<i>Pinus</i> spp.), sacred fir (<i>Abies religiosa</i>), rosemary.',
    { shape: 'acicular', margin: 'entero', venation: 'uninervia', petiole: 0.06 }, 'forma');
  t('f-linear', 'forma', 'Linear', 'Linear',
    'Larga y angosta, con los bordes casi paralelos; al menos diez veces más larga que ancha.',
    'Long and narrow, with almost parallel edges; at least ten times longer than wide.',
    'Pastos, maíz (<i>Zea mays</i>), cebolla, zacate.',
    'Grasses, maize (<i>Zea mays</i>), onion.',
    { shape: 'linear', venation: 'paralela', petiole: 0.05 }, 'forma');
  t('f-oblonga', 'forma', 'Oblonga', 'Oblong',
    'Más larga que ancha (2–4 veces), con los lados casi paralelos en la parte media.',
    'Longer than wide (2–4 times), with the sides almost parallel in the middle.',
    'Guanábana (<i>Annona muricata</i>), mamey.',
    'Soursop (<i>Annona muricata</i>), mamey sapote.',
    { shape: 'oblonga', venation: 'broquidodroma' }, 'forma');
  t('f-eliptica', 'forma', 'Elíptica', 'Elliptic',
    'Como una elipse: lo más ancho está al centro y se estrecha por igual hacia ambos extremos.',
    'Like an ellipse: widest at the middle, narrowing equally towards both ends.',
    'Cafeto (<i>Coffea arabica</i>), guayabo (<i>Psidium guajava</i>).',
    'Coffee (<i>Coffea arabica</i>), guava (<i>Psidium guajava</i>).',
    { shape: 'eliptica', venation: 'broquidodroma' }, 'forma');
  t('f-ovada', 'forma', 'Ovada', 'Ovate',
    'Con contorno de huevo: lo más ancho queda abajo, cerca de la base.',
    'Egg-shaped in outline: widest below the middle, near the base.',
    'Albahaca (<i>Ocimum basilicum</i>), cacao (<i>Theobroma cacao</i>).',
    'Basil (<i>Ocimum basilicum</i>), cacao (<i>Theobroma cacao</i>).',
    { shape: 'ovada' }, 'forma');
  t('f-obovada', 'forma', 'Obovada', 'Obovate',
    'Huevo invertido: lo más ancho queda arriba, cerca del ápice.',
    'An inverted egg: widest above the middle, near the apex.',
    'Aguacate criollo (algunas hojas), magnolia, nogalillo.',
    'Some avocado leaves, magnolia.',
    { shape: 'obovada' }, 'forma');
  t('f-lanceolada', 'forma', 'Lanceolada', 'Lanceolate',
    'Como punta de lanza: angosta, mucho más larga que ancha y con lo más ancho abajo.',
    'Like a lance head: narrow, much longer than wide, widest below the middle.',
    'Sauce (<i>Salix</i>), duraznillo, chile de árbol.',
    'Willow (<i>Salix</i>), peach-leaf species.',
    { shape: 'lanceolada', margin: 'serrulado' }, 'forma');
  t('f-oblanceolada', 'forma', 'Oblanceolada', 'Oblanceolate',
    'Lanza invertida: lo más ancho cerca del ápice y una base largamente estrechada.',
    'An inverted lance: widest near the apex, with a long-tapering base.',
    'Chirimoya (algunas hojas), <i>Barkleyanthus salicifolius</i> (jarilla).',
    'Some cherimoya leaves, willow ragwort.',
    { shape: 'oblanceolada' }, 'forma');
  t('f-espatulada', 'forma', 'Espatulada', 'Spatulate',
    'Como espátula o cuchara: redondeada arriba y angostada poco a poco hacia la base.',
    'Like a spatula or spoon: rounded above, gradually narrowed to the base.',
    'Margarita (<i>Bellis perennis</i>), siempreviva, tronadora joven.',
    'Daisy (<i>Bellis perennis</i>), some stonecrops.',
    { shape: 'espatulada' }, 'forma');
  t('f-orbicular', 'forma', 'Orbicular', 'Orbicular',
    'Casi circular: el largo y el ancho son prácticamente iguales.',
    'Almost circular: length and width practically equal.',
    'Mastuerzo (<i>Tropaeolum majus</i>), árbol del amor (<i>Cercis</i>).',
    'Nasturtium (<i>Tropaeolum majus</i>), redbud (<i>Cercis</i>).',
    { shape: 'orbicular', venation: 'palmada' }, 'forma');
  t('f-romboidal', 'forma', 'Romboidal', 'Rhomboid',
    'Con contorno de rombo: cuatro lados casi rectos y lo más ancho al centro.',
    'Diamond-shaped: four almost straight sides, widest at the middle.',
    'Abedul (<i>Betula</i>), quelite cenizo (<i>Chenopodium album</i>).',
    'Birch (<i>Betula</i>), lamb’s quarters (<i>Chenopodium album</i>).',
    { shape: 'romboidal', margin: 'dentado' }, 'forma');
  t('f-deltoide', 'forma', 'Deltoide', 'Deltoid',
    'Triangular como la letra griega delta (Δ), con la base ancha y casi recta.',
    'Triangular like the Greek letter delta (Δ), with a broad, almost straight base.',
    'Álamo (<i>Populus deltoides</i>), teclate.',
    'Eastern cottonwood (<i>Populus deltoides</i>).',
    { shape: 'deltoide', margin: 'crenado' }, 'forma');
  t('f-cordiforme', 'forma', 'Cordada (acorazonada)', 'Cordate',
    'Con forma de corazón: base con dos lóbulos redondeados y ápice en punta.',
    'Heart-shaped: base with two rounded lobes, apex pointed.',
    'Violeta (<i>Viola</i>), hoja santa (<i>Piper auritum</i>), cacalosúchil.',
    'Violet (<i>Viola</i>), Mexican pepperleaf (<i>Piper auritum</i>).',
    { shape: 'cordiforme', venation: 'palmada' }, 'forma');
  t('f-obcordada', 'forma', 'Obcordada', 'Obcordate',
    'Corazón invertido: la escotadura queda en el ápice y la punta en la base.',
    'An inverted heart: the notch is at the apex, the point at the base.',
    'Trébol (<i>Trifolium</i>, folíolos), <i>Oxalis</i> (agritos).',
    'Clover leaflets (<i>Trifolium</i>), wood sorrel (<i>Oxalis</i>).',
    { shape: 'obcordada' }, 'forma');
  t('f-reniforme', 'forma', 'Reniforme', 'Reniform',
    'Con forma de riñón: más ancha que larga, con base escotada y ápice redondeado.',
    'Kidney-shaped: wider than long, with a notched base and rounded apex.',
    'Gordolobo rastrero, <i>Centella asiatica</i>, capulincillo.',
    '<i>Centella asiatica</i>, wild ginger.',
    { shape: 'reniforme', venation: 'palmada' }, 'forma');
  t('f-sagitiforme', 'forma', 'Sagitada', 'Sagittate',
    'Como punta de flecha: lóbulos basales agudos dirigidos hacia abajo.',
    'Like an arrowhead: acute basal lobes pointing downwards.',
    'Flecha de agua (<i>Sagittaria</i>), alcatraz (<i>Zantedeschia</i>).',
    'Arrowhead (<i>Sagittaria</i>), calla lily (<i>Zantedeschia</i>).',
    { shape: 'sagitiforme', venation: 'palmada' }, 'forma');
  t('f-hastiforme', 'forma', 'Hastada', 'Hastate',
    'Como alabarda: lóbulos basales agudos dirigidos hacia afuera.',
    'Like a halberd: acute basal lobes pointing outwards.',
    'Lengua de vaca (<i>Rumex</i>), correhuela.',
    'Some docks (<i>Rumex</i>), bindweed.',
    { shape: 'hastiforme', venation: 'palmada' }, 'forma');
  t('f-falcada', 'forma', 'Falcada', 'Falcate',
    'Curvada como una hoz, con la lámina angosta doblada hacia un lado.',
    'Curved like a sickle, the narrow blade bent to one side.',
    'Eucalipto adulto (<i>Eucalyptus</i>).',
    'Adult eucalypt leaves (<i>Eucalyptus</i>).',
    { shape: 'falcada', venation: 'camptodroma' }, 'forma');
  t('f-flabelada', 'forma', 'Flabelada', 'Flabellate',
    'En forma de abanico, ancha arriba, a menudo con venación dicotómica.',
    'Fan-shaped, broad above, often with dichotomous venation.',
    '<i>Ginkgo biloba</i>, palma de abanico (<i>Washingtonia</i>).',
    '<i>Ginkgo biloba</i>, fan palms (<i>Washingtonia</i>).',
    { shape: 'flabelada', petiole: 0.5 }, 'forma');
  t('f-panduriforme', 'forma', 'Panduriforme', 'Pandurate',
    'Con forma de violín: obovada con una cintura marcada a los lados.',
    'Fiddle-shaped: obovate with a marked waist on the sides.',
    '<i>Ficus lyrata</i> (higuera lira), algunas <i>Ipomoea</i>.',
    'Fiddle-leaf fig (<i>Ficus lyrata</i>), some morning glories.',
    { shape: 'panduriforme', venation: 'camptodroma' }, 'forma');
  t('f-lirada', 'forma', 'Lirada', 'Lyrate',
    'Pinnatilobada con el lóbulo terminal grande y redondeado y los inferiores pequeños.',
    'Pinnately lobed with a large rounded terminal lobe and small lower lobes.',
    'Rábano (<i>Raphanus sativus</i>), mostaza.',
    'Radish (<i>Raphanus sativus</i>), mustard.',
    { shape: 'lirada' }, 'forma');
  t('f-runcinada', 'forma', 'Runcinada', 'Runcinate',
    'Pinnatipartida con lóbulos agudos dirigidos hacia la base, como sierra invertida.',
    'Pinnately cut with sharp lobes pointing towards the base, like an inverted saw.',
    'Diente de león (<i>Taraxacum officinale</i>).',
    'Dandelion (<i>Taraxacum officinale</i>).',
    { shape: 'runcinada', petiole: 0.14 }, 'forma');

  /* ============ ÁPICE ============ */
  const apx = (id, es, en, defEs, defEn, exEs, exEn, model) =>
    t(id, 'apice', es, en, defEs, defEn, exEs, exEn, model, 'apice');
  apx('a-agudo', 'Agudo', 'Acute',
    'Termina en punta con lados rectos que forman un ángulo menor de 90°.',
    'Ends in a point with straight sides forming an angle of less than 90°.',
    'Guayabo, chirimoyo, la mayoría de las hojas.', 'Guava, cherimoya, most leaves.',
    { shape: 'eliptica', apex: 'agudo' });
  apx('a-acuminado', 'Acuminado', 'Acuminate',
    'La punta se prolonga en un acumen: lados cóncavos que forman una punta fina y alargada, útil para escurrir la lluvia.',
    'The tip is drawn out into an acumen: concave sides forming a fine, elongated “drip tip”.',
    'Cacao, hule (<i>Ficus elastica</i>), amate.', 'Cacao, rubber fig (<i>Ficus elastica</i>).',
    { shape: 'ovada', apex: 'acuminado' });
  apx('a-obtuso', 'Obtuso', 'Obtuse',
    'Termina en punta roma, con lados que forman un ángulo mayor de 90°.',
    'Ends bluntly, the sides forming an angle greater than 90°.',
    'Aguacate (<i>Persea americana</i>), pirul.', 'Avocado (<i>Persea americana</i>).',
    { shape: 'obovada', apex: 'obtuso' });
  apx('a-redondeado', 'Redondeado', 'Rounded',
    'El ápice describe un arco continuo, sin punta.',
    'The apex describes a continuous arc, without a point.',
    'Siempreviva, ficus lira, guaje (folíolos).', 'Stonecrops, fiddle-leaf fig.',
    { shape: 'obovada', apex: 'redondeado' });
  apx('a-truncado', 'Truncado', 'Truncate',
    'Como cortado en línea recta, casi perpendicular a la vena media.',
    'As if cut straight across, almost at right angles to the midrib.',
    'Tulipán de Virginia (<i>Liriodendron</i>), <i>Ginkgo</i>.', 'Tulip tree (<i>Liriodendron</i>), <i>Ginkgo</i>.',
    { shape: 'obovada', apex: 'truncado' });
  apx('a-emarginado', 'Emarginado', 'Emarginate',
    'Con una escotadura o muesca notable en la punta.',
    'With a conspicuous notch at the tip.',
    'Pata de vaca (<i>Bauhinia</i>), colorín (folíolos).', 'Orchid tree (<i>Bauhinia</i>).',
    { shape: 'obovada', apex: 'emarginado' });
  apx('a-retuso', 'Retuso', 'Retuse',
    'Con una escotadura muy leve y poco profunda en un ápice por lo demás redondeado.',
    'With a very slight, shallow notch on an otherwise rounded apex.',
    'Huizache (folíolos), algunas leguminosas.', 'Some legume leaflets.',
    { shape: 'obovada', apex: 'retuso' });
  apx('a-mucronado', 'Mucronado', 'Mucronate',
    'Ápice redondeado u obtuso rematado por una puntita corta y abrupta (mucrón), continuación de la vena media.',
    'Rounded or obtuse apex tipped by a short, abrupt point (mucro), a continuation of the midrib.',
    'Frijol (folíolos), alfalfa.', 'Bean leaflets, alfalfa.',
    { shape: 'eliptica', apex: 'mucronado' });
  apx('a-apiculado', 'Apiculado', 'Apiculate',
    'Con una puntita corta, delgada y flexible (apículo).',
    'With a short, slender, flexible point (apiculum).',
    'Zapote blanco (folíolos), algunos ficus.', 'Some figs.',
    { shape: 'eliptica', apex: 'apiculado' });
  apx('a-cuspidado', 'Cuspidado', 'Cuspidate',
    'Ápice que se estrecha de golpe en una punta rígida y bien marcada (cúspide).',
    'Apex abruptly narrowed into a stiff, well-marked point (cusp).',
    'Zapote negro, algunas <i>Coccoloba</i>.', 'Black sapote, some seagrapes.',
    { shape: 'ovada', apex: 'cuspidado' });
  apx('a-aristado', 'Aristado', 'Aristate',
    'Rematado por una cerda larga y delgada (arista).',
    'Tipped by a long, slender bristle (arista).',
    'Encinos rojos (<i>Quercus</i> sect. <i>Lobatae</i>), pastos.', 'Red oaks, grasses.',
    { shape: 'eliptica', apex: 'aristado' });
  apx('a-caudado', 'Caudado', 'Caudate',
    'Con una “cola”: acumen extremadamente largo y angosto.',
    'With a “tail”: an extremely long, narrow acumen.',
    'Higuera sagrada (<i>Ficus religiosa</i>).', 'Sacred fig (<i>Ficus religiosa</i>).',
    { shape: 'cordiforme', apex: 'caudado', venation: 'palmada' });
  apx('a-pungente', 'Pungente (espinoso)', 'Pungent (spiny)',
    'Termina en una espina dura y punzante.',
    'Ends in a hard, pricking spine.',
    'Maguey (<i>Agave</i>), acebo, cardos.', 'Agave, holly, thistles.',
    { shape: 'lanceolada', apex: 'pungente', margin: 'espinoso' });

  /* ============ BASE ============ */
  const bas = (id, es, en, defEs, defEn, exEs, exEn, model) =>
    t(id, 'base', es, en, defEs, defEn, exEs, exEn, model, 'base');
  bas('b-cuneada', 'Cuneada', 'Cuneate',
    'En forma de cuña: lados rectos que convergen hacia el pecíolo en ángulo agudo.',
    'Wedge-shaped: straight sides converging on the petiole at an acute angle.',
    'Guayabo, fresno (folíolos).', 'Guava, ash leaflets.',
    { shape: 'obovada', base: 'cuneada' });
  bas('b-atenuada', 'Atenuada', 'Attenuate',
    'Se estrecha gradualmente en una punta larga, con lados cóncavos que escurren hacia el pecíolo.',
    'Gradually narrowed into a long point, the concave sides tapering into the petiole.',
    'Lechuga, espinaca, tabaco.', 'Lettuce, spinach, tobacco.',
    { shape: 'espatulada', base: 'atenuada' });
  bas('b-decurrente', 'Decurrente', 'Decurrent',
    'La lámina se prolonga hacia abajo en alas sobre el pecíolo o el tallo.',
    'The blade runs down the petiole or stem as wings.',
    'Tabaco (<i>Nicotiana tabacum</i>), cardo santo.', 'Tobacco (<i>Nicotiana tabacum</i>), thistles.',
    { shape: 'eliptica', base: 'decurrente', petiole: 0.34 });
  bas('b-obtusa', 'Obtusa', 'Obtuse',
    'Los lados llegan al pecíolo formando un ángulo mayor de 90°.',
    'The sides reach the petiole at an angle greater than 90°.',
    'Cafeto, mango.', 'Coffee, mango.',
    { shape: 'eliptica', base: 'obtusa' });
  bas('b-redondeada', 'Redondeada', 'Rounded',
    'La base describe un arco continuo hasta el pecíolo.',
    'The base curves in a continuous arc to the petiole.',
    'Manzano, capulín.', 'Apple, capulin cherry.',
    { shape: 'ovada', base: 'redondeada' });
  bas('b-truncada', 'Truncada', 'Truncate',
    'Como cortada en línea recta, perpendicular al pecíolo.',
    'As if cut straight across, at right angles to the petiole.',
    'Álamo (<i>Populus</i>), lila.', 'Poplar (<i>Populus</i>), lilac.',
    { shape: 'deltoide', base: 'truncada' });
  bas('b-oblicua', 'Oblicua (asimétrica)', 'Oblique',
    'Los dos lados de la lámina no llegan al pecíolo a la misma altura: la base es desigual.',
    'The two sides of the blade meet the petiole at different heights: the base is unequal.',
    'Begonia, olmo (<i>Ulmus</i>), tiliáceas.', 'Begonia, elm (<i>Ulmus</i>).',
    { shape: 'ovada', base: 'oblicua', margin: 'biserrado' });
  bas('b-cordada', 'Cordada', 'Cordate',
    'Con dos lóbulos basales redondeados separados por una escotadura donde llega el pecíolo.',
    'With two rounded basal lobes separated by a notch where the petiole arrives.',
    'Violeta, hoja santa, girasol.', 'Violet, pepperleaf, sunflower.',
    { shape: 'cordiforme', base: 'cordada', venation: 'palmada' });
  bas('b-auriculada', 'Auriculada', 'Auriculate',
    'Con dos lóbulos basales pequeños y redondeados, como orejitas.',
    'With two small rounded basal lobes, like little ears.',
    'Jaltomate, algunas <i>Salvia</i>.', 'Some nightshades and sages.',
    { shape: 'eliptica', base: 'auriculada' });
  bas('b-sagitada', 'Sagitada', 'Sagittate',
    'Lóbulos basales agudos dirigidos hacia abajo, como flecha.',
    'Acute basal lobes pointing downwards, arrow-like.',
    'Flecha de agua, quiebraplatos.', 'Arrowhead, morning glories.',
    { shape: 'sagitiforme', base: 'sagitada', venation: 'palmada' });
  bas('b-hastada', 'Hastada', 'Hastate',
    'Lóbulos basales agudos dirigidos hacia afuera, como alabarda.',
    'Acute basal lobes pointing outwards, halberd-like.',
    'Lengua de vaca, correhuela.', 'Docks, bindweed.',
    { shape: 'hastiforme', base: 'hastada', venation: 'palmada' });
  bas('b-amplexicaule', 'Amplexicaule', 'Amplexicaul (clasping)',
    'La base rodea y abraza el tallo; la hoja es sésil.',
    'The base surrounds and clasps the stem; the leaf is sessile.',
    'Lechuguilla silvestre (<i>Lactuca serriola</i>), amapola.',
    'Prickly lettuce (<i>Lactuca serriola</i>), poppies.',
    { shape: 'oblonga', base: 'amplexicaule', petiole: 0 });
  bas('b-peltada', 'Peltada', 'Peltate',
    'El pecíolo no llega al borde: se inserta por debajo, dentro de la lámina.',
    'The petiole does not reach the margin: it is attached underneath, inside the blade.',
    'Mastuerzo (<i>Tropaeolum</i>), higuerilla, malanga.',
    'Nasturtium (<i>Tropaeolum</i>), castor bean, taro.',
    { shape: 'orbicular', base: 'peltada', venation: 'palmada' });
  bas('b-envainadora', 'Envainadora', 'Sheathing',
    'La base se ensancha en una vaina que envuelve el tallo.',
    'The base widens into a sheath wrapping the stem.',
    'Maíz y demás pastos, plátano, alcatraz.',
    'Maize and other grasses, banana.',
    { shape: 'linear', base: 'envainadora', venation: 'paralela', petiole: 0, ligule: true });

  /* ============ MARGEN ============ */
  const mar = (id, es, en, defEs, defEn, exEs, exEn, model) =>
    t(id, 'margen', es, en, defEs, defEn, exEs, exEn, model, 'margen');
  mar('m-entero', 'Entero', 'Entire',
    'Borde liso y continuo, sin dientes ni lóbulos.',
    'Smooth, continuous edge, without teeth or lobes.',
    'Mango, cafeto, hule.', 'Mango, coffee, rubber fig.',
    { shape: 'eliptica', margin: 'entero' });
  mar('m-ondulado', 'Ondulado', 'Undulate',
    'Borde con ondas suaves que suben y bajan respecto al plano de la lámina.',
    'Edge with gentle waves rising and falling out of the blade plane.',
    'Zapote blanco, laurel de la India.', 'White sapote, some figs.',
    { shape: 'oblonga', margin: 'ondulado' });
  mar('m-sinuado', 'Sinuado', 'Sinuate',
    'Con entradas y salidas amplias y poco profundas, en el plano de la lámina.',
    'With broad, shallow ins and outs, in the plane of the blade.',
    'Encino blanco, jaltomate.', 'Some white oaks, nightshades.',
    { shape: 'obovada', margin: 'sinuado' });
  mar('m-crenado', 'Crenado', 'Crenate',
    'Con dientes redondeados, como festón.',
    'With rounded, scalloped teeth.',
    'Hierbabuena, geranio de olor, tepozán.',
    'Mint, scented geraniums.',
    { shape: 'ovada', margin: 'crenado' });
  mar('m-crenulado', 'Crenulado', 'Crenulate',
    'Crenado en miniatura: dientecitos redondeados muy pequeños.',
    'Minutely crenate: very small rounded teeth.',
    'Cuajilote, algunas salvias.', 'Some sages.',
    { shape: 'eliptica', margin: 'crenulado' });
  mar('m-dentado', 'Dentado', 'Dentate',
    'Con dientes triangulares que apuntan hacia afuera, perpendiculares al borde.',
    'With triangular teeth pointing outwards, at right angles to the edge.',
    'Girasol, castaño, malva.', 'Sunflower, chestnut, mallow.',
    { shape: 'ovada', margin: 'dentado' });
  mar('m-denticulado', 'Denticulado', 'Denticulate',
    'Dentado en miniatura: dientecitos muy finos.',
    'Minutely dentate: very fine little teeth.',
    'Tejocote, algunas compuestas.', 'Hawthorn, some daisies.',
    { shape: 'eliptica', margin: 'denticulado' });
  mar('m-aserrado', 'Aserrado', 'Serrate',
    'Con dientes agudos inclinados hacia el ápice, como los de un serrucho.',
    'With sharp teeth leaning towards the apex, like a saw.',
    'Rosa, durazno, capulín.', 'Rose, peach, capulin cherry.',
    { shape: 'lanceolada', margin: 'aserrado' });
  mar('m-serrulado', 'Serrulado', 'Serrulate',
    'Aserrado en miniatura: dientecitos de sierra muy finos.',
    'Minutely serrate: very fine saw teeth.',
    'Sauce, tejocote.', 'Willow, hawthorn.',
    { shape: 'lanceolada', margin: 'serrulado' });
  mar('m-biserrado', 'Biserrado (doble aserrado)', 'Biserrate (doubly serrate)',
    'Dientes de sierra que llevan a su vez dientecitos menores.',
    'Saw teeth that bear smaller teeth of their own.',
    'Olmo (<i>Ulmus</i>), aliso (<i>Alnus</i>), avellano.',
    'Elm (<i>Ulmus</i>), alder (<i>Alnus</i>), hazel.',
    { shape: 'ovada', margin: 'biserrado', base: 'oblicua' });
  mar('m-espinoso', 'Espinoso', 'Spiny',
    'Los dientes terminan en espinas duras y punzantes.',
    'The teeth end in hard, pricking spines.',
    'Acebo (<i>Ilex</i>), cardo, encino espinoso.',
    'Holly (<i>Ilex</i>), thistles.',
    { shape: 'eliptica', margin: 'espinoso', apex: 'pungente' });
  mar('m-ciliado', 'Ciliado', 'Ciliate',
    'Borde entero pero con una hilera de pelos finos, como pestañas.',
    'Edge entire but fringed with fine hairs, like eyelashes.',
    'Siempreviva pilosa, algunas gramíneas.', 'Some stonecrops and grasses.',
    { shape: 'eliptica', margin: 'ciliado' });
  mar('m-revoluto', 'Revoluto', 'Revolute',
    'El borde se enrolla hacia el envés; visto de frente parece engrosado.',
    'The edge rolls towards the underside; seen from above it looks thickened.',
    'Romero, laurel rosa (<i>Nerium</i>), té de monte.',
    'Rosemary, oleander (<i>Nerium</i>).',
    { shape: 'linear', margin: 'revoluto', venation: 'camptodroma' });
  /* lobed margins, pinnate and palmate */
  mar('m-pinnatilobado', 'Pinnatilobado', 'Pinnately lobed',
    'Lóbulos a lo largo de la vena media que penetran menos de la mitad de la semilámina.',
    'Lobes along the midrib cutting less than half-way to the midvein.',
    'Encino blanco (<i>Quercus</i>), roble.', 'White oaks (<i>Quercus</i>).',
    { shape: 'obovada', lobing: { mode: 'pinnati', n: 4, depth: 0.42, sharp: 0.15 }, venation: 'craspedodroma' });
  mar('m-pinnatipartido', 'Pinnatipartido', 'Pinnately parted',
    'Las incisiones pasan de la mitad de la semilámina, pero no llegan a la vena media.',
    'The cuts go beyond half-way, but do not reach the midvein.',
    'Chicalote (<i>Argemone</i>), mirasol.', 'Prickly poppy (<i>Argemone</i>).',
    { shape: 'eliptica', lobing: { mode: 'pinnati', n: 5, depth: 0.68, sharp: 0.4 }, venation: 'craspedodroma' });
  mar('m-pinnatisecto', 'Pinnatisecto', 'Pinnatisect',
    'Las incisiones llegan hasta la vena media: la lámina queda dividida, pero sin folíolos independientes.',
    'The cuts reach the midvein: the blade is divided, yet without independent leaflets.',
    'Manzanilla, mirasol morado (<i>Cosmos</i>), zanahoria.',
    'Chamomile, cosmos, carrot.',
    { shape: 'eliptica', lobing: { mode: 'pinnati', n: 6, depth: 0.93, sharp: 0.6 }, venation: 'craspedodroma' });
  mar('m-palmatilobado', 'Palmatilobado', 'Palmately lobed',
    'Lóbulos que irradian de la base, con incisiones de menos de la mitad.',
    'Lobes radiating from the base, cut less than half-way.',
    'Higuera (<i>Ficus carica</i>), vid, arce.',
    'Fig (<i>Ficus carica</i>), grapevine, maple.',
    { shape: 'orbicular', lobing: { mode: 'palmati', n: 2, depth: 0.42, sharp: 0.3 }, venation: 'palmada' });
  mar('m-palmatipartido', 'Palmatipartido', 'Palmately parted',
    'Los cortes radiales pasan de la mitad de la lámina sin llegar a la base.',
    'The radial cuts go beyond half-way without reaching the base.',
    'Higuerilla (<i>Ricinus communis</i>), geranio de campo.',
    'Castor bean (<i>Ricinus communis</i>), cranesbills.',
    { shape: 'orbicular', lobing: { mode: 'palmati', n: 3, depth: 0.68, sharp: 0.55 }, venation: 'palmada', margin: 'denticulado' });
  mar('m-palmatisecto', 'Palmatisecto', 'Palmatisect',
    'Los cortes radiales llegan casi hasta la base: segmentos independientes en apariencia.',
    'The radial cuts reach almost to the base: apparently independent segments.',
    'Yuca de hoja (<i>Manihot esculenta</i>), chaya.',
    'Cassava (<i>Manihot esculenta</i>), chaya.',
    { shape: 'orbicular', lobing: { mode: 'palmati', n: 3, depth: 0.92, sharp: 0.5 }, venation: 'palmada' });

  /* ============ NERVADURA ============ */
  const ner = (id, es, en, defEs, defEn, exEs, exEn, model) =>
    t(id, 'nervadura', es, en, defEs, defEn, exEs, exEn, model, 'nervadura');
  ner('n-uninervia', 'Uninervia', 'One-veined',
    'Una sola vena recorre la lámina, sin ramificarse de forma visible.',
    'A single vein runs through the blade, with no visible branching.',
    'Pinos, romero, ahuehuete (hojas lineares).',
    'Pines, rosemary, bald cypress.',
    { shape: 'acicular', venation: 'uninervia', petiole: 0.05 });
  ner('n-pinnada', 'Pinnatinervia (penninervia)', 'Pinnate (penni-veined)',
    'Una vena media de la que salen venas secundarias a los lados, como las barbas de una pluma.',
    'One midvein with secondary veins branching off both sides, like the barbs of a feather.',
    'Mango, encino, durazno.', 'Mango, oak, peach.',
    { shape: 'eliptica', venation: 'pinnada' });
  ner('n-craspedodroma', 'Craspedódroma', 'Craspedodromous',
    'Pinnada cuyas venas secundarias llegan hasta el margen, a menudo terminando en un diente.',
    'Pinnate with secondary veins running all the way to the margin, often ending in a tooth.',
    'Olmo, castaño, encino.', 'Elm, chestnut, oak.',
    { shape: 'ovada', venation: 'craspedodroma', margin: 'aserrado' });
  ner('n-camptodroma', 'Camptódroma', 'Camptodromous',
    'Pinnada cuyas secundarias se arquean cerca del margen sin tocarlo.',
    'Pinnate with the secondaries arching near the margin without touching it.',
    'Aguacate, laurel.', 'Avocado, laurel.',
    { shape: 'eliptica', venation: 'camptodroma' });
  ner('n-broquidodroma', 'Broquidódroma', 'Brochidodromous',
    'Camptódroma en la que las secundarias se unen entre sí formando arcos o festones junto al margen.',
    'Camptodromous with the secondaries joining one another in loops near the margin.',
    'Cafeto, zapote, hule.', 'Coffee, sapotes, rubber fig.',
    { shape: 'oblonga', venation: 'broquidodroma' });
  ner('n-palmada', 'Palmatinervia (actinódroma)', 'Palmate (actinodromous)',
    'Varias venas primarias de calibre similar irradian desde la base de la lámina.',
    'Several primary veins of similar calibre radiate from the base of the blade.',
    'Higuerilla, malva, vid, geranio.', 'Castor bean, mallow, grapevine.',
    { shape: 'cordiforme', venation: 'palmada' });
  ner('n-paralela', 'Paralelinervia', 'Parallel-veined',
    'Muchas venas casi paralelas recorren la lámina de la base al ápice; típica de monocotiledóneas.',
    'Many almost parallel veins run from base to apex; typical of monocots.',
    'Maíz, caña, pastos, agave.', 'Maize, sugarcane, grasses, agave.',
    { shape: 'linear', venation: 'paralela', base: 'envainadora', petiole: 0 });
  ner('n-curvinervia', 'Curvinervia (acródroma)', 'Curvi-veined (acrodromous)',
    'Pocas venas arqueadas nacen en la base (o cerca de ella) y convergen en el ápice.',
    'A few arched veins arise at or near the base and converge at the apex.',
    'Llantén (<i>Plantago</i>), zarzaparrilla (<i>Smilax</i>), miconias.',
    'Plantain (<i>Plantago</i>), greenbrier (<i>Smilax</i>), <i>Miconia</i>.',
    { shape: 'eliptica', venation: 'curvinervia' });
  ner('n-dicotomica', 'Dicotómica', 'Dichotomous',
    'Las venas se bifurcan en horquillas repetidas, sin vena media ni retículo; una venación antigua.',
    'The veins fork repeatedly, with no midvein and no network; an ancient venation.',
    '<i>Ginkgo biloba</i>, helechos.', '<i>Ginkgo biloba</i>, ferns.',
    { shape: 'flabelada', petiole: 0.5 });

  /* ============ COMPOSICIÓN ============ */
  const cmp = (id, es, en, defEs, defEn, exEs, exEn, model) =>
    t(id, 'compo', es, en, defEs, defEn, exEs, exEn, model, null, { compound: model.type ? model : null });
  cmp('c-simple', 'Simple', 'Simple',
    'La lámina es una sola pieza, aunque esté profundamente lobada; hay una sola yema axilar en la base de todo el conjunto.',
    'The blade is a single piece, however deeply lobed; there is a single axillary bud at the base of the whole.',
    'Mango, encino, higuera.', 'Mango, oak, fig.',
    { shape: 'eliptica' });
  cmp('c-unifoliolada', 'Unifoliolada', 'Unifoliolate',
    'Compuesta reducida a un solo folíolo: se delata por la articulación entre el folíolo y el pecíolo.',
    'A compound leaf reduced to a single leaflet, betrayed by the joint between leaflet and petiole.',
    'Naranjo y limonero (<i>Citrus</i>, con pecíolo alado).',
    'Orange and lemon trees (<i>Citrus</i>, with a winged petiole).',
    { type: 'unifoliolada', leaflet: { shape: 'eliptica' } });
  cmp('c-trifoliolada', 'Trifoliolada', 'Trifoliolate',
    'Compuesta por tres folíolos.',
    'Compound with three leaflets.',
    'Frijol (<i>Phaseolus</i>), trébol, fresa.',
    'Bean (<i>Phaseolus</i>), clover, strawberry.',
    { type: 'trifoliolada', leaflet: { shape: 'ovada' } });
  cmp('c-palmaticompuesta', 'Palmaticompuesta (digitada)', 'Palmately compound (digitate)',
    'Todos los folíolos nacen de un mismo punto en el extremo del pecíolo, como los dedos de una mano.',
    'All leaflets arise from one point at the tip of the petiole, like the fingers of a hand.',
    'Ceiba (<i>Ceiba pentandra</i>), lupino, castaño de Indias.',
    'Kapok (<i>Ceiba pentandra</i>), lupine, horse chestnut.',
    { type: 'palmaticompuesta', n: 6, leaflet: { shape: 'oblanceolada' } });
  cmp('c-imparipinnada', 'Imparipinnada', 'Odd-pinnate (imparipinnate)',
    'Folíolos a los lados de un raquis, con un folíolo terminal: número impar.',
    'Leaflets along a rachis with one terminal leaflet: an odd number.',
    'Rosa, fresno, nogal.', 'Rose, ash, walnut.',
    { type: 'imparipinnada', n: 4, leaflet: { shape: 'eliptica', margin: 'aserrado' } });
  cmp('c-paripinnada', 'Paripinnada', 'Even-pinnate (paripinnate)',
    'Folíolos en pares a lo largo del raquis, sin folíolo terminal: número par.',
    'Leaflets in pairs along the rachis, with no terminal leaflet: an even number.',
    'Tamarindo (<i>Tamarindus indica</i>), casia.',
    'Tamarind (<i>Tamarindus indica</i>), cassias.',
    { type: 'paripinnada', n: 5, leaflet: { shape: 'oblonga', apex: 'redondeado' } });
  cmp('c-bipinnada', 'Bipinnada', 'Bipinnate',
    'Dos veces pinnada: el raquis lleva raquillas (pinnas) y éstas llevan los folíolos.',
    'Twice pinnate: the rachis bears secondary axes (pinnae) which bear the leaflets.',
    'Guaje (<i>Leucaena</i>), mimosa, jacaranda, guamúchil.',
    'Leadtree (<i>Leucaena</i>), mimosa, jacaranda.',
    { type: 'bipinnada', n: 4, leaflet: { shape: 'oblonga', apex: 'redondeado', petiole: 0.02 } });
  cmp('c-interrumpida', 'Interrumpidamente pinnada', 'Interruptedly pinnate',
    'Pinnada con folíolos grandes y pequeños alternados a lo largo del raquis.',
    'Pinnate with large and small leaflets alternating along the rachis.',
    'Jitomate y papa (<i>Solanum</i>).', 'Tomato and potato (<i>Solanum</i>).',
    { type: 'interrumpida', n: 5, leaflet: { shape: 'ovada', margin: 'sinuado' } });

  /* ============ FILOTAXIA ============ */
  const fil = (id, es, en, defEs, defEn, exEs, exEn, ph) =>
    t(id, 'filotaxia', es, en, defEs, defEn, exEs, exEn, { shape: 'eliptica' }, null, { phyllo: ph });
  fil('p-alterna-esp', 'Alterna espiralada', 'Alternate (spiral)',
    'Una hoja por nudo, y las hojas sucesivas describen una hélice alrededor del tallo; el ángulo entre hojas sucesivas ronda los 137.5°.',
    'One leaf per node, successive leaves tracing a helix around the stem; the angle between successive leaves is about 137.5°.',
    'Encino, manzano, girasol.', 'Oak, apple, sunflower.',
    { mode: 'spiral', angle: 137.5 });
  fil('p-alterna-dis', 'Alterna dística', 'Alternate (distichous)',
    'Una hoja por nudo, en dos filas opuestas sobre el mismo plano (ángulo de 180°).',
    'One leaf per node, in two opposite ranks on the same plane (180° angle).',
    'Maíz y demás pastos, olmo.', 'Maize and other grasses, elm.',
    { mode: 'spiral', angle: 180 });
  fil('p-opuesta', 'Opuesta', 'Opposite',
    'Dos hojas por nudo, enfrentadas una a la otra.',
    'Two leaves per node, facing one another.',
    'Guayabo, fresno (pares de hojas), muicle.',
    'Guava, privet.',
    { mode: 'opposite', decussate: false });
  fil('p-decusada', 'Opuesta decusada', 'Opposite decussate',
    'Opuesta en la que cada par se cruza en ángulo recto con el par anterior; típica de labiadas.',
    'Opposite with each pair set at right angles to the previous one; typical of mints.',
    'Hierbabuena, salvia, chía y demás labiadas.',
    'Mint, sage, chia and other Lamiaceae.',
    { mode: 'opposite', decussate: true });
  fil('p-verticilada', 'Verticilada', 'Whorled',
    'Tres o más hojas por nudo, formando un verticilo.',
    'Three or more leaves per node, forming a whorl.',
    'Laurel rosa (<i>Nerium</i>, 3), rubia (<i>Galium</i>).',
    'Oleander (<i>Nerium</i>, 3), bedstraw (<i>Galium</i>).',
    { mode: 'whorl', n: 4 });
  fil('p-rosulada', 'Rosulada (en roseta)', 'Rosulate (rosette)',
    'Hojas agrupadas en una roseta basal, con entrenudos tan cortos que no se ven.',
    'Leaves grouped in a basal rosette, the internodes too short to be seen.',
    'Maguey, diente de león, lechuga, siempreviva.',
    'Agave, dandelion, lettuce, houseleek.',
    { mode: 'rosette' });
  fil('p-fasciculada', 'Fasciculada', 'Fascicled',
    'Hojas en manojos (fascículos) sobre ramitas muy cortas.',
    'Leaves in bundles (fascicles) on very short shoots.',
    'Pinos (2, 3 o 5 acículas por fascículo), berberis.',
    'Pines (2, 3 or 5 needles per fascicle), barberry.',
    { mode: 'fascicle', n: 3 });

  /* ============ INSERCIÓN ============ */
  const uni = (id, es, en, defEs, defEn, exEs, exEn, model, extra) =>
    t(id, 'union', es, en, defEs, defEn, exEs, exEn, model, null, extra);
  uni('u-peciolada', 'Peciolada', 'Petiolate',
    'Con pecíolo: un tallito propio que une la lámina con el tallo.',
    'With a petiole: a stalk of its own joining blade and stem.',
    'La mayoría de las dicotiledóneas.', 'Most dicots.',
    { shape: 'ovada', petiole: 0.4 });
  uni('u-sesil', 'Sésil', 'Sessile',
    'Sin pecíolo: la lámina se une directamente al tallo.',
    'Without a petiole: the blade joins the stem directly.',
    'Clavelinas, muchas compuestas.', 'Many daisies and pinks.',
    { shape: 'lanceolada', petiole: 0 });
  uni('u-amplexicaule', 'Amplexicaule', 'Clasping',
    'Sésil con la base abrazando el tallo.',
    'Sessile with the base clasping the stem.',
    'Lechuguilla silvestre, amapola.', 'Prickly lettuce, poppies.',
    { shape: 'oblonga', base: 'amplexicaule', petiole: 0 });
  uni('u-perfoliada', 'Perfoliada', 'Perfoliate',
    'La base rodea por completo el tallo, que parece atravesar la hoja.',
    'The base completely surrounds the stem, which seems to pierce the leaf.',
    '<i>Bupleurum</i>, algunas madreselvas jóvenes.',
    '<i>Bupleurum</i>, some honeysuckles.',
    { shape: 'eliptica', base: 'amplexicaule', petiole: 0, perfoliate: true });
  uni('u-peltada', 'Peltada', 'Peltate',
    'El pecíolo se inserta en la cara inferior de la lámina, no en el borde.',
    'The petiole is attached to the lower face of the blade, not to the edge.',
    'Mastuerzo, malanga.', 'Nasturtium, taro.',
    { shape: 'orbicular', base: 'peltada', venation: 'palmada' });
  uni('u-decurrente', 'Decurrente', 'Decurrent',
    'La lámina baja en alas por el pecíolo o el tallo.',
    'The blade runs down the petiole or stem as wings.',
    'Tabaco, cardos.', 'Tobacco, thistles.',
    { shape: 'eliptica', base: 'decurrente', petiole: 0.32 });
  uni('u-envainadora', 'Envainadora', 'Sheathing',
    'La base forma una vaina que envuelve el tallo; en los pastos, la vaina remata en una lígula.',
    'The base forms a sheath wrapping the stem; in grasses the sheath ends in a ligule.',
    'Maíz, plátano, papiro.', 'Maize, banana, papyrus.',
    { shape: 'linear', base: 'envainadora', venation: 'paralela', petiole: 0, ligule: true });
  uni('u-estipulas', 'Con estípulas', 'Stipulate',
    'Con un par de apéndices laminares (estípulas) en la base del pecíolo; pueden ser hojosas, espinosas o caducas.',
    'With a pair of blade-like appendages (stipules) at the base of the petiole; they may be leafy, spiny or deciduous.',
    'Rosa, chícharo, mezquite (espinosas).',
    'Rose, pea, mesquite (spiny).',
    { shape: 'ovada', margin: 'aserrado', stipules: true, petiole: 0.42 });
  uni('u-pulvinulo', 'Con pulvínulo', 'Pulvinate',
    'Con un engrosamiento móvil (pulvínulo) en la base del pecíolo o de los folíolos, que permite movimientos de la hoja.',
    'With a swollen, mobile joint (pulvinus) at the base of the petiole or leaflets, allowing leaf movements.',
    'Frijol, mimosa sensitiva, tamarindo.',
    'Bean, sensitive plant, tamarind.',
    { shape: 'ovada', petiole: 0.42, pulvinus: true });
  uni('u-filodio', 'Filodio', 'Phyllode',
    'Pecíolo aplanado y ensanchado que funciona como lámina; la lámina verdadera falta o cae pronto.',
    'A flattened, widened petiole working as a blade; the true blade is missing or soon shed.',
    'Acacias australianas.', 'Australian wattles.',
    { shape: 'falcada', venation: 'curvinervia', petiole: 0.08 });

  /* ============ SUPERFICIE ============ */
  const sup = (id, es, en, defEs, defEn, exEs, exEn, model, skin) =>
    t(id, 'superficie', es, en, defEs, defEn, exEs, exEn, model, null, { skin });
  sup('s-glabra', 'Glabra', 'Glabrous',
    'Superficie lisa, sin pelos.',
    'Smooth surface, hairless.',
    'Cafeto, hule, camelia.', 'Coffee, rubber fig, camellia.',
    { shape: 'eliptica', venation: 'broquidodroma' }, 'glabra');
  sup('s-glauca', 'Glauca', 'Glaucous',
    'Cubierta por una cera azulada o grisácea que se desprende al frotarla.',
    'Covered by a bluish or greyish wax that rubs off.',
    'Agave, col, eucalipto joven.', 'Agave, cabbage, juvenile eucalypt.',
    { shape: 'obovada' }, 'glauca');
  sup('s-pubescente', 'Pubescente', 'Pubescent',
    'Con pelos finos, cortos y suaves.',
    'With fine, short, soft hairs.',
    'Jitomate, frijol.', 'Tomato, bean.',
    { shape: 'ovada' }, 'pubescente');
  sup('s-tomentosa', 'Tomentosa', 'Tomentose',
    'Densamente cubierta de pelos lanosos entrelazados, como fieltro.',
    'Densely covered with matted woolly hairs, like felt.',
    'Gordolobo (<i>Verbascum</i>), salvia blanca.', 'Mullein (<i>Verbascum</i>), white sage.',
    { shape: 'obovada' }, 'tomentosa');
  sup('s-hirsuta', 'Hirsuta', 'Hirsute',
    'Con pelos largos, tiesos y ásperos.',
    'With long, stiff, rough hairs.',
    'Borraja, calabaza.', 'Borage, squash.',
    { shape: 'ovada', margin: 'dentado' }, 'hirsuta');
  sup('s-escabrosa', 'Escabrosa', 'Scabrous',
    'Áspera al tacto, como lija, por pelitos rígidos y diminutos.',
    'Rough to the touch, like sandpaper, from minute stiff hairs.',
    'Maíz, girasol, amate de lija.', 'Maize, sunflower, sandpaper fig.',
    { shape: 'linear', venation: 'paralela', base: 'envainadora', petiole: 0 }, 'escabrosa');
  sup('s-coriacea', 'Coriácea', 'Coriaceous',
    'Gruesa, dura y correosa, como cuero.',
    'Thick, tough and leathery.',
    'Encino, hule, laurel de la India.', 'Oak, rubber fig.',
    { shape: 'oblonga', venation: 'broquidodroma' }, 'coriacea');
  sup('s-suculenta', 'Suculenta (carnosa)', 'Succulent (fleshy)',
    'Gruesa y jugosa, con tejido que almacena agua.',
    'Thick and juicy, with water-storing tissue.',
    'Maguey, siempreviva, verdolaga, sábila.', 'Agave, houseleek, purslane, aloe.',
    { shape: 'espatulada', apex: 'mucronado' }, 'suculenta');
  sup('s-membranacea', 'Membranácea', 'Membranous',
    'Delgada, flexible y algo translúcida.',
    'Thin, flexible and somewhat translucent.',
    'Begonia, hoja santa.', 'Begonia, pepperleaf.',
    { shape: 'cordiforme', venation: 'palmada' }, 'membranacea');
  sup('s-discolora', 'Discolora', 'Discolorous',
    'Haz y envés de colores claramente distintos.',
    'Upper and lower faces of clearly different colours.',
    'Encino blanco, clavo, magnolia.', 'White oak, magnolia.',
    { shape: 'eliptica' }, 'discolora');

  window.MORPH = {
    cats: CATS,
    terms: T,
    byId: id => T.find(x => x.id === id),
    byCat: cat => T.filter(x => x.cat === cat),
  };
})();
