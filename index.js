// Lanterne : Une petite voyageuse traverse une grotte sans fin avec sa lanterne. La lumière baisse : ramasse les fioles d'huile, évite la roche et les chauves-souris.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Lanterne</span><span class="hint">Maintiens espace, clic ou ↑ pour monter · X ou clic droit : éclat de lumière · P : pause</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="lnCanvas" width="288" height="216"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="lnStats"></div></div>
      <div class="row"><button class="btn main" id="lnNew">NOUVELLE PARTIE</button></div>
      <div class="hint">La flamme baisse toute seule. Les fioles d'huile la ravivent ; elles scintillent un peu dans le noir. Un feu de camp tous les 1000 m remplit la lanterne.</div>
      <div class="hint">Éclat de lumière (X) : coûte de l'huile mais fait fuir les chauves-souris proches. Ramasse les cristaux. Tous les 500 m, une nouvelle zone : stalactites qui tombent, gouttes qui affaiblissent la flamme…</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:620px;aspect-ratio:288/216}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: 'LANTERNE', T: { k: '#0a0604', k2: '#160e08', fill: '#22160c', fillOn: '#2e1e10', hl: '#3a2614', line: '#5a3a1a', acc: '#ffa030', accL: '#ffe0a0', accS: '#c86a10', accD: '#4a2406',
  rivet: '#fff4c0', btn: '#3a2614', btnHi: '#6a4a24', btnLo: '#160e08', btnHov: '#4a3018', btnHovHi: '#8a5e2e', text: '#fff4e0', muted: '#c8a880', acc2: '#ffd84a', gold: '#ffd84a',
  orange: '#ffa030', red: '#ff5a4a', green: '#7ee07a', green2: '#2f8a3a', bg: '#0c0804', bgDot: '#22160c', bgDot2: '#160e08', spark: '#5a3a1a', spark2: '#ffd84a',
  tile: ['................', '...:............', '................', '..........+.....', '................', '................', '.....:..........', '................',
    '................', '.............:..', '................', '..+.............', '................', '.........:......', '................', '................'] },
  emblem: ['....kkk.....', '...kyyyk....', '..kyowoyk...', '..kyowoyk...', '..kyyoyyk...', '...kkkkk....', '....kbk.....', '...kbbbk....', '..kbbbbbk...', '..kbbbbbk...', '.kbbbbbbbk..', '.kkkkkkkkk..'],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');

/* ---------- Lanterne : grotte générée colonne par colonne (toujours la même pour une distance donnée), obscurité = un masque troué ---------- */
const LN = {W: 288, H: 216, PX: 70, LMAX: 92, LMIN: 10};
const lns = gstore('lanterne', {games: 0, oil: 0, meters: 0}); lns.gems ??= 0;
// les zones, tous les 500 m : couleurs de la roche et dangers en plus
const LN_ZONES = [{name: 'La grotte', rock: ['#4a3428', '#6a4a34', '#8a6444', '#3a2620'], bg: '#2a1c2e', bg2: '#33223a', fleck: '#5ec8ff'},
  {name: 'La mine de cristal', rock: ['#3a3050', '#54487a', '#7a6aa8', '#2a2440'], bg: '#1e1a30', bg2: '#28224a', fleck: '#ff5ad9'},
  {name: 'Le lac souterrain', rock: ['#24384a', '#34506a', '#4a7090', '#1a2838'], bg: '#14202c', bg2: '#1c2c3c', fleck: '#7fe0ee'},
  {name: 'Le cœur de lave', rock: ['#4a2018', '#6a3020', '#a04a24', '#3a140e'], bg: '#2a1210', bg2: '#3a1814', fleck: '#ffa030'}];
