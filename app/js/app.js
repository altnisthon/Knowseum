/* Knowseum — interactive mobile prototype.
   Plain JavaScript, no build step. Screens are rendered as HTML strings into #device,
   progress is saved in localStorage (only on this browser). Content lives in data.js. */
(() => {
'use strict';
const KN = window.KN;
const ART = KN.articles;
const LV = Object.fromEntries(KN.levels.map(l => [l.key, l]));
const LEVELS = ['easy', 'mid', 'hard'];
const OPEN = ['singapore', 'politics', 'tech'];
const HAIR = { g: ['long', 'bob', 'ponytail', 'buns', 'hijab', 'curlylong'], b: ['short', 'side', 'wavy', 'curly', 'buzz', 'cap'] };
const HAIR_NAMES = { long: 'Long', bob: 'Bob', ponytail: 'Ponytail', buns: 'Buns', hijab: 'Hijab', curlylong: 'Curls', short: 'Short', side: 'Side part', wavy: 'Wavy', curly: 'Curly', buzz: 'Buzz', cap: 'Cap' };
const HAIR_COL = ['#1c1b19', '#5a3b2a', '#a8723c', '#e2c06e', '#b5403a', '#9fb2d6'];
const CLOTH_COL = ['#d8bd5a', '#7fb3a8', '#b5403a', '#5b76b0', '#d79aac', '#3a3834'];
const OUTFITS = { g: [['hoodie', 'Hoodie'], ['tee', 'Tee'], ['dress', 'Dress'], ['uniform', 'School uniform'], ['kurung', 'Baju kurung'], ['jacket', 'Denim jacket']],
  b: [['hoodie', 'Hoodie'], ['tee', 'Tee'], ['uniform', 'School uniform'], ['jersey', 'Jersey'], ['melayu', 'Baju Melayu'], ['jacket', 'Denim jacket']] };
const ACCS = [['headphones', 'Headphones'], ['cat', 'Cat buddy'], ['camera', 'Camera'], ['backpack', 'Backpack'], ['bucket', 'Bucket hat'], ['bubbletea', 'Bubble tea']];
const SECRETS = [
  { key: 'presspass', name: 'Press pass', streak: 1, how: 'Start a streak' }, { key: 'notebook', name: 'Notebook', streak: 3, how: '3-day streak' },
  { key: 'mic', name: 'Mic', quizzes: 5, how: 'Finish 5 quizzes' }, { key: 'vip', name: 'Exclusive pass', streak: 8, how: 'Day 8 streak' },
  { key: 'shades', name: 'Cool sunglasses', streak: 14, how: 'Day 14 streak' }, { key: 'bottle', name: 'Water bottle', streak: 19, how: 'Day 19 streak' },
  { key: 'fedora', name: "Reporter's fedora", streak: 25, how: 'Day 25 streak' }, { key: 'goldmic', name: 'Golden mic', streak: 30, how: 'Day 30 streak' },
  { key: 'cape', name: 'Headline cape', streak: 50, how: 'Day 50 streak', mystery: true }];
const EARNED = [
  { key: 'gradcap', name: 'Grad cap', art: 'politics', bonus: true, how: 'Finish SG Politics' }, { key: 'teamcap', name: 'Team cap', art: 'singapore', bonus: true, how: 'Finish Singapore' },
  { key: 'cyberhoodie', name: 'Cyber hoodie', art: 'tech', bonus: true, how: 'Finish Tech' }, { key: 'glasses', name: 'Round glasses', art: 'politics', item: 'Round glasses', how: '5/5 · SG Politics Not bad leh' },
  { key: 'gloves', name: 'Racing gloves', art: 'singapore', item: 'Racing gloves', how: '5/5 · Singapore Not bad leh' }, { key: 'pixel', name: 'Pixel shades', art: 'tech', item: 'Pixel shades', how: '5/5 · Tech Not bad leh' }];
const BONUS_ACC = { 'Grad cap': 'gradcap', 'Team cap': 'teamcap', 'Cyber hoodie': 'cyberhoodie' };
const W_ = window.KN_WORLD;
const device = document.getElementById('device');

// ------------------------------------------------------------------ state
const KEY = 'knowseum-state-v1';
const fresh = () => ({
  user: null, streak: 1, quizzesDone: 0, perfectHard: false, badges: [], seenTip: false, equipped: [], topic: {}, tipHidden: {}, seenSecrets: [], tips: {}, mini: {},
  arts: Object.fromEntries(OPEN.map(k => [k, { runs: 0, seenLevel: 0, story: false, persp: false, best: { easy: null, mid: null, hard: null }, stamps: {}, items: [], bonus: false }])),
});
let S;
try { S = JSON.parse(localStorage.getItem(KEY)) || fresh(); } catch (e) { S = fresh(); }
S.topic = S.topic || {}; S.tips = S.tips || {}; S.mini = S.mini || {}; S.tipHidden = S.tipHidden || {}; S.seenSecrets = S.seenSecrets || [];
if (S.user && !S.user.look) S.user.look = { ...DEFAULT_LOOK, girl: S.user.girl !== false };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
const points = () => OPEN.reduce((t, k) => t + LEVELS.reduce((u, l) => u + (S.arts[k].best[l] || 0) * LV[l].mult, 0), 0);
const stampCount = () => OPEN.reduce((t, k) => t + Object.keys(S.arts[k].stamps).length, 0);
const actsDone = k => { const a = S.arts[k]; return [a.story, a.persp, ...LEVELS.map(l => a.best[l] !== null)].filter(Boolean).length; };
const DEFAULT_LOOK = { girl: true, hair: 'buns', hairCol: '#1c1b19', outfit: 'tee', outfitCol: '#d8bd5a', acc: ['headphones'] };
const curLook = () => (S.user && S.user.look) || DEFAULT_LOOK;
const avatarSrc = (look, legs, head) => KNAvatar.uri(look || curLook(), { legs: !!legs, bust: !head });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ------------------------------------------------------------------ badges
const ALLB = [...KN.badges.streak.map(b => ({ ...b, kind: 'streak' })), ...KN.badges.quiz.map(b => ({ ...b, kind: 'quiz' })),
  ...OPEN.map(k => ({ key: ART[k].badgeArt, name: ART[k].bonus.badge, sub: ART[k].name, kind: 'article', art: k }))];
const BK = kind => ALLB.filter(b => b.kind === kind);
const isEarned = b => b.kind === 'streak' ? S.streak >= b.at : b.kind === 'quiz' ? (b.at === null ? S.perfectHard : S.quizzesDone >= b.at) : S.arts[b.art].bonus;
function checkBadges() {
  const fresh = ALLB.filter(b => isEarned(b) && !S.badges.includes(b.key));
  fresh.forEach(b => S.badges.push(b.key));
  const ns = SECRETS.filter(s => (s.streak ? S.streak >= s.streak : S.quizzesDone >= s.quizzes) && !S.seenSecrets.includes(s.key));
  ns.forEach(s => S.seenSecrets.push(s.key));
  if (ns.length && S.user && S.user.look) setTimeout(() => toast(`${ic('lock', 16, '#e7cf6a')} New in Make your look · Secret: ${ns.map(s => s.name).join(', ')}`, 3200), 300);
  save();
  return fresh.filter(b => b.kind !== 'article');
}

// ------------------------------------------------------------------ icons + small svgs
const P = {
  back: 'M15 5 L8 12 L15 19', chev: 'M9 5 L16 12 L9 19', close: 'M6 6 L18 18 M18 6 L6 18', play: 'M8 5 L19 12 L8 19 Z',
  book: 'M4 5 C7 4 10 4 12 6 C14 4 17 4 20 5 V19 C17 18 14 18 12 20 C10 18 7 18 4 19 Z M12 6 V20',
  lock: 'M6 11 h12 v10 h-12 Z M8.5 11 V8 a3.5 3.5 0 0 1 7 0 V11 M12 15 v2',
  flame: 'M12 3 C14 8 19 9 18 15 C17 19 14.5 21 12 21 C8.5 21 6 18.5 6 15 C6 11.5 9 10.5 10 7 C11 10 12 9 12 3 Z',
  spark: 'M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z',
  map: 'M3 6 L9 4 L15 6 L21 4 V18 L15 20 L9 18 L3 20 Z M9 4 V18 M15 6 V20',
  passport: 'M5 3 h14 v18 h-14 Z M12 8 a3 3 0 1 0 0.01 0 M8.5 17 h7',
  lobby: 'M3 10 L12 4 L21 10 M5 10 V19 M19 10 V19 M3 20 H21 M9 19 V13 H15 V19',
  user: 'M12 4 a4 4 0 1 0 0.01 0 M4 21 C5 15 19 15 20 21', mail: 'M3 6 h18 v12 h-18 Z M3 7 L12 13 L21 7',
  at: 'M16 12 a4 4 0 1 1 -1.2 -2.8 M16 8 V13.5 a2.5 2.5 0 0 0 5 0 V12 a9 9 0 1 0 -3.5 7.1',
  shuffle: 'M3 7 h4 c5 0 6 10 11 10 h3 M18 14 l3 3 l-3 3 M3 17 h4 c2 0 3-1.5 4-3 M14 8.5 c1-1 2-1.5 4-1.5 h3 M18 4 l3 3 l-3 3',
  stamp: 'M12 3 a4 4 0 0 0 -2 7.5 V14 H5 V18 H19 V14 H14 V10.5 A4 4 0 0 0 12 3 Z M5 21 H19',
  palette: 'M12 3 a9 9 0 1 0 0 18 c1.5 0 2-1 2-2 c0-1.5-1.5-2 0-3.5 c1-1 2.5-0.5 4-0.5 a3 3 0 0 0 3-3 C21 7 17 3 12 3 Z M7.5 11 h0.01 M10 7.5 h0.01 M15 7.5 h0.01',
  pencil: 'M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10', arrowup: 'M12 19 V5 M6 11 L12 5 L18 11',
};
const ic = (n, s = 20, c = 'currentColor', w = 1.9, fill = 'none') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[n]}"/></svg>`;
const tick = (s = 24, c = '#2e9a58', w = 3.2) => `<svg class="draw" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"><path d="M3 13 Q6 15 9.5 20 Q14 9 23 2"/></svg>`;
const cross = (s = 24, c = '#d6544b', w = 3.2) => `<svg class="draw" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"><path d="M4 3 Q12 11 21 21 M20 3 Q11 12 3 22"/></svg>`;
const star = (on, c = '#e7cf6a') => `<svg viewBox="0 0 20 20"><path d="M10 1.5 L12.4 7.2 L18.6 7.6 L13.8 11.6 L15.4 17.6 L10 14.3 L4.6 17.6 L6.2 11.6 L1.4 7.6 L7.6 7.2 Z" fill="${on ? c : 'none'}" stroke="${on ? '#1c1b19' : '#c9c4ba'}" stroke-width="1.4" stroke-linejoin="round"/></svg>`;
const stars = (n, c) => `<span class="stars">${[0, 1, 2].map(i => star(i < n, c)).join('')}</span>`;
const sparkSvg = (fill = '#fff') => `<svg viewBox="0 0 24 24"><path d="M12 1 Q13.5 10.5 23 12 Q13.5 13.5 12 23 Q10.5 13.5 1 12 Q10.5 10.5 12 1 Z" fill="${fill}" stroke="#1c1b19" stroke-width="1.2"/></svg>`;
const sparkles = list => list.map(([x, y, s, f, d]) => `<span class="sparkle" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;animation-delay:${d || 0}s">${sparkSvg(f)}</span>`).join('');
function burstSvg(n = 22, r1 = 112, r2 = 160, col = '#1c1b19') {
  let d = ''; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + (i % 3) * .04, b = r1 * (0.96 + (i % 4) * .03), e = r2 * (0.85 + (i % 5) * .06);
    d += `<path d="M${165 + b * Math.cos(a)} ${165 + b * Math.sin(a)} L${165 + e * Math.cos(a)} ${165 + e * Math.sin(a)}" stroke-width="${i % 2 ? 2.2 : 1.4}"/>`; }
  return `<svg class="burst" viewBox="0 0 330 330" fill="none" stroke="${col}" stroke-linecap="round">${d}</svg>`;
}
function ringSvg(col) { // hand-drawn loop around a chosen answer
  return `<svg class="ring draw" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" stroke="${col}" stroke-width="1.4" vector-effect="non-scaling-stroke"><path vector-effect="non-scaling-stroke" d="M8 30 C20 4 80 2 96 26 C104 48 96 86 60 96 C30 102 2 86 2 54 C2 34 14 18 40 10"/></svg>`;
}
const av = (p, cls = '') => `<span class="av ${cls}" style="background:${p.color}">${esc(p.ini)}</span>`;

// ------------------------------------------------------------------ router
let current = null, currentName = '';
function go(name, params = {}, how = 'fwd') {
  closeSheet(true);
  const html = SCREENS[name](params);
  const el = document.createElement('div');
  el.className = 'screen' + (TABS.includes(name) ? ' has-tabs' : '') + (['persp', 'question', 'lobby', 'map'].includes(name) ? ' noscroll' : '');
  el.innerHTML = html;
  const enter = { fwd: 'enter-fwd', back: 'enter-back', up: 'enter-up', fade: 'enter-fade', none: '' }[how];
  const exit = { fwd: 'exit-fwd', back: 'exit-back', up: 'exit-fade', fade: 'exit-fade', none: '' }[how];
  if (enter) el.classList.add(enter);
  device.insertBefore(el, device.querySelector('.statusbar'));
  if (current) { const old = current; if (exit) { old.classList.add(exit); setTimeout(() => old.remove(), 380); } else old.remove(); }
  current = el; currentName = name;
  renderTabs(name);
  setStatus(name === 'night');
  device.querySelector('.statusbar').style.visibility = name === 'story' ? 'hidden' : '';
  (MOUNT[name] || (() => {}))(el, params);
  el.scrollTop = 0;
}
const TABS = ['lobby', 'map', 'passport', 'profile'];
function renderTabs(name) {
  let bar = device.querySelector('.tabbar');
  const show = TABS.includes(name) || ['stamps', 'badges'].includes(name);
  if (!show) { if (bar) bar.remove(); return; }
  if (!bar) { bar = document.createElement('nav'); bar.className = 'tabbar'; bar.setAttribute('aria-label', 'Main'); device.insertBefore(bar, device.querySelector('.statusbar')); }
  const on = ['stamps', 'badges'].includes(name) ? 'passport' : name;
  bar.innerHTML = [['lobby', 'Lobby'], ['map', 'Map'], ['passport', 'Passport'], ['user', 'Profile']].map(([i, l]) => {
    const t = i === 'user' ? 'profile' : i;
    return `<button data-tab="${t}" class="${on === t ? 'on' : ''}" aria-current="${on === t ? 'page' : 'false'}">${ic(i, 24)}${l}</button>`;
  }).join('');
}
function setStatus(dark) { device.querySelector('.statusbar').classList.toggle('dark', !!dark); }
function toast(msg, ms = 2400) {
  device.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.innerHTML = msg;
  device.appendChild(t); setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, ms);
}
function openSheet(html, cls = '') {
  closeSheet(true);
  const scrim = document.createElement('div'); scrim.className = 'scrim'; scrim.dataset.act = 'close-sheet';
  const sh = document.createElement('div'); sh.className = 'sheet ' + cls; sh.setAttribute('role', 'dialog'); sh.innerHTML = `<div class="grab"></div>${html}`;
  device.append(scrim, sh);
}
function closeSheet(now) {
  const sh = device.querySelector('.sheet'), sc = device.querySelector('.scrim');
  if (!sh) return;
  if (now) { sh.remove(); sc && sc.remove(); return; }
  sh.classList.add('closing'); sc && sc.classList.add('closing');
  setTimeout(() => { sh.remove(); sc && sc.remove(); }, 300);
}

