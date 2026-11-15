// lancé par le test « local » de NeoDex : la vérification interne (grotte, huile, éclat, créatures, lanternes), une partie au clavier avec
// la voyageuse et sa lanterne, les créatures des zones profondes, la musique qui change de zone, le choix d'une lanterne,
// le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('lnCanvas').__ln, ln = T.st(); ${code} })()`);
  const key = (k, type = 'keydown') => pj(`document.dispatchEvent(new KeyboardEvent('${type}', {key: '${k}', bubbles: true})), 0`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('lnCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'lanterne-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const keepGems = await C('return T.lns.gems;');
  await C('T.lns.music = true; T.again(); return 0;'); await sleep(200);
  // un pilote : la voyageuse reste au milieu de la grotte pendant le test (on regarde le décor, pas l'adresse)
  await pj(`window.__auto = setInterval(() => { const T = document.getElementById('lnCanvas').__ln, ln = T.st(); if (ln.mode === 'play') { const [t, b] = T.cave(ln.d + 70); ln.y = (t + b) / 2; ln.vy = 0; } }, 8); 0`);
  await key(' '); await sleep(250); await key(' ', 'keyup'); await sleep(500); await shot('0-voyageuse');
  const s1 = await C('return {mode: ln.mode, d: ln.d, mus: T.mus.on, zone: T.mus.zone, notes: T.mus.notes};');
  if (s1.mode !== 'play' || !(s1.d > 20)) throw new Error('la partie devait partir : ' + JSON.stringify(s1));
  if (!s1.mus || s1.zone !== 0) throw new Error('la musique devait jouer dans la grotte : ' + JSON.stringify(s1));
  // chaque zone profonde : sa créature bien visible devant la voyageuse, et la musique change de zone
  const safe = `ln.light = 92; ln.bats = []; ln.falls = []; ln.drips = []; ln.nbat = ln.nfall = ln.ndrip = 1e9; const [t, b] = lnCave(0); `;
  for (const [zk, kind, n] of [[1, 'spider', '1-araignee'], [2, 'fish', '2-poisson'], [3, 'wisp', '3-feu-follet']]) {
    await C(`ln.d = ${zk} * 5000 + 60; ln.light = 92; ln.bats = []; ln.falls = []; ln.drips = []; ln.foes = []; ln.nbat = ln.nfall = ln.ndrip = 1e9; ln.nfoe = 1; ln.foes = []; return 0;`);
    await sleep(500); const fx = await C(`const f = ln.foes[0]; if (!f) return null; f.x = 150; if (f.kind === 'fish') { f.jumped = true; f.vy = -2; f.y = ln.y - 20; } ln.nfoe = 1e9; return f.kind;`);
    if (fx !== kind) throw new Error('la zone ' + zk + ' devait amener ' + kind + ' : ' + fx);
    await sleep(120); await shot(n); await C('ln.foes = []; return 0;');
    const z = await C('return T.mus.zone;'); if (z !== zk) throw new Error('la musique devait passer à la zone ' + zk + ' : ' + z);
  }
  const notes = await C('return T.mus.notes;'); if (!(notes > s1.notes)) throw new Error('la musique ne joue aucune note');
  // pause : la musique se tait
  await pj('clearInterval(__auto), 0'); await key('p'); await sleep(400); if (await C('return T.mus.on;')) throw new Error('la musique devait se taire en pause');
  await C(`ln.mode = 'over'; ln.dead = 60; ln.why = 'test'; return 0;`); await sleep(200);
  // les lanternes : bloquées sans cristaux, choisies avec
  await C('T.lns.gems = 400; T.info(); return 0;'); await sleep(150);
  const btns = await pj(`[...document.querySelectorAll('#lnLamps button')].map(b => b.disabled)`); if (btns.join() !== 'false,false,false,true') throw new Error('déblocage des lanternes : ' + btns);
  await pj(`document.querySelectorAll('#lnLamps button')[2].click(), 0`); await sleep(100);
  const lamp = await C('return T.lns.lamp;'); if (lamp !== 2) throw new Error('la lanterne-phare devait être choisie : ' + lamp);
  await C('T.again(); return 0;'); await sleep(200); await shot('4-phare');
  await C(`T.lns.gems = ${keepGems}; T.lns.lamp = 0; T.info(); T.again(); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(200);
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(800);
  const fs = await pj(`(() => { const c = document.getElementById('lnCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(400);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('lnCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('lnCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 280) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · partie au clavier · araignée, poisson, feu follet · musique par zone (' + notes + ' notes), muette en pause · lanternes débloquées · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