const lnZone = d => LN_ZONES[Math.floor(d / 5000) % LN_ZONES.length];
let ln = null;
const lnCanvas = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; fn(c.getContext('2d')); return c; };
const hash = n => { n = Math.imul(n ^ n >>> 15, 0x2c1b3c6d); n = Math.imul(n ^ n >>> 12, 0x297a2d39); return ((n ^ n >>> 15) >>> 0) / 4294967296; };
const noise = x => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return hash(i) * (1 - s) + hash(i + 1) * s; };
function lnCave(xw) {  // haut et bas de la grotte à la distance xw ; elle se resserre avec la distance
  const gap = Math.max(74, 120 - xw / 160), c = LN.H / 2 + (noise(xw / 140) - .5) * 90 + (noise(xw / 37 + 50) - .5) * 24;
  const top = Math.max(6, c - gap / 2 + (noise(xw / 9 + 99) - .5) * 10), bot = Math.min(LN.H - 6, c + gap / 2 + (noise(xw / 11 + 7) - .5) * 10);
  const spike = Math.max(0, Math.min(bot - top - 46, hash(Math.floor(xw / 6) * 7 + 3) < .06 ? 10 + hash(Math.floor(xw / 6)) * 14 : 0));  // une pointe laisse toujours 46 px  // stalactites et stalagmites, 6 px de large
  return [top + (Math.floor(xw / 6) % 2 ? spike * (1 - Math.abs(xw % 6 - 3) / 3) : 0), bot - (Math.floor(xw / 6) % 2 ? 0 : spike * (1 - Math.abs(xw % 6 - 3) / 3))];
}
const LN_GIRL = [['...kkkk....', '..kccccck..', '.kcsssscck.', '.kcsksksck.', '.kcssssck..', '..kkcckkk..', '.kccccccck.', 'kcccccccck.', 'kccccccccck', '.kcccccccck', '..kpk..kpk.', '..kkk..kkk.'],
  ['...kkkk....', '..kccccck..', '.kcsssscck.', '.kcsksksck.', '.kcssssck..', '..kkcckkk..', '.kccccccck.', '.kccccccccK', 'kccccccccck', 'kcccccccck.', '..kpk.kpk..', '..kkk.kkk..']];
const LN_PAL = {k: '#120a04', c: '#6a3a9a', K: '#120a04', s: '#ffd0a8', p: '#3a2614'};
const LN_SPR = {girl: LN_GIRL.map(r => lnCanvas(11, 12, g => sprite(g, r, 0, 0, LN_PAL))),
  oil: lnCanvas(7, 9, g => sprite(g, ['..kkk..', '..kwk..', '.kkkkk.', 'kgyyygk', 'kgyyygk', 'kgoooyk', 'kgoooyk', '.kkkkk.', '.......'], 0, 0, {k: '#120a04', w: '#c8a880', y: '#ffd84a', o: '#ffa030', g: '#fff4c0'})),
  gem: lnCanvas(5, 7, g => sprite(g, ['..k..', '.kck.', 'kcwck', 'kccck', 'kcbck', '.kbk.', '..k..'], 0, 0, {k: '#0a1a2a', c: '#5ec8ff', w: '#e8fbff', b: '#2a88c8'})),
  fall: lnCanvas(7, 12, g => sprite(g, ['kkkkkkk', 'kaaaaak', 'kaaaabk', '.kaaak.', '.kaabk.', '.kaak..', '..kak..', '..kak..', '..kk...', '...k...', '.......', '.......'], 0, 0, {k: '#120a04', a: '#8a7a6a', b: '#c8b8a0'})),
  fire: lnCanvas(12, 12, g => sprite(g, ['.....r......', '....ryr.....', '...ryyr..r..', '...ryyyr.ry.', '..ryywyrryr.', '..ryywwyyyr.', '.rryywwyyrr.', '..rryyyyrr..', '.kbbkbbkbbk.', 'kbbkbbkbbkbk', '.kkkkkkkkkk.', '............'], 0, 0, {r: '#ff5a2a', y: '#ffd84a', w: '#fff4c0', k: '#120a04', b: '#6a4a34'})),
  bat: [['k.......k', 'kk.kkk.kk', 'kkkkrkkkk', '.kkkkkkk.', '...k.k...'], ['...kkk...', '..kkrkk..', '.kkkkkkk.', 'kk.....kk', 'k.......k']].map(r => lnCanvas(9, 5, g => sprite(g, r, 0, 0, {k: '#1a1020', r: '#ff4a5a'})))};