// ------------------------------------------------------------------ screens
const SCREENS = {}, MOUNT = {};
const topbar = (title, sub, left = 'back', right = '') => `<div class="topbar">${left ? `<button class="round" data-act="${left}" aria-label="${left === 'close' ? 'Close' : 'Back'}">${ic(left === 'close' ? 'close' : 'back', 20)}</button>` : '<span class="spacer40"></span>'}
  <div class="ttl"><b>${title}</b>${sub ? `<span>${sub}</span>` : ''}</div>${right || '<span class="spacer40"></span>'}</div>`;

// --- onboarding
SCREENS.signin = () => `<div class="onb stagger">
  <img class="facade" src="assets/facade.svg" alt="The Knowseum building">
  <h1 class="brand">The <em>Knowseum</em></h1>
  <p class="sub">A museum of this week's news. Walk the wings, step into stories and fill your visitor passport.</p>
  <button class="btn line" data-act="google"><span style="width:22px;height:22px;border-radius:50%;border:1px solid #d7d5cf;display:grid;place-items:center;font-weight:800;font-size:13px">G</span>Continue with Google</button>
  <div class="or">or</div>
  <form id="emailform" style="display:grid;gap:12px">
    <label class="field">${ic('mail', 20, '#7d7972', 1.6)}<input id="email" type="email" inputmode="email" autocomplete="email" placeholder="you@school.edu.sg" aria-label="Email"></label>
    <button class="btn ink" type="submit">Continue with email</button>
  </form>
  <p class="hint" id="emailhint"></p>
</div>`;
MOUNT.signin = el => {
  el.querySelector('#emailform').addEventListener('submit', e => {
    e.preventDefault();
    const v = el.querySelector('#email').value.trim();
    if (!/^\S+@\S+\.\S+$/.test(v)) { const h = el.querySelector('#emailhint'); h.textContent = 'Type an email like name@school.edu.sg'; h.className = 'hint bad'; return; }
    pending.email = v; go('username');
  });
};
const pending = {};
SCREENS.username = () => `${topbar('Pick a username', 'Step 1 of 2')}
<div class="onb" style="padding-top:8px">
  <h2 class="h1 rise" style="font-size:24px">What should the museum call you?</h2>
  <p class="sub rise" style="text-align:left;margin:8px 0 18px">This shows on your visitor passport.</p>
  <label class="field">${ic('at', 20, '#7d7972', 1.6)}<input id="handle" maxlength="15" autocapitalize="none" autocomplete="off" spellcheck="false" placeholder="nisa.knows" aria-label="Username"></label>
  <p class="hint" id="uh">3 to 15 letters, numbers, dots or underscores.</p>
  <div class="sugg">${['nisa.knows', 'newsie_sg', 'museum.kid', 'curious.cat'].map(s => `<button class="chip" data-act="sugg" data-v="${s}">@${s}</button>`).join('')}</div>
  <div style="flex:1"></div>
  <button class="btn ink" id="uok" data-act="handle-ok" disabled>Continue</button>
</div>`;
MOUNT.username = el => {
  const inp = el.querySelector('#handle'), h = el.querySelector('#uh'), b = el.querySelector('#uok');
  const check = () => {
    const v = inp.value.trim().toLowerCase(); inp.value = v;
    const ok = /^[a-z0-9._]{3,15}$/.test(v);
    b.disabled = !ok;
    const mine = S.user && S.loggedOut && v === S.user.handle;
    h.textContent = !v ? '3 to 15 letters, numbers, dots or underscores.' : mine ? `Welcome back, @${v}. Continue to pick up where you left off.` : ok ? `@${v} is free.` : 'Use 3 to 15 letters, numbers, dots or underscores.';
    h.className = 'hint ' + (!v ? '' : ok ? 'good' : 'bad');
  };
  inp.addEventListener('input', check);
  if (S.user && S.loggedOut) { inp.value = S.user.handle; check(); }
  el.addEventListener('click', e => { const s = e.target.closest('[data-act="sugg"]'); if (s) { inp.value = s.dataset.v; check(); } });
  setTimeout(() => inp.focus(), 450);
};
SCREENS.welcome = () => `<div class="onb">
  <img class="facade" src="assets/facade.svg" alt="">
  <h1 class="brand rise">Welcome, <em>@${esc(pending.handle)}</em></h1>
  <div class="welcome-list stagger">
    <div><span class="ic">${ic('lobby', 18)}</span>Each wing is one news story, painted on the Newsworthy Wall.</div>
    <div><span class="ic">${ic('book', 18)}</span>Step into the story, hear every side in Perspectives, then take the quiz.</div>
    <div><span class="ic">${ic('stamp', 18)}</span>Every quiz you finish stamps your passport. Keep a streak for badges.</div>
  </div>
  <button class="btn ink" data-act="to-look">Make your look</button>
</div>`;

// --- welcome back (shown whenever a saved visitor opens the app)
SCREENS.back = () => `<div class="onb back-onb">
  <img class="facade" src="assets/facade.svg" alt="The Knowseum building">
  <span class="backav pop"><img src="${avatarSrc()}" alt="Your avatar"></span>
  <h1 class="brand rise" style="text-align:center">Welcome back, <em>@${esc(S.user.handle)}</em></h1>
  <p class="sub" style="text-align:center">${ic('flame', 16, '#d6544b', 2)} ${S.streak}-day streak · ${stampCount()} stamp${stampCount() === 1 ? '' : 's'} · ${S.badges.length} badge${S.badges.length === 1 ? '' : 's'}</p>
  <button class="btn ink" data-act="continue-back">Continue</button>
  <button class="btn line" data-act="logout">Not you? Log out</button>
</div>`;

// --- make your look
// --- make your look (Hair / Outfit / Accessories / Secret, as in the Figma frames)
let lookDraft = null, lookTab = 'Hair';
const doodle = (kind, locked) => `<svg viewBox="0 0 100 100" aria-hidden="true">${(locked ? window.KN_DOODLE_LOCKED : window.KN_DOODLE)[kind] || ''}</svg>`;
function lookTile({ act, v, name, sub, state = 'on', art, seed = 0 }) {
  // state: on | sel | locked | progress | mystery
  const lock = state === 'locked' || state === 'mystery' || state === 'progress';
  const corner = state === 'sel' ? `<span class="tc sel">${tick(13, '#fff', 3)}</span>` : lock ? `<span class="tc">${ic('lock', 12, '#9d988f', 1.9)}</span>` : '';
  return `<button class="ltile ${state}" data-act="${act}" data-v="${v}" style="--r:${(seed % 3) - 1}deg" aria-pressed="${state === 'sel'}" ${lock ? 'aria-disabled="true"' : ''}>
    <span class="art">${art}${state === 'mystery' ? '<span class="myst">?</span>' : ''}</span><b>${name}</b>${sub ? `<small>${sub}</small>` : ''}${corner}</button>`;
}
function secretState(it) {
  const have = it.streak ? S.streak >= it.streak : S.quizzesDone >= it.quizzes;
  if (have) return lookDraft.acc.includes(it.key) ? 'sel' : 'on';
  if (it.mystery) return 'mystery';
  return it.quizzes ? 'progress' : 'locked';
}
function earnedHave(e) { return e.bonus ? S.arts[e.art].bonus : S.arts[e.art].items.includes(e.item); }
SCREENS.look = ({ edit } = {}) => {
  lookDraft = lookDraft || JSON.parse(JSON.stringify(curLook()));
  const d = lookDraft, g = d.girl ? 'g' : 'b';
  const tabs = ['Hair', 'Outfit', 'Accessories', 'Secret'];
  let body = '';
  if (lookTab === 'Hair') {
    body = `<div class="lgrid">${HAIR[g].map((h, i) => lookTile({ act: 'hair', v: h, name: HAIR_NAMES[h], state: d.hair === h ? 'sel' : 'on', seed: i, art: `<img src="${KNAvatar.uri({ ...d, hair: h, acc: [] }, { bust: false })}" alt="">` })).join('')}</div>
      <div class="colrow"><span class="label">Colour</span>${HAIR_COL.map(c => `<button class="sw ${d.hairCol === c ? 'on' : ''}" style="background:${c}" data-act="haircol" data-v="${c}" aria-label="Hair colour ${c}"></button>`).join('')}</div>`;
  } else if (lookTab === 'Outfit') {
    body = `<div class="lgrid">${OUTFITS[g].map(([k, n], i) => lookTile({ act: 'outfit', v: k, name: n, state: d.outfit === k ? 'sel' : 'on', seed: i, art: doodle(k) })).join('')}</div>
      <div class="colrow"><span class="label">Colour</span>${CLOTH_COL.map(c => `<button class="sw ${d.outfitCol === c ? 'on' : ''}" style="background:${c}" data-act="clothcol" data-v="${c}" aria-label="Outfit colour ${c}"></button>`).join('')}</div>`;
  } else if (lookTab === 'Accessories') {
    body = `<div class="lgrid">${ACCS.map(([k, n], i) => lookTile({ act: 'acc', v: k, name: n, state: d.acc.includes(k) ? 'sel' : 'on', seed: i, art: doodle(k) })).join('')}</div>
      <p class="lnote">Wear up to 2 accessories at once.</p>
      <div class="label pad" style="margin:18px 0 10px">Earned in the museum</div>
      <div class="lgrid">${EARNED.map((e, i) => { const have = earnedHave(e); return lookTile({ act: have ? 'acc' : 'earned-locked', v: e.key, name: e.name, sub: have ? (d.acc.includes(e.key) ? 'Wearing' : 'Unlocked') : e.how, state: have ? (d.acc.includes(e.key) ? 'sel' : 'on') : 'locked', seed: i + 2,
        art: `<img src="${KNAvatar.uri({ ...d, acc: [e.key] }, { bust: !['gradcap', 'teamcap', 'glasses', 'pixel'].includes(e.key) })}" alt="">` }); }).join('')}</div>`;
  } else {
    const next = SECRETS.find(s => s.streak && S.streak < s.streak);
    const ms = SECRETS.filter(s => s.streak).map(s => s.streak);
    const pos = Math.max(0, ms.findIndex(m => m > S.streak));
    const frac = next ? (pos - 1 + (S.streak - (ms[pos - 1] || 0)) / (ms[pos] - (ms[pos - 1] || 0))) / (ms.length - 1) : 1;
    body = `<div class="streakcard"><div class="top">${ic('flame', 18, '#d6544b', 2)}<b>${S.streak}-day streak</b><span>${next ? `${next.name} in ${next.streak - S.streak} day${next.streak - S.streak > 1 ? 's' : ''}` : 'Every streak item unlocked'}</span></div>
      <div class="track"><i style="width:${Math.max(0, Math.min(1, frac)) * 100}%"></i>${ms.map((m, i) => `<span class="dot ${S.streak >= m ? 'on' : next && m === next.streak ? 'next' : ''}" style="left:${i / (ms.length - 1) * 100}%"><em>D${m}</em></span>`).join('')}</div></div>
      <div class="lgrid">${SECRETS.map((s, i) => { const st = secretState(s);
        const sub = st === 'progress' ? `<span class="minibar"><i style="width:${Math.min(1, S.quizzesDone / s.quizzes) * 100}%"></i></span>${Math.min(S.quizzesDone, s.quizzes)}/${s.quizzes} quizzes` : st === 'sel' ? 'Wearing' : st === 'on' ? 'Unlocked' : s.how;
        return lookTile({ act: st === 'on' || st === 'sel' ? 'acc' : 'secret-locked', v: s.key, name: st === 'mystery' ? '???' : s.name, sub, state: st, seed: i + 5, art: doodle(s.key, st !== 'on' && st !== 'sel') }); }).join('')}</div>
      <p class="lnote" style="text-align:center">Keep your streak going to unlock more.</p>`;
  }
  return `${topbar('Make your look', edit ? '' : 'Step 2 of 2', edit ? 'back-look' : '', `<button class="savepill" data-act="look-save">Save</button>`)}
  <div class="seg2" role="tablist"><span class="knob" style="transform:translateX(${d.girl ? 0 : '100%'})"></span>
    <button data-act="girl" data-v="1" role="tab" aria-selected="${d.girl}">Girl</button><button data-act="girl" data-v="0" role="tab" aria-selected="${!d.girl}">Boy</button></div>
  <div class="look-stage"><img id="lookimg" src="${KNAvatar.uri(d)}" alt="Your avatar preview">
    <button class="round white lsh" data-act="look-shuffle" aria-label="Shuffle look">${ic('shuffle', 20)}</button>
    <button class="round white lpal" data-act="look-palette" aria-label="Next colour">${ic('palette', 20)}</button>${sparkles([[26, 24, 14, '#e7cf6a'], [330, 50, 11, '#fff', .5]])}</div>
  <div class="ltabs" role="tablist">${tabs.map(t => `<button class="${t === lookTab ? 'on' : ''}" data-act="look-tab" data-v="${t}" role="tab" aria-selected="${t === lookTab}">${t}${t === 'Secret' ? ' ' + ic('lock', 12, 'currentColor', 2) : ''}</button>`).join('')}</div>
  <div class="lbody" key="${lookTab}">${body}</div>
  <div class="pad" style="padding-top:18px;padding-bottom:34px"><button class="btn ${edit ? 'ink' : 'acc'}" data-act="look-save">${edit ? 'Save my look' : 'Enter the museum'}</button></div>`;
};
function rerenderLook(bump = true) {
  const sc = current.scrollTop; current.innerHTML = SCREENS.look({ edit: !!S.user }); current.scrollTop = sc;
  if (bump) { const im = current.querySelector('#lookimg'); im.classList.add('bump'); }
}
function toggleAcc(key) {
  const d = lookDraft, slot = KNAvatar.ACC[key].slot;
  if (d.acc.includes(key)) { d.acc = d.acc.filter(a => a !== key); return; }
  d.acc = d.acc.filter(a => KNAvatar.ACC[a].slot !== slot);
  d.acc.push(key);
  if (d.acc.length > 2) { d.acc.shift(); toast('You can wear 2 accessories at once. Swapped out the oldest one.'); }
}

