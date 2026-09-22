/* LeafPro — one entry point that draws any atlas term, whatever its kind:
   engine leaf, compound leaf, phyllotaxy pair, or hand-drawn special.
   Used by the atlas (Block 5), the quiz (7) and the classroom (8). */

(function () {
  window.termArt = function (term, opts) {
    opts = opts || {};
    if (term.special) return Leaf.special(term.special, opts);
    if (term.compound) return Leaf.compound(term.compound, opts);
    if (term.phyllo) return `<div class="art-duo">${B4.sideView(term.phyllo)}${B4.topView(term.phyllo)}</div>`;
    return Leaf.svg(term.model, Object.assign({ highlight: term.hl, skin: term.skin }, opts));
  };
})();
