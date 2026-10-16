/* Knowseum avatar — the round-2 doodle character, ported from the Figma kit so hair, colours,
   outfits and accessories can change live. Returns SVG strings / data URIs (works from file://). */
(() => {
'use strict';
const INK = '#1c1b19', SKIN = '#f7d9cb';
const HAIR_BACK = {
  long: 'M22 54 C16 24 80 18 80 50 C82 72 86 96 90 110 C78 114 68 106 64 98 L38 98 C34 108 24 114 12 110 C18 94 22 74 22 54 Z',
  bob: 'M21 54 C16 24 80 18 80 50 C82 64 84 76 86 86 C76 89 70 85 68 80 L36 80 C32 86 24 89 15 86 C19 76 21 66 21 54 Z',
  ponytail: 'M74 38 C94 32 102 56 95 74 C91 86 82 92 77 86 C86 70 84 52 72 46 Z',
  hijab: 'M14 112 C12 84 14 58 19 44 C26 18 76 14 83 44 C88 60 90 84 92 112 Z',
};
const HAIR_FRONT = {
  short: 'M25 56 C21 30 45 18 66 24 C80 29 82 44 78 54 C74 46 66 40 56 40 C46 40 38 44 32 50 C30 52 27 55 25 56 Z',
  side: 'M24 58 C20 30 50 16 70 26 C82 33 80 48 77 54 C70 42 58 38 46 42 L38 52 L35 45 C30 49 27 54 24 58 Z',
  wavy: 'M24 58 C18 34 34 18 54 20 C72 21 84 34 78 54 C74 48 70 46 66 47 C62 42 56 42 52 45 C48 41 42 42 38 47 C34 46 30 50 27 56 Z',
  buzz: 'M27 52 C26 32 50 24 68 30 C76 34 78 42 76 48 C68 40 46 38 30 50 Z',
  cap: 'M25 56 C21 30 45 18 66 24 C80 29 82 44 78 54 C74 46 66 40 56 40 C46 40 38 44 32 50 C30 52 27 55 25 56 Z',
  long: 'M24 58 C20 30 74 22 78 50 C70 42 56 38 44 42 C36 44 30 50 24 58 Z',
  bob: 'M24 58 C20 30 74 22 78 50 C70 42 56 38 44 42 C36 44 30 50 24 58 Z',
  ponytail: 'M24 58 C20 30 74 20 78 50 C68 38 50 36 36 44 C30 48 26 54 24 58 Z',
  buns: 'M25 56 C21 30 45 20 66 24 C80 29 82 44 78 54 C70 42 54 38 40 44 C32 48 28 52 25 56 Z',
  hijab: 'M25 60 C22 34 74 28 77 54 C66 44 38 44 25 60 Z',
};
const CURLS_TOP = [[30, 46, 11], [36, 33, 12], [49, 26, 13], [63, 27, 12], [73, 37, 11], [77, 50, 7.5], [26, 56, 7], [42, 38, 10], [58, 36, 9]];
const CURLS_SIDE = [[24, 64, 10], [22, 80, 10], [25, 95, 9], [79, 64, 10], [81, 80, 10], [78, 95, 9]];

const shade = (hex, f) => {
  const h = hex.replace('#', ''); let [r, g, b] = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
  [r, g, b] = [r, g, b].map(c => f >= 1 ? Math.round(c + (255 - c) * (f - 1)) : Math.round(c * f));
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
};

// accessory catalogue: slot decides where it draws and what it replaces
const ACC = {
  headphones: { slot: 'ears' }, cat: { slot: 'head' }, bucket: { slot: 'head' }, fedora: { slot: 'head' }, gradcap: { slot: 'head' }, teamcap: { slot: 'head' },
  shades: { slot: 'face' }, glasses: { slot: 'face' }, pixel: { slot: 'face' },
  presspass: { slot: 'neck' }, vip: { slot: 'neck' },
  camera: { slot: 'hand' }, bubbletea: { slot: 'hand' }, mic: { slot: 'hand' }, goldmic: { slot: 'hand' }, notebook: { slot: 'hand' }, bottle: { slot: 'hand' }, gloves: { slot: 'hand' },
  cape: { slot: 'back' }, backpack: { slot: 'back' }, cyberhoodie: { slot: 'body' },
};

function draw(look, opt = {}) {
  const sw = opt.sw || 3.4, bust = opt.bust !== false, legs = !!opt.legs;
  const hairCol = look.hairCol || INK;
  let outfit = look.outfitCol || '#d8bd5a', style = look.outfit || (look.girl ? 'vneck' : 'hoodie');
  const acc = new Set(look.acc || []);
  if (acc.has('cyberhoodie')) { outfit = '#5e3f5c'; style = 'hoodie'; }
  const hair = look.hair || 'buns';
  const hij = look.hairCol && hair === 'hijab' ? look.hairCol : '#9fb2d6';
  const st = `stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
  let o = '';
  const P = (d, f) => { o += `<path d="${d}" fill="${f}" ${st}/>`; };
  const C = (cx, cy, r, f) => { o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${st}/>`; };
  const D = (kind, x, y, s) => { const b = (window.KN_DOODLE || {})[kind]; if (b) o += `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100" overflow="visible">${b}</svg>`; };

  if (legs) o += `<path d="M30 150 L32 196 L46 196 L48 150 Z M54 150 L56 196 L70 196 L72 150 Z" fill="#3a3834" ${st}/>`;
  if (bust && acc.has('cape')) P('M24 104 C6 130 4 160 2 170 L100 170 C98 160 96 130 78 104 Z', '#b5403a');
  if (bust && acc.has('backpack')) P('M10 112 h20 v40 h-20 Z', '#b5403a');
  if (HAIR_BACK[hair]) P(HAIR_BACK[hair], hair === 'hijab' ? hij : hairCol);
  if (hair === 'curlylong') CURLS_SIDE.forEach(c => C(...c, hairCol));
  if (bust) {
    P('M12 156 C13 124 26 105 42 100 L60 100 C77 105 88 124 90 156 Z', outfit);
    const line = d => P(d, 'none');
    if (style === 'vneck' || style === 'dress') { line('M41 101 L51 113 L61 101'); if (style === 'dress') line('M22 134 Q51 142 80 134'); }
    else if (style === 'hoodie') { line('M34 104 C38 117 64 117 68 104'); line('M28 128 L26 156 M74 128 L76 156'); if (acc.has('cyberhoodie')) o += `<path d="M36 128 H66 M40 138 H62" stroke="#d8ff3d" stroke-width="2.4" stroke-linecap="round"/>`; }
    else if (style === 'tee') line('M40 100 C44 108 58 108 62 100');
    else if (style === 'jersey') { line('M40 100 C44 109 58 109 62 100'); line('M28 128 L26 156 M74 128 L76 156'); o += `<text x="51" y="146" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="800" fill="#ffffff" stroke="${INK}" stroke-width="1.6" text-anchor="middle">7</text>`; }
    else if (style === 'kurung') { line('M44 99 L44 106 L58 106 L58 99'); line('M51 106 L51 122'); [[34, 132], [66, 128], [44, 146], [74, 148], [24, 150]].forEach(([x, y]) => { o += `<circle cx="${x}" cy="${y}" r="2.6" fill="#fff" stroke="${INK}" stroke-width="1.4"/>`; }); }
    else if (style === 'melayu') { P('M43 98 L43 107 L59 107 L59 98', shade(outfit, 1.2)); [112, 122, 132].forEach(y => { o += `<circle cx="51" cy="${y}" r="2.2" fill="#e7cf6a" stroke="${INK}" stroke-width="1.2"/>`; }); P('M14 146 L88 146 L90 156 L12 156 Z', '#d8bd5a'); }
    else if (style === 'uniform') { P('M42 100 L51 114 L60 100 L58 110 L51 116 L44 110 Z', '#ffffff'); [126, 140].forEach(y => { o += `<circle cx="51" cy="${y}" r="2" fill="${INK}"/>`; }); }
    else if (style === 'jacket') { line('M42 100 L47 122 L51 106 M60 100 L55 122 L51 106'); line('M51 106 V156'); P('M36 118 h10 v6 h-10 Z', shade(outfit, 1.25)); }
    if (acc.has('backpack')) line('M32 104 L28 156 M70 104 L74 156');
  }
  if (hair !== 'hijab') { P('M43 80 L43 101 M59 80 L59 101', 'none'); o += `<rect x="44.7" y="78" width="12.6" height="22" fill="${SKIN}"/>`; }
  if (hair === 'hijab' && bust) P(HAIR_BACK.hijab.replace(/112/g, '104'), hij);
  P('M27 56 C27 33 73 31 75 52 C77 70 68 85 51 87 C39 88 28 79 27 62 Z', SKIN);
  if (hair !== 'hijab') P('M73 56 C81 55 82 66 73 67', SKIN);
  o += `<circle cx="45" cy="60" r="2.6" fill="${INK}"/><circle cx="57" cy="60" r="2.6" fill="${INK}"/>`;
  o += `<path d="M47 72 Q51 75 55 72" fill="none" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>`;
  if (hair === 'buns') { C(31, 23, 10, hairCol); C(69, 21, 10, hairCol); }
  if (hair === 'curly' || hair === 'curlylong') CURLS_TOP.forEach(c => C(...c, hairCol));
  else if (HAIR_FRONT[hair]) P(HAIR_FRONT[hair], hair === 'hijab' ? hij : hair === 'buzz' ? (look.hairCol ? shade(hairCol, 1.15) : '#3d3a35') : hairCol);
  if (hair === 'cap' && !acc.has('teamcap') && !acc.has('gradcap')) { P('M23 49 C22 22 76 18 78 46 Z', outfit); P('M62 45 L95 47 C95 52 76 54 62 51 Z', outfit); }
  // face accessories
  if (acc.has('glasses')) o += `<g fill="none" ${st}><circle cx="44" cy="60" r="7"/><circle cx="60" cy="60" r="7"/><path d="M51 59 L53 59 M67 58 L74 56"/></g>`;
  if (acc.has('shades')) o += `<g ${st}><path d="M34 54 H50 Q50 66 42 66 Q34 66 34 54 Z M54 54 H70 Q70 66 62 66 Q54 66 54 54 Z" fill="${INK}"/><path d="M50 56 H54 M70 55 L76 53" fill="none"/></g><path d="M37 57 L41 57" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  if (acc.has('pixel')) o += `<g fill="${INK}"><rect x="33" y="54" width="18" height="9"/><rect x="53" y="54" width="18" height="9"/><rect x="51" y="55" width="2" height="3"/><rect x="36" y="56" width="4" height="3" fill="#d8ff3d"/><rect x="56" y="56" width="4" height="3" fill="#d8ff3d"/></g>`;
  // head
  if (acc.has('cat')) {
    P('M30 22 C30 8 74 4 78 18 C80 26 70 30 52 30 C38 30 30 28 30 22 Z', '#77736c'); P('M42 29 C44 21 56 21 58 29 Z', '#ffffff');
    o += `<path d="M76 18 C88 14 90 0 85 -8" fill="none" stroke="#77736c" stroke-width="${sw * 0.9}" stroke-linecap="round"/>`;
    C(36, 14, 11, '#77736c'); P('M27 9 L27 -2 L34 5 Z', '#77736c'); P('M38 5 L44 -3 L46 8 Z', '#77736c');
    o += `<circle cx="33" cy="13" r="1.6" fill="${INK}"/><circle cx="40" cy="13" r="1.6" fill="${INK}"/>`;
  }
  if (acc.has('bucket')) { P('M26 42 C26 18 76 16 76 42 Z', '#7fb3a8'); P('M12 46 Q51 34 90 46 Q51 58 12 46 Z', shade('#7fb3a8', 0.9)); }
  if (acc.has('fedora')) { P('M28 38 C28 10 74 10 74 38 Z', '#6b5543'); o += `<rect x="28" y="30" width="46" height="6" fill="#b5403a" stroke="${INK}" stroke-width="1.6"/>`; P('M8 42 Q51 30 94 42 Q51 52 8 42 Z', '#5a4636'); }
  if (acc.has('gradcap')) { P('M28 30 L28 42 C40 50 62 50 74 42 L74 30', '#2b2a27'); P('M51 8 L98 24 L51 40 L4 24 Z', INK); P('M51 24 L84 30 L84 50', 'none'); C(84, 53, 4.5, '#e7cf6a'); }
  if (acc.has('teamcap')) { P('M23 49 C22 22 76 18 78 46 Z', '#b5403a'); P('M62 45 L95 47 C95 52 76 54 62 51 Z', '#b5403a'); o += `<path d="M38 40 L60 36" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`; }
  if (acc.has('headphones')) { o += `<path d="M24 52 C20 12 82 12 78 52" fill="none" stroke="${INK}" stroke-width="${sw * 1.8}" stroke-linecap="round"/>`; P('M17 48 h10 v18 h-10 Z', outfit); P('M75 48 h10 v18 h-10 Z', outfit); }
  if (bust && (acc.has('presspass') || acc.has('vip'))) {
    const vip = acc.has('vip');
    P('M40 100 L50 128 L62 100', 'none'); P('M42 128 h18 v22 h-18 Z', vip ? '#e7cf6a' : '#ffffff');
    o += `<rect x="42" y="128" width="18" height="6" fill="${vip ? INK : '#b5403a'}" stroke="${INK}" stroke-width="1.6"/>`;
    if (vip) o += `<text x="51" y="146" font-family="Inter, Arial" font-size="6" font-weight="800" text-anchor="middle" fill="${INK}">VIP</text>`;
  }
  // held items
  const held = ['camera', 'bubbletea', 'mic', 'goldmic', 'notebook', 'bottle'].find(k => acc.has(k));
  if (bust && held) D(held, 62, 108, 42);
  if (bust && acc.has('gloves')) o += `<g ${st}><path d="M70 150 L70 132 Q70 128 73 128 L73 120 Q73 117 76 117 Q79 117 79 120 L79 126 L79 117 Q79 114 82 114 Q85 114 85 117 L85 128 L88 126 Q91 124 92 128 L86 150 Z" fill="#b5403a"/></g>`;
  return o;
}

function svg(look, opt = {}) {
  const vb = opt.bust === false ? '10 -14 82 104' : opt.legs ? '-4 -16 110 216' : '-4 -16 110 176';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${draw(look, opt)}</svg>`;
}
const uri = (look, opt) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(look, opt));
window.KNAvatar = { draw, svg, uri, ACC };
})();