const lnMasks = new Map();
function lnMask(r) {  // le noir, troué autour de la lanterne : bord tramé sur 8 pixels (deux paliers), mis en cache par rayon
  r = Math.round(r / 2) * 2; if (lnMasks.has(r)) return lnMasks.get(r);
  const W = LN.W * 2, H = LN.H * 2, S = 2 * r + 20, c = lnCanvas(W, H, g => {  // seul le carré autour du trou est calculé pixel par pixel
    g.fillStyle = 'rgb(5,3,10)'; g.fillRect(0, 0, W, H);
    const id = g.createImageData(S, S), d = id.data, o = S / 2, x0 = W / 2 - o, y0 = H / 2 - o;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const k = Math.hypot(x - o, y - o), i = (y * S + x) * 4, par = (x + x0 + y + y0) % 2; let a = 255;
      if (k <= r) a = 0; else if (k <= r + 4) a = par ? 170 : 60; else if (k <= r + 8) a = par ? 255 : 170;
      d[i] = 5; d[i + 1] = 3; d[i + 2] = 10; d[i + 3] = a;
    }
    g.putImageData(id, x0, y0);
  });
  lnMasks.set(r, c); return c;
}
function lnNew() { ln = Object.assign(ln || {tick: 0, raf: 0}, {seen: ln ? ln.tick : 0, mode: 'ready', y: LN.H / 2, vy: 0, d: 0, light: 70, items: [], bats: [], next: 120, nbat: 400, up: false, record: false, dead: 0, got: 0,
  gems: [], gem: 0, ngem: 200, falls: [], nfall: 300, drips: [], ndrip: 200, fires: [], nextFire: 10000, flash: 0, zone: 0, banner: 0, fireMsg: 0}); }
