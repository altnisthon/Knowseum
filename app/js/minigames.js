/* Knowseum · mini game engine. Two games per wing, content in js/minigames-data.js.
   Fact or Cap (every wing) · GeoGuessr (World) · Jargon Match (Tech) · Wikirace (Singapore, Culture)
   Who Am I? (SG Politics) · Earth Quests (Environment) */
(function () {
  const D = () => window.KN_MINI;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const tick = (s = 16, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13 L9.5 18 L20 6"/></svg>`;
  const cross = (s = 16, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"/></svg>`;

  const GAMES = {
    singapore: ['factcap', 'wiki'], politics: ['factcap', 'whoami'], tech: ['factcap', 'jargon'],
    world: ['factcap', 'geo'], culture: ['factcap', 'wiki'], environment: ['factcap', 'quests'],
  };
  const META = {
    factcap: { name: 'Fact or Cap', sub: 'Swipe right for Fact, left for Cap', how: 'Swipe right if it’s true, left if it’s cap. Every card flips to show the real deal.', ico: 'swipe' },
    geo: { name: 'GeoGuessr', sub: 'Read the clue, drop a pin', how: 'Read the clue, then tap the map where you think it is. The closer your pin, the more points, plus a fun fact about the place.', ico: 'globe' },
    jargon: { name: 'Jargon Match', sub: 'Match tech words to real meanings', how: 'Tap a term, then tap what it really means. Two rounds of four.', ico: 'link' },
    wiki: { name: 'Wikirace', sub: 'Click links to reach the target page', how: 'Start on one page and reach the target page using only the blue links. Fewest clicks wins.', ico: 'race' },
    whoami: { name: 'Who Am I?', sub: 'Guess the minister or policy', how: 'Read the clue, then pick the right card out of three.', ico: 'who' },
    quests: { name: 'Earth Quests', sub: 'Small actions, real impact', how: 'Do four small quests to heal the Earth. Each one shows the real impact of that action.', ico: 'leaf' },
  };
  const ICO = {
    swipe: '<path d="M7 4 h10 a2 2 0 0 1 2 2 v12 a2 2 0 0 1 -2 2 h-10 a2 2 0 0 1 -2 -2 v-12 a2 2 0 0 1 2 -2 Z M9 11 l2 2 l4 -4"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12 h17 M12 3.5 c3 3 3 14 0 17 M12 3.5 c-3 3 -3 14 0 17"/>',
    link: '<path d="M10 14 a4 4 0 0 0 5.6 0 l3 -3 a4 4 0 0 0 -5.6 -5.6 l-1 1 M14 10 a4 4 0 0 0 -5.6 0 l-3 3 a4 4 0 0 0 5.6 5.6 l1 -1"/>',
    race: '<path d="M5 21 V4 M5 4 h12 l-2 4 l2 4 h-12"/>',
    who: '<circle cx="12" cy="8" r="4"/><path d="M4 21 c1 -5 15 -5 16 0"/><path d="M15.5 4.5 l2 -2"/>',
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

  // ------------------------------------------------------------ Jargon Match
  const JM = {
    start() { const all = shuffle(D().jargon); st.rounds = [all.slice(0, 4), all.slice(4, 8)]; st.i = 0; st.score = 0; st.miss = 0; JM.draw(); },
    draw() {
      if (st.i >= st.rounds.length) { body().innerHTML = result(st.score, 8, `<p class="mg-sub">${st.miss} wrong tap${st.miss === 1 ? '' : 's'}</p>`); return; }
      const set = st.rounds[st.i]; st.sel = null;
      setProg(`Round ${st.i + 1}/2`);
      body().innerHTML = `<div class="jm"><p class="mg-hint" style="margin-top:0">Tap a term, then tap what it means.</p>
        <div class="jm-cols"><div class="col">${shuffle(set).map(([t]) => `<button class="jt" data-mx="jt" data-v="${esc(t)}">${esc(t)}</button>`).join('')}</div>
        <div class="col">${shuffle(set).map(([t, m]) => `<button class="jd" data-mx="jd" data-v="${esc(t)}">${esc(m)}</button>`).join('')}</div></div>${badge()}<div id="jmnext"></div></div>`;
    },
    term(b) { body().querySelectorAll('.jt').forEach(x => x.classList.toggle('sel', x === b && !x.classList.contains('ok'))); if (!b.classList.contains('ok')) st.sel = b.dataset.v; },
    def(b) {
      if (b.classList.contains('ok')) return;
      if (!st.sel) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return; }
      const t = body().querySelector(`.jt[data-v="${CSS.escape(st.sel)}"]`);
      if (b.dataset.v === st.sel) { b.classList.add('ok'); t.classList.add('ok'); t.classList.remove('sel'); st.score++; st.sel = null;
        if (!body().querySelector('.jt:not(.ok)')) body().querySelector('#jmnext').innerHTML = `<button class="btn ink rise" data-mx="jm-next">${st.i ? 'See my score' : 'Next round'}</button>`; }
      else { st.miss++; [b, t].forEach(x => { x.classList.remove('shake'); void x.offsetWidth; x.classList.add('shake', 'bad'); setTimeout(() => x.classList.remove('bad'), 500); }); }
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

  // ------------------------------------------------------------ Who Am I?
  const WA = {
    start() { st.rounds = shuffle(D().whoami); st.i = 0; st.score = 0; WA.draw(); },
    draw() {
      if (st.i >= st.rounds.length) { body().innerHTML = result(st.score, st.rounds.length); return; }
      const r = st.rounds[st.i];
      setProg(`${st.i + 1}/${st.rounds.length}`);
      body().innerHTML = `<div class="wa"><div class="wa-clue rise"><span class="k">Who am I? · ${esc(r.kind)}</span><p>“${esc(r.clue)}”</p>${badge()}</div>
        <div class="wa-cards">${r.opts.map((o, j) => `<button class="wa-card" data-mx="wa" data-v="${j}" style="animation-delay:${.1 + j * .08}s"><span class="av">${esc(o.split(' ').filter(w => /^[A-Z]/.test(w)).slice(0, 2).map(w => w[0]).join('') || '?')}</span><b>${esc(o)}</b></button>`).join('')}</div><div id="wanext"></div></div>`;
    },
    pick(b) {
      const r = st.rounds[st.i], j = +b.dataset.v, cards = body().querySelectorAll('.wa-card');
      if (body().querySelector('.wa-cards.done')) return; body().querySelector('.wa-cards').classList.add('done');
      cards.forEach((c, x) => c.classList.add(x === r.a ? 'right' : x === j ? 'wrong' : 'dim'));
      if (j === r.a) st.score++;
      body().querySelector('#wanext').innerHTML = `<div class="wa-res rise ${j === r.a ? 'ok' : 'no'}"><b>${j === r.a ? 'Correct!' : 'Not quite.'}</b> It’s <b>${esc(r.opts[r.a])}</b>.</div>
        <button class="btn ink rise" data-mx="wa-next">${st.i + 1 < st.rounds.length ? 'Next clue' : 'See my score'}</button>`;
    },
  };

  // ------------------------------------------------------------ Earth Quests
  const QI = {
    bottle: '<path d="M10 3h4v3l2 3v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V9l2-3Z" fill="#9fd3e6" stroke="#1c1b19"/><path d="M9 13h6" stroke="#1c1b19"/>',
    bag: '<path d="M6 8h12l-1 13H7Z" fill="#f2f2ee" stroke="#1c1b19"/><path d="M9 8a3 3 0 0 1 6 0" fill="none" stroke="#1c1b19"/>',
    straw: '<path d="M8 21 L15 5 L18 3" fill="none" stroke="#d6544b" stroke-width="3"/><path d="M8 21 L15 5 L18 3" fill="none" stroke="#1c1b19" stroke-width="1" opacity=".4"/>',
    can: '<rect x="8" y="4" width="8" height="16" rx="2" fill="#d6544b" stroke="#1c1b19"/><path d="M8 8h8M8 16h8" stroke="#fff"/>',
    wrapper: '<path d="M5 9 L8 7 L16 7 L19 9 L19 15 L16 17 L8 17 L5 15 Z" fill="#e7cf6a" stroke="#1c1b19"/><path d="M9 12h6" stroke="#1c1b19"/>',
    shell: '<path d="M4 18 C4 9 20 9 20 18 Z" fill="#f6d9c7" stroke="#1c1b19"/><path d="M12 18 V11 M8 18 L10 12 M16 18 L14 12" stroke="#1c1b19"/>',
    shell2: '<path d="M6 17 C6 8 18 8 18 17 Z" fill="#fbe7ee" stroke="#1c1b19"/><path d="M12 17 V10" stroke="#1c1b19"/>',
    crab: '<ellipse cx="12" cy="14" rx="6" ry="4" fill="#e2763d" stroke="#1c1b19"/><path d="M6 13 L3 9 M18 13 L21 9 M7 17 L4 19 M17 17 L20 19" stroke="#1c1b19"/><circle cx="10" cy="11" r="1" fill="#1c1b19"/><circle cx="14" cy="11" r="1" fill="#1c1b19"/>',
    fan: '<circle cx="12" cy="10" r="6" fill="#dfe9f3" stroke="#1c1b19"/><path d="M12 10 L12 5 M12 10 L16 12 M12 10 L8 12" stroke="#1c1b19" stroke-width="2"/><path d="M12 16 V21 M8 21 H16" stroke="#1c1b19"/>',
    light: '<path d="M8 10 a4 4 0 1 1 8 0 c0 3 -2 4 -2 6 h-4 c0 -2 -2 -3 -2 -6 Z" fill="#f6e49a" stroke="#1c1b19"/><path d="M10 19 h4" stroke="#1c1b19"/>',
    tv: '<rect x="3" y="5" width="18" height="12" rx="2" fill="#5b76b0" stroke="#1c1b19"/><path d="M9 21 h6 M12 17 v4" stroke="#1c1b19"/>',
    aircon: '<rect x="3" y="6" width="18" height="7" rx="2" fill="#f2f2ee" stroke="#1c1b19"/><path d="M6 16 v3 M12 16 v3 M18 16 v3" stroke="#7fb3a8" stroke-width="2"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2" fill="#e6e4de" stroke="#1c1b19"/><path d="M6 10 h12 M9 6 v2 M9 13 v3" stroke="#1c1b19"/>',
  };
  const qic = (k, s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" stroke-width="1.3" stroke-linejoin="round" stroke-linecap="round">${QI[k] || ''}</svg>`;
  const EQ = {
    start() { st.done = {}; st.health = 40; st.score = 0; EQ.list(); },
    meter() { return `<div class="eq-meter"><span class="globe" style="--h:${st.health}%"></span><div><span class="k">Earth health</span><div class="bar"><i style="width:${st.health}%"></i></div></div><b>${st.health}%</b></div>`; },
    list() {
      const Q = D().quests, n = Object.keys(st.done).length;
      setProg(`${n}/${Q.length}`);
      if (n === Q.length) { body().innerHTML = result(st.score, Q.length, `<p class="mg-sub">Earth healed to ${st.health}%</p>`); return; }
      body().innerHTML = `<div class="eq">${EQ.meter()}<div class="eq-list">${Q.map((q, i) => `<button class="eq-q ${st.done[q.key] ? 'done' : ''}" data-mx="eq-open" data-v="${i}" ${st.done[q.key] ? 'disabled' : ''}>
        <span class="n">${st.done[q.key] ? tick(16) : i + 1}</span><span class="tx"><b>${esc(q.title)}</b><small>${st.done[q.key] ? 'Done · +15% Earth health' : esc(q.intro)}</small></span></button>`).join('')}</div>${badge()}</div>`;
    },
    open(i) {
      const q = D().quests[i]; st.q = q; st.qi = i; st.qmiss = 0;
      let inner = '';
      if (q.kind === 'tap') {
        const scene = q.key === 'beach' ? 'beach' : 'room';
        const spots = shuffle(q.items.map((it, j) => j)).map((j, n) => ({ it: q.items[j], x: 8 + (n % 4) * 23 + Math.random() * 8, y: (scene === 'beach' ? 42 : 30) + Math.floor(n / 4) * 30 + Math.random() * 8 }));
        inner = `<div class="eq-scene ${scene}">${spots.map(s => `<button class="eq-item" data-mx="eq-tap" data-v="${s.it[0]}" data-good="${s.it[2]}" style="left:${s.x}%;top:${s.y}%" aria-label="${esc(s.it[1])}">${qic(s.it[0])}</button>`).join('')}</div>`;
      } else if (q.kind === 'choose') {
        inner = `<div class="eq-opts">${q.opts.map(([t, good, d], j) => `<button class="eq-opt" data-mx="eq-choose" data-v="${j}"><b>${esc(t)}</b><small>${esc(d)}</small></button>`).join('')}</div>`;
      } else {
        st.sortQ = shuffle(q.items); st.sortI = 0;
        inner = `<div class="eq-sort" id="eqsort"></div>`;
      }
      body().innerHTML = `<div class="eq">${EQ.meter()}<div class="eq-quest rise"><span class="k">Quest ${i + 1} · ${esc(q.title)}</span><p>${esc(q.intro)}</p></div>${inner}<p class="mg-hint" id="eqhint"></p><div id="eqdone"></div></div>`;
      if (q.kind === 'sort') EQ.sortDraw();
    },
    tap(b) {
      if (b.dataset.good === '1') { b.classList.add('gone'); if (!body().querySelector('.eq-item[data-good="1"]:not(.gone)')) EQ.finish(); }
      else { st.qmiss++; b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); body().querySelector('#eqhint').textContent = st.q.key === 'beach' ? 'Leave that one, it belongs on the beach!' : 'Keep the fridge on, or your food goes bad!'; }
    },
    choose(b) {
      const o = st.q.opts[+b.dataset.v];
      if (o[1]) { b.classList.add('right'); body().querySelectorAll('.eq-opt').forEach(x => x.disabled = true); EQ.finish(); }
      else { st.qmiss++; b.classList.add('wrong', 'shake'); body().querySelector('#eqhint').textContent = 'Hmm, that one ends up in the bin after one meal. Try again.'; }
    },
    sortDraw() {
      const box = body().querySelector('#eqsort');
      if (st.sortI >= st.sortQ.length) { box.innerHTML = ''; EQ.finish(); return; }
      const [name] = st.sortQ[st.sortI];
      box.innerHTML = `<div class="eq-sortcard rise">${esc(name)}<small>${st.sortI + 1} of ${st.sortQ.length}</small></div>
        <div class="eq-bins"><button class="bin blue" data-mx="eq-sort" data-v="1"><i></i>Recycle</button><button class="bin grey" data-mx="eq-sort" data-v="0"><i></i>Trash</button></div>`;
    },
    sort(b) {
      const [name, rec] = st.sortQ[st.sortI], ok = +b.dataset.v === rec, h = body().querySelector('#eqhint');
      if (!ok) st.qmiss++;
      h.textContent = ok ? `✓ ${name}: ${rec ? 'recycle it' : 'that goes in the trash'}` : `✗ ${name} ${rec ? 'can be recycled' : 'goes in the trash, not the blue bin'}`;
      h.className = 'mg-hint ' + (ok ? 'good' : 'bad');
      st.sortI++; setTimeout(EQ.sortDraw, 650);
    },
    finish() {
      st.done[st.q.key] = true; st.health = Math.min(100, st.health + 15); if (!st.qmiss) st.score++;
      const m = body().querySelector('.eq-meter'); m.outerHTML = EQ.meter();
      body().querySelector('#eqdone').innerHTML = `<div class="eq-impact rise"><span class="k">${tick(14, '#2e9a58')} Quest done · the impact</span><p>${esc(st.q.impact)}</p>${badge()}
        <button class="btn ink" data-mx="eq-back">Back to quests</button></div>`;
      body().querySelector('#eqdone').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    },
  };

  const ENGINE = { factcap: FC, geo: GEO, jargon: JM, wiki: WR, whoami: WA, quests: EQ };

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
      case 'jt': JM.term(t); break;
      case 'jd': JM.def(t); break;
      case 'jm-next': st.i++; JM.draw(); break;
      case 'wl': WR.go(t.dataset.v); break;
      case 'wb': WR.back(); break;
      case 'wr-next': st.i++; WR.begin(); break;
      case 'wa': WA.pick(t); break;
      case 'wa-next': st.i++; WA.draw(); break;
      case 'eq-open': EQ.open(+t.dataset.v); break;
      case 'eq-tap': EQ.tap(t); break;
      case 'eq-choose': EQ.choose(t); break;
      case 'eq-sort': EQ.sort(t); break;
      case 'eq-back': EQ.list(); break;
    }
  }

  window.KNMiniGame = {
    GAMES, META,
    render(k, g, ctx) { st = { k, g, ...ctx }; return intro(); },
    mount(el, hooks) { st.el = el; st.hooks = hooks; el.addEventListener('click', onClick); },
    icon,
  };
})();