// --- lobby: the museum itself
const DOOR_SIDE = { world: 'L', singapore: 'R', culture: 'R', tech: 'L', environment: 'U', politics: 'U' };
const DOOR_NAME = { singapore: 'Singapore', politics: 'SG Politics', tech: 'Tech', world: 'World', environment: 'Environment', culture: 'Culture' };
const lp = (x, y, w = 390, h = 300) => `left:${x / w * 100}%;top:${y / h * 100}%`;
const walkerW = (k, w = 390) => `width:${110 * k / w * 100}%`;
SCREENS.lobby = () => {
  const L = W_.lobby;
  const wingsDone = KN.wings.filter(w => ART[w.key] ? actsDone(w.key) === 5 : S.topic[w.key]).length;
  return `<div class="lobbyv">
  <div class="hello rise"><span class="av"><img src="${avatarSrc()}" alt=""></span>
    <div style="flex:1"><b>The Lobby</b><span>Hi, @${esc(S.user.handle)} · this week's stories are in</span></div>
    <button class="chip" data-act="to-hall" style="background:#1c1b19;color:#e7cf6a" aria-label="Hall of Fame">♛</button>
    <span class="chip" style="background:#fdecea">${ic('flame', 15, '#d6544b', 2)} ${S.streak}</span>
    <button class="chip" data-tab="passport" style="background:var(--grey)">${ic('stamp', 15)} ${stampCount()}</button></div>
  <div class="museum" id="museum"><div class="stagein" id="lobbyart"><img src="assets/lobby.webp" alt="The museum lobby with six arched doorways, one for each wing" draggable="false">
    ${L.doors.map(d => `<button class="door ${DOOR_SIDE[d.key]}" aria-label="Enter the ${DOOR_NAME[d.key]} Wing" data-act="enter-wing" data-v="${d.key}" style="${lp(d.x, d.y)};--c:${KN.wings.find(w => w.key === d.key).color}"><span class="dotp"></span><span class="dl">${DOOR_NAME[d.key]}</span></button>`).join('')}
    <span class="walker grab" id="walker" style="${lp(...lobbyPx())};${walkerW(L.k * 1.25)}" role="img" aria-label="You. Hold and drag to move"><img src="${avatarSrc(null, true)}" alt="" draggable="false"></span>
    ${coach('lobby', 'Hold your character and drag it to a doorway to enter a wing')}</div>
    <button class="round white helpbtn" data-act="drag-help" data-v="lobby" aria-label="How to move">?</button></div>
  <div class="wingdrawer ${wingsOpen ? 'open' : ''}" id="wingdrawer">
    <button class="wdh" data-act="toggle-wings" aria-expanded="${wingsOpen}"><span class="grip"></span>
      <span class="t"><b>Wings</b><small>${wingsDone} of 6 explored · or tap one to jump in</small></span>${ic('chev', 18, '#1c1b19', 2.2)}</button>
    <div class="wdbody"><div class="wdinner">
      <div class="stats" style="padding:2px 16px 4px">
        <div class="stat streak"><b>${ic('flame', 16, '#d6544b', 2)} ${S.streak}</b><span>day streak</span></div>
        <div class="stat pts"><b>${points()}</b><span>quiz points</span></div>
        <div class="stat"><b>${S.quizzesDone}</b><span>quizzes done</span></div></div>
      <div class="wrows">${KN.wings.map(w => {
        const art = ART[w.key];
        const sub = art ? art.headline : WALL_ONLY[w.key].headline;
        const prog = art ? `<span class="pips">${[0, 1, 2, 3, 4].map(i => `<i class="${i < actsDone(w.key) ? 'on' : ''}"></i>`).join('')}</span>` : `<span class="tq ${S.topic[w.key] ? 'done' : ''}">${S.topic[w.key] ? 'Done' : 'Quiz'}</span>`;
        return `<button class="wrow" data-act="enter-wing" data-v="${w.key}" style="--c:${w.color};--t:${w.tint}"><span class="sw2"><i></i></span><span class="tx"><b>${w.name} Wing</b><small>${esc(sub)}</small></span>${prog}${ic('chev', 18, '#7d7972', 2)}</button>`;
      }).join('')}</div></div></div></div></div>`;
};
// lobby floor maths (same iso projection the art was drawn with)
const LB = { ox: 195, oy: 96, k: 15.2, c: Math.cos(Math.PI / 6) };
const lbToPx = (x, y) => [LB.ox + (x - y) * LB.c * LB.k, LB.oy + (x + y) * .5 * LB.k];
const lbToFloor = (sx, sy) => { const d = (sx - LB.ox) / (LB.c * LB.k), s = (sy - LB.oy) / (.5 * LB.k); return [(s + d) / 2, (s - d) / 2]; };
const clampF = v => Math.max(.7, Math.min(11.3, v));
let lobbyMe = null, wingsOpen = false;
const lobbyPx = () => lbToPx(...(lobbyMe || [6.3, 6.3]));
const coach = (key, text) => S.tips[key] ? '' : `<span class="coach" id="coach-${key}"><span class="hand">${HAND}</span><span>${text}</span><button data-act="coach-x" data-v="${key}" aria-label="Got it">${ic('close', 12, '#fff', 2.4)}</button></span>`;
const HAND = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#fff" stroke="#1c1b19" stroke-width="1.5" stroke-linejoin="round"><path d="M9 11 V4.5 a1.5 1.5 0 0 1 3 0 V10 V8.5 a1.5 1.5 0 0 1 3 0 V10.5 a1.5 1.5 0 0 1 3 0 V15 c0 3.5 -2.5 6 -6 6 h-1 c-2 0 -3.3 -.9 -4.4 -2.4 L4 14.5 a1.5 1.5 0 0 1 2.4 -1.8 L9 15 Z"/></svg>`;
function placeCoach(scope, key, el) {
  const c = scope.querySelector('#coach-' + key); if (!c || !el) return;
  c.style.left = el.style.left; c.style.top = el.style.top;
}
function tipDone(key) { if (S.tips[key]) return; S.tips[key] = true; save(); const c = current.querySelector('#coach-' + key); if (c) { c.classList.add('bye'); setTimeout(() => c.remove(), 260); } }
// generic "hold the character and drag it" handler
function dragChar(walker, box, { onMove, onDrop, onTap }) {
  let held = false, moved = false, sx = 0, sy = 0;
  walker.addEventListener('pointerdown', e => {
    e.preventDefault(); e.stopPropagation(); walker.setPointerCapture(e.pointerId); held = true; moved = false; sx = e.clientX; sy = e.clientY;
    walker.classList.add('held'); walker.classList.remove('walking'); box.classList.add('dragging');
  });
  walker.addEventListener('pointermove', e => {
    if (!held) return;
    if (!moved && Math.hypot(e.clientX - sx, e.clientY - sy) < 4) return;
    moved = true;
    const r = box.getBoundingClientRect(), wr = walker.getBoundingClientRect();
    // keep the character's middle under the finger, so the feet sit just below it
    onMove((e.clientX - r.left) / r.width, (e.clientY + wr.height * .42 - r.top) / r.height);
  });
  const up = e => { if (!held) return; held = false; walker.classList.remove('held'); box.classList.remove('dragging'); if (moved) onDrop(); else onTap && onTap(); walker._justDragged = Date.now(); };
  walker.addEventListener('pointerup', up); walker.addEventListener('pointercancel', up);
  walker.addEventListener('click', e => e.stopPropagation());
}
MOUNT.lobby = el => {
  const L = W_.lobby, museum = el.querySelector('#museum'), stage = el.querySelector('#lobbyart'), wk = el.querySelector('#walker');
  // scale the museum up to fill the space above the wings drawer
  let half = 195;
  const fit = () => { const w = museum.clientWidth, h = museum.clientHeight, sw = Math.min(w * 1.45, h * 390 / 300); stage.style.width = sw + 'px'; half = (w / 2) / (sw / 390) - 16; };
  fit(); requestAnimationFrame(() => { fit(); setPos(...lobbyMe); });
  const doorsF = L.doors.map(d => ({ ...d, f: lbToFloor(d.x, d.y) }));
  let near = null;
  const setPos = (x, y) => {
    x = clampF(x); y = clampF(y);
    // keep the character inside the visible part of the museum
    let [px] = lbToPx(x, y); const lim = Math.max(-half, Math.min(half, px - LB.ox));
    if (lim !== px - LB.ox) { const s = x + y, d = lim / (LB.c * LB.k); x = clampF((s + d) / 2); y = clampF((s - d) / 2); }
    lobbyMe = [x, y]; const [, py] = lbToPx(...lobbyMe); px = lbToPx(...lobbyMe)[0]; wk.style.left = px / 390 * 100 + '%'; wk.style.top = py / 300 * 100 + '%'; placeCoach(stage, 'lobby', wk); };
  const nearDoor = () => doorsF.find(d => Math.hypot(d.f[0] - lobbyMe[0], d.f[1] - lobbyMe[1]) < 1.9);
  setPos(...(lobbyMe || [6.3, 6.3]));
  dragChar(wk, stage, {
    onMove: (fx, fy) => {
      wk.style.transition = 'none'; setPos(...lbToFloor(fx * 390, fy * 300));
      const d = nearDoor(), k = d && d.key;
      if (k !== near) { near = k; el.querySelectorAll('.door').forEach(b => { const on = b.dataset.v === k; b.classList.toggle('near', on); b.querySelector('.dl').textContent = on ? `Let go to enter ${DOOR_NAME[b.dataset.v]}` : DOOR_NAME[b.dataset.v]; }); }
    },
    onDrop: () => {
      wk.style.transition = ''; tipDone('lobby');
      const d = nearDoor();
      if (d) { el.querySelectorAll('.door').forEach(b => b.classList.toggle('picked', b.dataset.v === d.key)); lobbyMe = [...d.f]; walkTo('walker', d.x, d.y, 390, 300, () => { lobbyMe = [6.3, 6.3]; go('room', { k: d.key }); }); }
    },
    onTap: () => toast(`${HAND.replace('width="22" height="22"', 'width="18" height="18"')} Hold me, then drag me to a doorway`),
  });
  // tap anywhere on the floor to walk there
  stage.addEventListener('click', e => {
    if (e.target.closest('.door, .coach, .walker')) return;
    const r = stage.getBoundingClientRect();
    setPos(...lbToFloor((e.clientX - r.left) / r.width * 390, (e.clientY - r.top) / r.height * 300));
  });
};

function walkTo(elId, x, y, w, h, then) {
  const wk = current.querySelector('#' + elId);
  if (!wk) { then(); return; }
  wk.classList.add('walking'); wk.style.left = x / w * 100 + '%'; wk.style.top = y / h * 100 + '%';
  setTimeout(() => { wk.classList.add('gone'); setTimeout(then, 220); }, 760);
}

// --- wing room (isometric) — before and after furnishing
function wingRuns(k) { return (S.arts[k] && S.arts[k].runs) || 0; }
function furnLevel(k) { return Math.min(3, wingRuns(k)); }
SCREENS.room = ({ k }) => {
  const w = KN.wings.find(x => x.key === k), R = W_.rooms[k], art = ART[k];
  const lvl = art ? furnLevel(k) : 0, st = R[String(lvl)];
  const runs = wingRuns(k), placed = R.furn.filter(f => runs >= f[3]).length;
  const topic = !art, only = WALL_ONLY[k];
  const tipShown = !S.tipHidden[k];
  const prizes = art ? LEVELS.map(l => art.rewards[l]).filter(r => r.where === 'room item' && S.arts[k].items.includes(r.item)) : [];
  return `<div style="--c:${w.color};--t:${w.tint}">${topbar(`${w.name} Wing`, topic ? 'Room 1 of 1 · not furnished yet' : `Room 1 of 1 · ${placed ? placed + ' furnishing' + (placed > 1 ? 's' : '') : 'not furnished yet'}`, 'to-lobby', `<span class="round" style="background:#f4eccb;overflow:hidden;padding:0"><img src="${avatarSrc(null, false, true)}" alt="" style="width:40px;height:40px"></span>`)}
  <div class="iso room" id="roomart"><img src="assets/rooms/room-${k}-${lvl}.webp" alt="The ${w.name} Wing room${lvl ? ', furnished' : ''}">
    <button class="hot" data-act="room-wall" data-v="${k}" style="${lp(...st.wall, 390, 330)}"><span class="hring"></span><span class="dl on">Newsworthy wall</span></button>
    ${lvl >= 3 ? `<span class="hot static" style="${lp(...st.trophy, 390, 330)}"><span class="dl">${art ? 'Trophy' : ''}</span></span>` : ''}
    <span class="walker" id="rwalker" style="${lp(...st.me, 390, 330)};${walkerW(st.k)}"><img src="${avatarSrc(null, true)}" alt="You"></span></div>
  ${tipShown && !placed ? `<div class="tipcard rise"><div class="h"><span class="ic">${ic('spark', 18, '#1c1b19', 1.9)}</span><b>Make this room yours</b><button data-act="hide-tip" data-v="${k}" aria-label="Close tip">${ic('close', 14, '#fff', 2.2)}</button></div>
    <p>${topic ? `This wing's story is on the Newsworthy wall. Its activities land soon, and there's a warm-up topic quiz there meanwhile.` : 'Finish the quizzes in this wing to unlock furnishings for this room and new accessories for your look.'}</p>
    <button class="hide" data-act="hide-tip" data-v="${k}">Hide tip</button></div>` : ''}
  <button class="wallcard rise" data-act="room-wall" data-v="${k}"><span class="thumb"><img src="assets/paintings/${(art || only).painting}.webp" alt=""></span>
    <span class="tx"><span class="label">Newsworthy wall</span><b>${topic ? esc(only.headline) : '3 frames to explore'}</b><span class="mini">${ic('chev', 14, '#fff', 2.2)} View wall</span></span></button>
  ${miniSection(k)}
  ${topic ? `<p class="ascii" style="text-align:center;margin:18px 0 30px">*. room furnishings arrive with this wing's quizzes .*</p>` : `
  <div class="furnish rise"><div class="fh"><b>Furnish your room</b><span>${placed} of ${R.furn.length}</span></div>
    <div class="fbar"><span>${runs} of 12 quizzes done in this wing</span><i><em style="width:${Math.min(1, runs / 12) * 100}%"></em></i></div>
    <div class="lgrid">${R.furn.map(([kind, name, , q], i) => { const got = runs >= q, isNew = got && q === runs;
      return `<div class="ltile ${got ? (isNew ? 'sel' : 'on') : 'locked'}" style="--r:${(i % 3) - 1}deg"><span class="art">${doodle(kind, !got)}</span><b>${name}</b><small>${got ? (q <= 3 ? (isNew ? 'New · placed' : 'Placed') : 'Unlocked') : `Complete ${q} quiz${q > 1 ? 'zes' : ''} in this wing`}</small>${got ? `<span class="tc ${isNew ? 'sel' : 'ok'}">${tick(13, '#fff', 3)}</span>` : `<span class="tc">${ic('lock', 12, '#9d988f', 1.9)}</span>`}</div>`; }).join('')}</div>
    ${prizes.length ? `<div class="label" style="margin:16px 0 8px">Quiz prizes in this room</div><div class="sugg" style="margin:0">${prizes.map(p => `<span class="chip">${ic('spark', 14, '#d8bd5a', 2)} ${p.item}</span>`).join('')}</div>` : ''}
    <p class="lnote">Every level you finish counts, retries too.</p></div>`}</div>`;
};
MOUNT.room = (el, { k }) => {
  const a = S.arts[k]; if (!a) return;
  const lvl = furnLevel(k);
  if ((a.seenLevel || 0) < lvl) {
    const names = ['', 'Couch', 'Coffee table', 'Trophy'];
    setTimeout(() => toast(`${sparkSvg('#e7cf6a').replace('<svg', '<svg width="16" height="16"')} ${names[lvl]} placed in your room!`), 500);
    a.seenLevel = lvl; save();
  }
};
function miniSection(k) {
  const G = KNMiniGame.GAMES[k]; if (!G) return '';
  return `<div class="minis rise"><div class="fh"><b>Mini games</b><span>Background + general knowledge</span></div>
    <div class="minigrid">${G.map((g, i) => { const m = KNMiniGame.META[g], r = (S.mini[k] || {})[g];
      return `<button class="minicard ${i ? 'alt' : ''}" data-act="mini-open" data-v="${k}" data-g="${g}"><span class="mi">${KNMiniGame.icon(m.ico, 24)}</span><b>${m.name}</b><small>${m.sub}</small>
        ${r ? `<span class="best">${tick(12, '#fff', 3)} Best ${r.best}/${r.total}</span>` : '<span class="best new">Play</span>'}</button>`; }).join('')}</div>
    <button class="vetlink" data-act="vetting">${ic('spark', 14, '#8a7a52', 2)} AI-drafted for the demo. How the newsroom checks it</button></div>`;
}
function vetSheet() {
  const V = KN_MINI.vetting;
  return `<div class="ascii" style="margin-bottom:6px">HOW MINI GAME CONTENT GOES LIVE</div><h2 style="margin:0 0 6px;font-size:21px">Checked by a Tier 1 newsroom first</h2>
    <p style="color:var(--body);margin:0 0 14px;font-size:14px">The facts, clues and explainers in these games are background knowledge, not news. Here's how each card gets from draft to live.</p>
    <ol class="vetsteps">${V.steps.map(([h, p], i) => `<li><span>${i + 1}</span><div><b>${h}</b><p>${p}</p></div></li>`).join('')}</ol>
    <div class="vetstatus"><span class="vbadge static"><i></i>${V.badge}</span><span class="arr">→</span><span class="vbadge static ok"><i></i>Verified by the newsroom</span></div>
    <p style="color:var(--mute);font-size:12.5px;margin:12px 0 16px">In this prototype every card is still an AI draft, so each one shows the grey badge. In the live app only verified cards appear.</p>
    <button class="btn ink" data-act="close-sheet">Got it</button>`;
}
SCREENS.mini = ({ k, g }) => { const w = KN.wings.find(x => x.key === k); return KNMiniGame.render(k, g, { color: w.color, tint: w.tint, wing: w.name + ' Wing' }); };
MOUNT.mini = (el, { k, g }) => KNMiniGame.mount(el, {
  vetting: () => openSheet(vetSheet()),
  done: (score, total) => { S.mini[k] = S.mini[k] || {}; const r = S.mini[k][g]; const first = !r;
    if (!r || score > r.best) S.mini[k][g] = { best: score, total }; save();
    if (first) setTimeout(() => toast(`${tick(18, '#e7cf6a', 3)} ${KNMiniGame.META[g].name} done in the ${wingNm(k)} Wing`), 400); },
});
const wingNm = k => KN.wings.find(x => x.key === k).name;
function topicQuiz(k) {
  const R = W_.rooms[k], [q, opts, ans] = R.quiz;
  openSheet(`<div class="ascii" style="margin-bottom:6px;color:${KN.wings.find(w => w.key === k).color}">TOPIC QUIZ · ${esc(R.short.toUpperCase())}</div>
    <h2 style="margin:0 0 14px;font-size:20px;line-height:1.3">${esc(q)}</h2>
    <div class="opts" id="topts" style="padding:0">${opts.map((o, i) => `<button class="opt-btn" data-act="topic-ans" data-k="${k}" data-v="${i}"><span class="L">${'ABC'[i]}</span><span>${esc(o)}</span><span class="mark"></span></button>`).join('')}</div>
    <div id="tfeed"></div>`);
}