function lnFlare() {  // l'éclat : 18 d'huile, la lumière s'agrandit d'un coup et les chauves-souris proches s'enfuient
  if (!ln || ln.mode !== 'play' || ln.light < LN.LMIN + 24) return lnBeep(140, .1, 'square');
  ln.light -= 18; ln.flash = 16; lnBeep(260, .35, 'square', 1040);
  ln.bats = ln.bats.filter(b => Math.hypot(b.x - LN.PX, b.y - ln.y) > 95);
}
let lnac = null;
function lnBeep(f, d, type = 'triangle', slide = 0) { try { lnac ??= new AudioContext(); const o = lnac.createOscillator(), g = lnac.createGain(), t = lnac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(lnac.destination); o.start(t); o.stop(t + d + .02); } catch {} }
function lnPress(down) {
  ln.up = down; if (!down) return;
  if (ln.mode === 'ready') { ln.mode = 'play'; lns.games++; saveGames(); }
  else if (ln.mode === 'pause') ln.mode = 'play';
  else if (ln.mode === 'over' && ln.dead > 40) { lnNew(); }
}
function lnDie(why) { ln.mode = 'over'; ln.dead = 0; ln.why = why; lnBeep(220, .7, 'sawtooth', 50); ln.record = best('lanterne', Math.floor(ln.d / 10)); lns.oil += ln.got; lns.gems += ln.gem; lns.meters += Math.floor(ln.d / 10); saveGames(); lnInfo(); }
function lnUpdate() {
  if (ln.mode === 'over') { ln.dead++; if (ln.light > 0) ln.light = Math.max(0, ln.light - 1.5); return; }
  if (ln.mode !== 'play') { ln.d += .4; return; }
  const sp = 1.3 + Math.min(1.3, ln.d / 9000); ln.d += sp;
  const want = ln.up ? -1 : 1, acc = ln.vy * want < 0 ? .45 : .15;  // à contre-sens on freine fort : relâcher ne fait plus filer la lanterne
  ln.vy = Math.max(-2.1, Math.min(2.1, ln.vy + want * acc)); ln.y += ln.vy;
  ln.light -= .038 + Math.min(.035, ln.d / 70000);
  if (ln.light <= LN.LMIN) return lnDie('La flamme s\'est éteinte');
  // fioles d'huile au milieu de la grotte, chauves-souris qui ondulent
  if (--ln.next <= 0) { const xw = ln.d + LN.W + 10, [t, b] = lnCave(xw); ln.items.push({x: LN.W + 10, y: t + 14 + Math.random() * (b - t - 28)}); ln.next = 170 + Math.random() * 120; }
  if (ln.d > 1500 && --ln.nbat <= 0) { const [t, b] = lnCave(ln.d + LN.W + 10); ln.bats.push({x: LN.W + 10, y0: (t + b) / 2, a: Math.random() * 6, amp: Math.min(30, (b - t) / 2 - 12)}); ln.nbat = Math.max(120, 420 - ln.d / 60) * (.7 + Math.random() * .6); }
  for (const it of ln.items) { it.x -= sp; if (Math.abs(it.x - LN.PX) < 8 && Math.abs(it.y - ln.y) < 10) { it.got = true; ln.got++; ln.light = Math.min(LN.LMAX, ln.light + 26); lnBeep(660, .2, 'triangle', 1320); } }
  for (const bt of ln.bats) { bt.x -= sp + .5; bt.a += .06; bt.y = bt.y0 + Math.sin(bt.a) * bt.amp; if (Math.abs(bt.x - LN.PX) < 8 && Math.abs(bt.y - ln.y) < 7) return lnDie('Une chauve-souris !'); }
  // la zone (tous les 500 m), les cristaux, les stalactites qui tombent, les gouttes, le feu de camp tous les 1000 m
  const z = Math.floor(ln.d / 5000); if (z !== ln.zone) { ln.zone = z; ln.banner = 150; lnBeep(330, .4, 'triangle', 660); }
  if (ln.banner) ln.banner--; if (ln.flash) ln.flash--; if (ln.fireMsg) ln.fireMsg--;
  const zk = z % LN_ZONES.length;
  if (--ln.ngem <= 0) { const [t, b] = lnCave(ln.d + LN.W + 10), y0 = t + 18 + Math.random() * Math.max(1, b - t - 36), n = 3 + Math.floor(Math.random() * 3); for (let i = 0; i < n; i++) ln.gems.push({x: LN.W + 10 + i * 12, y: y0 - Math.sin(i / (n - 1) * Math.PI) * 10}); ln.ngem = 220 + Math.random() * 200; }
  if (zk >= 1 && --ln.nfall <= 0) { const [t] = lnCave(ln.d + LN.W + 10); ln.falls.push({x: LN.W + 10, y: t - 2, vy: 0, drop: false}); ln.nfall = (zk === 1 ? 160 : 300) + Math.random() * 200; }
  if (zk >= 2 && --ln.ndrip <= 0) { const xs = LN.W - 20 + Math.random() * 30; ln.drips.push({x: xs, y: lnCave(ln.d + xs)[0], vy: 0}); ln.ndrip = (zk === 2 ? 50 : 110) + Math.random() * 70; }
  if (ln.d + LN.W >= ln.nextFire) { ln.fires.push({x: LN.W + (ln.nextFire - ln.d - LN.W)}); ln.nextFire += 10000; }
  for (const g of ln.gems) { g.x -= sp; if (Math.abs(g.x - LN.PX) < 7 && Math.abs(g.y - ln.y) < 9) { g.got = true; ln.gem++; lnBeep(1100 + ln.gem % 5 * 120, .07, 'square'); } }
  for (const f of ln.falls) {
    f.x -= sp; if (!f.drop && f.x - LN.PX < 64) { f.drop = true; lnBeep(160, .25, 'square', 80); }
    if (f.drop) { f.vy = Math.min(5, f.vy + .22); f.y += f.vy; }
    if (Math.abs(f.x - LN.PX) < 6 && f.y + 10 > ln.y - 5 && f.y < ln.y + 5) return lnDie('Une stalactite est tombée');
    if (f.y > lnCave(ln.d + f.x)[1]) f.gone = true;
  }
  for (const d of ln.drips) {
    d.x -= sp; d.vy = Math.min(4, d.vy + .18); d.y += d.vy;
    if (Math.abs(d.x - LN.PX) < 5 && Math.abs(d.y - ln.y) < 7) { d.gone = true; ln.light = Math.max(LN.LMIN + 1, ln.light - (zk === 3 ? 6 : 10)); lnBeep(900, .15, 'sawtooth', 300); }
    if (d.y > lnCave(ln.d + d.x)[1]) d.gone = true;
  }
  for (const f of ln.fires) { f.x -= sp; if (!f.used && f.x <= LN.PX) { f.used = true; ln.light = LN.LMAX; ln.fireMsg = 120; lnBeep(523, .15); lnBeep(784, .35); } }
  ln.gems = ln.gems.filter(g => !g.got && g.x > -10); ln.falls = ln.falls.filter(f => !f.gone && f.x > -10); ln.drips = ln.drips.filter(d => !d.gone && d.x > -10); ln.fires = ln.fires.filter(f => f.x > -20);
  ln.items = ln.items.filter(i => !i.got && i.x > -10); ln.bats = ln.bats.filter(b => b.x > -10);
  for (let dx = -4; dx <= 4; dx += 4) { const [t, b] = lnCave(ln.d + LN.PX + dx); if (ln.y - 4 < t || ln.y + 4 > b) return lnDie('Contre la roche'); }
}
function lnDraw() {
  const g = ln.g, {W, H} = LN;
  for (; ln.seen < ln.tick; ln.seen++) if (ln.mode !== 'play') lnUpdate();
  g.imageSmoothingEnabled = false;
  const Z = lnZone(ln.d), R = Z.rock;
  px(g, Z.bg, 0, 0, W, H);
  for (let x = 0; x < W; x += 3) { const xw = Math.floor((x + ln.d * .4) / 3); if (hash(xw * 13) < .3) px(g, Z.bg2, x, 20 + hash(xw) * 170, 3, 6 + hash(xw * 7) * 20); }  // le fond de la grotte, plus lent
  for (let x = 0; x < W; x += 2) {
    const xw = x + Math.floor(ln.d), Zx = lnZone(xw), Rx = Zx.rock, [t, b] = lnCave(xw), sh = hash(Math.floor(xw / 4) * 31);
    px(g, Rx[0], x, 0, 2, t); px(g, Rx[1], x, t - 3, 2, 3); px(g, Rx[2], x, t - 1, 2, 1);
    px(g, Rx[0], x, b, 2, H - b); px(g, Rx[1], x, b, 2, 3); px(g, Rx[2], x, b, 2, 1);
    if (sh < .25) { px(g, Rx[3], x, t - 10 - sh * 30, 2, 2); px(g, Rx[3], x, b + 8 + sh * 40, 2, 2); }
    if (sh > .97) px(g, Zx.fleck, x, b + 5, 2, 2);  // petits cristaux dans la roche
  }
  for (const f of ln.fires) { const [, b] = lnCave(ln.d + f.x); g.drawImage(LN_SPR.fire, Math.round(f.x - 6), Math.round(b - 11)); }
  for (const gm of ln.gems) g.drawImage(LN_SPR.gem, Math.round(gm.x - 2), Math.round(gm.y - 3));
  for (const f of ln.falls) g.drawImage(LN_SPR.fall, Math.round(f.x - 3), Math.round(f.y));
  for (const d of ln.drips) { px(g, '#7fe0ee', d.x, d.y, 1, 2); px(g, '#e8fbff', d.x, d.y, 1, 1); }
  for (const it of ln.items) g.drawImage(LN_SPR.oil, Math.round(it.x - 3), Math.round(it.y - 4 + Math.sin(ln.tick / 10 + it.x) * 1.5));
  for (const bt of ln.bats) g.drawImage(LN_SPR.bat[Math.floor(ln.tick / 6) % 2], Math.round(bt.x - 4), Math.round(bt.y - 2));
  const f = Math.floor(ln.tick / 10) % 2; g.drawImage(LN_SPR.girl[f], LN.PX - 6, Math.round(ln.y - 6));
  // la lanterne au bout du bras, flamme qui tremble
  const lx = LN.PX + 6, ly = Math.round(ln.y) - 1; px(g, '#120a04', lx, ly - 1, 5, 7); px(g, '#ffd84a', lx + 1, ly, 3, 5); px(g, ln.tick % 8 < 4 ? '#ff8a2a' : '#fff4c0', lx + 2, ly + 1, 1, 3);
  // l'obscurité : un masque troué centré sur la lanterne, rayon = la flamme (qui tremble un peu)
  const r = Math.min(150, ln.light + Math.sin(ln.tick / 5) * 1.5 + ln.flash * 5); g.drawImage(lnMask(r), Math.round(lx + 2 - W), Math.round(ly + 2 - H));
  if (ln.flash > 10) { g.fillStyle = 'rgba(255,244,192,.25)'; g.fillRect(0, 0, W, H); }
  for (const gm of ln.gems) if (Math.floor(ln.tick / 9 + gm.x) % 4 === 0) px(g, '#e8fbff', gm.x, gm.y, 1, 1);  // les cristaux brillent dans le noir
  for (const f of ln.fires) { const [, b] = lnCave(ln.d + f.x); if (!f.used) { px(g, '#ffa030', f.x - 1, b - 9, 2, 2); px(g, '#ffd84a', f.x, b - 8 - ln.tick % 3, 1, 1); } }
  for (const it of ln.items) if (Math.floor(ln.tick / 12 + it.x) % 3 === 0) px(g, '#ffd84a', it.x, it.y - 2, 1, 1);  // les fioles scintillent dans le noir
  for (const bt of ln.bats) px(g, '#ff4a5a', bt.x, bt.y - 1, 1, 1);
  // jauge d'huile et distance
  px(g, '#120a04', 6, 6, 62, 8); px(g, '#3a2614', 7, 7, 60, 6); const k = Math.max(0, (ln.light - LN.LMIN) / (LN.LMAX - LN.LMIN)); px(g, k < .25 && ln.tick % 20 < 10 ? '#ff5a4a' : '#ffa030', 7, 7, Math.round(60 * k), 6); px(g, '#ffd84a', 7, 7, Math.round(60 * k), 2);
  pxFont(g, Math.floor(ln.d / 10) + ' m', W - 6, 14, '#fff4e0', 12, 'right');
  g.drawImage(LN_SPR.gem, 74, 7); pxFont(g, String(ln.gem), 82, 14, '#5ec8ff', 8);
  if (ln.banner && ln.mode === 'play') pxFont(g, Z.name.toUpperCase(), W / 2, 34, Z.fleck, 12, 'center');
  else if (ln.fireMsg && ln.mode === 'play') pxFont(g, 'Feu de camp : lanterne pleine', W / 2, 34, '#ffd84a', 8, 'center');
  if (ln.mode === 'ready') gameText(g, W, [['LANTERNE', '#ffa030', 16], ['Maintiens pour monter', '#ffffff'], ['Ramasse l\'huile', '#c8a880'], ['Record ' + (games.best.lanterne || 0) + ' m', '#ffd84a']], 84);
  if (ln.mode === 'pause') gameText(g, W, [['PAUSE', '#ffffff', 12], ['Espace pour reprendre', '#c8a880']], 100);
  if (ln.mode === 'over' && ln.dead > 25) gameText(g, W, [[ln.why, '#ff5a4a', 12], [Math.floor(ln.d / 10) + ' m · ' + ln.got + ' fioles · ' + ln.gem + ' cristaux', '#ffffff'], [ln.record ? 'NOUVEAU RECORD !' : 'Record ' + (games.best.lanterne || 0) + ' m', '#ffd84a'], [ln.dead > 40 ? 'Espace pour repartir' : '', '#c8a880']], 84);
}
function lnInfo() {
  $('lnStats').replaceChildren(...[['Plus loin', (games.best.lanterne || 0) + ' m'], ['Parties', lns.games], ['Fioles ramassées', lns.oil], ['Cristaux', lns.gems], ['Distance totale', lns.meters + ' m']].flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));
}
const lnKey = k => k === ' ' || k === 'ArrowUp' || k === 'Enter' || k === 'w' || k === 'z';
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !ln || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  if (lnKey(e.key)) { e.preventDefault(); if (!e.repeat) lnPress(true); }
  if (e.key.toLowerCase() === 'p' && ln.mode === 'play') ln.mode = 'pause';
  if ((e.key.toLowerCase() === 'x' || e.key === 'Shift') && !e.repeat) { e.preventDefault(); lnFlare(); }
});
$('lnCanvas').oncontextmenu = e => { e.preventDefault(); lnFlare(); };
document.addEventListener('keyup', e => { if (ln && lnKey(e.key)) lnPress(false); });
$('lnCanvas').onpointerdown = e => { e.preventDefault(); if (ln && e.button !== 2) lnPress(true); };
document.addEventListener('pointerup', () => { if (ln) ln.up = false; });
$('lnNew').onclick = () => { lnNew(); $('lnNew').blur(); };
{  // vérification : la grotte est la même à chaque passage, laisse toujours au moins 40 px, l'huile s'épuise et tue
  const keep = ln, realBest = games.best.lanterne, realStats = {...lns}; ln = null;
  let minGap = 999; for (let x = 0; x < 60000; x += 3) { const [t, b] = lnCave(x); minGap = Math.min(minGap, b - t); }
  const same = lnCave(1234)[0] === lnCave(1234)[0];
  lnNew(); ln.mode = 'play'; ln.light = LN.LMIN + .01; ln.next = ln.nbat = 1e9; lnUpdate(); const dark = ln.mode === 'over';
  lnNew(); ln.mode = 'play'; ln.next = ln.nbat = ln.ngem = 1e9; ln.light = 60; ln.bats = [{x: LN.PX + 30, y0: ln.y, a: 0, amp: 0, y: ln.y}]; lnFlare(); const scared = !ln.bats.length && ln.light === 42;
  lnNew(); ln.mode = 'play'; ln.next = ln.nbat = ln.ngem = 1e9; ln.vy = -2.1; ln.up = false; const y0 = ln.y; let ymin = y0; for (let i = 0; i < 30 && ln.vy < 0; i++) { lnUpdate(); ymin = Math.min(ymin, ln.y); } const drift = y0 - ymin;
  console.assert(minGap >= 40 && same && dark && scared && drift < 10, 'lanterne', {minGap, same, dark, scared, drift});
  if (realBest === undefined) delete games.best.lanterne; else games.best.lanterne = realBest; Object.assign(lns, realStats);
  ln = keep;
}
ctx.onOpen(() => {
  if (!ln || !ln.g) { lnNew(); ln.g = $('lnCanvas').getContext('2d'); }
  gameLoop(ln, 'lanterne', lnUpdate, lnDraw); lnInfo();
});
}
