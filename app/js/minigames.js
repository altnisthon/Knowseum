/* Knowseum · mini game engine. Two games per wing, content in js/minigames-data.js.
   Fact or Cap (every wing) · GeoGuessr (World) · Wikirace (Singapore, Culture)
   Guess Who (SG Politics) · Hole-some Recycling (Environment) · Real or Fake? (Tech) */
(function () {
  const D = () => window.KN_MINI;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const tick = (s = 16, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13 L9.5 18 L20 6"/></svg>`;
  const cross = (s = 16, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>`;

  const GAMES = {
    singapore: ['factcap', 'wiki'], politics: ['factcap', 'guesswho'], tech: ['factcap', 'realfake'],
    world: ['factcap', 'geo'], culture: ['factcap', 'wiki'], environment: ['factcap', 'hole'],
  };
  const META = {
    factcap: { name: 'Fact or Cap', sub: 'Swipe right for Fact, left for Cap', how: 'Swipe right if it’s true, left if it’s cap. Every card flips to show the real deal.', ico: 'swipe' },
    geo: { name: 'GeoGuessr', sub: 'Read the clue, drop a pin', how: 'Read the clue, then tap the map where you think it is. The closer your pin, the more points, plus a fun fact about the place.', ico: 'globe' },
    wiki: { name: 'Wikirace', sub: 'Click links to reach the target page', how: 'Start on one page and reach the target page using only the blue links. Fewest clicks wins.', ico: 'race' },
    guesswho: { name: 'Guess Who', sub: '5 cards, 5 facts, 1 MP', how: 'Five MPs, one answer. Facts drip in one by one: flip down anyone they rule out, then make your guess. The fewer facts you need, the more points. 4 rounds, 2 PAP and 2 WP answers.', ico: 'who' },
    hole: { name: 'Hole-some Recycling', sub: 'Swallow the recyclables', how: 'Drag your hole around the floor. Recyclables make it grow, trash shrinks it. Each wave adds a stricter rule, and empty bottles earn 10¢ to spend on perks.', ico: 'leaf' },
    realfake: { name: 'Real or Fake?', sub: 'Spot AI images and fake news', how: 'Real photo or AI? Real headline or fake news? Three rounds, each one harder. Get one wrong and you get a tip for next time.', ico: 'eye' },
  };
  const ICO = {
    swipe: '<path d="M7 4 h10 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2 Z M9 11 l2 2 l4 -4"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12 h17 M12 3.5 c3 3 3 14 0 17 M12 3.5 c-3 3 -3 14 0 17"/>',
    link: '<path d="M10 14 a4 4 0 0 0 5.6 0 l3 -3 a4 4 0 0 0 -5.6 -5.6 l-1 1 M14 10 a4 4 0 0 0 -5.6 0 l-3 3 a4 4 0 0 0 5.6 5.6 l1 -1"/>',
    race: '<path d="M5 21 V4 M5 4 h12 l-2 4 l2 4 h-12"/>',
    who: '<circle cx="12" cy="8" r="4"/><path d="M4 21 c1 -5 15 -5 16 0"/><path d="M15.5 4.5 l2 -2"/>',
    eye: '<path d="M2.5 12 C5 7 8.5 5 12 5 C15.5 5 19 7 21.5 12 C19 17 15.5 19 12 19 C8.5 19 5 17 2.5 12 Z"/><circle cx="12" cy="12" r="3.2"/>',
    leaf: '<path d="M5 19 C5 9 12 4 20 4 C20 12 15 19 5 19 Z M5 19 L13 11"/>',
  };
  const icon = (n, s = 22, c = 'currentColor') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${ICO[n]}</svg>`;

  let st = null; // { k, g, el, hooks, ... }
  const badge = () => `<button class="vbadge" data-mx="vet"><i></i>${esc(D().vetting.badge)}</button>`;

  // ------------------------------------------------------------ shell
  function shell(body, prog) {
    const m = META[st.g];
    return `<div class="mg" style="--c:${st.color};--t:${st.tint}">
      <div class="mg-top"><button class="round" data-act="mini-close" data-v="${st.k}" aria-label="Close">${cross(18, '#1c1b19')}</button>
        <div class="ttl"><b>${m.name}</b><span>${esc(st.wing)}</span></div><span class="mg-prog">${prog || ''}</span></div>
      <div class="mg-body" id="mgbody">${body}</div></div>`;
  }
  function intro() {
    const m = META[st.g];
    return shell(`<div class="mg-intro rise"><span class="mg-ico">${icon(m.ico, 34)}</span><h1>${m.name}</h1><p>${m.how}</p>
      ${badge()}
      <button class="btn acc" data-mx="start">Play</button>
      <button class="mg-link" data-mx="vet">How is this checked before it goes live?</button></div>`);
  }
  function result(score, total, extra = '') {
    st.hooks.done(score, total);
    const pct = total ? score / total : 1;
    const msg = pct === 1 ? 'Perfect run!' : pct >= .6 ? 'Nice work!' : 'Good try. Run it back?';
    return `<div class="mg-result rise"><span class="mg-ico big">${icon(META[st.g].ico, 40)}</span><div class="score"><b>${score}</b><span>/ ${total}</span></div>
      <h2>${msg}</h2>${extra}${badge()}
      <button class="btn acc" data-mx="restart">Play again</button><button class="btn line" data-act="mini-close" data-v="${st.k}">Back to the room</button></div>`;
  }
  const body = () => st.el.querySelector('#mgbody');
  const setProg = t => { const p = st.el.querySelector('.mg-prog'); if (p) p.textContent = t; };

  // ------------------------------------------------------------ Fact or Cap
  const FC = {
    start() { st.cards = shuffle(D().factcap[st.k]); st.i = 0; st.score = 0; FC.draw(); },
    draw() {
      if (st.i >= st.cards.length) { body().innerHTML = result(st.score, st.cards.length); return; }
      const [claim] = st.cards[st.i];
      setProg(`${st.i + 1}/${st.cards.length}`);
      body().innerHTML = `<div class="fc">
        <div class="fc-stack">${st.i + 1 < st.cards.length ? '<div class="fc-card ghost"></div>' : ''}
          <div class="fc-card" id="fccard"><span class="lab cap">CAP</span><span class="lab fact">FACT</span>
            <div class="front"><span class="k">${esc(st.wing)} · card ${st.i + 1}</span><p>${esc(claim)}</p>${badge()}</div></div></div>
        <div class="fc-btns"><button class="fcb cap" data-mx="fc" data-v="0">${cross(22, '#d6544b')}<span>Cap</span></button><button class="fcb fact" data-mx="fc" data-v="1">${tick(22, '#2e9a58')}<span>Fact</span></button></div>
        <p class="mg-hint">Swipe the card, or tap a button</p></div>`;
      FC.drag(body().querySelector('#fccard'));
    },
    drag(card) {
      let x0 = null, dx = 0;
      card.addEventListener('pointerdown', e => { if (e.target.closest('.vbadge')) return; x0 = e.clientX; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
      card.addEventListener('pointermove', e => { if (x0 === null) return; dx = e.clientX - x0; card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; card.style.setProperty('--f', Math.max(0, dx / 90)); card.style.setProperty('--c2', Math.max(0, -dx / 90)); });
      const up = () => { if (x0 === null) return; x0 = null; card.style.transition = '';
        if (Math.abs(dx) > 80) FC.answer(dx > 0 ? 1 : 0); else { card.style.transform = ''; card.style.setProperty('--f', 0); card.style.setProperty('--c2', 0); } dx = 0; };
      card.addEventListener('pointerup', up); card.addEventListener('pointercancel', up);
    },
    answer(v) {
      const [claim, truth, why] = st.cards[st.i], ok = (v === 1) === truth;
      if (ok) st.score++;
      const card = body().querySelector('#fccard');
      card.classList.add('fly', v ? 'r' : 'l');
      setTimeout(() => {
        body().innerHTML = `<div class="fc"><div class="fc-stack"><div class="fc-card back ${ok ? 'ok' : 'no'}">
          <span class="verdict">${ok ? tick(18) : cross(18)} ${ok ? 'You got it' : 'Not quite'}</span>
          <span class="truth ${truth ? 'fact' : 'cap'}">${truth ? 'FACT' : 'CAP'}</span>
          <p class="claim">${esc(claim)}</p><p class="why">${esc(why)}</p>${badge()}</div></div>
          <button class="btn ink" data-mx="fc-next">${st.i + 1 < st.cards.length ? 'Next card' : 'See my score'}</button></div>`;
      }, 260);
    },
  };

  // ------------------------------------------------------------ GeoGuessr
  const hav = (a, b) => { const R = 6371, r = x => x * Math.PI / 180, dLa = r(b.lat - a.lat), dLo = r(b.lon - a.lon);
    const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(h)); };
  const GEO = {
    start() { st.rounds = shuffle(D().geo).slice(0, 5); st.i = 0; st.score = 0; GEO.draw(); },
    draw() {
      if (st.i >= st.rounds.length) { body().innerHTML = result(Math.round(st.score / 100), st.rounds.length * 10, `<p class="mg-sub">${st.score.toLocaleString()} of ${(st.rounds.length * 1000).toLocaleString()} points</p>`); return; }
      const r = st.rounds[st.i]; st.pin = null;
      setProg(`${st.i + 1}/${st.rounds.length}`);
      body().innerHTML = `<div class="geo"><div class="geo-clue"><span class="k">Clue ${st.i + 1}</span><p>${esc(r.clue)}</p>${badge()}</div>
        <div class="geo-map" id="geomap"><div class="geo-inner" id="geoinner"><img src="assets/worldmap.svg" alt="World map" draggable="false"><span class="pin me hide" id="pinme"></span><span class="pin real hide" id="pinreal"></span><svg class="geo-line hide" id="geoline" viewBox="0 0 1000 500" preserveAspectRatio="none"><line id="gl" stroke="#1c1b19" stroke-width="2" stroke-dasharray="6 5"/></svg></div></div>
        <p class="mg-hint" id="geohint">Tap the map to drop your pin. Scroll sideways to see more.</p>
        <button class="btn acc" data-mx="geo-lock" id="geolock" disabled>Lock in my guess</button></div>`;
      const map = body().querySelector('#geomap'), inner = body().querySelector('#geoinner');
      requestAnimationFrame(() => { map.scrollLeft = (inner.offsetWidth - map.clientWidth) * .5; });
      inner.addEventListener('click', e => {
        if (st.locked) return;
        const b = inner.getBoundingClientRect(), fx = (e.clientX - b.left) / b.width, fy = (e.clientY - b.top) / b.height;
        st.pin = { lon: fx * 360 - 180, lat: 90 - fy * 180 };
        const p = body().querySelector('#pinme'); p.classList.remove('hide'); p.style.left = fx * 100 + '%'; p.style.top = fy * 100 + '%';
        body().querySelector('#geolock').disabled = false;
      });
      st.locked = false;
    },
    lock() {
      if (!st.pin || st.locked) return; st.locked = true;
      const r = st.rounds[st.i], d = hav(st.pin, r), pts = Math.round(1000 * Math.exp(-d / 1500));
      st.score += pts;
      const pr = body().querySelector('#pinreal'), fx = (r.lon + 180) / 360, fy = (90 - r.lat) / 180;
      pr.classList.remove('hide'); pr.style.left = fx * 100 + '%'; pr.style.top = fy * 100 + '%';
      const l = body().querySelector('#gl'), mx = (st.pin.lon + 180) / 360 * 1000, my = (90 - st.pin.lat) / 180 * 500;
      l.setAttribute('x1', mx); l.setAttribute('y1', my); l.setAttribute('x2', fx * 1000); l.setAttribute('y2', fy * 500);
      body().querySelector('#geoline').classList.remove('hide');
      const map = body().querySelector('#geomap'); map.scrollTo({ left: Math.max(0, fx * map.scrollWidth - map.clientWidth / 2), behavior: 'smooth' });
      body().querySelector('#geohint').innerHTML = '';
      const btn = body().querySelector('#geolock'); btn.remove();
      body().querySelector('.geo').insertAdjacentHTML('beforeend', `<div class="geo-res rise"><div class="row"><b>${esc(r.name)}</b><span class="pts">+${pts}</span></div>
        <span class="dist">Your pin was ${Math.round(d).toLocaleString()} km away</span>
        <div class="fun"><span class="k">Fun fact</span><p>${esc(r.fact)}</p></div>${badge()}
        <button class="btn ink" data-mx="geo-next">${st.i + 1 < st.rounds.length ? 'Next place' : 'See my score'}</button></div>`);
      setTimeout(() => body().querySelector('.geo-res').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 350);
    },
  };

  // ------------------------------------------------------------ Wikirace
  const norm = s => s.toLowerCase();
  const WR = {
    data() { return D().wiki[st.k]; },
    page(name) { const P = WR.data().pages; return Object.keys(P).find(k => norm(k) === norm(name)); },
    par(a, b) { const P = WR.data().pages, q = [[a, 0]], seen = new Set([a]);
      while (q.length) { const [n, d] = q.shift(); if (n === b) return d; for (const m of (P[n].match(/\[\[(.+?)\]\]/g) || [])) { const t = WR.page(m.slice(2, -2)); if (t && !seen.has(t)) { seen.add(t); q.push([t, d + 1]); } } } return 99; },
    start() { st.races = WR.data().races; st.i = 0; st.score = 0; st.clicksAll = 0; WR.begin(); },
    begin() {
      if (st.i >= st.races.length) { body().innerHTML = result(st.score, st.races.length * 3, `<p class="mg-sub">${st.clicksAll} clicks in total</p>`); return; }
      const [a, b] = st.races[st.i]; st.cur = WR.page(a); st.target = WR.page(b); st.path = [st.cur]; st.clicks = 0; st.parN = WR.par(st.cur, st.target);
      WR.draw();
    },
    draw() {
      const P = WR.data().pages, txt = esc(P[st.cur]).replace(/\[\[(.+?)\]\]/g, (m, t) => `<button class="wl" data-mx="wl" data-v="${esc(t)}">${esc(t)}</button>`);
      setProg(`Race ${st.i + 1}/${st.races.length}`);
      body().innerHTML = `<div class="wr"><div class="wr-goal"><span>Start: <b>${esc(st.path[0])}</b></span><span class="arr">→</span><span>Target: <b>${esc(st.target)}</b></span></div>
        <div class="wr-stats"><span>Clicks: <b>${st.clicks}</b></span><span>Par: ${st.parN}</span>${st.path.length > 1 ? '<button class="wr-back" data-mx="wb">← Back</button>' : ''}</div>
        <article class="wr-page rise"><div class="wr-bar"><i></i><i></i><i></i><span>knowseum.wiki/${esc(st.cur.replace(/ /g, '_'))}</span></div>
          <h2>${esc(st.cur)}</h2><p>${txt}</p>${badge()}</article>
        <div class="wr-path">${st.path.map(p => `<span>${esc(p)}</span>`).join('<i>›</i>')}</div></div>`;
    },
    go(name) {
      const t = WR.page(name); if (!t) return;
      st.cur = t; st.path.push(t); st.clicks++; st.clicksAll++;
      if (t === st.target) {
        const stars = st.clicks <= st.parN ? 3 : st.clicks <= st.parN + 2 ? 2 : 1; st.score += stars;
        body().innerHTML = `<div class="wr"><div class="wr-win rise"><span class="k">You made it!</span><h2>${esc(st.target)}</h2>
          <p>${st.clicks} click${st.clicks === 1 ? '' : 's'} · par ${st.parN}</p><div class="stars">${[0, 1, 2].map(i => `<i class="${i < stars ? 'on' : ''}">★</i>`).join('')}</div>
          <div class="wr-path">${st.path.map(p => `<span>${esc(p)}</span>`).join('<i>›</i>')}</div>
          <p class="sm">${esc(WR.data().pages[st.target].replace(/\[\[(.+?)\]\]/g, '$1'))}</p>${badge()}
          <button class="btn ink" data-mx="wr-next">${st.i + 1 < st.races.length ? 'Next race' : 'See my score'}</button></div></div>`;
      } else WR.draw();
    },
    back() { if (st.path.length < 2) return; st.path.pop(); st.cur = st.path[st.path.length - 1]; st.clicks++; st.clicksAll++; WR.draw(); },
  };

  // ------------------------------------------------------------ Guess Who (SG Politics)
  const initials = n => n.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('');
  const GW = {
    data() { return D().guesswho; },
    start() {
      // fair split: 2 PAP answers + 2 WP answers, alternating, random which party goes first
      const G = GW.data(), by = p => shuffle(G.rounds.filter(r => G.people[r.answer] === p));
      const a = by('PAP'), b = by('WP'), first = Math.random() < .5 ? a : b, second = first === a ? b : a;
      st.rounds = [first[0], second[0], first[1], second[1]];
      st.i = 0; st.score = 0; GW.begin();
    },
    begin() {
      if (st.i >= st.rounds.length) { body().innerHTML = result(st.score, st.rounds.length * 5, `<p class="mg-sub">2 PAP and 2 WP answers, every game</p>`); return; }
      const r = st.rounds[st.i];
      st.cards = shuffle(r.cards); st.down = new Set(); st.shown = 1; st.guess = false; st.over = false; st.wrong = new Set();
      GW.draw();
    },
    worth() { return Math.max(1, 6 - st.shown - st.wrong.size); },
    draw() {
      const r = st.rounds[st.i], G = GW.data();
      setProg(`${st.i + 1}/${st.rounds.length}`);
      const card = n => { const p = G.people[n], cls = [st.down.has(n) ? 'down' : '', st.wrong.has(n) ? 'wrong' : '', st.over && n === r.answer ? 'right' : ''].join(' ');
        return `<button class="gw-card ${cls}" data-mx="gw-card" data-v="${esc(n)}" ${st.over ? 'disabled' : ''}><span class="face"><span class="av">${esc(initials(n))}</span><b>${esc(n)}</b><span class="pty">${p}</span></span><span class="back">${st.wrong.has(n) ? cross(20, '#d6544b') : '?'}</span></button>`; };
      const facts = r.facts.slice(0, st.shown).map((f, j) => `<li class="${j === st.shown - 1 ? 'new' : ''}"><span>${j + 1}</span>${esc(f[0])}</li>`).join('');
      body().innerHTML = `<div class="gw">
        <div class="gw-facts"><div class="gw-fh"><span class="k">Who am I? · ${st.shown} of 5 facts</span><span class="gw-worth">Worth <b>${GW.worth()}</b></span></div>
          <ol>${facts}</ol>
          ${st.over ? '' : `<button class="gw-more" data-mx="gw-fact" ${st.shown >= 5 ? 'disabled' : ''}>${st.shown >= 5 ? 'All 5 facts shown' : 'Show next fact <small>−1 point</small>'}</button>`}</div>
        <div class="gw-board">${st.cards.map(card).join('')}</div>
        ${st.over ? '' : `<div class="gw-mode"><button class="${st.guess ? '' : 'on'}" data-mx="gw-mode" data-v="0">Flip down</button><button class="${st.guess ? 'on' : ''}" data-mx="gw-mode" data-v="1">Make my guess</button></div>
        <p class="mg-hint">${st.guess ? 'Tap the person you think it is.' : 'Tap cards to flip down anyone the facts rule out.'}</p>`}
        <div id="gwres"></div>${badge()}</div>`;
      if (st.over) GW.reveal();
    },
    tap(n) {
      if (st.over) return;
      const r = st.rounds[st.i];
      if (!st.guess) { st.down.has(n) ? st.down.delete(n) : st.down.add(n); body().querySelector(`.gw-card[data-v="${CSS.escape(n)}"]`).classList.toggle('down', st.down.has(n)); return; }
      if (n === r.answer) { st.score += GW.worth(); st.pts = GW.worth(); st.over = true; st.won = true; GW.draw(); return; }
      st.wrong.add(n); st.down.add(n);
      const left = st.cards.filter(c => !st.wrong.has(c));
      if (left.length === 1) { st.over = true; st.won = false; st.pts = 0; }
      else if (st.shown < 5) st.shown++;
      GW.draw();
      const el = body().querySelector(`.gw-card[data-v="${CSS.escape(n)}"]`); if (el) { el.classList.add('shake'); }
    },
    reveal() {
      const r = st.rounds[st.i];
      body().querySelector('#gwres').innerHTML = `<div class="gw-res rise ${st.won ? 'ok' : 'no'}">
        <span class="verdict">${st.won ? `${tick(16)} Got it! +${st.pts}` : `${cross(16)} Not this time`}</span>
        <b class="nm">${esc(r.answer)} <span class="pty">${GW.data().people[r.answer]}</span></b><span class="role">${esc(r.role)}</span>
        <button class="gw-rm" data-mx="gw-rm" aria-expanded="false"><span>Read more</span><i class="tg"></i></button>
        <div class="gw-dyk" hidden><span class="k">Did you know?</span><p>${esc(r.didyou)}</p><small>${esc(GW.data().checked)}</small></div>
        <button class="btn ink" data-mx="gw-next">${st.i + 1 < st.rounds.length ? 'Next round' : 'See my score'}</button></div>`;
      setTimeout(() => body().querySelector('.gw-res').scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 200);
    },
  };

  // ------------------------------------------------------------ Hole-some Recycling (Environment)
  const II = {
    bottle: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3Z" fill="#bfe3ef" stroke="#1c1b19"/><path d="M8.5 12h7v4h-7Z" fill="#5aa9c7" stroke="none"/>',
    dbottle: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3Z" fill="#bfe3ef" stroke="#1c1b19"/><path d="M8.6 15c2-1 4 1 6.8-.5V20H8.6Z" fill="#a0672d" opacity=".85"/><circle cx="11" cy="10" r="1" fill="#a0672d"/>',
    full: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3Z" fill="#bfe3ef" stroke="#1c1b19"/><path d="M8.6 10h6.8v10H8.6Z" fill="#e2763d" opacity=".9"/>',
    crushed: '<path d="M7 9l3-1 2 2 3-2 2 1-1 3 2 3-2 2-3-1-2 2-3-1 1-3-2-2Z" fill="#bfe3ef" stroke="#1c1b19"/>',
    can: '<rect x="8" y="4" width="8" height="16" rx="2" fill="#d6544b" stroke="#1c1b19"/><path d="M8 8h8M8 16h8" stroke="#fff"/>',
    paper: '<path d="M6 3h9l3 3v15H6Z" fill="#fff" stroke="#1c1b19"/><path d="M9 9h6M9 12h6M9 15h4" stroke="#9a968e"/>',
    box: '<path d="M3 8l9-4 9 4v10l-9 4-9-4Z" fill="#d9a066" stroke="#1c1b19"/><path d="M3 8l9 4 9-4M12 12v10" stroke="#1c1b19" fill="none"/>',
    pizza: '<path d="M3 8l9-4 9 4v10l-9 4-9-4Z" fill="#d9a066" stroke="#1c1b19"/><path d="M3 8l9 4 9-4M12 12v10" stroke="#1c1b19" fill="none"/><ellipse cx="7" cy="14" rx="2.4" ry="1.8" fill="#8a4a1c" opacity=".7"/><ellipse cx="16" cy="16" rx="2" ry="1.4" fill="#8a4a1c" opacity=".7"/>',
    jar: '<rect x="7" y="7" width="10" height="13" rx="3" fill="#cfe8d5" stroke="#1c1b19"/><rect x="8" y="3.5" width="8" height="3.5" rx="1" fill="#e7cf6a" stroke="#1c1b19"/>',
    carton: '<path d="M7 8l2-4h6l2 4v13H7Z" fill="#f2f2ee" stroke="#1c1b19"/><path d="M7 12h10v5H7Z" fill="#7fb3a8"/>',
    mag: '<rect x="5" y="3" width="14" height="18" rx="1" fill="#f6b8c9" stroke="#1c1b19"/><path d="M8 7h8M8 10h5" stroke="#1c1b19"/><circle cx="12" cy="15" r="3" fill="#fff" stroke="#1c1b19"/>',
    tissue: '<path d="M6 10c1-4 4-6 6-4 2-2 6 0 6 4 0 5-3 9-6 9s-7-4-6-9Z" fill="#fff" stroke="#1c1b19"/><path d="M9 12c2 1 4 1 6 0" stroke="#bdb7ad" fill="none"/>',
    peel: '<path d="M12 4c-1 6-6 9-8 15 3-1 6-4 8-8 2 4 5 7 8 8-2-6-7-9-8-15Z" fill="#f2d24f" stroke="#1c1b19"/><path d="M11 3h2v2h-2Z" fill="#6b4a2a"/>',
    foam: '<path d="M3 9h18l-2 10H5Z" fill="#fafaf7" stroke="#1c1b19"/><path d="M3 9l2-4h14l2 4" fill="#f0efea" stroke="#1c1b19"/><circle cx="8" cy="13" r=".8" fill="#c9c4ba"/><circle cx="14" cy="15" r=".8" fill="#c9c4ba"/>',
    cutlery: '<path d="M8 3v8M6 3v5a2 2 0 0 0 4 0V3M8 11v10" stroke="#1c1b19" fill="none"/><path d="M16 3c2 2 2 7 0 8v10" stroke="#1c1b19" fill="#fff"/>',
    cup: '<path d="M6 6h12l-1.5 15h-9Z" fill="#fff" stroke="#1c1b19"/><path d="M5 4h14v2H5Z" fill="#8a5a3a" stroke="#1c1b19"/><path d="M8 14c2 1 4-1 8 0" stroke="#8a4a1c" stroke-width="2" fill="none" opacity=".7"/>',
    tub: '<path d="M4 9h16l-2 10H6Z" fill="#f2f2ee" stroke="#1c1b19"/><path d="M3 7h18v2H3Z" fill="#cfcac0" stroke="#1c1b19"/><ellipse cx="11" cy="14" rx="4" ry="2" fill="#e09a2d" opacity=".75"/>',
    battery: '<rect x="8" y="5" width="8" height="15" rx="1.5" fill="#2f2f2f" stroke="#1c1b19"/><rect x="10" y="3" width="4" height="2" fill="#9a968e"/><path d="M8 9h8" stroke="#e7cf6a" stroke-width="2"/><path d="M11 13h2M12 12v2" stroke="#fff"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="2" fill="#3a3834" stroke="#1c1b19"/><rect x="8.5" y="5" width="7" height="12" fill="#5b76b0"/><path d="M10 7l3 4-2 1 3 4" stroke="#fff" fill="none"/>',
    bank: '<rect x="5" y="6" width="14" height="13" rx="3" fill="#e6e4de" stroke="#1c1b19"/><path d="M13 8l-3 5h3l-2 4" stroke="#2e9a58" stroke-width="1.6" fill="none"/>',
    toy: '<circle cx="12" cy="13" r="6" fill="#c99a6b" stroke="#1c1b19"/><circle cx="7.5" cy="7.5" r="2.5" fill="#c99a6b" stroke="#1c1b19"/><circle cx="16.5" cy="7.5" r="2.5" fill="#c99a6b" stroke="#1c1b19"/><circle cx="10" cy="12" r=".9" fill="#1c1b19"/><circle cx="14" cy="12" r=".9" fill="#1c1b19"/><ellipse cx="12" cy="15" rx="1.6" ry="1.1" fill="#1c1b19"/>',
    frog: '<ellipse cx="12" cy="15" rx="8" ry="6" fill="#57b05e" stroke="#1c1b19"/><circle cx="8" cy="9" r="3" fill="#57b05e" stroke="#1c1b19"/><circle cx="16" cy="9" r="3" fill="#57b05e" stroke="#1c1b19"/><circle cx="8" cy="9" r="1.3" fill="#1c1b19"/><circle cx="16" cy="9" r="1.3" fill="#1c1b19"/><path d="M8 16c2 2 6 2 8 0" stroke="#1c1b19" fill="none"/><path d="M6 21l2-3M18 21l-2-3" stroke="#1c1b19"/><path d="M4 8l4-3 4 3" fill="#d6544b" stroke="#1c1b19" stroke-width=".8"/>',
  };
  const iic = (k, s) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round">${II[k] || ''}</svg>`;
  const HG = {
    H() { return D().hole; },
    start() { st.w = 0; st.coins = 0; st.total = 0; st.cleared = 0; st.perks = {}; HG.intro(); },
    intro() {
      const H = HG.H(), w = H.waves[st.w];
      if (!w) return HG.end();
      setProg(`Wave ${st.w + 1}/${H.waves.length}`);
      const keys = [...new Set(w.spawn)];
      const prev = new Set(st.w ? H.waves.slice(0, st.w).flatMap(x => x.spawn) : []);
      const tag = k => { const t = HG.kindOf(k); return t.good ? 'good' : 'bad'; };
      body().innerHTML = `<div class="hg-intro rise"><span class="k">Wave ${st.w + 1} · ${esc(w.name)}</span><p class="rule">${esc(w.rule)}</p>
        <div class="hg-legend">${keys.map(k => `<span class="it ${tag(k)} ${prev.has(k) ? '' : 'nw'}">${iic(k, 26)}<small>${esc(H.items[k][0])}</small></span>`).join('')}</div>
        <div class="hg-stats"><span>Goal <b>${w.goal}</b> pts</span><span>Time <b>${w.time}s</b></span><span class="coins">${iic('bottle', 16)} <b>${st.coins}</b> × 10¢</span></div>
        <p class="mg-hint">Drag the hole around. You can only swallow things smaller than the hole.</p>
        <button class="btn acc" data-mx="hg-go">Start wave ${st.w + 1}</button></div>`;
    },
    // is this item good to swallow in the current wave?
    kindOf(k, washed) {
      const [, , kind] = HG.H().items[k], w = st.w;
      if (washed) return { good: true, pts: 10, coin: k === 'dbottle' ? 1 : 0, msg: 'Rinsed!' };
      if (kind === 'rec') return { good: true, pts: 10, coin: 0 };
      if (kind === 'bottle') return { good: true, pts: 10, coin: 1 };
      if (kind === 'crushed') return { good: true, pts: 6, coin: 0, msg: 'No deposit' };
      if (kind === 'dirty') return w === 0 ? { good: true, pts: 10, coin: 0 } : { good: false, pts: -12, msg: 'Contaminated!' };
      if (kind === 'ewaste') return { good: false, pts: -15, msg: 'E-waste!' };
      if (kind === 'full') return { good: false, pts: -12, msg: 'Not empty!' };
      return { good: false, pts: -10, msg: 'Not recyclable' };
    },
    go() {
      const w = HG.H().waves[st.w];
      body().innerHTML = `<div class="hg">
        <div class="hg-hud"><div class="bar"><i id="hgbar"></i><span id="hgpts">0 / ${w.goal}</span></div><span class="t" id="hgt">${w.time}</span><span class="coins">${iic('bottle', 16)}<b id="hgc">${st.coins}</b></span></div>
        <div class="hg-field" id="hgf"><div class="hg-hole" id="hgh"><i></i></div><div class="hg-frog hide" id="hgfrog">${iic('frog', 40)}</div><svg class="hg-tongue" id="hgtg"><line x1="0" y1="0" x2="0" y2="0"/></svg></div>
        <div class="hg-perks">${HG.H().perks.map(p => { const n = st.perks[p.key] || 0; return `<button class="hg-perk ${n ? '' : 'off'}" data-mx="hg-perk" data-v="${p.key}" ${n ? '' : 'disabled'}><b>${esc(p.name)}</b><small>${n ? `×${n}` : 'Locked'}</small></button>`; }).join('')}</div></div>`;
      const f = body().querySelector('#hgf'), R = f.getBoundingClientRect();
      Object.assign(st, { W: R.width, Hh: R.height, hx: R.width / 2, hy: R.height / 2, tx: R.width / 2, ty: R.height / 2, r: 26, items: [], pts: 0, left: w.time, nty: (st.perks.nty || 0) > 0, frogT: 0, lastSpawn: 0, run: true, last: performance.now(), id: 0 });
      const mv = e => { const b = f.getBoundingClientRect(); st.tx = Math.max(0, Math.min(b.width, e.clientX - b.left)); st.ty = Math.max(0, Math.min(b.height, e.clientY - b.top - 30)); };
      f.addEventListener('pointerdown', e => { f.setPointerCapture(e.pointerId); mv(e); });
      f.addEventListener('pointermove', e => { if (e.buttons || e.pointerType === 'touch') mv(e); });
      for (let i = 0; i < 9; i++) HG.spawn(true);
      HG.perkUI();
      st.timer = setInterval(() => { if (!st.run) return; st.left--; const t = body().querySelector('#hgt'); if (t) t.textContent = st.left; if (st.left <= 0) HG.stop(); }, 1000);
      requestAnimationFrame(HG.loop);
    },
    spawn(init) {
      const w = HG.H().waves[st.w], pick = a => a[Math.floor(Math.random() * a.length)];
      const good = w.spawn.filter(k => HG.kindOf(k).good), bad = w.spawn.filter(k => !HG.kindOf(k).good);
      const k = pick(Math.random() < (w.fast ? .55 : .62) || !bad.length ? good : bad), s = HG.H().items[k][1] * 1.3;
      let x, y, n = 0;
      do { x = s / 2 + Math.random() * (st.W - s); y = s / 2 + Math.random() * (st.Hh - s); n++; } while (n < 20 && Math.hypot(x - st.hx, y - st.hy) < st.r + s + 30);
      const el = document.createElement('div'); el.className = 'hg-item' + (init ? '' : ' pop'); el.innerHTML = iic(k, s); el.style.width = el.style.height = s + 'px';
      el.title = HG.H().items[k][0];
      const it = { k, x, y, s, el, washed: false, die: HG.kindOf(k).good ? 0 : performance.now() + 7000 + Math.random() * 4000, vx: (Math.random() - .5) * (w.fast ? 30 : 12), vy: (Math.random() - .5) * (w.fast ? 30 : 12), id: st.id++ };
      body().querySelector('#hgf').appendChild(el); st.items.push(it); HG.place(it);
    },
    place(it) { it.el.style.transform = `translate(${it.x - it.s / 2}px, ${it.y - it.s / 2}px)`; },
    loop(now) {
      if (!st.run || !body().querySelector('#hgf')) return;
      const dt = Math.min(.05, (now - st.last) / 1000); st.last = now;
      const w = HG.H().waves[st.w];
      st.hx += (st.tx - st.hx) * Math.min(1, dt * 9); st.hy += (st.ty - st.hy) * Math.min(1, dt * 9);
      const h = body().querySelector('#hgh'); h.style.transform = `translate(${st.hx - st.r}px, ${st.hy - st.r}px)`; h.style.width = h.style.height = st.r * 2 + 'px';
      h.classList.toggle('shut', st.nty);
      for (const it of st.items.slice()) {
        if (it.gone) continue;
        if (it.die && now > it.die) { it.gone = true; st.items = st.items.filter(i => i !== it); it.el.classList.add('fade'); setTimeout(() => it.el.remove(), 400); continue; }
        it.x += it.vx * dt; it.y += it.vy * dt;
        if (it.x < it.s / 2 || it.x > st.W - it.s / 2) it.vx *= -1; if (it.y < it.s / 2 || it.y > st.Hh - it.s / 2) it.vy *= -1;
        const d = Math.hypot(it.x - st.hx, it.y - st.hy);
        if (d < st.r * .95) {
          if (it.s < st.r * 1.9) HG.eat(it);
          else { const a = Math.atan2(it.y - st.hy, it.x - st.hx); it.x = st.hx + Math.cos(a) * (st.r + 2); it.y = st.hy + Math.sin(a) * (st.r + 2); it.el.classList.add('big'); }
        } else it.el.classList.remove('big');
        HG.place(it);
      }
      // keep the floor stocked
      if (now - st.lastSpawn > (w.fast ? 450 : 800) && st.items.filter(i => !i.gone).length < (w.fast ? 15 : 11)) { st.lastSpawn = now; HG.spawn(); }
      // Captain Green
      const fr = body().querySelector('#hgfrog');
      if (st.frogT > now) {
        fr.classList.remove('hide'); const fx = st.hx + st.r + 4, fy = st.hy - st.r - 4; fr.style.transform = `translate(${fx - 20}px, ${fy - 20}px)`;
        if (!st.lick || now - st.lick > 650) {
          const tgt = st.items.filter(i => !i.gone && HG.kindOf(i.k, i.washed).good && Math.hypot(i.x - fx, i.y - fy) < 170).sort((a, b) => Math.hypot(a.x - fx, a.y - fy) - Math.hypot(b.x - fx, b.y - fy))[0];
          if (tgt) { st.lick = now; const l = body().querySelector('#hgtg line'); l.setAttribute('x1', fx); l.setAttribute('y1', fy); l.setAttribute('x2', tgt.x); l.setAttribute('y2', tgt.y);
            body().querySelector('#hgtg').classList.add('on'); setTimeout(() => body().querySelector('#hgtg')?.classList.remove('on'), 220); HG.eat(tgt, true); }
        }
      } else fr.classList.add('hide');
      requestAnimationFrame(HG.loop);
    },
    eat(it, frog) {
      const res = HG.kindOf(it.k, it.washed);
      if (!res.good && st.nty && (st.perks.nty || 0) > 0) {
        st.perks.nty--; HG.float(it.x, it.y, 'No thank you!', 'blk'); HG.perkUI();
        const a = Math.atan2(it.y - st.hy, it.x - st.hx) || 1; it.x = st.hx + Math.cos(a) * (st.r + it.s); it.y = st.hy + Math.sin(a) * (st.r + it.s); it.vx = Math.cos(a) * 60; it.vy = Math.sin(a) * 60;
        if (!st.perks.nty) st.nty = false; return;
      }
      it.gone = true; st.items = st.items.filter(i => i !== it);
      it.el.classList.add('eaten'); it.el.style.transform = `translate(${st.hx - it.s / 2}px, ${st.hy - it.s / 2}px) scale(.1) rotate(160deg)`; setTimeout(() => it.el.remove(), 350);
      st.pts = Math.max(0, st.pts + res.pts);
      if (res.good) { st.r = Math.min(66, st.r + (frog ? 1 : 1.8)); st.coins += res.coin || 0; }
      else { st.r = Math.max(14, st.r - 4); body().querySelector('#hgh').classList.remove('hurt'); void body().querySelector('#hgh').offsetWidth; body().querySelector('#hgh').classList.add('hurt'); }
      HG.float(it.x, it.y, (res.pts > 0 ? '+' : '') + res.pts + (res.coin ? ' · 10¢' : '') + (res.msg ? ' ' + res.msg : ''), res.good ? 'good' : 'bad');
      const w = HG.H().waves[st.w];
      body().querySelector('#hgbar').style.width = Math.min(100, st.pts / w.goal * 100) + '%';
      body().querySelector('#hgpts').textContent = `${st.pts} / ${w.goal}`; body().querySelector('#hgc').textContent = st.coins;
    },
    float(x, y, t, c) { const f = body().querySelector('#hgf'); if (!f) return; const e = document.createElement('span'); e.className = 'hg-float ' + c; e.textContent = t; e.style.left = x + 'px'; e.style.top = y + 'px'; f.appendChild(e); setTimeout(() => e.remove(), 900); },
    perkUI() { body().querySelectorAll('.hg-perk').forEach(b => { const n = st.perks[b.dataset.v] || 0; b.querySelector('small').textContent = n ? (b.dataset.v === 'nty' ? `${st.nty ? 'On' : 'Off'} · ×${n}` : `×${n}`) : 'Used up'; b.disabled = !n; b.classList.toggle('off', !n); b.classList.toggle('act', b.dataset.v === 'nty' && st.nty); }); },
    perk(k) {
      if (!st.run || !(st.perks[k] > 0)) return;
      if (k === 'wash') {
        st.perks.wash--; let n = 0;
        st.items.forEach(i => { if (!i.gone && HG.H().items[i.k][2] === 'dirty' && !i.washed && Math.hypot(i.x - st.hx, i.y - st.hy) < 130) { i.washed = true; i.el.classList.add('washed'); n++; } });
        const f = body().querySelector('#hgf'), ring = document.createElement('span'); ring.className = 'hg-wash'; ring.style.left = st.hx + 'px'; ring.style.top = st.hy + 'px'; f.appendChild(ring); setTimeout(() => ring.remove(), 700);
        HG.float(st.hx, st.hy - st.r, n ? `Rinsed ${n}!` : 'Nothing dirty nearby', n ? 'good' : 'blk');
      } else if (k === 'nty') { st.nty = !st.nty; HG.float(st.hx, st.hy - st.r, st.nty ? 'Shield on' : 'Shield off', 'blk'); }
      else if (k === 'frog') { st.perks.frog--; st.frogT = performance.now() + 10000; HG.float(st.hx, st.hy - st.r, 'Captain Green!', 'good'); }
      HG.perkUI();
    },
    stop() {
      st.run = false; clearInterval(st.timer);
      const H = HG.H(), w = H.waves[st.w], pass = st.pts >= w.goal; st.best = Math.max(st.best || 0, st.pts); if (pass) { st.total += st.pts; st.cleared++; }
      const unlock = H.perks.filter(p => p.after === st.w + 1);
      body().innerHTML = `<div class="hg-intro rise"><span class="k">Wave ${st.w + 1} ${pass ? 'cleared' : 'over'}</span>
        <div class="score"><b>${st.pts}</b><span>/ ${w.goal}</span></div>
        <div class="hg-learn"><span class="k">Did you know?</span><p>${esc(w.learn)}</p></div>
        ${pass && st.w + 1 < H.waves.length ? HG.shop(unlock) : ''}
        ${pass && st.w + 1 < H.waves.length ? `<button class="btn acc" data-mx="hg-next">Next wave</button>` : `<button class="btn acc" data-mx="hg-end">See my score</button>`}
        ${!pass ? `<button class="btn line" data-mx="hg-retry">Try wave ${st.w + 1} again</button><p class="mg-hint">Reach the goal to unlock the next wave.</p>` : ''}${badge()}</div>`;
    },
    shop(unlock) {
      const H = HG.H(), avail = H.perks.filter(p => p.after <= st.w + 1);
      if (!avail.length) return '';
      return `<div class="hg-shop"><div class="hd"><b>Perk shop</b><span class="coins">${iic('bottle', 16)} <b id="hgcoins">${st.coins}</b> bottles · $${(st.coins / 10).toFixed(2)}</span></div>
        ${avail.map(p => `<div class="row ${unlock.includes(p) ? 'nw' : ''}"><span class="pi">${p.key === 'frog' ? iic('frog', 30) : p.key === 'wash' ? '<b>💧</b>' : '<b>✋</b>'}</span><span class="tx"><b>${esc(p.name)}${unlock.includes(p) ? ' <em>New</em>' : ''}</b><small>${esc(p.desc)}</small></span>
          <button class="buy" data-mx="hg-buy" data-v="${p.key}" ${st.coins < p.cost ? 'disabled' : ''}>${p.cost} ${iic('bottle', 14)}</button></div>`).join('')}
        <p class="note">Every empty bottle or can you swallow is worth 10¢, like Singapore’s deposit scheme.</p></div>`;
    },
    buy(k) {
      const p = HG.H().perks.find(x => x.key === k); if (st.coins < p.cost) return;
      st.coins -= p.cost; st.perks[k] = (st.perks[k] || 0) + p.uses;
      body().querySelector('#hgcoins').textContent = st.coins;
      body().querySelectorAll('.hg-shop .buy').forEach(b => { const q = HG.H().perks.find(x => x.key === b.dataset.v); b.disabled = st.coins < q.cost; });
      HG.toastBuy(p);
    },
    toastBuy(p) { const r = body().querySelector(`.hg-shop .buy[data-v="${p.key}"]`).closest('.row'); r.classList.remove('bought'); void r.offsetWidth; r.classList.add('bought'); r.querySelector('small').textContent = `Bought! You have ×${st.perks[p.key]}.`; },
    end() { body().innerHTML = result(st.cleared, HG.H().waves.length, `<p class="mg-sub">Waves cleared · ${st.total} points · ${st.coins} bottles (${'$'}${(st.coins / 10).toFixed(2)}) left over</p>`); },
  };

  // ------------------------------------------------------------ Real or Fake? (Tech)
  const RF = {
    R() { return D().realfake; },
    TIME: [0, 15, 10],
    start() { st.r = 0; st.i = 0; st.score = 0; st.n = RF.R().rounds.reduce((a, r) => a + r.items.length, 0); RF.roundIntro(); },
    roundIntro() {
      const rd = RF.R().rounds[st.r]; if (!rd) { body().innerHTML = result(st.score, st.n); return; }
      setProg(`Round ${st.r + 1}/3`);
      body().innerHTML = `<div class="rf-intro rise"><span class="k">Round ${st.r + 1} · ${esc(rd.note)}</span><h2>${esc(rd.name)}</h2>
        <p>${st.r === 0 ? 'Is it a real photo, or made by AI? Take your time.' : st.r === 1 ? 'Real headline or fake news? Now there’s a 15-second clock.' : 'Photos and headlines, mixed. 10 seconds each, and the easy tells are gone.'}</p>
        <button class="btn acc" data-mx="rf-go">Start round</button></div>`;
    },
    draw() {
      const rd = RF.R().rounds[st.r], it = rd.items[st.i];
      if (!it) { st.r++; st.i = 0; RF.roundIntro(); return; }
      const T = RF.TIME[st.r], img = it.kind === 'img';
      const [a, b] = img ? ['Real photo', 'AI-made'] : ['Real news', 'Fake'];
      body().innerHTML = `<div class="rf"><div class="rf-top"><span>${st.i + 1} of ${rd.items.length}</span>${T ? `<span class="rf-clock"><i id="rfclk" style="animation-duration:${T}s"></i></span>` : ''}</div>
        ${img ? `<div class="rf-img"><img src="${it.src}" alt="Photo to judge" onerror="this.parentNode.classList.add('missing')"><span class="miss">Real photo goes here<br><small>${esc(it.src)}</small></span></div>`
          : `<div class="rf-news"><span class="src">${esc(it.src)}</span><p>${esc(it.head)}</p></div>`}
        <div class="rf-btns"><button class="rfb real" data-mx="rf" data-v="real">${a}</button><button class="rfb fake" data-mx="rf" data-v="${img ? 'ai' : 'fake'}">${b}</button></div>
        <div id="rfres"></div>${badge()}</div>`;
      clearTimeout(st.clock); st.done = false;
      if (T) st.clock = setTimeout(() => RF.answer(null), T * 1000);
    },
    answer(v) {
      if (st.done) return; st.done = true; clearTimeout(st.clock);
      const it = RF.R().rounds[st.r].items[st.i], ok = v === it.ans; if (ok) st.score++;
      body().querySelectorAll('.rfb').forEach(b => { b.disabled = true; b.classList.add(b.dataset.v === it.ans ? 'right' : b.dataset.v === v ? 'wrong' : 'dim'); });
      const c = body().querySelector('#rfclk'); if (c) c.style.animationPlayState = 'paused';
      const label = { real: it.kind === 'img' ? 'REAL PHOTO' : 'REAL NEWS', ai: 'AI-MADE', fake: 'FAKE · made up for this game' }[it.ans];
      const tip = it.tell || RF.R().realTip;
      body().querySelector('#rfres').innerHTML = `<div class="rf-res rise ${ok ? 'ok' : 'no'}"><span class="verdict">${ok ? tick(16) : cross(16)} ${v === null ? 'Time’s up!' : ok ? 'Correct' : 'Not quite'}</span><b>${label}</b>
        ${ok ? (it.tell ? `<p>${esc(it.tell)}</p>` : '') : `<div class="tip"><span class="k">Tip</span><p>${esc(tip)}</p></div>`}
        ${it.credit ? `<small class="rf-credit">Photo: ${esc(it.credit)}</small>` : ''}<button class="btn ink" data-mx="rf-next">Next</button></div>`;
      setTimeout(() => body().querySelector('.rf-res')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);
    },
  };

  const ENGINE = { factcap: FC, geo: GEO, wiki: WR, guesswho: GW, hole: HG, realfake: RF };

  function onClick(e) {
    const t = e.target.closest('[data-mx]'); if (!t) return;
    const x = t.dataset.mx, E = ENGINE[st.g];
    switch (x) {
      case 'vet': st.hooks.vetting(); break;
      case 'start': case 'restart': body().innerHTML = ''; E.start(); break;
      case 'fc': FC.answer(+t.dataset.v); break;
      case 'fc-next': st.i++; FC.draw(); break;
      case 'geo-lock': GEO.lock(); break;
      case 'geo-next': st.i++; GEO.draw(); break;
      case 'wl': WR.go(t.dataset.v); break;
      case 'wb': WR.back(); break;
      case 'wr-next': st.i++; WR.begin(); break;
      case 'gw-card': GW.tap(t.dataset.v); break;
      case 'gw-fact': if (st.shown < 5) { st.shown++; GW.draw(); } break;
      case 'gw-mode': st.guess = t.dataset.v === '1'; GW.draw(); break;
      case 'gw-rm': { const d = t.nextElementSibling, o = d.hidden; d.hidden = !o; t.setAttribute('aria-expanded', o); t.classList.toggle('on', o); break; }
      case 'gw-next': st.i++; GW.begin(); break;
      case 'hg-go': HG.go(); break;
      case 'hg-perk': HG.perk(t.dataset.v); break;
      case 'hg-buy': HG.buy(t.dataset.v); break;
      case 'hg-next': st.w++; HG.intro(); break;
      case 'hg-end': HG.end(); break;
      case 'hg-retry': HG.intro(); break;
      case 'rf-go': RF.draw(); break;
      case 'rf': RF.answer(t.dataset.v); break;
      case 'rf-next': st.i++; RF.draw(); break;
    }
  }

  window.KNMiniGame = {
    GAMES, META,
    render(k, g, ctx) { if (st) { st.run = false; clearInterval(st.timer); clearTimeout(st.clock); } st = { k, g, ...ctx }; return intro(); },
    mount(el, hooks) { st.el = el; st.hooks = hooks; el.addEventListener('click', onClick); },
    icon,
  };
})();