// --- newsworthy wall
// wings whose story is on the wall but whose activities aren't built yet (headline + painting only)
const WALL_ONLY = {
  environment: { headline: '\u2018Why would I want to harm myself?\u2019: Some delivery riders look to cut hours as haze worsens', painting: 'haze', topic: 'Haze and delivery riders', src: 'The Straits Times', date: '15 Oct 2026', url: 'https://sg.news.yahoo.com/why-want-harm-myself-delivery-092020108.html' },
  culture: { headline: 'Chinamaxxing? Boiling apples won\u2019t make you Chinese', painting: 'chinamaxxing', topic: 'Chinamaxxing', src: 'The Straits Times', date: '1 Mar 2026', url: 'https://www.pressreader.com/singapore/the-straits-times/20260301/281844355118509' },
  world: { headline: 'Central Ukrainian region hit by vast drone attack, killing three', painting: 'ukraine', topic: 'Drone attack in Ukraine', src: 'Reuters \u00b7 The Straits Times', date: '15 Oct 2026', url: 'https://www.straitstimes.com/world/europe/central-ukrainian-region-hit-by-vast-drone-attack-killing-three' },
};
const ARTICLE_URL = { politics: 'https://sg.news.yahoo.com/govts-must-incentivise-private-sector-115433630.html', singapore: 'https://www.redhot.sg/mercedes-kimi-antonelli-within-touching-distance-of-maiden-f1-title-after-finishing-3rd-at-s-pore-gp-726764.html', tech: 'https://sg.news.yahoo.com/anthropic-signs-mou-singapore-evaluate-083000721.html' };
const wallArt = k => ART[k] || (() => { const w = KN.wings.find(x => x.key === k), o = WALL_ONLY[k]; return { ...o, color: w.color, tint: w.tint, wingName: w.name + ' Wing', only: true }; })();
const WALL_PH = [{ img: 'blur1', t: 'A new story lands on this wall next week' }, { img: 'blur2', t: 'Another headline is on its way' }, { img: null, t: 'More stories from this wing, coming soon' }];
let wallIdx = 0;
function wallInfo(k, i) {
  const a = wallArt(k), N = WALL_PH.length + 1;
  if (i === 0 && a.only) {
    const R = W_.rooms[k], done = S.topic[k];
    return `<div class="plaque rise"><div class="label">${a.wingName} · Frame 1 of ${N}</div><h2>${esc(a.headline)}</h2>
    <div class="row"><span>${a.src} · ${a.date}</span><button data-act="read-article" data-url="${a.url}">${ic('book', 15)} Read article</button></div></div>
  <div class="acts-h"><span class="label" style="color:var(--ink)">Activities for this story land soon</span><span class="ascii" style="color:${a.color}">[---]</span></div>
  <div class="acts locked">${['Step into the story', 'Perspectives', 'Quiz'].map((n, j) => `<button class="act ph rise" data-act="wall-soon" data-v="this" style="animation-delay:${j * .05}s"><span class="lk">${ic('lock', 18, '#9d988f', 2)}</span><b>${n}</b><small>Coming soon</small></button>`).join('')}</div>
  <button class="tqcard rise" data-act="topic-open" data-v="${k}"><span class="q">?</span><span class="tx"><span class="label">Warm-up · topic quiz</span><b>${esc(R.quiz[0])}</b><small>${done ? (done.ok ? 'Done · you got it right' : 'Done · try again any time') : '1 question · counts toward your quiz badges'}</small></span>${ic('chev', 18, '#1c1b19', 2.2)}</button>`;
  }
  const st = S.arts[k] || { best: {} }, lvDone = a.only ? 0 : LEVELS.filter(l => st.best[l] !== null).length;
  if (i > 0) {
    const ph = WALL_PH[i - 1];
    return `<div class="plaque ph rise"><div class="label">${a.wingName} · Frame ${i + 1} of ${N} · coming soon</div><h2>${esc(ph.t)}</h2>
      <div class="row"><span>Placeholder for the demo</span><span class="chip" style="height:26px;font-size:11px">${ic('lock', 12)} Locked</span></div></div>
    <div class="acts-h"><span class="label" style="color:var(--ink)">Activities unlock when the story lands</span><span class="ascii">[---]</span></div>
    <div class="acts locked">${['Step into the story', 'Perspectives', 'Quiz'].map((n, j) => `<button class="act ph rise" data-act="wall-soon" style="animation-delay:${j * .05}s"><span class="lk">${ic('lock', 18, '#9d988f', 2)}</span><b>${n}</b><small>Soon</small></button>`).join('')}</div>`;
  }
  return `<div class="plaque rise"><div class="label">${a.wingName} · Frame 1 of ${N}</div><h2>${esc(a.headline)}</h2>
    <div class="row"><span>The Straits Times · ${a.date}</span><button data-act="read-article" data-url="${ARTICLE_URL[k] || ''}">${ic('book', 15)} Read article</button></div></div>
  <div class="acts-h"><span class="label" style="color:var(--ink)">Pick an activity · any order</span><span class="ascii" style="color:${a.color}">[${'#'.repeat([st.story, st.persp, lvDone === 3].filter(Boolean).length)}${'-'.repeat(3 - [st.story, st.persp, lvDone === 3].filter(Boolean).length)}]</span></div>
  <div class="acts">
    <button class="act story rise" data-act="story" data-v="${k}"><span class="play">${ic('play', 18, '#fff', 2, '#fff')}</span><b>Step into the story</b><small>14 frames</small>${st.story ? `<span class="tick-badge">${tick(16, '#fff', 3)}</span>` : ''}</button>
    <button class="act persp rise" data-act="persp" data-v="${k}" style="animation-delay:.06s"><span class="bub"><i style="left:0;top:0;width:50px;background:#e9e9eb"></i><i style="left:0;top:26px;width:36px;background:#e9e9eb"></i><i style="right:0;top:13px;width:50px;background:linear-gradient(#5aa4ff,#1a68d8)"></i></span><b>Perspectives</b><small>3 voices + you</small>${st.persp ? `<span class="tick-badge">${tick(16, '#fff', 3)}</span>` : ''}</button>
    <button class="act quiz rise" data-act="levels" data-v="${k}" style="animation-delay:.12s"><span class="q">?</span><span style="position:absolute;top:66px;left:14px">${stars(3, '#fff')}</span><b>Quiz</b><small>${lvDone ? `${lvDone} of 3 levels` : '3 levels'}</small><span class="lvpips">${LEVELS.map(l => `<i class="${st.best[l] !== null ? 'on' : ''}"></i>`).join('')}</span>${lvDone === 3 ? `<span class="tick-badge">${tick(16, '#fff', 3)}</span>` : ''}</button>
  </div>`;
}
SCREENS.wall = ({ k }) => {
  const a = wallArt(k);
  const showTip = !S.seenTip;
  const other = ['politics', 'kimi', 'tech'].find(p => p !== a.painting);
  const slides = [{ img: a.painting }, ...WALL_PH.map(p => ({ img: p.img || other, ph: true }))];
  wallIdx = 0;
  return `<div class="gallery" style="--c:${a.color};--wing:${a.color}"><div class="floor"></div>
  <div class="wall-top"><button class="round white" data-act="to-room" data-v="${k}" aria-label="Back to the room">${ic('close', 20)}</button>
    <div class="ttl"><b>Newsworthy wall</b><span id="wallsub">${a.wingName} · 1 of ${slides.length}</span></div><span class="spacer40"></span></div>
  <div class="wtrack-wrap"><div class="spot"></div><div class="wtrack" id="wtrack">${slides.map((s, i) => `<div class="wslide ${i ? '' : 'on'}" data-i="${i}">
    <div class="gilt ${i ? '' : 'main'}"><span class="crest"></span><img src="assets/paintings/${s.img}.webp" alt="${i ? 'Coming soon' : 'Painting for ' + esc(a.topic)}" draggable="false" class="${s.ph ? 'ph' : ''}">${s.ph ? '<span class="soon"><span>COMING SOON</span></span>' : ''}</div></div>`).join('')}</div>
    <button class="wnav l" data-act="wall-go" data-v="-1" aria-label="Previous frame">${ic('back', 18, '#1c1b19', 2.4)}</button><button class="wnav r" data-act="wall-go" data-v="1" aria-label="Next frame">${ic('chev', 18, '#1c1b19', 2.4)}</button></div>
  <div class="dots" id="walldots">${slides.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div>
  <div id="wallinfo">${wallInfo(k, 0)}</div>
  ${showTip ? `<div class="newtip" id="newtip">${sparkSvg('#e7cf6a').replace('<svg', '<svg width="14" height="14"')} Swipe the wall for more frames <button data-act="tip-x" aria-label="Dismiss" style="width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.16);display:grid;place-items:center">${ic('close', 10, '#fff', 2.4)}</button></div>` : ''}
  <div style="height:30px"></div></div>`;
};
MOUNT.wall = (el, { k }) => {
  const tr = el.querySelector('#wtrack'), N = tr.children.length;
  let raf = null;
  const sync = () => {
    raf = null;
    const c = tr.scrollLeft + tr.clientWidth / 2;
    let best = 0, bd = 1e9;
    [...tr.children].forEach((s, i) => { const m = s.offsetLeft + s.offsetWidth / 2, d = Math.abs(m - c); if (d < bd) { bd = d; best = i; }
      const f = Math.min(1, d / s.offsetWidth); s.style.transform = `scale(${1 - f * .2})`; s.style.opacity = 1 - f * .35; });
    if (best !== wallIdx) {
      wallIdx = best;
      [...tr.children].forEach((s, i) => s.classList.toggle('on', i === best));
      el.querySelectorAll('#walldots i').forEach((d, i) => d.classList.toggle('on', i === best));
      el.querySelector('#wallsub').textContent = `${wallArt(k).wingName} · ${best + 1} of ${N}`;
      el.querySelector('#wallinfo').innerHTML = wallInfo(k, best);
      const t = el.querySelector('#newtip'); if (t && best) { S.seenTip = true; save(); t.remove(); }
    }
  };
  tr.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(sync); }, { passive: true });
  // mouse drag-to-swipe for desktop
  let dx = null, sl = 0;
  tr.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; dx = e.clientX; sl = tr.scrollLeft; tr.classList.add('dragging'); });
  window.addEventListener('pointermove', e => { if (dx === null) return; tr.scrollLeft = sl - (e.clientX - dx); });
  window.addEventListener('pointerup', () => { if (dx === null) return; dx = null; tr.classList.remove('dragging'); const w = tr.children[0].offsetWidth + 16; tr.scrollTo({ left: Math.round(tr.scrollLeft / w) * w, behavior: 'smooth' }); }, { once: false });
  sync();
};

// --- story player (the 14 illustrated frames per article)
SCREENS.story = () => `<div class="player" style="position:absolute;inset:0"><div id="sp-stage" class="sp-stage"></div></div>`;
MOUNT.story = (el, { k }) => (storyK = k, KNStory.mount(el, k, { finish: () => finishStory(k) }));
function finishStory(k) {
  const first = !S.arts[k].story; S.arts[k].story = true; save();
  go('wall', { k }, 'fade');
  if (first) setTimeout(() => toast(`${tick(18, '#e7cf6a', 3)} Story complete. Ticked on the wall.`), 450);
}

