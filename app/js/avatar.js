/* Knowseum avatar: one of three 3D cats, wearing one outfit, with up to 2 accessories.
   The cat + outfit is a pre-rendered sprite (assets/cats/<cat>-<outfit>-<pose>.webp, poses: front, side, jump).
   Accessories are layered on top as separate images, placed from the sprite's measured head (js/cats-data.js).
   Everything is plain <img> tags, so it works from a local file as well as from a web server. */
(() => {
'use strict';
const META = window.KN_CATS || {}, AR = window.KN_AR || {};
const INK = '#1c1b19';

const CATS = [['ragdoll', 'Ragdoll'], ['ginger', 'Ginger'], ['siamese', 'Siamese']];
const OUTFITS = [['hoodie', 'Hoodie'], ['uniform', 'School uniform'], ['fusion', 'Fusion ethnic baju'], ['jersey', 'Knowledge jersey'],
  ['tee', 'Tee'], ['dress', 'Dress'], ['jacket', 'Denim jacket'], ['kurung', 'Baju kurung']];

// slot decides what an item replaces. Every head-worn item shares one slot, so only one is worn at a time.
const ACC = {
  headphones: { slot: 'phones' }, cat: { slot: 'head' }, bucket: { slot: 'head' }, fedora: { slot: 'head' }, gradcap: { slot: 'head' }, teamcap: { slot: 'head' },
  shades: { slot: 'face' }, glasses: { slot: 'face' }, pixel: { slot: 'face' },
  presspass: { slot: 'neck' }, vip: { slot: 'neck' },
  camera: { slot: 'hand' }, bubbletea: { slot: 'hand' }, mic: { slot: 'hand' }, goldmic: { slot: 'hand' }, notebook: { slot: 'hand' }, bottle: { slot: 'hand' }, gloves: { slot: 'hand' },
  cape: { slot: 'back' }, backpack: { slot: 'back' }, cyberhoodie: { slot: 'body' },
};
// 3D items made for the cats (assets/acc). The rest are the museum's doodle items, kept as they were.
const PHOTO = { headphones: 1, cat: 1, bucket: 1, camera: 1, bubbletea: 1, backpack: 1, presspass: 1 };

// doodle art for earned items that only existed inside the old avatar drawing
const st = `stroke="${INK}" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round"`;
const EXTRA = {
  gradcap: `<path d="M30 52 L30 66 C42 74 58 74 70 66 L70 52" fill="#2b2a27" ${st}/><path d="M50 28 L94 44 L50 60 L6 44 Z" fill="${INK}" ${st}/><path d="M50 44 L80 50 L80 70" fill="none" ${st}/><circle cx="80" cy="73" r="5" fill="#e7cf6a" ${st}/>`,
  teamcap: `<path d="M14 64 C12 30 78 24 80 60 Z" fill="#b5403a" ${st}/><path d="M64 58 L97 61 C97 67 78 69 64 66 Z" fill="#b5403a" ${st}/><path d="M30 52 L56 46" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
  glasses: `<g fill="none" ${st}><circle cx="30" cy="50" r="16"/><circle cx="70" cy="50" r="16"/><path d="M46 49 L54 49"/></g>`,
  pixel: `<g fill="${INK}"><rect x="8" y="40" width="38" height="18"/><rect x="54" y="40" width="38" height="18"/><rect x="46" y="42" width="8" height="5"/><rect x="14" y="44" width="9" height="6" fill="#d8ff3d"/><rect x="60" y="44" width="9" height="6" fill="#d8ff3d"/></g>`,
  gloves: `<path d="M30 92 L30 58 Q30 50 36 50 L36 36 Q36 30 42 30 Q48 30 48 36 L48 48 L48 30 Q48 24 54 24 Q60 24 60 30 L60 50 L66 46 Q72 42 74 50 L62 92 Z" fill="#b5403a" ${st}/>`,
  cyberhoodie: `<path d="M8 30 H92 M18 52 H82" stroke="#d8ff3d" stroke-width="9" stroke-linecap="round"/><path d="M8 30 H92 M18 52 H82" stroke="#6a47ff" stroke-width="2.5" stroke-linecap="round"/>`,
};
const LANYARD = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 58"><g fill="none" stroke-linecap="round"><path d="M5 2 C9 28 30 48 46 56 M95 2 C91 28 70 48 54 56" stroke="#9d968a" stroke-width="9"/><path d="M5 2 C9 28 30 48 46 56 M95 2 C91 28 70 48 54 56" stroke="#ece6dc" stroke-width="6.5"/><path d="M6 6 C11 28 30 46 45 53 M94 6 C89 28 70 46 55 53" stroke="#fff" stroke-opacity=".6" stroke-width="1.6"/></g></svg>`);
const doodleSrc = (k) => {
  const body = EXTRA[k] || (window.KN_DOODLE || {})[k] || '';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${body}</svg>`);
};
const VARIANT = (k, pose) => k === 'backpack' && pose === 'side' ? '-side' : k === 'headphones' ? '-neck' : k === 'presspass' ? '-card' : '';
const itemSrc = (k, pose) => PHOTO[k] ? `assets/acc/${k}${VARIANT(k, pose)}.webp` : doodleSrc(k);
const itemAR = (k, pose) => PHOTO[k] ? (AR[`acc/${k}${VARIANT(k, pose)}`] || 1) : 1;

function clean(look) {
  const l = look || {};
  return { cat: CATS.some(c => c[0] === l.cat) ? l.cat : 'ragdoll', outfit: OUTFITS.some(o => o[0] === l.outfit) ? l.outfit : 'hoodie',
    acc: (l.acc || []).filter(a => ACC[a]).slice(0, 2) };
}

// where each item sits, in sprite pixels: [centreX, top, width, height, behind?]
function place(k, pose, m) {
  const HW = m.headW, c = m.crown, w = m.w, H = m.h, ar = itemAR(k, pose);
  const at = (cx, top, wd, ht, back) => [cx, top, wd, ht == null ? wd * ar : ht, !!back];
  const side = pose === 'side', jump = pose === 'jump';
  switch (k) {
    case 'cat': return at(m.hx + (side ? HW * .05 : 0), c + HW * .12 - HW * .36 * ar, HW * .36);
    case 'bucket': return at(m.hx, c - HW * .38, HW * .72);
    case 'headphones': return side ? null : at(m.hx, c + HW * .7, HW * .8); // resting round the neck
    case 'fedora': return at(m.hx, c - HW * .6, HW * 1.0);
    case 'gradcap': return at(m.hx, c - HW * .5, HW * 1.0);
    case 'teamcap': return at(m.hx, c - HW * .42, HW * .98);
    case 'shades': case 'glasses': case 'pixel':
      return side ? null : at(m.hx, c + HW * .44 - HW * .82 / 2, HW * .82);
    case 'presspass': return null; // lanyard + card, drawn in figure()
    case 'vip': return side ? null : at(m.hx, c + HW * .6, HW * .5);
    case 'camera': case 'bubbletea': case 'mic': case 'goldmic': case 'notebook': case 'bottle': {
      if (side || jump) return null;
      const wd = k === 'camera' ? w * .36 : k === 'bubbletea' ? w * .24 : w * .34;
      return [m.bx + w * .38, H * .88 - wd * ar, wd, wd * ar, false];
    }
    case 'gloves': return null; // drawn as a pair in figure()
    case 'backpack': return side ? at(m.bx + w * .26, H * .36, w * .44, null, true) : at(m.bx + w * .3, H * .38, w * .55, null, true);
    case 'cape': return at(m.bx, H * .34, w * 1.05, H * .62, true);
    case 'cyberhoodie': return side ? null : at(m.bx, H * .52, w * .52);
  }
  return null;
}

// one pose of the figure. Box = sprite plus room above the head and at the sides for items.
const PAD_X = .2, PAD_T = .2;
function figure(look, pose, refW) {
  const L = clean(look), key = `${L.cat}-${L.outfit}-${pose}`, m = META[key];
  if (!m) return '';
  const BW = m.w * (1 + PAD_X * 2), BH = m.h * (1 + PAD_T), ox = m.w * PAD_X, oy = m.h * PAD_T;
  const pct = (x, y, wd, ht) => `left:${(x + ox) / BW * 100}%;top:${(y + oy) / BH * 100}%;width:${wd / BW * 100}%;height:${ht / BH * 100}%`;
  let back = '', front = '';
  L.acc.forEach(k => {
    if (k === 'gloves') {
      if (pose !== 'front') return;
      const g = m.w * .2;
      [[m.bx - m.w * .4, 1], [m.bx + m.w * .4, -1]].forEach(([x, f]) => { front += `<img class="ki" src="${doodleSrc('gloves')}" alt="" style="${pct(x - g / 2, m.h * .58, g, g)};transform:scaleX(${f}) !important">`; });
      return;
    }
    if (k === 'presspass') {
      if (pose === 'side') return;
      // a lanyard round the neck, with the card resting on the chest
      const lw = m.headW * .5, lh = lw * .58, ly = m.crown + m.headW * .74, cw = m.headW * .24, car = AR['acc/presspass-card'] || 1;
      front += `<img class="ki" src="${LANYARD}" alt="" style="${pct(m.hx - lw / 2, ly, lw, lh)}">`;
      front += `<img class="ki" src="assets/acc/presspass-card.webp" alt="" style="${pct(m.hx - cw / 2, ly + lh * .86, cw, cw * car)}">`;
      return;
    }
    const p = place(k, pose, m); if (!p) return;
    const [cx, top, wd, ht, behind] = p;
    const tag = `<img class="ki${behind ? ' back' : ''}" src="${itemSrc(k, pose)}" alt="" style="${pct(cx - wd / 2, top, wd, ht)}">`;
    if (behind) back += tag; else front += tag;
  });
  const width = refW ? `width:${BW / refW * 100}%;` : '';
  return `<span class="kfig p-${pose}" style="${width}aspect-ratio:${BW.toFixed(1)}/${BH.toFixed(1)}">${back}<img class="kb" src="assets/cats/${key}.webp" alt="" style="${pct(0, 0, m.w, m.h)}">${front}</span>`;
}

// mode: 'full' (stage / tiles), 'bust' (round photos), 'walk' (front, side and jump stacked for the walkers)
function html(look, opt = {}) {
  const mode = opt.mode || 'full', L = clean(look);
  if (mode === 'walk') {
    const fm = META[`${L.cat}-${L.outfit}-front`], refW = fm ? fm.w * (1 + PAD_X * 2) : 0;
    return `<span class="kc walk">${figure(L, 'front')}${figure(L, 'side', refW)}${figure(L, 'jump', refW)}</span>`;
  }
  return `<span class="kc ${mode}" aria-hidden="true">${figure(L, opt.pose || 'front')}</span>`;
}

window.KNAvatar = { html, clean, ACC, CATS, OUTFITS, doodleSrc };
})();
