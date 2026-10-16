/* Knowseum · interactive story engine.
   Draws the 14 frames per article from window.KN_STORY and runs every interaction:
   swipe cards, tap-to-reveal, hold, sliders, toggles, quizzes and more. */
(function () {
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const tickSvg = (s = 16, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13 L9.5 18 L20 6"/></svg>`;
  const eye = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12 C5 6 19 6 22 12 C19 18 5 18 2 12 Z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  const DRIVERS = { HAM: ['Lewis Hamilton', 'Ferrari'], NOR: ['Lando Norris', 'Reigning champion'], ANT: ['Kimi Antonelli', 'Mercedes'] };

  // ------------------------------------------------------------ block renderers
  const R = {
    meta: b => `<div class="sb-meta">${b.items.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div>`,
    cards: (b, id) => `<div class="sb-cards ${b.quotes ? 'quotes' : ''}">
      ${b.label ? `<div class="sb-lbl"><span>${esc(b.label)}</span><span class="cnt" data-cnt>1/${b.items.length}</span></div>` : `<div class="sb-lbl"><span></span><span class="cnt" data-cnt>1/${b.items.length}</span></div>`}
      <div class="track" data-x="cards" data-b="${id}">${b.items.map(it => b.quotes
        ? `<div class="card q"><span class="qm">“</span><p>${esc(it.q)}</p><div class="by"><span class="ini">${esc(it.name.split(' ').map(w => w[0]).join(''))}</span><div><b>${esc(it.name)}</b><small>${esc(it.role)}</small></div></div></div>`
        : `<div class="card p"><div class="pic"><span>${esc(it.ini)}</span></div><b>${esc(it.name)}</b><small>${esc(it.role)}</small></div>`).join('')}</div>
      <div class="pips">${b.items.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('')}</div></div>`,
    ladder: (b, id) => `<div class="sb-ladder"><div class="lbl">The career ladder</div><div class="rails">
      ${b.rungs.map(r => `<div class="rung"><i></i><span>${esc(r)}</span></div>`).join('')}
      <button class="rung miss" data-x="ladder" data-b="${id}"><i></i><span class="q">?</span><span class="nm">${esc(b.missing)}</span></button></div></div>
      <div class="sb-note dark hide" data-after><div class="k">${esc(b.note[0])}</div><p>${esc(b.note[1])}</p></div>`,
    quote2: (b, id) => `<button class="sb-quote2" data-x="quote2" data-b="${id}"><span class="qm">“</span><span class="a">${esc(b.a)}</span><span class="b">${esc(b.b)}</span><span class="tapme">Tap for the rest</span></button>
      <div class="sb-by"><b>${esc(b.by)}</b><small>${esc(b.sub || '')}</small></div>`,
    draw: (b, id) => {
      const gap = b.kind === 'gap';
      const svg = gap
        ? `<svg viewBox="0 0 320 170"><path d="M24 10 V150 H310" fill="none" stroke="currentColor" stroke-width="1.6"/>
            <path class="dp" d="M26 140 L300 28" stroke="currentColor" stroke-width="2.4" fill="none"/>
            <path class="dp red" d="M26 140 L300 118" stroke="var(--acc)" stroke-width="2.2" stroke-dasharray="7 5" fill="none"/>
            <path class="dp gapl" d="M286 34 V114" stroke="var(--acc)" stroke-width="1.2" stroke-dasharray="3 3" fill="none"/>
            <text class="dl" x="300" y="20" text-anchor="end">Economic growth</text><text class="dl red" x="300" y="136" text-anchor="end">Job creation</text>
            <text class="dl gapt" x="280" y="80" text-anchor="end" font-style="italic">the gap</text></svg>`
        : `<svg viewBox="0 0 320 180"><path d="M40 12 V168" stroke="currentColor" stroke-width="3" fill="none"/>
            <path class="dp" d="M40 90 L300 16" stroke="currentColor" stroke-width="3" fill="none"/>
            <path class="dp red" d="M40 90 L300 168" stroke="var(--acc)" stroke-width="3" fill="none"/>
            <text class="dl" x="300" y="12" text-anchor="end">Pulls ahead</text><text class="dl red" x="296" y="160" text-anchor="end">Falls behind</text>
            ${[0, 1, 2, 3, 4].map(i => `<circle class="mid" cx="${110 + i * 34}" cy="${92 + (i % 2) * 2}" r="5" fill="none" stroke="currentColor" stroke-dasharray="2 2" style="transition-delay:${i * .12}s"/>`).join('')}
            <text class="dl midt" x="120" y="78" font-style="italic">the broad middle</text></svg>`;
      return `<div class="sb-draw">${b.label ? `<div class="lbl">${esc(b.label)}</div>` : ''}${svg}<button class="sbtn" data-x="draw" data-b="${id}">▶ ${esc(b.btn)}</button></div>`;
    },
    note: b => `<div class="sb-note ${b.dark ? 'dark' : ''} ${b.blue ? 'blue' : ''} ${b.lime ? 'lime' : ''} ${b.tyre ? 'tyre' : ''}">${b.tyre ? '<span class="tyreart"><i></i></span>' : ''}<div><div class="k">${esc(b.k)}</div>${b.big ? `<div class="big">${esc(b.big)}</div>` : ''}<p>${esc(b.v)}</p></div></div>`,
    reveal: (b, id) => `<div class="sb-reveal ${b.flip ? 'flip' : ''} ${b.big ? 'bigflip' : ''}">${b.label ? `<div class="lbl">${esc(b.label)}</div>` : ''}
      ${b.items.map((it, i) => {
        const arr = Array.isArray(it) ? it : [b.roman ? ROMAN[i] : b.num ? String(i + 1) : '', it];
        const [n, t, d] = arr.length === 3 ? arr : [arr[0], arr[1], null];
        return `<button class="rv" data-x="reveal" data-b="${id}" data-i="${i}"><span class="n">${esc(n)}</span><span class="cover">Tap to reveal ${eye}</span><span class="txt"><b>${esc(t)}</b>${d ? `<small>${esc(d)}</small>` : ''}</span></button>`;
      }).join('')}
      ${b.after ? `<div class="sb-quote small hide" data-after><span class="qm">“</span><p>${esc(b.after.q)}</p><small>${esc(b.after.by)}</small></div>` : ''}</div>`,
    choice: (b, id) => `<div class="sb-choice">${b.opts.map((o, i) => `<button class="opt" data-x="choice" data-b="${id}" data-i="${i}"><span class="k">${esc(o.k)}</span><b>${esc(o.h)}</b>${o.pts.map(p => `<small>• ${esc(p)}</small>`).join('')}</button>`).join('')}
      <div class="stamp hide" data-after><b>${esc(b.stamp[0])}</b><span>${esc(b.stamp[1])}</span></div><p class="msg" data-msg></p></div>`,
    tabs: (b, id) => `<div class="sb-tabs"><div class="seg">${b.tabs.map((t, i) => `<button class="${i ? '' : 'on'}" data-x="tab" data-b="${id}" data-i="${i}">${esc(t.name)}</button>`).join('')}</div>
      ${b.tabs.map((t, i) => `<div class="panel ${i ? 'hide' : ''}" data-panel="${i}">${t.rows.map(([n, h, s]) => `<div class="row"><span class="n">${esc(n)}</span><div><b>${esc(h)}</b><small>${esc(s)}</small></div></div>`).join('')}</div>`).join('')}</div>`,
    chips: (b, id) => `<div class="sb-chips ${b.rows ? 'rows' : ''}">${b.cmd ? `<div class="cmd">${esc(b.cmd)}</div>` : ''}<div class="wrap">${b.items.map(([n, d], i) => `<button class="chip" data-x="chip" data-b="${id}" data-i="${i}">${b.rows ? '• ' : ''}${esc(n)}</button>`).join('')}</div>
      <div class="detail" data-detail><span class="ph">Pick one to see more</span></div></div>`,
    hub: (b, id) => `<div class="sb-hub"><svg class="lines" viewBox="0 0 320 220"><path d="M160 110 L70 40 M160 110 L250 40 M160 110 L160 200" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 4" fill="none"/></svg>
      <span class="me"><svg viewBox="0 0 40 40" width="46" height="46"><circle cx="20" cy="14" r="7" fill="currentColor"/><path d="M6 36 C8 24 32 24 34 36 Z" fill="currentColor"/></svg></span>
      ${b.nodes.map((n, i) => `<button class="node n${i}" data-x="hub" data-b="${id}" data-i="${i}">${esc(n)}</button>`).join('')}</div>
      <div class="sb-note hide" data-after><div class="k">${esc(b.done[0])}</div><p>${esc(b.done[1])}</p></div>`,
    wave: () => `<div class="sb-wave"><svg viewBox="0 0 320 70" preserveAspectRatio="none"><path class="w1" d="M0 40 C40 10 80 10 120 40 S200 70 240 40 S300 10 340 40 S420 70 460 40" stroke="var(--wave)" stroke-width="2.4" fill="none"/><path class="w2" d="M0 48 C40 22 80 22 120 48 S200 74 240 48 S300 22 340 48 S420 74 460 48" stroke="var(--wave)" stroke-width="1.4" fill="none" opacity=".5"/></svg></div>`,
    quote: b => `<div class="sb-quote"><span class="qm">“</span><p>${esc(b.q)}</p><small>${esc(b.by)}</small></div>`,
    quiz: (b, id) => `<div class="sb-quiz" data-b="${id}" data-q="0"><div class="qcard"><span class="k">Question <em data-qn>1</em> of ${b.qs.length}</span><b data-qq>${esc(b.qs[0].q)}</b></div>
      <div class="opts" data-opts>${quizOpts(b, 0, id)}</div><div data-qf></div></div>`,
    list: b => `<div class="sb-list">${b.label ? `<div class="lbl">${esc(b.label)}</div>` : ''}${b.items.map((t, i) => `<div class="li" style="animation-delay:${.15 + i * .12}s"><span>${['i', 'ii', 'iii', 'iv'][i]}</span><p>${esc(t)}</p></div>`).join('')}</div>`,
    lights: (b, id) => `<div class="sb-lights"><div class="gantry">${[0, 1, 2, 3, 4].map(i => `<span class="col"><i data-l="${i}"></i><i data-l="${i}"></i></span>`).join('')}</div>
      <p class="lstat" data-lstat>0 of 5 lights on…</p>
      <button class="holdbtn" data-hold="lights" data-b="${id}"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="54" class="trk"/><circle cx="60" cy="60" r="54" class="prog" data-ring/></svg><span><b>HOLD</b><small>to start</small></span></button>
      <div class="react" data-react>Your reaction: 0.000 s</div></div>`,
    race: (b, id) => `<div class="sb-race"><div class="lt"><span>Live timing</span><span class="fl"><i></i>Final laps</span></div>
      <div class="rows" data-rows>${b.steps[0].map((c, i) => raceRow(c, i, b.steps[0])).join('')}</div>
      <p class="cap" data-cap>${esc(b.caps[0] || '')}</p>
      ${b.mode === 'slider' ? `<div class="replay"><div class="lt"><span>Race replay</span><span>Start → chequered flag</span></div><input type="range" min="0" max="100" value="0" data-x="race-slide" data-b="${id}" aria-label="Replay the final laps"></div>`
        : `<button class="overtake" data-x="race-tap" data-b="${id}"><span class="chev">›››</span></button><div class="tapl">${esc(b.btn)}</div>`}</div>`,
    count: b => `<div class="sb-count"><div class="car"><svg viewBox="0 0 300 70"><path d="M10 50 L40 38 L120 34 L150 22 L190 22 L205 34 L280 36 L292 44 L292 52 L10 54 Z" fill="#e8eef0" stroke="#1c1b19" stroke-width="1.6"/><path d="M150 24 L172 10 L196 12" stroke="#1c1b19" stroke-width="3" fill="none"/><circle cx="70" cy="54" r="12" fill="#1c1b19"/><circle cx="240" cy="54" r="12" fill="#1c1b19"/><circle cx="70" cy="54" r="4" fill="#19d3c5"/><circle cx="240" cy="54" r="4" fill="#19d3c5"/><path d="M40 40 L130 38" stroke="#19d3c5" stroke-width="4"/></svg></div>
      <div class="nm"><div><b>${esc(b.name)}</b><small>${esc(b.sub)}</small></div><span class="pos">${esc(b.pos)}</span></div>
      <div class="st">${b.stats.map(([v, l]) => `<div><b data-count="${esc(v)}">${esc(v)}</b><small>${esc(l)}</small></div>`).join('')}</div></div>`,
    rows: b => `<div class="sb-rows">${b.items.map(([n, h, s]) => `<div class="row"><span class="n">${esc(n)}</span><div><b>${esc(h)}</b><small>${esc(s)}</small></div></div>`).join('')}</div>`,
    bars: (b, id) => `<div class="sb-bars"><div class="seg">${b.tabs.map((t, i) => `<button class="${i ? '' : 'on'}" data-x="bars" data-b="${id}" data-i="${i}">${esc(t.name)}</button>`).join('')}</div>
      <div class="chart" data-chart>${barsInner(b, 0)}</div></div>`,
    standings: (b, id) => `<div class="sb-stand">${b.rows.map(([n, t, p], i) => `<button class="row ${i ? '' : 'lead'}" data-x="stand" data-b="${id}" data-i="${i}"><span class="n">0${i + 1}</span><div class="who"><b>${esc(n)}</b><small>${esc(t)}</small><span class="gap" data-gap>${i ? `−${b.rows[0][2] - p} pts behind` : 'Leader'}</span></div><span class="p"><b>${p}</b><small>pts</small></span></button>`).join('')}</div>`,
    check: (b, id) => `<div class="sb-check ${b.term ? 'term' : ''}">${b.cmd ? `<div class="cmd">${esc(b.cmd)}</div>` : ''}
      ${b.items.map(([h, s], i) => `<button class="ck" data-x="check" data-b="${id}" data-i="${i}">${b.term ? '' : `<span class="num">${i + 1}</span>`}<span class="box"></span><div><b>${esc(h)}</b>${s ? `<small>${esc(s)}</small>` : ''}</div></button>`).join('')}
      ${b.term ? `<div class="cmd dim" data-ckc>&gt; 0/${b.items.length} clauses opened</div>` : ''}
      ${b.bar ? `<div class="lead"><div class="lt"><span>${esc(b.bar.label)}</span><span>Target</span></div><div class="nums"><b>${b.bar.now}</b><span>/ ${b.bar.target}</span></div><div class="bar"><i style="width:${b.bar.now / b.bar.target * 100}%"></i><em></em></div><small>Hamilton is third on 229 points.</small></div>` : ''}
      ${b.sw ? `<button class="ifsw hide" data-x="switch" data-b="${id}" data-after><div><span class="k">${esc(b.sw[0])}</span><p>${esc(b.sw[1])}</p></div><span class="tog"><i></i></span></button>` : ''}</div>`,
    statrow: b => `<div class="sb-statrow">${b.items.map(([v, l]) => `<div><b>${esc(v)}</b><small>${esc(l)}</small></div>`).join('')}</div>`,
    parties: b => `<div class="sb-parties"><div><span>${esc(b.a[0])}</span><b>${esc(b.a[1])}</b><small>${esc(b.a[2])}</small></div><i>↔</i><div><span>${esc(b.b[0])}</span><b>${esc(b.b[1])}</b><small>${esc(b.b[2])}</small></div></div>`,
    hold: (b, id) => `<div class="sb-term"><div class="cmd">${esc(b.cmd)}</div>${b.bars.map(n => `<div class="hb"><span>${esc(n)}</span><div class="bar"><i data-hb></i></div><em>???</em></div>`).join('')}
      <button class="holdscan" data-hold="scan" data-b="${id}"><i data-scanfill></i><span>Hold to scan</span></button></div>
      <p class="after hide" data-after>${esc(b.after)}</p>`,
    nodes: (b, id) => `<div class="sb-nodes"><div class="lbl">${esc(b.label)}</div>${b.on.map(n => `<div class="nd"><span>• ${esc(n)}</span><em>Online</em></div>`).join('')}
      <button class="nd neu" data-x="node" data-b="${id}"><span>• ${esc(b.neu)}</span><em data-ns>Tap to connect</em></button>
      <div class="grid hide" data-after>${b.grid.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div></div>`,
    log: (b, id) => `<div class="sb-log ${b.thread ? 'thread' : ''}">${b.cmd ? `<div class="cmd">${esc(b.cmd)}</div>` : ''}<div class="lines" data-lines></div>
      <button class="sbtn" data-x="log" data-b="${id}">${esc(b.btn)} <span data-logc>0/${b.items.length}</span></button>
      <p class="after hide" data-after>${esc(b.after)}</p></div>`,
    pages: (b, id) => `<div class="sb-pages"><div class="grid">${Array.from({ length: b.total }, () => '<i></i>').join('')}</div>
      <div class="leg"><span><i class="on"></i> Risk factors <b data-pc>0</b></span><span><i></i> Other pages ${b.total - b.hit}</span></div>
      <button class="sbtn" data-x="pages" data-b="${id}">Flip the pages</button></div>`,
    file: (b, id) => `<div class="sb-file"><button class="fhead" data-x="file" data-b="${id}"><span>${esc(b.head)}</span><em data-fs>[ open ]</em></button>
      <div class="frow"><span>Source</span><b>${esc(b.src)}</b></div>${b.items.map((t, i) => `<div class="frow warn"><span>Warning_0${i + 1}</span><b class="redact" data-w>${esc(t)}</b></div>`).join('')}
      <svg class="sig" viewBox="0 0 300 40"><path d="M0 20 C30 0 50 40 80 20 S130 0 160 20 S210 40 240 20 S290 0 300 20" stroke="#d8ff3d" stroke-width="1.6" fill="none"/></svg></div>`,
    money: (b, id) => `<div class="sb-money"><div class="hd"><span>gic_rounds.csv</span><span>US$ billion</span></div>${b.items.map(([d, v, l, s], i) => `<button class="mr" data-x="money" data-b="${id}" data-i="${i}"><div class="top"><span>${esc(d)}</span><b>${v}</b></div><div class="bar"><i style="--w:${v / 30 * 100}%"></i></div><div class="det"><small>${esc(l)}</small><small class="hl">&gt; ${esc(s)}</small></div></button>`).join('')}</div>`,
    rank: (b, id) => `<div class="sb-rank"><div class="list" data-rlist>${['#001', '#002', '#003', '...', '#121'].map(r => `<div class="rr"><span>${r}</span><em>[ ---------- ]</em></div>`).join('')}</div>
      <button class="sbtn" data-x="rank" data-b="${id}">Run the ranking</button>
      <div class="usage hide" data-after><div class="lt">Usage vs. size</div><div class="ub"><span>Expected</span><i style="--w:12%"></i></div><div class="ub act"><span>Actual</span><i style="--w:70%"></i><b>~6×</b></div><p>Nearly six times what Singapore’s size alone would predict.</p></div></div>`,
    bignum: b => `<div class="sb-big"><b data-countto="${b.n}">0</b><span class="plus">${b.plus ? '+' : ''}</span><p>${esc(b.v)}</p></div>`,
  };
  function quizOpts(b, qi, id) { return b.qs[qi].o.map((o, i) => `<button class="qo" data-x="quiz" data-b="${id}" data-i="${i}"><span class="L">${'ABC'[i]}</span><span>${esc(o)}</span><span class="mk"></span></button>`).join(''); }
  function raceRow(code, i) { const [n, t] = DRIVERS[code]; return `<div class="rr ${code === 'ANT' ? 'ant' : ''}" data-code="${code}" style="--y:${i}"><span class="pos">${i + 3}</span><span class="bar"></span><div><b>${code}</b><small>${esc(n)} · ${esc(t)}</small></div><span class="tag" data-tag></span></div>`; }
  function barsInner(b, i) { const t = b.tabs[i], m = Math.max(t.a, t.b); return `<div class="bcol"><em>${esc(t.la)}</em><i style="--h:${t.a / m * 100}%"></i><b>${esc(b.names[0])}</b></div><div class="bcol r"><em>${esc(t.lb)}</em><i style="--h:${Math.max(4, t.b / m * 100)}%"></i><b>${esc(b.names[1])}</b></div>`; }

  // ------------------------------------------------------------ frame
  function frameHTML(k, i) {
    const S = window.KN_STORY[k], f = S.frames[i], n = S.frames.length;
    const lab = S.theme === 'case' ? `<span>${esc(S.label)}</span><em>No. ${String(i + 1).padStart(2, '0')} of ${n}</em>` : S.theme === 'race' ? `<span>${esc(S.label)}</span><em>${String(i + 1).padStart(2, '0')} / ${n}</em>` : `<span>KNOWSEUM_<small>TECH.WING // STEP INTO STORY</small></span><em>SCN_${String(i + 1).padStart(2, '0')}<small>${String(i + 1).padStart(2, '0')}/${n}</small></em>`;
    const head = `<div class="sp-top"><div class="segs">${S.frames.map((_, j) => `<i class="${j < i ? 'on' : j === i ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="bar"><button class="x" data-act="story-close" aria-label="Close story"><svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"><path d="M6 6 L18 18 M18 6 L6 18"/></svg></button><div class="lab">${lab}</div><span class="sp40"></span></div></div>`;
    const blocks = (f.blocks || []).map((b, j) => R[b.t](b, j)).join('');
    const title = (f.h[0] || f.h[1]) ? `<h1 class="sp-h"><span>${esc(f.h[0])}</span>${f.h[1] ? `<em>${esc(f.h[1])}</em>` : ''}</h1>` : '';
    let body;
    if (f.cover) {
      body = `<div class="sp-cover"><img src="assets/paintings/${f.img}.webp" alt=""><div class="shade"></div>
        <div class="cv"><span class="kick">${esc(f.kick)}</span>${title}<p class="lede">${esc(f.body)}</p>${blocks}
        <button class="cta" data-sx="next">${esc(f.cta)} <span>→</span></button><small class="src">${esc(S.source)}</small></div></div>`;
    } else {
      body = `<div class="sp-body"><span class="kick">${esc(f.kick)}</span>${title}${f.body ? `<p class="lede">${esc(f.body)}</p>` : ''}<div class="blocks">${blocks}</div>
        ${f.end ? `<div class="endbtns"><button class="cta" data-sx="finish">Back to the wall</button><button class="cta ghost" data-act="read-article">Read the article</button><span class="visited"><b>Knowseum</b><em>Visited</em></span></div>` : ''}</div>`;
    }
    const foot = f.cover || f.end ? `<div class="sp-foot"><span class="sp-hint">${esc(f.hint)}</span></div>`
      : `<div class="sp-foot"><span class="sp-hint" data-hint>${esc(f.hint)}</span><div class="nav"><button class="back" data-sx="prev" aria-label="Previous frame">‹</button><button class="next" data-sx="next">Continue <span>›</span></button></div></div>`;
    return `<div class="sp t-${S.theme} ${f.dark ? 'dk' : 'lt'} ${f.cover ? 'cover' : ''}" style="--acc:${S.accent}">${head}${body}${foot}</div>`;
  }

  // ------------------------------------------------------------ player
  let st = null;
  function mount(el, k, hooks) {
    st = { k, i: 0, el, hooks, frame: null, done: {} };
    show(0, 0);
    el.addEventListener('click', onClick);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('input', onInput);
    let x0 = null, y0 = 0;
    el.addEventListener('touchstart', e => { if (e.target.closest('.track, input, [data-hold]')) { x0 = null; return; } x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener('touchend', e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) step(dx < 0 ? 1 : -1); });
    document.onkeydown = e => { if (!st || st.el !== el || !el.isConnected) return; if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); };
  }
  function show(i, dir) {
    const box = st.el.querySelector('#sp-stage');
    const old = box.firstElementChild;
    const wrap = document.createElement('div');
    wrap.className = 'sp-frame ' + (dir > 0 ? 'in-r' : dir < 0 ? 'in-l' : 'in-f');
    wrap.innerHTML = frameHTML(st.k, i);
    box.appendChild(wrap);
    if (old) { old.classList.add(dir > 0 ? 'out-l' : 'out-r'); setTimeout(() => old.remove(), 360); }
    st.i = i; st.frame = wrap;
    const f = window.KN_STORY[st.k].frames[i];
    // frames with nothing to do are "done" straight away
    const needs = (f.blocks || []).some(b => !['meta', 'note', 'quote', 'list', 'rows', 'statrow', 'parties', 'wave', 'count', 'bignum'].includes(b.t));
    if (!needs) markDone(true);
    else if (st.done[i]) markDone(true);
    // count-ups
    wrap.querySelectorAll('[data-count]').forEach(n => countUp(n, n.dataset.count));
    wrap.querySelectorAll('[data-countto]').forEach(n => countUp(n, n.dataset.countto, true));
    // cards counter on scroll
    wrap.querySelectorAll('.track').forEach(t => t.addEventListener('scroll', () => {
      const w = t.firstElementChild.getBoundingClientRect().width + 12, idx = Math.round(t.scrollLeft / w), n = t.children.length;
      const p = t.parentElement; p.querySelector('[data-cnt]').textContent = `${Math.min(n, idx + 1)}/${n}`;
      p.querySelectorAll('.pips i').forEach((d, j) => d.classList.toggle('on', j === idx));
      if (idx >= n - 1) markDone();
    }, { passive: true }));
  }
  function countUp(node, raw, fmt) {
    const m = String(raw).match(/^([+]?)(\d+)(.*)$/); if (!m) return;
    const end = +m[2], t0 = performance.now(), dur = 900;
    const tick = t => { const p = Math.min(1, (t - t0) / dur), v = Math.round(end * (1 - Math.pow(1 - p, 3))); node.textContent = m[1] + (fmt ? v.toLocaleString('en-SG') : v) + m[3]; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  function markDone(silent) {
    st.done[st.i] = true;
    const nx = st.frame.querySelector('.next'); if (nx) nx.classList.add('ready');
    if (!silent) { const h = st.frame.querySelector('[data-hint]'); if (h) { h.textContent = 'Nice. Tap continue or swipe on'; h.classList.add('ok'); } }
  }
  function step(d) {
    const n = st.i + d, N = window.KN_STORY[st.k].frames.length;
    if (n < 0) return;
    if (n >= N) { st.hooks.finish(); return; }
    show(n, d);
  }
  const blk = t => window.KN_STORY[st.k].frames[st.i].blocks[+t.dataset.b];
  const after = (scope, sel = '[data-after]') => scope.querySelectorAll(sel).forEach(a => a.classList.remove('hide'));

  function onClick(e) {
    const sx = e.target.closest('[data-sx]');
    if (sx) { if (sx.dataset.sx === 'next') step(1); else if (sx.dataset.sx === 'prev') step(-1); else st.hooks.finish(); return; }
    const t = e.target.closest('[data-x]'); if (!t) return;
    const b = blk(t), host = t.closest('.blocks') || st.frame, x = t.dataset.x;
    if (X[x]) X[x](t, b, host);
  }
  const X = {
    ladder: (t, b, host) => { if (t.classList.contains('on')) return; t.classList.add('on'); after(host); markDone(); },
    quote2: t => { t.classList.add('on'); markDone(); },
    draw: (t, b) => { const d = t.closest('.sb-draw'); d.classList.add('go'); t.textContent = '↻ Replay'; setTimeout(markDone, 1200);
      t.onclick = () => { d.classList.remove('go'); void d.offsetWidth; d.classList.add('go'); }; },
    reveal: (t, b) => { t.classList.add('on'); const p = t.closest('.sb-reveal'); if (p.querySelectorAll('.rv:not(.on)').length === 0) { after(p); markDone(); } },
    choice: (t, b) => { const i = +t.dataset.i, p = t.closest('.sb-choice'), msg = p.querySelector('[data-msg]');
      if (i === b.ans) { p.querySelectorAll('.opt').forEach((o, j) => o.classList.toggle(j === i ? 'right' : 'dim', true)); after(p); msg.textContent = ''; markDone(); }
      else { t.classList.remove('shake'); void t.offsetWidth; t.classList.add('shake', 'wrong'); msg.textContent = b.opts[i].no || 'Try the other one.'; } },
    tab: (t) => { const p = t.closest('.sb-tabs'), i = t.dataset.i; p.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === t)); p.querySelectorAll('[data-panel]').forEach(x => x.classList.toggle('hide', x.dataset.panel !== i)); markDone(); },
    chip: (t, b) => { const p = t.closest('.sb-chips'), [n, d] = b.items[+t.dataset.i]; p.querySelectorAll('.chip').forEach(c => c.classList.toggle('on', c === t)); t.classList.add('seen');
      const det = p.querySelector('[data-detail]'); det.innerHTML = `<b>${esc(n)}</b><p>${esc(d)}</p>`; det.classList.remove('pop'); void det.offsetWidth; det.classList.add('pop');
      if (p.querySelectorAll('.chip.seen').length >= Math.min(2, b.items.length)) markDone(); },
    hub: (t, b, host) => { t.classList.add('on'); const p = t.closest('.sb-hub'); p.classList.add('l' + t.dataset.i); if (!p.querySelector('.node:not(.on)')) { p.classList.add('all'); after(host); markDone(); } },
    quiz: (t, b) => {
      const p = t.closest('.sb-quiz'), qi = +p.dataset.q, q = b.qs[qi], i = +t.dataset.i, ok = i === q.a;
      const opts = p.querySelector('[data-opts]'); if (opts.classList.contains('locked')) return; opts.classList.add('locked');
      [...opts.children].forEach((o, j) => { if (j === q.a) { o.classList.add('right'); o.querySelector('.mk').innerHTML = tickSvg(14); } else if (j === i) { o.classList.add('wrong', 'shake'); o.querySelector('.mk').textContent = '✕'; } else o.classList.add('dim'); });
      p.dataset.score = (+p.dataset.score || 0) + (ok ? 1 : 0);
      const last = qi === b.qs.length - 1;
      p.querySelector('[data-qf]').innerHTML = `<div class="qfeed ${ok ? 'ok' : 'no'}"><span class="k">${ok ? 'Correct' : 'Not quite'}</span><p>${esc(q.w)}</p></div>
        <button class="sbtn wide" data-x="${last ? 'quiz-end' : 'quiz-next'}" data-b="${t.dataset.b}">${last ? 'See my score' : 'Next question'}</button>`;
    },
    'quiz-next': (t, b) => { const p = t.closest('.sb-quiz'), qi = +p.dataset.q + 1; p.dataset.q = qi;
      p.querySelector('[data-qn]').textContent = qi + 1; p.querySelector('[data-qq]').textContent = b.qs[qi].q;
      const o = p.querySelector('[data-opts]'); o.classList.remove('locked'); o.innerHTML = quizOpts(b, qi, t.dataset.b); p.querySelector('[data-qf]').innerHTML = ''; },
    'quiz-end': (t, b) => { const p = t.closest('.sb-quiz'), s = +p.dataset.score || 0;
      p.innerHTML = `<div class="qdone"><b>${s}/${b.qs.length}</b><p>${s === b.qs.length ? 'Perfect. You were paying attention.' : s ? 'Nice work. The full quiz on the wall goes deeper.' : 'No stress. The full quiz on the wall will help it stick.'}</p></div>`; markDone(); },
    'race-tap': (t, b) => { if (t.classList.contains('used')) return; t.classList.add('used'); raceTo(t.closest('.sb-race'), b, 1); markDone(); },
    bars: (t, b) => { const p = t.closest('.sb-bars'); p.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === t)); p.querySelector('[data-chart]').innerHTML = barsInner(b, +t.dataset.i); markDone(); },
    stand: (t) => { const p = t.closest('.sb-stand'); p.querySelectorAll('.row').forEach(r => r.classList.toggle('on', r === t)); t.classList.add('seen'); if (p.querySelectorAll('.row.seen').length >= 2) markDone(); },
    check: (t, b) => { t.classList.toggle('on'); const p = t.closest('.sb-check'), n = p.querySelectorAll('.ck.on').length;
      const c = p.querySelector('[data-ckc]'); if (c) c.textContent = `> ${n}/${b.items.length} clauses opened`;
      if (n === b.items.length) { after(p); markDone(); } },
    switch: t => t.classList.toggle('on'),
    node: (t, b, host) => { if (t.classList.contains('on')) return; t.classList.add('on'); t.querySelector('[data-ns]').textContent = 'New · 14.10'; after(t.parentElement); markDone(); },
    log: (t, b) => { const p = t.closest('.sb-log'), L = p.querySelector('[data-lines]'), n = L.children.length; if (n >= b.items.length) return;
      const [a, v] = b.items[n], d = document.createElement('div'); d.className = 'ln'; d.innerHTML = `<span>${esc(a)}</span><p></p>`; L.appendChild(d); type(d.querySelector('p'), v);
      p.querySelector('[data-logc]').textContent = `${n + 1}/${b.items.length}`;
      if (n + 1 === b.items.length) { t.classList.add('hide'); setTimeout(() => { after(p); markDone(); }, 500); } },
    pages: (t, b) => { if (t.classList.contains('used')) return; t.classList.add('used'); const p = t.closest('.sb-pages'), sq = p.querySelectorAll('.grid i'), c = p.querySelector('[data-pc]');
      let i = 0; const go = () => { for (let j = 0; j < 4 && i < b.hit; j++, i++) sq[i].classList.add('on'); c.textContent = i; if (i < b.hit) requestAnimationFrame(go); else { t.textContent = '80 of 261 pages: risk factors'; markDone(); } }; go(); },
    file: t => { if (t.classList.contains('on')) return; t.classList.add('on'); t.querySelector('[data-fs]').textContent = '[ opened ]';
      t.parentElement.querySelectorAll('[data-w]').forEach((w, i) => setTimeout(() => w.classList.add('show'), 350 + i * 450)); setTimeout(markDone, 1700); },
    money: t => { t.classList.add('on'); const p = t.closest('.sb-money'); if (!p.querySelector('.mr:not(.on)')) markDone(); },
    rank: t => { if (t.classList.contains('used')) return; t.classList.add('used'); const rows = t.parentElement.querySelectorAll('.rr'); let n = 0;
      const seq = [0, 2, 4, 3, 0, 2, 1]; const tick = () => { rows.forEach(r => r.classList.remove('hl')); rows[seq[n]].classList.add('hl'); n++;
        if (n < seq.length) setTimeout(tick, 160); else { rows[1].classList.add('win'); rows[1].querySelector('em').textContent = 'SINGAPORE'; t.classList.add('hide'); after(t.parentElement); markDone(); } }; tick(); },
  };
  function type(node, text) { let i = 0; const tk = () => { i += 2; node.textContent = text.slice(0, i); if (i < text.length) setTimeout(tk, 14); }; tk(); }
  function raceTo(p, b, s) {
    const order = b.steps[s];
    p.querySelectorAll('.rr').forEach(r => { const y = order.indexOf(r.dataset.code); const was = +getComputedStyle(r).getPropertyValue('--y'); r.style.setProperty('--y', y); r.querySelector('.pos').textContent = y + 3;
      const tag = r.querySelector('[data-tag]'); tag.textContent = y < was ? '▲' : y > was ? '▼' : ''; tag.className = 'tag ' + (y < was ? 'up' : y > was ? 'down' : ''); });
    const cap = p.querySelector('[data-cap]'); cap.textContent = b.caps[s] || ''; cap.classList.remove('pop'); void cap.offsetWidth; cap.classList.add('pop');
  }
  function onInput(e) {
    const t = e.target.closest('[data-x="race-slide"]'); if (!t) return;
    const b = blk(t), s = Math.min(b.steps.length - 1, Math.floor(+t.value / 100 * (b.steps.length - .01)));
    const p = t.closest('.sb-race'); if (+p.dataset.s !== s) { p.dataset.s = s; raceTo(p, b, s); }
    if (s === b.steps.length - 1) markDone();
  }
  // hold interactions (lights-out game, scan)
  function onDown(e) {
    const t = e.target.closest('[data-hold]'); if (!t) return;
    e.preventDefault(); t.setPointerCapture && t.setPointerCapture(e.pointerId);
    if (t.dataset.hold === 'scan') return holdScan(t, e);
    holdLights(t);
  }
  function holdScan(t) {
    if (t.classList.contains('done')) return;
    const p = t.closest('.blocks') || st.frame, fills = p.querySelectorAll('[data-hb]'), f = t.querySelector('[data-scanfill]');
    let v = +t.dataset.v || 0, raf, last = performance.now();
    const run = now => { v = Math.min(1, v + (now - last) / 1600); last = now; t.dataset.v = v; f.style.width = v * 100 + '%'; fills.forEach((x, i) => x.style.width = Math.min(1, v * 1.2 - i * .1) * 100 + '%');
      if (v >= 1) { t.classList.add('done'); t.querySelector('span').textContent = 'Scan complete: still ???'; after(p); markDone(); return; } raf = requestAnimationFrame(run); };
    raf = requestAnimationFrame(run);
    const stop = () => { cancelAnimationFrame(raf); t.removeEventListener('pointerup', stop); t.removeEventListener('pointercancel', stop); };
    t.addEventListener('pointerup', stop); t.addEventListener('pointercancel', stop);
  }
  function holdLights(t) {
    const p = t.closest('.sb-lights'), cols = p.querySelectorAll('.col'), stat = p.querySelector('[data-lstat]'), react = p.querySelector('[data-react]'), ring = p.querySelector('[data-ring]');
    p.querySelectorAll('.col i').forEach(i => i.classList.remove('on')); react.className = 'react'; react.textContent = 'Wait for lights out…';
    t.classList.add('held'); ring.style.transition = 'stroke-dashoffset 3.6s linear'; ring.style.strokeDashoffset = '0';
    let n = 0, outAt = 0, timers = [];
    const on = () => { if (n < 5) { cols[n].querySelectorAll('i').forEach(i => i.classList.add('on')); n++; stat.textContent = `${n} of 5 lights on…`; timers.push(setTimeout(on, 650)); }
      else timers.push(setTimeout(() => { p.querySelectorAll('.col i').forEach(i => i.classList.remove('on')); stat.textContent = 'Lights out! Let go!'; outAt = performance.now(); }, 500 + Math.random() * 1500)); };
    timers.push(setTimeout(on, 400));
    const up = () => {
      timers.forEach(clearTimeout); t.classList.remove('held'); ring.style.transition = 'none'; ring.style.strokeDashoffset = '';
      if (!outAt) { react.textContent = 'Jump start! You let go too early. Hold again.'; react.classList.add('bad'); stat.textContent = '0 of 5 lights on…'; p.querySelectorAll('.col i').forEach(i => i.classList.remove('on')); }
      else { const ms = (performance.now() - outAt) / 1000; react.textContent = `Your reaction: ${ms.toFixed(3)} s`; react.classList.add('good'); stat.textContent = ms < .3 ? 'Lightning start!' : 'Away you go. Hold again to retry.'; markDone(); }
      t.removeEventListener('pointerup', up); t.removeEventListener('pointercancel', up);
    };
    t.addEventListener('pointerup', up); t.addEventListener('pointercancel', up);
  }

  window.KNStory = { mount, frameHTML, count: k => window.KN_STORY[k].frames.length };
})();