// --- perspectives (Messages thread)
let thread = null;
SCREENS.persp = ({ k }) => {
  const a = ART[k];
  return `<div class="inner"><div class="msgs" style="min-height:100%">
  <div class="nav"><button class="back" data-act="persp-back" aria-label="Back to the wall">${ic('back', 24, '#2f86f6', 2.4)}Wall</button>
    <div class="who"><div class="stack">${a.parties.map(p => av(p)).join('')}</div><b>${esc(a.topic)} ›</b><span>3 contacts + you</span></div>
    <span class="count" id="pcount">1/4</span></div>
  <div class="thread" id="thread" aria-live="polite"><div class="tstamp"><b>${a.threadDay}</b> at ${a.threadTime}</div></div>
  </div></div>
  <div class="msgbar"><div class="voices" id="voices">${[0, 1, 2, 3].map(i => `<i style="${i === 0 ? 'background:' + a.color : ''}"></i>`).join('')}</div>
    <button class="compose" data-act="persp-next" style="width:100%"><span class="mono" style="font-weight:700">[ . . . ]</span><span id="ptxt">Tap anywhere for the next message</span><span class="send">${ic('arrowup', 16, '#fff', 2.4)}</span></button></div>`;
};
MOUNT.persp = (el, { k }) => {
  const a = ART[k], items = [];
  a.thread.forEach((t, vi) => t.msgs.forEach((m, i) => items.push({ type: 'in', key: t.key, text: m, first: i === 0, last: i === t.msgs.length - 1, voice: vi })));
  items.push({ type: 'divider', voice: 3 });
  a.you.forEach((m, i) => items.push({ type: 'out', text: m, last: i === a.you.length - 1, voice: 3 }));
  thread = { k, items, i: 0, busy: false };
  el.querySelector('.inner').addEventListener('click', e => { if (!e.target.closest('button')) perspNext(); });
  setTimeout(perspNext, 500);
};
function perspNext() {
  const t = thread; if (!t || t.busy || currentName !== 'persp') return;
  if (t.i >= t.items.length) return;
  const it = t.items[t.i], a = ART[t.k], box = current.querySelector('#thread');
  const P_ = it.key ? a.parties.find(p => p.key === it.key) : null;
  t.busy = true;
  let typing = null;
  if (it.type === 'in') {
    if (it.first) box.insertAdjacentHTML('beforeend', `<div class="from rise"><b>${esc(P_.name)}</b>${esc(P_.short)} · ${P_.time}</div>`);
    typing = document.createElement('div'); typing.className = 'row-in last';
    typing.innerHTML = `${av(P_)}<span class="typing"><i></i><i></i><i></i></span>`;
    box.appendChild(typing);
    current.querySelector('#ptxt').textContent = `${P_.name} is typing...`;
  } else if (it.type === 'out') {
    typing = document.createElement('div'); typing.style.alignSelf = 'flex-end';
    typing.innerHTML = `<span class="typing" style="background:#dce9ff"><i style="background:#5a8fe0"></i><i style="background:#5a8fe0"></i><i style="background:#5a8fe0"></i></span>`;
    box.appendChild(typing); current.querySelector('#ptxt').textContent = 'You are typing...';
  }
  scrollThread();
  setTimeout(() => {
    if (typing) typing.remove();
    if (it.type === 'in') {
      const prev = box.lastElementChild;
      if (prev && prev.classList.contains('row-in') && prev.dataset.key === it.key) prev.classList.remove('last');
      const row = document.createElement('div'); row.className = 'row-in last'; row.dataset.key = it.key;
      row.innerHTML = `${av(P_)}<div class="bubble in">${esc(it.text)}</div>`;
      box.appendChild(row);
    } else if (it.type === 'divider') {
      box.insertAdjacentHTML('beforeend', `<div class="divider"><div class="ascii">+------------ your turn ------------+</div><b>What this means for you</b></div>`);
    } else {
      box.insertAdjacentHTML('beforeend', `<div class="bubble out">${esc(it.text)}</div>`);
      if (it.last) box.insertAdjacentHTML('beforeend', `<div class="delivered">Delivered</div>`);
    }
    t.i++; t.busy = false;
    const voice = t.i >= t.items.length ? 4 : t.items[t.i].voice;
    current.querySelector('#pcount').textContent = `${Math.min(4, voice + 1)}/4`;
    current.querySelectorAll('#voices i').forEach((v, i) => { v.style.background = i <= Math.min(3, voice) ? (i === 3 ? '#2f86f6' : a.color) : ''; });
    if (t.i >= t.items.length) {
      box.insertAdjacentHTML('beforeend', `<div class="rise" style="margin:22px auto 0;width:230px"><button class="btn ink" data-act="persp-done">${ic('back', 20, '#fff', 2.2)}Back to the Wall</button><div class="ascii" style="text-align:center;margin-top:10px">*.  thread complete  .*</div></div>`);
      current.querySelector('#ptxt').textContent = 'All 4 voices heard. Nice one.';
    } else current.querySelector('#ptxt').textContent = 'Tap anywhere for the next message';
    scrollThread();
  }, it.type === 'divider' ? 250 : 750);
}
function scrollThread() { const sc = current.querySelector('.inner') || current; requestAnimationFrame(() => sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' })); }

// --- quiz
let Q = null;
function levelSheet(k) {
  const st = S.arts[k];
  openSheet(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span class="ascii">+--  QUIZ  --+</span><button class="round" data-act="close-sheet" aria-label="Close">${ic('close', 16)}</button></div>
  <h2 class="h1" style="font-size:24px">Pick your level</h2><p style="color:var(--body);margin:6px 0 16px;font-size:14px">5 questions each. Start with any level.</p>
  ${KN.levels.map((l, i) => { const b = st.best[l.key]; const bg = ['#fff', '#fbf3d3', 'linear-gradient(135deg,#ffd9f2,#dce3ff 35%,#d2faee 68%,#fff2c2)'][i];
    return `<button class="lvl rise" style="background:${bg};animation-delay:${i * .06}s" data-act="start-quiz" data-k="${k}" data-v="${l.key}">
      <span class="meta">${stars(l.stars)} <span class="mono" style="font-size:11px;font-weight:700;margin-left:4px">x${l.mult} pts</span><b>${l.name}</b><small>${l.blurb}</small></span>
      <span class="best">${b === null ? '<small style="color:var(--mute);font-weight:600">Not played</small>' : `<span>BEST</span><strong>${b}/5</strong>`}</span>${ic('chev', 18, '#1c1b19', 2.2)}</button>`; }).join('')}
  <p class="ascii" style="text-align:center;color:${ART[k].color};margin:4px 0 0">*.  all 3 levels + Perspectives = bonus badge  .*</p>`);
}
SCREENS.question = () => {
  const a = ART[Q.k], l = LV[Q.lv], q = a.quiz[Q.lv][Q.i];
  return `<div class="inner"><div class="qscreen" style="--wing:${a.color};min-height:100%">
  <div class="qtop"><button class="round" data-act="quit-quiz" aria-label="Quit quiz">${ic('close', 18)}</button>
    <span class="lvpill">${l.name} ${stars(l.stars)}</span>
    <span class="scorepill chrome" id="score">${sparkSvg('#e7cf6a').replace('<svg', '<svg width="14" height="14"')} ${Q.pts} pt${Q.pts === 1 ? '' : 's'}</span></div>
  <div class="segs">${[0, 1, 2, 3, 4].map(i => `<i class="${i < Q.marks.length ? (Q.marks[i] ? 'ok' : 'no') : i === Q.i ? 'cur' : ''}"></i>`).join('')}</div>
  <div class="qmeta"><span class="label" style="color:var(--body)">Question ${Q.i + 1} of 5</span><span class="ascii">[${'#'.repeat(Q.i + 1)}${'-'.repeat(4 - Q.i)}] ${Q.i + 1}/5</span></div>
  <div class="qcard wob"><div class="k">Q${Q.i + 1} ~ ${esc(a.topic)}</div><h2>${esc(q.q)}</h2></div>
  <div class="opts" id="opts">${q.opts.map((o, i) => `<button class="opt-btn" data-act="answer" data-v="${i}"><span class="L">${'ABCD'[i]}</span><span>${esc(o)}</span><span class="mark"></span></button>`).join('')}</div>
  <p class="ascii" style="text-align:center;margin-top:20px" id="taphint">&gt;&gt;  tap an answer to lock it in  &lt;&lt;</p></div></div>`;
};
function answer(i) {
  const a = ART[Q.k], q = a.quiz[Q.lv][Q.i], ok = i === q.ans, mult = LV[Q.lv].mult;
  const box = current.querySelector('#opts'); box.classList.add('locked');
  current.querySelector('#taphint').remove();
  [...box.children].forEach((b, j) => {
    if (j === q.ans) { b.classList.add('right'); b.querySelector('.mark').innerHTML = tick(26, '#2e9a58', 3.4); }
    else if (j === i) { b.classList.add('wrong'); b.querySelector('.mark').innerHTML = cross(24, '#d6544b', 3.4); }
    else b.classList.add('dim');
  });
  box.children[i].insertAdjacentHTML('beforeend', ringSvg(ok ? '#1c1b19' : '#d6544b'));
  if (navigator.vibrate) try { navigator.vibrate(ok ? 18 : [30, 40, 30]); } catch (e) {}
  Q.marks.push(ok);
  if (ok) { Q.pts += mult; const sp = current.querySelector('#score'); sp.innerHTML = `${sparkSvg('#e7cf6a').replace('<svg', '<svg width="14" height="14"')} ${Q.pts} pt${Q.pts === 1 ? '' : 's'}`; sp.classList.remove('bump'); void sp.offsetWidth; sp.classList.add('bump'); }
  current.querySelectorAll('.segs i')[Q.i].className = ok ? 'ok' : 'no';
  const last = Q.i === 4;
  current.insertAdjacentHTML('beforeend', `<div class="feedback" role="status">
    <div class="verdict"><span class="badge" style="background:${ok ? 'var(--green-t)' : 'var(--red-t)'};border:1.6px solid ${ok ? 'var(--green)' : 'var(--red)'}">${ok ? tick(24) : cross(22)}</span>
      <b style="color:${ok ? 'var(--green-d)' : 'var(--red)'}">${ok ? 'Correct!' : 'Not quite.'}</b>${ok ? `<span class="pts">+${mult} pt${mult > 1 ? 's' : ''}</span>` : '<span class="mono" style="color:var(--red);font-weight:700;font-size:12px">+0 pts</span>'}</div>
    <div class="label" style="margin-top:12px;display:flex;gap:6px;align-items:center">${ic('book', 14)} From the article</div>
    <p>${esc(q.why)}</p><button class="btn ink" data-act="next-q">${last ? 'See results' : 'Next'}</button></div>`);
}
SCREENS.results = () => {
  const a = ART[Q.k], l = LV[Q.lv], score = Q.marks.filter(Boolean).length, band = KN.bands.find(b => score >= b.lo && score <= b.hi);
  return `<div style="background:#f6f5f1;min-height:100%;padding-bottom:30px">${topbar('Results', '', 'to-wall-q')}
  <div class="res-card holo wob rise"><div class="ascii" style="color:var(--ink)">+==========================+</div>
    <span class="lvpill" style="height:30px;margin-top:10px;font-size:13px">${l.name} ${stars(l.stars)}</span>
    <div class="big" id="bigscore">0/5</div><span class="ptspill chrome">+${score * l.mult} pts</span>
    <div class="ascii" style="margin-top:10px;color:var(--body)">${score} correct x${l.mult} = ${score * l.mult}</div>
    ${sparkles([[30, 120, 14, '#e7cf6a'], [300, 70, 20, '#fff', .4]])}</div>
  <div class="pad rise" style="animation-delay:.2s"><h3 style="margin:0;font-size:20px;display:inline-block;background:linear-gradient(transparent 78%,var(--acc) 78%)">${band.title}</h3><p style="color:var(--body);margin:6px 0 14px">${band.msg}</p></div>
  <div class="qlist stagger">${a.quiz[Q.lv].map((q, i) => `<div>${Q.marks[i] ? tick(20) : cross(18)}<span style="color:${Q.marks[i] ? 'var(--ink)' : 'var(--red)'}">${esc(q.q)}</span></div>`).join('')}</div>
  <div class="pad" style="display:grid;gap:10px"><button class="btn acc" data-act="see-rewards">${ic('spark', 18, '#1c1b19', 1.8)} See rewards</button><button class="btn line" data-act="retry">${ic('shuffle', 18)} Retry level</button></div></div>`;
};
MOUNT.results = el => {
  const score = Q.marks.filter(Boolean).length, big = el.querySelector('#bigscore');
  let n = 0; const t = setInterval(() => { big.textContent = `${n}/5`; if (n++ >= score) clearInterval(t); }, 160);
};
function recordQuiz() {
  // save the run once, when the player reaches results
  if (Q.recorded) return; Q.recorded = true;
  const st = S.arts[Q.k], score = Q.marks.filter(Boolean).length;
  Q.firstStamp = !st.stamps[Q.lv];
  if (Q.firstStamp) st.stamps[Q.lv] = today();
  st.best[Q.lv] = Math.max(st.best[Q.lv] ?? -1, score);
  S.quizzesDone++; st.runs = (st.runs || 0) + 1;
  Q.itemNew = false;
  const item = ART[Q.k].rewards[Q.lv].item;
  if (score === 5 && !st.items.includes(item)) { st.items.push(item); Q.itemNew = true; }
  if (score === 5 && Q.lv === 'hard') S.perfectHard = true;
  Q.bonusNew = checkBonus(Q.k);
  Q.newBadges = checkBadges();
  save();
}
function checkBonus(k) {
  const st = S.arts[k];
  if (!st.bonus && st.persp && LEVELS.every(l => st.best[l] !== null)) { st.bonus = true; save(); checkBadges(); return true; }
  return false;
}
SCREENS.rewards = () => {
  const a = ART[Q.k], l = LV[Q.lv], score = Q.marks.filter(Boolean).length, r = a.rewards[Q.lv];
  const nextLv = LEVELS.find(x => !S.arts[Q.k].items.includes(a.rewards[x].item));
  return `<div class="reward">${topbar('', '', '')}
  <div class="ascii" style="text-align:center;color:var(--ink);letter-spacing:.2em">*. .  ${Q.firstStamp ? 'STAMPED' : 'STAMP COLLECTED'}  . .*</div>
  <h1 class="h1 pop" style="text-align:center;margin-top:8px">${l.name} stamp!</h1>
  <div class="reveal">${burstSvg()}<img class="hero" src="assets/stamps/stamp-${Q.k}-${Q.lv}.webp" alt="${a.name} ${l.name} travel stamp">
    ${sparkles([[40, 40, 22, '#fff', .2], [320, 80, 16, '#e7cf6a', .5], [300, 260, 24, '#fff', .8], [50, 250, 14, '#e7cf6a', .3]])}</div>
  <p style="text-align:center;font-weight:600;color:var(--body);margin:-4px 0 2px">${Q.firstStamp ? 'Added to your passport' : 'Already in your passport'}</p>
  <p class="ascii" style="text-align:center;margin:0 0 16px">${l.name} · ${score}/5 · +${score * l.mult} pts</p>
  <div class="unlock-list wob rise" style="animation-delay:.6s"><div class="label" style="color:var(--ink);margin-bottom:6px">Also unlocked</div>
    ${Q.itemNew ? `<div class="it"><span class="ph">${ic('spark', 26, '#d8bd5a', 1.8)}</span><div><b>${r.item}</b><small>Full marks on ${l.name} · ${r.where === 'Make your look' ? 'New in Make your look' : 'Placed in your room'}</small></div>${tick(22)}</div>` : ''}
    ${Q.newBadges.map(b => `<div class="it"><img src="assets/badges/${b.key}.webp" alt=""><div><b>${b.name} badge</b><small>${b.sub}</small></div>${tick(22)}</div>`).join('')}
    ${nextLv && !Q.itemNew ? `<div class="it locked"><span class="ph">${ic('lock', 22, '#7d7972', 1.8)}</span><div><b>${a.rewards[nextLv].item}</b><small>Get 5/5 on ${LV[nextLv].name} to unlock</small></div></div>` : ''}
    ${!Q.itemNew && !Q.newBadges.length && !nextLv ? `<div class="it"><span class="ph">${ic('spark', 24, '#d8bd5a')}</span><div><b>Everything in this wing</b><small>You've collected every item here.</small></div></div>` : ''}
  </div>
  <div class="pad" style="margin-top:18px"><button class="btn ink" data-act="rewards-done">${Q.bonusNew ? 'Continue' : `${ic('back', 20, '#fff', 2.2)} Back to the Wall`}</button></div></div>`;
};
SCREENS.bonus = ({ k }) => {
  const a = ART[k], st = S.arts[k];
  return `<div class="reward">${topbar('', '', '')}
  <div class="ascii" style="text-align:center;color:var(--ink);letter-spacing:.2em">+==== BONUS BADGE ====+</div>
  <h1 class="h1 pop" style="text-align:center;margin-top:8px">Article complete!</h1><p style="text-align:center;color:var(--body);margin:4px 0 0">${esc(a.topic)}</p>
  <div class="reveal">${burstSvg(24, 108, 156)}<img class="hero spin" src="assets/badges/${a.badgeArt}.webp" alt="${a.bonus.badge} badge">${sparkles([[40, 50, 22, '#fff'], [310, 90, 16, '#e7cf6a', .4], [300, 270, 22, '#fff', .7], [40, 260, 14, '#e7cf6a', .2]])}</div>
  <div class="unlock-list wob stagger" style="margin-top:4px">
    <div class="it" style="padding:6px 0">${tick(20)}<b style="flex:1;font-size:14.5px">Perspectives</b><span class="mono" style="font-size:12px">4 voices</span></div>
    ${LEVELS.map(l => `<div class="it" style="padding:6px 0">${tick(20)}<b style="flex:1;font-size:14.5px">${LV[l].name}</b><span class="mono" style="font-size:12px">${st.best[l]}/5</span></div>`).join('')}</div>
  <div class="unlock-list wob rise" style="margin-top:12px;background:#fbf3d3;display:flex;align-items:center;gap:12px;animation-delay:.6s">
    <img id="bonusav" src="${KNAvatar.uri({ ...curLook(), acc: [BONUS_ACC[a.bonus.item]] })}" alt="" style="width:62px;height:82px;object-fit:cover;object-position:top"><div style="flex:1"><b style="font-size:16px">${a.bonus.item}</b><small style="display:block;color:var(--body)">New accessory in Make your look</small></div>
    <button class="chip" style="background:#fff;border:1.3px solid var(--ink)" data-act="wear" data-v="${a.bonus.item}">Wear it</button></div>
  <div class="pad" style="margin-top:18px"><button class="btn ink" data-act="to-wall" data-v="${k}">${ic('back', 20, '#fff', 2.2)} Back to the Wall</button></div></div>`;
};

// --- badge unlocked (night sky)
let badgeQueue = [], afterBadges = null;
function showBadges(list, then) {
  badgeQueue = [...list]; afterBadges = then;
  nextBadge();
}
function nextBadge() {
  device.querySelectorAll('.night').forEach(n => n.remove());
  if (!badgeQueue.length) { const f = afterBadges; afterBadges = null; setStatus(false); f && f(); return; }
  const b = badgeQueue.shift();
  const nxt = ALLB.filter(x => x.kind === b.kind && x.at).find(x => !isEarned(x));
  const div = document.createElement('div'); div.className = 'night'; div.setAttribute('role', 'dialog'); div.setAttribute('aria-label', `${b.name} badge unlocked`);
  div.innerHTML = `<canvas></canvas><div class="ascii" style="color:#f6e49a;letter-spacing:.2em">*. .  BADGE UNLOCKED  . .*</div>
    <img class="hero" src="assets/badges/${b.key}.webp" alt="${b.name}"><h2 class="pop" style="animation-delay:.5s">${b.name}</h2><div class="s">${b.sub}</div>
    <p>${KN.badgeBlurbs[b.key]}</p>${nxt ? `<p style="font-size:13px;margin-top:14px;color:#aab3d8">Next: ${nxt.name} · ${nxt.sub}</p>` : ''}
    <div class="btns"><button class="btn acc" data-act="badge-profile">Show on profile</button><button class="btn line" data-act="badge-next">Nice!</button></div>`;
  device.appendChild(div); setStatus(true);
  nightSky(div.querySelector('canvas'));
}
function nightSky(cv) {
  const ctx = cv.getContext('2d'), dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const swirls = Array.from({ length: 40 }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H * .7, r: 26 + Math.random() * 70, a: Math.random() * 6.28, s: (Math.random() - .5) * .006, w: 3 + Math.random() * 5,
    c: ['#2c47a0', '#3a5bb8', '#4f73c9', '#24387f', '#6d8fd6'][i % 5] }));
  const starsA = Array.from({ length: 9 }, () => ({ x: Math.random() * W, y: Math.random() * H * .6, r: 4 + Math.random() * 7, p: Math.random() * 6 }));
  let t = 0;
  const draw = () => {
    if (!cv.isConnected) return;
    t++; ctx.clearRect(0, 0, W, H);
    swirls.forEach(s => { s.a += s.s; ctx.strokeStyle = s.c; ctx.globalAlpha = .55; ctx.lineWidth = s.w; ctx.lineCap = 'round'; ctx.beginPath();
      for (let k = 0; k < 14; k++) { const a = s.a + k * .32, rr = s.r * (1 - k * .04); const x = s.x + rr * Math.cos(a), y = s.y + rr * Math.sin(a) * .55; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); });
    starsA.forEach(s => { const g = 1 + Math.sin(t / 30 + s.p) * .25; ctx.globalAlpha = .2; ctx.fillStyle = '#f6e49a'; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * 1.9 * g, 0, 7); ctx.fill(); ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(s.x, s.y, s.r * g, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) requestAnimationFrame(draw);
  };
  draw();
}

// --- passport
SCREENS.passport = () => {
  const latest = [];
  OPEN.forEach(k => LEVELS.forEach(l => { if (S.arts[k].stamps[l]) latest.push(`stamp-${k}-${l}`); }));
  const show = latest.slice(-3).reverse();
  const row = (title, list, n, icon) => `<div class="brow rise"><div class="h">${ic(icon, 16)} ${title}</div><div class="imgs">${list.map(b => `<img src="assets/badges/${isEarned(b) ? '' : 'locked-'}${b.key}.webp" alt="${b.name}${isEarned(b) ? '' : ' (locked)'}">`).join('')}</div></div>`;
  return `<div class="pad" style="padding-top:14px"><h1 class="h1">Visitor passport</h1><p style="color:var(--mute);margin:4px 0 14px">@${esc(S.user.handle)} · KN-0427</p></div>
  <div class="bearer paper rise"><span class="photo"><img src="${avatarSrc()}" alt=""></span><div><b>${esc(S.user.handle)}</b><small>Visitor since ${S.user.since}</small><small class="mono" style="font-size:9.5px;letter-spacing:.08em">KN&lt;VISITOR&lt;&lt;${esc(S.user.handle.toUpperCase().replace(/\./g, '<'))}&lt;&lt;</small></div>
    <div class="pts chrome"><b>${points()}</b><br><span>quiz pts</span></div></div>
  <div class="sec-h"><h3>Stamps<small>${stampCount()} of 18</small></h3><button data-act="to-stamps">See all ${ic('chev', 14, '#1c1b19', 2.2)}</button></div>
  <button class="strip paper rise" data-act="to-stamps" style="width:calc(100% - 32px)">${show.length ? show.map((s, i) => `<img src="assets/stamps/${s}.webp" alt="" style="transform:rotate(${[-8, 6, -3][i]}deg)">`).join('') : '<span class="empty">Finish any quiz level to get your first stamp.</span>'}</button>
  <div class="sec-h"><h3>Badges<small>${S.badges.length} earned</small></h3><button data-act="to-badges">See all ${ic('chev', 14, '#1c1b19', 2.2)}</button></div>
  ${row(`${S.streak} day streak`, BK('streak'), S.streak, 'flame')}${row(`${S.quizzesDone} quizzes done`, BK('quiz'), S.quizzesDone, 'book')}
  ${row(`${OPEN.filter(k => S.arts[k].bonus).length} of 3 articles complete`, ALLB.filter(b => b.kind === 'article'), 0, 'spark')}`;
};
let stampWing = 'singapore', newStamp = null;
SCREENS.stamps = () => {
  const k = stampWing, a = ART[k], st = S.arts[k];
  return `${topbar('Stamps', `${stampCount()} of 18 collected`, 'to-passport')}
  <div class="wingchips">${OPEN.map(w => `<button class="${w === k ? 'on' : ''}" data-act="stamp-wing" data-v="${w}">${ART[w].name}<span class="n">${Object.keys(S.arts[w].stamps).length}/3</span></button>`).join('')}<button disabled style="border-style:dashed;color:var(--mute)">+3 soon</button></div>
  <div class="page paper rise"><div class="ph"><span class="label">${a.wingName}</span><b>${esc(a.topic)}</b></div>
    ${LEVELS.map((l, i) => { const d = st.stamps[l], rot = [-6, 7, -3][i];
      return `<div class="slot ${i === 1 ? 'rev' : ''}">${d ? `<button class="st ${newStamp === k + l ? 'new' : ''}" data-act="stamp-detail" data-v="${l}" aria-label="${LV[l].name} stamp"><img src="assets/stamps/stamp-${k}-${l}.webp" alt="" style="transform:rotate(${rot}deg)"></button>
        <div class="cap"><b>${LV[l].name}</b><small>${st.best[l]}/5 · ${d}</small><i style="background:${['#7A4A22', '#4F6E8F', '#B0262E'][i]}"></i></div>`
        : `<div class="emptyslot" style="transform:rotate(${rot}deg)"><div><b>${LV[l].name}</b>Finish this level to get stamped</div></div><div class="cap"></div>`}</div>`; }).join('')}
    ${Object.keys(st.stamps).length === 3 ? `<div style="display:flex;justify-content:flex-end;padding:0 18px"><span class="chip on">${tick(16, '#e7cf6a', 2.8)} Page complete</span></div>` : ''}
  </div>`;
};
MOUNT.stamps = () => { newStamp = null; };
function stampDetail(l) {
  const k = stampWing, a = ART[k], st = S.arts[k];
  openSheet(`<img src="assets/stamps/stamp-${k}-${l}.webp" alt="" class="pop" style="width:230px;margin:0 auto">
  <h2 style="text-align:center;margin:8px 0 2px">${a.name} · ${LV[l].name}</h2><p style="text-align:center;color:var(--body);margin:0 0 14px">${esc(a.topic)}</p>
  <div class="qlist" style="margin:0 0 14px">${[['Best score', `${st.best[l]} / 5`], ['Points', `+${st.best[l] * LV[l].mult} (x${LV[l].mult})`], ['Stamped', st.stamps[l]], ['Ink', ['Sepia · easiest level', 'Silver-blue · middle level', 'Crimson + gold · hardest level'][LEVELS.indexOf(l)]]].map(([x, y]) => `<div><span style="color:var(--mute);flex:1">${x}</span><b>${y}</b></div>`).join('')}</div>
  <button class="btn ink" data-act="retry-from-stamp" data-k="${k}" data-v="${l}">${ic('shuffle', 18, '#fff')} ${st.best[l] === 5 ? 'Play again' : 'Retry for 5/5'}</button>`, 'paperish');
}
SCREENS.badges = () => {
  const card = (title, icon, right, list, now, unit) => {
    const nxt = list.find(b => !isEarned(b) && b.at), prev = Math.max(0, ...list.filter(b => b.at && isEarned(b)).map(b => b.at));
    const p = nxt ? Math.min(1, (now - prev) / (nxt.at - prev)) : 1;
    const left = nxt ? nxt.at - now : 0;
    return `<div class="bcard paper rise"><div class="h">${ic(icon, 20)}<b>${title}</b><span>${right}</span></div>
    <div class="prog"><i data-w="${p * 100}"></i></div><div class="ascii" style="color:var(--body)">${nxt ? `${left} ${unit === 'day' ? (left > 1 ? 'days' : 'day') : 'more'} to ${nxt.name}` : 'All milestones reached'}</div>
    <div class="bgrid">${list.slice(0, 3).map(b => tile(b, b === nxt ? p : null)).join('')}</div>
    <div class="blist" style="margin-top:10px">${list.slice(3).map(b => `<button class="it ${isEarned(b) ? '' : 'lock'}" data-act="badge-detail" data-v="${b.key}" style="width:100%"><img src="assets/badges/${isEarned(b) ? '' : 'locked-'}${b.key}.webp" alt=""><b>${b.name}</b><span>${b.sub}</span><span style="margin-left:auto">${isEarned(b) ? tick(16) : ic('lock', 16, '#b9b4aa', 1.8)}</span></button>`).join('')}</div></div>`;
  };
  const tile = (b, p) => `<button class="btile ${isEarned(b) ? '' : 'lock'}" data-act="badge-detail" data-v="${b.key}"><span class="imgw"><img src="assets/badges/${isEarned(b) ? '' : 'locked-'}${b.key}.webp" alt="">
    ${p !== null && p !== undefined ? `<svg class="ringp" viewBox="0 0 88 88"><circle cx="44" cy="44" r="41" fill="none" stroke="#e4dfd4" stroke-width="4"/><circle cx="44" cy="44" r="41" fill="none" stroke="#d8bd5a" stroke-width="4" stroke-linecap="round" stroke-dasharray="${2 * Math.PI * 41 * p} 999" transform="rotate(-90 44 44)"/></svg>` : !isEarned(b) ? `<span class="lk">${ic('lock', 13, '#7d7972', 1.8)}</span>` : ''}</span>
    <b>${b.name}</b><small>${b.sub}</small></button>`;
  const arts = ALLB.filter(b => b.kind === 'article'), nArt = arts.filter(isEarned).length;
  return `${topbar('Badges', `${S.badges.length} of 13 earned`, 'to-passport')}
  ${card('Streak milestones', 'flame', `${S.streak} day streak`, BK('streak'), S.streak, 'day')}
  ${card('Quiz milestones', 'book', `${S.quizzesDone} quizzes done`, BK('quiz'), S.quizzesDone, 'quiz')}
  <div class="bcard paper rise"><div class="h">${ic('spark', 20)}<b>Article badges</b><span>${nArt} of 3 earned</span></div>
    <div class="prog"><i data-w="${nArt / 3 * 100}"></i></div><div class="ascii" style="color:var(--body)">finish all 3 levels + Perspectives</div>
    <div class="bgrid">${arts.map(b => tile(b, null)).join('')}</div></div>
  <div class="pad" style="margin-bottom:20px"><div style="border:1.4px dashed var(--line);border-radius:14px;padding:13px 16px;display:flex;justify-content:space-between;color:var(--mute);font-weight:700;font-size:13.5px">Mini game milestones<span class="mono" style="font-size:11px">coming soon</span></div></div>`;
};
MOUNT.badges = el => setTimeout(() => el.querySelectorAll('.prog i').forEach(i => { i.style.width = i.dataset.w + '%'; }), 120);
function badgeDetail(key) {
  const b = ALLB.find(x => x.key === key), got = isEarned(b);
  let how = '';
  if (b.kind === 'streak') how = got ? `Earned with a ${b.at}-day streak.` : `Keep a ${b.at}-day streak. You're on ${S.streak}.`;
  else if (b.kind === 'quiz') how = b.at === null ? (got ? 'Full marks on a Dam hard sia quiz.' : 'Score 5/5 on any Dam hard sia quiz.') : got ? `Earned after ${b.at} quiz${b.at > 1 ? 'zes' : ''}.` : `Finish ${b.at} quizzes. You've done ${S.quizzesDone}. Every level you finish counts, retries too.`;
  else how = got ? `You finished every level and Perspectives in ${ART[b.art].name}.` : `Finish all 3 quiz levels and Perspectives in the ${ART[b.art].wingName}.`;
  openSheet(`<img src="assets/badges/${got ? '' : 'locked-'}${b.key}.webp" alt="" class="pop" style="width:180px;margin:0 auto">
    <h2 style="text-align:center;margin:10px 0 2px">${b.name}</h2><p style="text-align:center;color:var(--body);margin:0 0 6px;font-weight:600">${b.sub}</p>
    <p style="text-align:center;color:var(--body);line-height:1.45;margin:0 10px 18px">${KN.badgeBlurbs[b.key] && got ? KN.badgeBlurbs[b.key] + ' ' : ''}${how}</p>
    <button class="btn ink" data-act="close-sheet">${got ? 'Nice' : 'Got it'}</button>`);
}

// --- map with joystick
// --- museum map: drawn to fill the whole screen
let me = { fx: .5, fy: .62 };
let PLAN = {};
function mapLayout(W, H) {
  const m = 26, top = 26, bottom = H - 110, gap = 44, cw = (W - 2 * m - 2 * gap) / 3, rh = (bottom - top - 2 * gap) / 3;
  const cell = (c, r, hf = 1) => [m + c * (cw + gap), top + r * (rh + gap), cw, rh * hf];
  return { W, H, m, top, bottom, gap, cw, rh, rooms: {
    environment: cell(0, 0), singapore: cell(1, 0), tech: cell(2, 0),
    world: cell(0, 1), lobby: cell(1, 1), politics: cell(2, 1),
    culture: cell(0, 2), hall: cell(2, 2) } };
}
function mapSVG(L) {
  const { W, H } = L, wing = k => KN.wings.find(w => w.key === k);
  const room = (k, [x, y, w, h]) => {
    if (k === 'lobby') return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#f3e3a3" stroke="#1c1b19" stroke-width="3"/>
      <circle cx="${x + w / 2}" cy="${y + h / 2 - 26}" r="34" fill="#fff" stroke="#1c1b19" stroke-width="2.4"/><path d="M${x + w / 2 - 16} ${y + h / 2 - 22} l16 -12 l16 12 M${x + w / 2 - 12} ${y + h / 2 - 22} v14 h24 v-14" fill="none" stroke="#1c1b19" stroke-width="2.6" stroke-linejoin="round"/>
      <text x="${x + w / 2}" y="${y + h / 2 + 34}" text-anchor="middle" font-size="34" font-weight="800">Lobby</text><text x="${x + w / 2}" y="${y + h / 2 + 66}" text-anchor="middle" font-size="24" fill="#6f6a5f">Info desk</text></g>`;
    if (k === 'hall') return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1c1b19" stroke="#1c1b19" stroke-width="3"/>
      <rect x="${x + 10}" y="${y + 10}" width="${w - 20}" height="${h - 20}" rx="6" fill="none" stroke="#d8bd5a" stroke-width="2" stroke-dasharray="6 6"/>
      <g transform="translate(${x + w / 2} ${y + h / 2 - 34})"><path d="M-26 -30 h52 v22 a26 26 0 0 1 -52 0 Z" fill="#e7cf6a" stroke="#d8bd5a" stroke-width="2"/><path d="M-26 -22 h-14 a14 14 0 0 0 14 22 M26 -22 h14 a14 14 0 0 1 -14 22" fill="none" stroke="#e7cf6a" stroke-width="5"/><rect x="-6" y="18" width="12" height="12" fill="#e7cf6a"/><rect x="-20" y="30" width="40" height="9" rx="3" fill="#e7cf6a"/></g>
      <text x="${x + w / 2}" y="${y + h / 2 + 40}" text-anchor="middle" font-size="31" font-weight="800" fill="#fff">Hall of Fame</text><text x="${x + w / 2}" y="${y + h / 2 + 72}" text-anchor="middle" font-size="23" fill="#d8bd5a">Leaderboards</text></g>`;
    const wg = wing(k), open = !!ART[k], st = ART[k] ? actsDone(k) : (S.topic[k] ? 5 : 0);
    const n = 7, dots = Array.from({ length: n }, (_, i) => `<circle cx="${x + 26 + i * ((w - 52) / (n - 1))}" cy="${y + 24}" r="7" fill="${i < Math.round(st / 5 * n) ? wg.color : '#fff'}" stroke="${wg.color}" stroke-width="2.4"/>`).join('');
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${wg.tint}" stroke="${wg.color}" stroke-width="3.4"/>${dots}
      <text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" font-size="${wg.name.length > 12 ? 27 : 33}" font-weight="800" fill="#1c1b19">${esc(wg.name.replace('Singapore ', 'SG '))}</text>
      <text x="${x + w / 2}" y="${y + h / 2 + 38}" text-anchor="middle" font-size="22" fill="#5d5950">${open ? '7 stations' : 'On the wall'}</text>
      <path d="M${x + w / 2 - 40} ${y + h - 30} q40 -40 80 -10" fill="none" stroke="${wg.color}" stroke-width="2.2" stroke-dasharray="5 6" opacity=".6"/></g>`;
  };
  const cx = L.m + L.cw + L.gap / 2, cx2 = L.m + 2 * L.cw + 1.5 * L.gap, ry1 = L.top + L.rh + L.gap / 2, ry2 = L.top + 2 * L.rh + 1.5 * L.gap;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" font-family="Inter, sans-serif" preserveAspectRatio="none">
    <defs><pattern id="mg" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0 H0 V40" fill="none" stroke="#ebe3cf" stroke-width="1.5"/></pattern></defs>
    <rect width="${W}" height="${H}" fill="#f8f3e6"/><rect width="${W}" height="${H}" fill="url(#mg)"/>
    <rect x="${L.m - 12}" y="${L.top - 12}" width="${W - 2 * L.m + 24}" height="${L.bottom - L.top + 24}" rx="16" fill="#ece4cf" stroke="#1c1b19" stroke-width="5"/>
    <g stroke="#d4c8a8" stroke-width="2.4" stroke-dasharray="6 7" fill="none"><path d="M${cx} ${L.top} V${L.bottom}"/><path d="M${cx2} ${L.top} V${L.bottom}"/><path d="M${L.m} ${ry1} H${W - L.m}"/><path d="M${L.m} ${ry2} H${W - L.m}"/></g>
    ${Object.entries(L.rooms).map(([k, r]) => room(k, r)).join('')}
    <g transform="translate(${W / 2} ${L.top + 2 * (L.rh + L.gap) + L.rh / 2})"><text text-anchor="middle" font-size="24" fill="#a39678" font-family="JetBrains Mono, monospace">*. corridor .*</text></g>
    <rect x="${W / 2 - 70}" y="${L.bottom + 4}" width="140" height="14" fill="#f8f3e6"/>
    <g font-family="JetBrains Mono, monospace" font-size="22" fill="#1c1b19" font-weight="700">
      <path d="M${W / 2} ${L.bottom + 60} V${L.bottom + 26} m-12 12 l12 -12 l12 12" stroke="#1c1b19" stroke-width="3" fill="none"/><text x="${W / 2}" y="${L.bottom + 92}" text-anchor="middle">ENTRANCE</text>
      <path d="M${L.m} ${L.bottom + 56} h120" stroke="#1c1b19" stroke-width="6"/><path d="M${L.m + 60} ${L.bottom + 56} h60" stroke="#f8f3e6" stroke-width="3"/><text x="${L.m}" y="${L.bottom + 44}">0</text><text x="${L.m + 100}" y="${L.bottom + 44}">15 m</text><text x="${L.m}" y="${L.bottom + 88}" fill="#8a7a52">LEVEL 1</text>
      <circle cx="${W - L.m - 30}" cy="${L.bottom + 58}" r="28" fill="#fff" stroke="#1c1b19" stroke-width="2.4"/><path d="M${W - L.m - 30} ${L.bottom + 36} l8 22 h-16 Z" fill="#d6544b"/><path d="M${W - L.m - 30} ${L.bottom + 80} l8 -22 h-16 Z" fill="#1c1b19"/><text x="${W - L.m - 30}" y="${L.bottom + 28}" text-anchor="middle" font-size="18">N</text></g></svg>`;
}
SCREENS.map = () => `<div class="mapv"><div class="maphead"><div style="flex:1"><h1 class="h1">Museum map</h1><p>Hold your character and drag it into a room.</p></div>
    <button class="round white helpbtn static" data-act="drag-help" data-v="map" aria-label="How to move">?</button></div>
  <div class="mapwrap full" id="mapwrap"><div id="mapsvg" class="mapsvg"></div><div id="roomhits"></div>
    <span class="me grab" id="me" role="img" aria-label="You. Hold and drag to move"><img src="${avatarSrc(null, true)}" alt="" draggable="false"></span>
    ${coach('map', 'Hold your character and drag it into a room')}</div>
  <div class="enterbar float" id="enterbar"></div></div>`;
MOUNT.map = el => {
  const wrap = el.querySelector('#mapwrap'), meEl = el.querySelector('#me'), bar = el.querySelector('#enterbar');
  const W = 1000, H = Math.round(1000 * wrap.clientHeight / Math.max(1, wrap.clientWidth));
  const L = mapLayout(W, H); PLAN = L.rooms;
  el.querySelector('#mapsvg').innerHTML = mapSVG(L);
  el.querySelector('#roomhits').innerHTML = Object.entries(PLAN).map(([k, [u, v, w, h]]) => `<span class="roomhit" data-room="${k}" style="left:${u / W * 100}%;top:${v / H * 100}%;width:${w / W * 100}%;height:${h / H * 100}%"></span>`).join('');
  let near = null;
  const place = () => { meEl.style.left = me.fx * 100 + '%'; meEl.style.top = me.fy * 100 + '%'; placeCoach(wrap, 'map', meEl); };
  const clampMe = () => { me.fx = Math.max(.04, Math.min(.96, me.fx)); me.fy = Math.max(.07, Math.min(.97, me.fy)); };
  const inRoom = () => Object.entries(PLAN).find(([, [u, v, w, h]]) => me.fx * W > u && me.fx * W < u + w && me.fy * H > v && me.fy * H < v + h);
  const label = k => k === 'lobby' ? 'Go to the Lobby' : k === 'hall' ? 'Enter the Hall of Fame' : `Enter the ${KN.wings.find(w => w.key === k).name} Wing`;
  const update = () => {
    const r = inRoom(), k = r && r[0];
    if (k === near) return; near = k;
    el.querySelectorAll('.roomhit').forEach(h => h.classList.toggle('near', h.dataset.room === k));
    bar.innerHTML = k ? `<button class="btn acc pop" data-act="map-enter" data-v="${k}">${label(k)}</button>` : '';
  };
  dragChar(meEl, wrap, {
    onMove: (fx, fy) => { meEl.style.transition = 'none'; me.fx = fx; me.fy = fy; clampMe(); place(); update(); },
    onDrop: () => { meEl.style.transition = ''; tipDone('map'); },
    onTap: () => toast(`${HAND.replace('width="22" height="22"', 'width="18" height="18"')} Hold me, then drag me into a room`),
  });
  wrap.addEventListener('click', e => { if (e.target.closest('.me, .coach')) return; const r = wrap.getBoundingClientRect(); me.fx = (e.clientX - r.left) / r.width; me.fy = (e.clientY - r.top) / r.height; clampMe(); place(); update(); });
  document.onkeydown = e => { if (currentName !== 'map') return; const m = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[e.key]; if (m) { e.preventDefault(); me.fx += m[0] * .03; me.fy += m[1] * .02; clampMe(); place(); update(); } };
  place(); update();
};

// --- hall of fame (demo leaderboard)
const HALL = [['newsy.nadia', 84, 41, 9], ['quizwiz.kai', 81, 30, 9], ['headline.hana', 76, 26, 8], ['zi.reads', 70, 19, 8], ['arjun.asks', 66, 22, 7], ['f1.fan.ella', 61, 14, 7],
  ['siti.scoops', 55, 12, 6], ['byte.size.ben', 49, 9, 6], ['priya.press', 42, 8, 5], ['ray.reports', 36, 6, 4], ['mei.reads.ai', 30, 5, 4], ['ethan.explains', 22, 3, 3], ['leo.ledger', 15, 2, 2], ['dan.deepdive', 8, 1, 1]];
const HALL_TABS = [['Quiz points', 1, 'pts'], ['Streak', 2, 'days'], ['Stamps', 3, 'stamps']];
let hallTab = 0;
const seedLook = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; const r = n => { h = (Math.imul(h, 1103515245) + 12345) >>> 0; return (h >>> 16) % n; };
  const girl = !!r(2), g = girl ? 'g' : 'b'; return { girl, hair: HAIR[g][r(6)], hairCol: HAIR_COL[r(6)], outfit: OUTFITS[g][r(6)][0], outfitCol: CLOTH_COL[r(6)], acc: r(3) ? [ACCS[r(6)][0]] : [] }; };
SCREENS.hall = () => {
  const [tn, ci, unit] = HALL_TABS[hallTab];
  const mine = [points(), S.streak, stampCount()][ci - 1];
  const all = [...HALL.map(r => ({ h: r[0], v: r[ci], look: seedLook(r[0]) })), { h: S.user.handle, v: mine, me: true, look: curLook() }].sort((a, b) => b.v - a.v || (a.me ? 1 : -1));
  const myRank = all.findIndex(x => x.me) + 1, top = all.slice(0, 3), rest = all.slice(3, 12);
  const av = (x, big) => `<span class="hav ${big ? 'big' : ''}"><img src="${KNAvatar.uri(x.look)}" alt=""></span>`;
  const pod = [top[1], top[0], top[2]];
  return `${topbar('Hall of Fame', 'Leaderboards · demo players', 'to-map')}
  <div class="hall">
    <div class="seg3" role="tablist">${HALL_TABS.map(([n], i) => `<button class="${i === hallTab ? 'on' : ''}" data-act="hall-tab" data-v="${i}" role="tab" aria-selected="${i === hallTab}">${n}</button>`).join('')}</div>
    <div class="podium">${pod.map((x, i) => { const place = [2, 1, 3][i]; return `<div class="pcol p${place} ${x.me ? 'mine' : ''}" style="animation-delay:${[.15, 0, .3][i]}s">${place === 1 ? '<span class="crown">♛</span>' : ''}${av(x, place === 1)}<b>@${esc(x.h)}</b><span class="val">${x.v} ${unit}</span><div class="step"><em>${place}</em></div></div>`; }).join('')}</div>
    <div class="hlist stagger">${rest.map((x, i) => `<div class="hrow ${x.me ? 'mine' : ''}"><span class="rk">${i + 4}</span>${av(x)}<b>@${esc(x.h)}${x.me ? ' <small>(you)</small>' : ''}</b><span class="val">${x.v}<small> ${unit}</small></span></div>`).join('')}</div>
    ${myRank > 12 ? `<div class="hrow mine pinned"><span class="rk">${myRank}</span>${av(all[myRank - 1])}<b>@${esc(S.user.handle)} <small>(you)</small></b><span class="val">${mine}<small> ${unit}</small></span></div>` : ''}
    <div class="hnote">${ic('spark', 16, '#d8bd5a', 2)} <span>${myRank <= 3 ? `You're on the podium! Keep it up.` : `You're #${myRank} for ${tn.toLowerCase()}. ${ci === 1 ? 'Finish more quiz levels to climb.' : ci === 2 ? 'Come back tomorrow to grow your streak.' : 'Every quiz level you finish stamps your passport.'}`}</span></div>
    <p class="ascii" style="text-align:center;margin:14px 0 30px">*. demo leaderboard · other players are made up for the prototype .*</p>
  </div>`;
};

// --- profile
SCREENS.profile = () => `<div class="prof"><div class="bigav pop"><img src="${avatarSrc()}" alt="Your avatar"></div><h2 style="margin:0">@${esc(S.user.handle)}</h2>
  <p style="color:var(--mute);margin:4px 0 0">${esc(S.user.email || 'Signed in with Google')}</p>${curLook().acc.length ? `<p style="margin:8px 0 0"><span class="chip">${ic('spark', 14)} Wearing: ${curLook().acc.map(a => [...ACCS, ...SECRETS.map(s => [s.key, s.name]), ...EARNED.map(e => [e.key, e.name])].find(x => (x[0] || x.key) === a)?.[1] || a).join(', ')}</span></p>` : ''}</div>
  <div class="statgrid stagger"><div><b>${points()}</b><span>quiz points</span></div><div><b>${S.streak}</b><span>day streak</span></div><div><b>${stampCount()}</b><span>stamps</span></div><div><b>${S.badges.length}</b><span>badges</span></div></div>
  <div class="menu rise"><button data-act="edit-look">${ic('pencil', 18)} Edit my look<small>›</small></button>
    <button data-act="next-day">${ic('flame', 18)} Simulate tomorrow<small>+1 streak day</small></button>
    <button data-act="week">${ic('flame', 18)} Simulate a week<small>+7 days</small></button>
    <button data-act="logout">${ic('user', 18)} Log out<small>›</small></button>
    <button class="danger" data-act="reset">${ic('close', 18)} Reset my progress</button></div>
  <p class="ascii" style="text-align:center;margin:18px 0 10px">*.  demo build · progress saves on this browser only  .*</p>`;

// ------------------------------------------------------------------ actions
const ACT = {
  google: () => { pending.email = ''; go('username'); },
  'handle-ok': () => { pending.handle = current.querySelector('#handle').value.trim().toLowerCase();
    if (S.user && S.loggedOut) {
      if (pending.handle === S.user.handle) { S.loggedOut = false; save(); go('lobby', {}, 'fade'); toast(`${tick(18, '#e7cf6a', 3)} Welcome back, @${esc(S.user.handle)}`); return; }
      S = fresh(); save();
    }
    go('welcome'); },
  'to-look': () => { lookDraft = null; lookTab = 'Hair'; go('look'); },
  girl: el => { const girl = el.dataset.v === '1'; if (girl === lookDraft.girl) return; lookDraft.girl = girl; lookDraft.hair = girl ? 'buns' : 'curly';
    if (!OUTFITS[girl ? 'g' : 'b'].some(o => o[0] === lookDraft.outfit)) lookDraft.outfit = 'hoodie'; rerenderLook(); },
  hair: el => { lookDraft.hair = el.dataset.v; rerenderLook(); },
  haircol: el => { lookDraft.hairCol = el.dataset.v; rerenderLook(); },
  outfit: el => { lookDraft.outfit = el.dataset.v; rerenderLook(); },
  clothcol: el => { lookDraft.outfitCol = el.dataset.v; rerenderLook(); },
  acc: el => { toggleAcc(el.dataset.v); rerenderLook(); },
  'secret-locked': el => { const s = SECRETS.find(x => x.key === el.dataset.v); toast(`${ic('lock', 16, '#fff')} ${s.mystery ? 'A mystery item.' : s.name + ':'} ${s.how} to unlock.`); },
  'earned-locked': el => { const e = EARNED.find(x => x.key === el.dataset.v); toast(`${ic('lock', 16, '#fff')} ${e.name}: ${e.how} to unlock.`); },
  'look-tab': el => { lookTab = el.dataset.v; rerenderLook(false); },
  'look-shuffle': () => { const g = lookDraft.girl ? 'g' : 'b', pick = a => a[Math.floor(Math.random() * a.length)];
    Object.assign(lookDraft, { hair: pick(HAIR[g]), hairCol: pick(HAIR_COL), outfit: pick(OUTFITS[g])[0], outfitCol: pick(CLOTH_COL), acc: Math.random() < .7 ? [pick(ACCS)[0]] : [] }); rerenderLook(); },
  'look-palette': () => { if (lookTab === 'Hair') lookDraft.hairCol = HAIR_COL[(HAIR_COL.indexOf(lookDraft.hairCol) + 1) % HAIR_COL.length];
    else lookDraft.outfitCol = CLOTH_COL[(CLOTH_COL.indexOf(lookDraft.outfitCol) + 1) % CLOTH_COL.length]; rerenderLook(); },
  'back-look': () => { lookDraft = null; go('profile', {}, 'back'); },
  'look-save': () => {
    const first = !S.user;
    if (first) { S.user = { email: pending.email, handle: pending.handle || 'visitor', since: today() }; }
    S.user.look = lookDraft; S.user.girl = lookDraft.girl; lookDraft = null; save();
    if (first) { go('lobby', {}, 'fade'); const nb = checkBadges(); if (nb.length) setTimeout(() => showBadges(nb), 700); }
    else { go('profile', {}, 'back'); toast(`${tick(18, '#e7cf6a', 3)} Look saved`); }
  },
  'enter-wing': el => { const k = el.dataset.v, L = W_.lobby, d = L.doors.find(x => x.key === k);
    if (currentName !== 'lobby') { go('room', { k }); return; }
    current.querySelectorAll('.door').forEach(b => b.classList.toggle('picked', b.dataset.v === k));
    if (wingsOpen && el.closest('.wingdrawer')) { wingsOpen = false; current.querySelector('#wingdrawer').classList.remove('open'); }
    walkTo('walker', d.x, d.y, 390, 300, () => { lobbyMe = [6.3, 6.3]; go('room', { k }); }); },
  'toggle-wings': () => { wingsOpen = !wingsOpen; const d = current.querySelector('#wingdrawer'); d.classList.toggle('open', wingsOpen); d.querySelector('.wdh').setAttribute('aria-expanded', wingsOpen); },
  'coach-x': el => tipDone(el.dataset.v),
  'drag-help': el => { const k = el.dataset.v; S.tips[k] = false; save(); go(k, {}, 'none'); },
  'room-wall': el => { const k = el.dataset.v, st = W_.rooms[k][String(ART[k] ? furnLevel(k) : 0)];
    walkTo('rwalker', st.wall[0] - 6, st.wall[1] + 44, 390, 330, () => go('wall', { k })); },
  'hide-tip': el => { S.tipHidden[el.dataset.v] = true; save(); const t = current.querySelector('.tipcard'); if (t) { t.style.animation = 'fadeOut .25s both'; setTimeout(() => t.remove(), 250); } },
  'topic-ans': el => { const k = el.dataset.k, i = +el.dataset.v, R = W_.rooms[k], ok = i === R.quiz[2];
    const box = device.querySelector('#topts'); box.classList.add('locked');
    [...box.children].forEach((b, j) => { if (j === R.quiz[2]) { b.classList.add('right'); b.querySelector('.mark').innerHTML = tick(24); } else if (j === i) { b.classList.add('wrong'); b.querySelector('.mark').innerHTML = cross(22); } else b.classList.add('dim'); });
    const first = !S.topic[k]; S.topic[k] = { ok }; if (first) S.quizzesDone++; const nb = checkBadges(); save();
    device.querySelector('#tfeed').innerHTML = `<div class="rise" style="margin-top:16px"><b style="font-size:20px;color:${ok ? 'var(--green-d)' : 'var(--red)'}">${ok ? 'Correct!' : 'Not quite.'}</b>
      <p style="color:var(--body);margin:6px 0 14px">${first ? 'That counts as a quiz toward your badges. ' : ''}Read the full article from the plaque on the wall.</p>
      <button class="btn ink" data-act="topic-done" data-v="${k}" data-nb="${nb.map(b => b.key).join(',')}">Done</button></div>`; },
  'topic-open': el => topicQuiz(el.dataset.v),
  'mini-open': el => go('mini', { k: el.dataset.v, g: el.dataset.g }),
  'mini-close': el => go('room', { k: el.dataset.v }, 'back'),
  vetting: () => openSheet(vetSheet()),
  'topic-done': el => { const nb = (el.dataset.nb || '').split(',').filter(Boolean).map(k => ALLB.find(b => b.key === k)); closeSheet();
    if (currentName === 'wall') { const i = current.querySelector('#wallinfo'); if (i) i.innerHTML = wallInfo(el.dataset.v, 0); } else go('room', { k: el.dataset.v }, 'none'); if (nb.length) setTimeout(() => showBadges(nb), 350); },
  'to-room': el => go('room', { k: el.dataset.v }, 'back'),
  'locked-wing': el => toast(`${ic('lock', 16, '#fff')} The ${el.dataset.v} Wing opens soon.`),
  'to-lobby': () => go('lobby', {}, 'back'),
  'tip-x': () => { S.seenTip = true; save(); const t = current.querySelector('#newtip'); t && (t.style.animation = 'fadeOut .25s both', setTimeout(() => t.remove(), 250)); },
  'map-enter': el => { const k = el.dataset.v; if (k === 'lobby') go('lobby', {}, 'fade'); else if (k === 'hall') go('hall'); else go('room', { k }); },
  'to-map': () => go('map', {}, 'back'),
  'hall-tab': el => { hallTab = +el.dataset.v; const sc = current.scrollTop; current.innerHTML = SCREENS.hall(); current.scrollTop = sc; },
  'to-hall': () => go('hall'),
  'wall-go': el => { const tr = current.querySelector('#wtrack'); if (!tr) return; const w = tr.children[0].offsetWidth + 16; const n = Math.max(0, Math.min(tr.children.length - 1, wallIdx + +el.dataset.v)); tr.scrollTo({ left: n * w, behavior: 'smooth' }); },
  'wall-soon': el => el.dataset.v === 'this' ? toast(`${ic('lock', 16, '#fff')} Step into the story, Perspectives and Quiz for this article land soon.`) : toast(`${ic('lock', 16, '#fff')} This frame opens when its story lands. It's a placeholder for the demo.`),
  'read-article': el => { const u = el.dataset.url; if (u) window.open(u, '_blank', 'noopener'); else toast(`${ic('book', 16, '#fff')} This would open the Straits Times article.`); },
  story: el => { S.seenTip = true; save(); go('story', { k: el.dataset.v }, 'up'); },
  'story-close': () => go('wall', { k: curK() }, 'fade'),
  persp: el => { S.seenTip = true; save(); go('persp', { k: el.dataset.v }); },
  'persp-next': () => perspNext(),
  'persp-back': () => go('wall', { k: thread.k }, 'back'),
  'persp-done': () => {
    const k = thread.k, first = !S.arts[k].persp; S.arts[k].persp = true; save();
    const bonus = checkBonus(k);
    if (bonus) go('bonus', { k }, 'fade');
    else { go('wall', { k }, 'back'); if (first) setTimeout(() => toast(`${tick(18, '#e7cf6a', 3)} Perspectives done. Ticked on the wall.`), 450); }
  },
  levels: el => { S.seenTip = true; save(); levelSheet(el.dataset.v); },
  'close-sheet': () => closeSheet(),
  'start-quiz': el => { Q = { k: el.dataset.k, lv: el.dataset.v, i: 0, marks: [], pts: 0 }; go('question', {}, 'up'); },
  answer: el => answer(+el.dataset.v),
  'next-q': () => { if (Q.i < 4) { Q.i++; go('question', {}, 'fwd'); } else { recordQuiz(); go('results', {}, 'fade'); } },
  'quit-quiz': () => openSheet(`<h2 style="margin:6px 0 4px">Leave this quiz?</h2><p style="color:var(--body);margin:0 0 18px">Your answers so far won't be saved.</p>
    <div style="display:grid;gap:10px"><button class="btn ink" data-act="quit-yes">Leave quiz</button><button class="btn line" data-act="close-sheet">Keep playing</button></div>`),
  'quit-yes': () => go('wall', { k: Q.k }, 'back'),
  retry: () => { Q = { k: Q.k, lv: Q.lv, i: 0, marks: [], pts: 0 }; go('question', {}, 'fade'); },
  'see-rewards': () => go('rewards', {}, 'up'),
  'to-wall-q': () => go('wall', { k: Q.k }, 'back'),
  'rewards-done': () => {
    const nb = Q.newBadges || [], k = Q.k;
    newStamp = Q.firstStamp ? k + Q.lv : null;
    const next = () => Q.bonusNew ? go('bonus', { k }, 'fade') : go('wall', { k }, 'back');
    nb.length ? showBadges(nb, next) : next();
  },
  'to-wall': el => go('wall', { k: el.dataset.v }, 'back'),
  wear: el => { const key = BONUS_ACC[el.dataset.v]; lookDraft = JSON.parse(JSON.stringify(curLook())); if (!lookDraft.acc.includes(key)) toggleAcc(key); S.user.look = lookDraft; lookDraft = null; save();
    el.textContent = 'Wearing'; const im = current.querySelector('#bonusav'); if (im) { im.src = avatarSrc(); im.classList.add('bump'); } toast(`${tick(18, '#e7cf6a', 3)} ${el.dataset.v} is on your look.`); },
  'badge-next': () => nextBadge(),
  'badge-profile': () => { badgeQueue = []; afterBadges = null; device.querySelectorAll('.night').forEach(n => n.remove()); setStatus(false); go('badges', {}, 'fade'); },
  'to-stamps': () => { const w = OPEN.find(k => Object.keys(S.arts[k].stamps).length); stampWing = w || 'singapore'; go('stamps'); },
  'to-badges': () => go('badges'),
  'to-passport': () => go('passport', {}, 'back'),
  'stamp-wing': el => { stampWing = el.dataset.v; go('stamps', {}, 'none'); },
  'stamp-detail': el => stampDetail(el.dataset.v),
  'retry-from-stamp': el => { Q = { k: el.dataset.k, lv: el.dataset.v, i: 0, marks: [], pts: 0 }; go('question', {}, 'up'); },
  'badge-detail': el => badgeDetail(el.dataset.v),
  'edit-look': () => { lookDraft = null; lookTab = 'Hair'; go('look', { edit: true }); },
  'next-day': () => addDays(1), week: () => addDays(7),
  reset: () => openSheet(`<h2 style="margin:6px 0 4px">Reset everything?</h2><p style="color:var(--body);margin:0 0 18px">This clears your look, stamps, badges and scores on this browser.</p>
    <div style="display:grid;gap:10px"><button class="btn ink" style="background:var(--red)" data-act="reset-yes">Reset progress</button><button class="btn line" data-act="close-sheet">Cancel</button></div>`),
  'reset-yes': () => { S = fresh(); save(); go('signin', {}, 'fade'); },
  'continue-back': () => { go('lobby', {}, 'fade'); const nb = checkBadges(); if (nb.length) setTimeout(() => showBadges(nb), 700); },
  logout: () => openSheet(`<h2 style="margin:6px 0 4px">Log out?</h2><p style="color:var(--body);margin:0 0 18px">Your progress stays saved on this device. Sign in again with <b>@${esc(S.user.handle)}</b> to pick up where you left off. A different username starts a fresh museum visit.</p>
    <div style="display:grid;gap:10px"><button class="btn ink" data-act="logout-yes">Log out</button><button class="btn line" data-act="close-sheet">Cancel</button></div>`),
  'logout-yes': () => { S.loggedOut = true; save(); closeSheet(); go('signin', {}, 'fade'); },
};
function addDays(n) { S.streak += n; save(); const nb = checkBadges(); go('profile', {}, 'none'); toast(`${ic('flame', 16, '#e7cf6a', 2)} ${S.streak}-day streak`); if (nb.length) setTimeout(() => showBadges(nb, () => go('profile', {}, 'none')), 500); }
let storyK = 'singapore';
function curK() { return storyK; }

device.addEventListener('click', e => {
  const t = e.target.closest('[data-act],[data-tab]');
  if (!t || !device.contains(t)) return;
  if (t.dataset.tab) { const to = t.dataset.tab; if (to !== currentName) go(to, {}, 'fade'); return; }
  const f = ACT[t.dataset.act]; if (f) { e.preventDefault(); f(t); }
});

// ------------------------------------------------------------------ boot
go(S.user && !S.loggedOut ? 'back' : 'signin', {}, 'fade');
})();
