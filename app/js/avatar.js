/* Knowseum avatar — the sprout character (no gender, no hair). Outfits are painted inside the body
   silhouette with the sprite's own shading on top; accessories are fitted to the sprout's head, face,
   neck, hands and back. Returns SVG strings / data URIs (works from file://).
   Poses: 'front' (idle / walking) and 'jump' (arms up, used when you pick the character up). */
(() => {
'use strict';
const INK = '#1c1b19';
const CH = () => window.KN_CHAR || {};

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

/* Everything is drawn in the front pose's coordinate space (180 x 300, eyes at y 112).
   The jump sprite is offset so its face lands in the same place. */
const POSE = {
  front: { img: 'p0', x: 0, y: 0, w: 180, h: 300,
    top: 'M-40 147 C20 143 52 158 90 160 C128 158 160 143 220 147',
    cut: 'L220 200 L150 200 L150 256 C120 262 60 262 30 256 L30 200 L-40 200 Z',
    hem: 256, hands: [[18, 214], [163, 214]], pend: [89, 212] },
  jump: { img: 'p8', x: -21.5, y: 5, w: 216.7, h: 280.8,
    top: 'M-40 150 C20 146 52 160 90 162 C128 160 160 146 220 150',
    cut: 'L220 232 C150 240 30 240 -40 232 Z',
    hem: 232, hands: [[4, 96], [172, 96]], pend: [88.5, 210] },
};

let uid = 0;
function draw(look, opt = {}) {
  const P0 = POSE[opt.pose === 'jump' ? 'jump' : 'front'], ch = CH(), id = 'k' + (uid++).toString(36);
  let outfit = look.outfitCol || '#d8bd5a', style = look.outfit || 'tee';
  const acc = new Set(look.acc || []);
  if (acc.has('cyberhoodie')) { outfit = '#5e3f5c'; style = 'hoodie'; }
  const sw = 2.6, line = shade(outfit, 0.62);
  const st = `stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"`;
  let o = '';
  const P = (d, f, s = st) => { o += `<path d="${d}" fill="${f}" ${s}/>`; };
  const L = (d, w = 2.2, c = line) => { o += `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`; };
  const C = (cx, cy, r, f, s = st) => { o += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${s}/>`; };
  const D = (kind, x, y, s) => { const b = (window.KN_DOODLE || {})[kind]; if (b) o += `<svg x="${x}" y="${y}" width="${s}" height="${s}" viewBox="0 0 100 100" overflow="visible">${b}</svg>`; };
  const IMG = (k, extra = '') => ch[k] ? `<image href="${ch[k]}" x="${P0.x}" y="${P0.y}" width="${P0.w}" height="${P0.h}" preserveAspectRatio="none"${extra}/>` : '';
  const old = inner => { o += `<g transform="translate(-6.9 -6.9) scale(1.9)">${inner}</g>`; }; // round-2 head coords -> sprout head
  const jump = P0 === POSE.jump;
  const [hx, hy] = P0.hands[1];

  o += `<defs><mask id="${id}m" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="-60" y="-40" width="300" height="380">${IMG(P0.img)}</mask></defs>`;

  // back layer
  if (acc.has('cape')) P(jump ? 'M30 150 C10 190 -6 236 -14 268 Q90 284 194 268 C186 236 170 190 150 150 Z' : 'M32 146 C12 186 -2 236 -8 276 Q90 292 188 276 C182 236 168 186 148 146 Z', '#b5403a');
  if (acc.has('backpack')) { o += `<rect x="34" y="${jump ? 142 : 146}" width="112" height="92" rx="22" fill="#b5403a" ${st}/>`; }

  // the sprout
  o += IMG(P0.img);

  // dress skirt sits over the top of the legs
  if (style === 'dress') {
    const y = P0.hem - 24;
    P(`M34 ${y} C26 ${y + 18} 18 ${y + 32} 14 ${y + 44} Q90 ${y + 58} 166 ${y + 44} C162 ${y + 32} 154 ${y + 18} 146 ${y} Z`, outfit, `stroke="${line}" stroke-width="1.6"`);
    L(`M22 ${y + 36} Q90 ${y + 50} 158 ${y + 36}`, 1.8);
  }

  // outfit, painted inside the body silhouette
  o += `<g mask="url(#${id}m)">`;
  P(P0.top + ' ' + P0.cut, outfit, 'stroke="none"');
  const hem = P0.hem;
  if (style === 'vneck' || style === 'dress') L('M70 157 L90 182 L110 157');
  else if (style === 'hoodie') {
    L('M50 151 C58 182 122 182 130 151', 2.6); L(`M56 ${hem - 34} L124 ${hem - 34} L132 ${hem - 6} M56 ${hem - 34} L48 ${hem - 6}`);
    if (acc.has('cyberhoodie')) o += `<path d="M44 ${hem - 52} H70 M110 ${hem - 52} H136 M48 ${hem - 44} H66 M114 ${hem - 44} H132" stroke="#d8ff3d" stroke-width="3" stroke-linecap="round"/>`;
  }
  else if (style === 'tee') L('M66 157 C74 172 106 172 114 157', 2.6);
  else if (style === 'jersey') {
    L('M66 157 C74 172 106 172 114 157', 2.6); o += `<path d="M36 160 L36 ${hem} M144 160 L144 ${hem}" stroke="#ffffff" stroke-width="5"/>`;
    o += `<text x="${jump ? 128 : 124}" y="${hem - 22}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" fill="#ffffff" stroke="${INK}" stroke-width="1.6" text-anchor="middle">7</text>`;
  }
  else if (style === 'kurung') { L('M80 156 L80 168 L100 168 L100 156'); [[50, 178], [128, 176], [56, 214], [134, 222], [44, 240], [120, 248], [74, 250]].forEach(([x, y]) => C(x, y, 3.4, '#fff', `stroke="${line}" stroke-width="1.2"`)); }
  else if (style === 'melayu') {
    P('M74 152 L74 168 L106 168 L106 152', shade(outfit, 1.2), `stroke="${line}" stroke-width="1.6"`);
    [174, 184].forEach(y => C(90, y, 3, '#e7cf6a', `stroke="${line}" stroke-width="1.2"`));
    P(`M-40 ${hem - 26} L220 ${hem - 26} L220 ${hem + 4} L-40 ${hem + 4} Z`, '#d8bd5a', 'stroke="none"'); L(`M-40 ${hem - 26} L220 ${hem - 26}`, 1.6, '#9a8436');
  }
  else if (style === 'uniform') { P('M68 152 L90 178 L112 152 L108 170 L90 184 L72 170 Z', '#ffffff', `stroke="${line}" stroke-width="1.6"`); [196, 226].forEach(y => C(56, y, 2.6, INK, 'stroke="none"')); }
  else if (style === 'jacket') { L('M68 154 L78 196 L90 170 M112 154 L102 196 L90 170', 2.4); L(`M90 170 V${hem}`); P('M42 190 h22 v12 h-22 Z', shade(outfit, 1.25), `stroke="${line}" stroke-width="1.4"`); P('M116 190 h22 v12 h-22 Z', shade(outfit, 1.25), `stroke="${line}" stroke-width="1.4"`); }
  o += IMG(P0.img + '-shade') + IMG(P0.img + '-hl');
  L(P0.top, 1.6); // edge line so the clothes read as clothes
  o += '</g>';

  // straps over the clothes
  if (acc.has('backpack')) o += `<path d="M48 ${jump ? 156 : 152} L44 ${hem - 12} M132 ${jump ? 156 : 152} L136 ${hem - 12}" stroke="#8f2f2a" stroke-width="7" stroke-linecap="round"/>`;

  // the sprout's own necklace stays on top of any outfit (unless a pass replaces it)
  const pass = acc.has('presspass') || acc.has('vip');
  if (!pass) o += IMG(P0.img + '-neck');

  // face
  if (acc.has('glasses')) o += `<g fill="none" ${st}><circle cx="66" cy="112" r="14"/><circle cx="109" cy="112" r="14"/><path d="M80 111 Q87.5 106 95 111 M52 109 L40 104 M123 109 L136 104"/></g>`;
  if (acc.has('shades')) o += `<g ${st}><path d="M48 101 H84 Q84 124 66 124 Q48 124 48 101 Z M92 101 H128 Q128 124 110 124 Q92 124 92 101 Z" fill="${INK}"/><path d="M84 104 H92 M48 103 L38 99 M128 103 L138 99" fill="none"/></g><path d="M54 106 L62 106" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`;
  if (acc.has('pixel')) o += `<g fill="${INK}"><rect x="46" y="101" width="38" height="18"/><rect x="92" y="101" width="38" height="18"/><rect x="84" y="103" width="8" height="5"/><rect x="38" y="101" width="8" height="5"/><rect x="130" y="101" width="8" height="5"/><rect x="52" y="105" width="8" height="6" fill="#d8ff3d"/><rect x="98" y="105" width="8" height="6" fill="#d8ff3d"/></g>`;

  // head (round-2 drawings, scaled onto the sprout's crown)
  let hat = '';
  const HP = (d, f) => { hat += `<path d="${d}" fill="${f}" stroke="${INK}" stroke-width="${sw / 1.9}" stroke-linejoin="round" stroke-linecap="round"/>`; };
  if (acc.has('cat')) {
    hat += '<g transform="translate(0 13)">';
    HP('M30 22 C30 8 74 4 78 18 C80 26 70 30 52 30 C38 30 30 28 30 22 Z', '#77736c'); HP('M42 29 C44 21 56 21 58 29 Z', '#ffffff');
    hat += `<path d="M76 18 C88 14 90 0 85 -8" fill="none" stroke="#77736c" stroke-width="2" stroke-linecap="round"/>`;
    hat += `<circle cx="36" cy="14" r="11" fill="#77736c" stroke="${INK}" stroke-width="1.4"/>`; HP('M27 9 L27 -2 L34 5 Z', '#77736c'); HP('M38 5 L44 -3 L46 8 Z', '#77736c');
    hat += `<circle cx="33" cy="13" r="1.6" fill="${INK}"/><circle cx="40" cy="13" r="1.6" fill="${INK}"/></g>`;
  }
  if (acc.has('bucket')) { HP('M26 42 C26 18 76 16 76 42 Z', '#7fb3a8'); HP('M12 46 Q51 34 90 46 Q51 58 12 46 Z', shade('#7fb3a8', 0.9)); }
  if (acc.has('fedora')) { HP('M28 38 C28 10 74 10 74 38 Z', '#6b5543'); hat += `<rect x="28" y="30" width="46" height="6" fill="#b5403a" stroke="${INK}" stroke-width="1"/>`; HP('M8 42 Q51 30 94 42 Q51 52 8 42 Z', '#5a4636'); }
  if (acc.has('gradcap')) { HP('M28 30 L28 42 C40 50 62 50 74 42 L74 30', '#2b2a27'); HP('M51 8 L98 24 L51 40 L4 24 Z', INK); HP('M51 24 L84 30 L84 50', 'none'); hat += `<circle cx="84" cy="53" r="4.5" fill="#e7cf6a" stroke="${INK}" stroke-width="1.4"/>`; }
  if (acc.has('teamcap')) { HP('M23 49 C22 22 76 18 78 46 Z', '#b5403a'); HP('M62 45 L95 47 C95 52 76 54 62 51 Z', '#b5403a'); hat += `<path d="M38 40 L60 36" stroke="#fff" stroke-width="3" stroke-linecap="round"/>`; }
  if (acc.has('headphones')) { hat += `<path d="M22 54 C18 6 84 6 80 54" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`; HP('M14 50 h11 v20 h-11 Z', outfit); HP('M77 50 h11 v20 h-11 Z', outfit); }
  if (hat) { old(hat); if (!acc.has('cat')) o += IMG(P0.img + '-sprout'); } // the sprout pokes through hats

  // neck
  if (pass) {
    const vip = acc.has('vip'), [px, py] = P0.pend;
    o += `<path d="M36 ${jump ? 146 : 142} C56 ${py - 40} ${px - 12} ${py - 26} ${px} ${py - 22} C${px + 12} ${py - 26} 124 ${py - 40} 144 ${jump ? 138 : 142}" fill="none" stroke="${vip ? '#e7cf6a' : '#b5403a'}" stroke-width="6" stroke-linecap="round"/>`;
    o += `<rect x="${px - 22}" y="${py - 24}" width="44" height="56" rx="4" fill="${vip ? '#e7cf6a' : '#ffffff'}" ${st}/>`;
    o += `<rect x="${px - 22}" y="${py - 24}" width="44" height="14" rx="3" fill="${vip ? INK : '#b5403a'}" stroke="${INK}" stroke-width="2"/>`;
    o += vip ? `<text x="${px}" y="${py + 16}" font-family="Inter, Arial" font-size="15" font-weight="800" text-anchor="middle" fill="${INK}">VIP</text>`
      : `<path d="M${px - 13} ${py + 2} H${px + 13} M${px - 13} ${py + 10} H${px + 8} M${px - 13} ${py + 18} H${px + 11}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
  }

  // hands
  const held = ['camera', 'bubbletea', 'mic', 'goldmic', 'notebook', 'bottle'].find(k => acc.has(k));
  if (held) D(held, hx - 26, hy - 34, 58);
  if (acc.has('gloves')) P0.hands.forEach(([x, y]) => { o += `<ellipse cx="${x}" cy="${y}" rx="15" ry="17" fill="#b5403a" ${st}/><path d="M${x - 9} ${y + 9} H${x + 9}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>`; });
  return o;
}

function svg(look, opt = {}) {
  const vb = opt.view === 'outfit' ? '-4 96 188 188' : opt.bust === false ? '18 -4 144 180' : opt.legs ? '-30 -8 240 314' : '-14 -6 208 270';
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vb}">${draw(look, opt)}</svg>`;
}
// light-touch encoding keeps the embedded base64 sprites small
const enc = s => s.replace(/[%#"<>\n{}|\\^`]/g, c => encodeURIComponent(c));
const cache = new Map();
const uri = (look, opt = {}) => {
  const k = JSON.stringify([look, opt]);
  let v = cache.get(k);
  if (!v) { v = 'data:image/svg+xml;charset=utf-8,' + enc(svg(look, opt)); if (cache.size > 200) cache.clear(); cache.set(k, v); }
  return v;
};
window.KNAvatar = { draw, svg, uri, ACC };
})();
