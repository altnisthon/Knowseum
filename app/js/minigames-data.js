/* Knowseum · mini game content (2 per wing).
   Fact or Cap (every wing) · GeoGuessr (World) · Wikirace (Singapore, Culture)
   Guess Who (SG Politics) · Hole-some Recycling (Environment) · Real or Fake? (Tech)
   DEMO NOTE: every item below was drafted by AI for the prototype. In the live product each item
   carries a status (ai-draft -> in-review -> verified) and only verified items are shown.
   Edit freely: each game is plain data. */
window.KN_MINI = {
  // shown on every game's start screen and in the "How this is checked" sheet
  vetting: {
    status: 'ai-draft',
    badge: 'AI draft · pending newsroom check',
    steps: [
      ['AI drafts', 'An AI writes background facts, clues and explainers from the outlet’s own archive and trusted references.'],
      ['Journalist checks', 'A Tier 1 journalist checks every claim against at least one source, and fixes or cuts anything shaky.'],
      ['Editor signs off', 'An editor approves the set. Each card then shows “Verified by” with the newsroom and date.'],
      ['Live, and still watched', 'Readers can flag a card. Flagged cards are pulled while the desk re-checks them.'],
    ],
  },

  // ------------------------------------------------------------------ Fact or Cap (every wing)
  factcap: {
    singapore: [
      ['The Singapore Grand Prix was F1’s first-ever night race.', true, 'It made history in 2008 as Formula One’s first race held at night, under floodlights.'],
      ['The Singapore GP is raced on a permanent racetrack.', false, 'It’s a street circuit. Public roads around Marina Bay are closed off and turned into a track for race weekend.'],
      ['Every F1 race is exactly 62 laps.', false, 'Lap counts depend on how long the track is. Races are set to about 305 km, so a short track needs more laps.'],
      ['Drivers can lose a few kilos of sweat during the Singapore race.', true, 'Heat and humidity make it one of the toughest races on the calendar for drivers’ bodies.'],
      ['The winner of a Grand Prix gets 25 points.', true, 'Points go down from there: 18 for second, 15 for third, and so on to 10th place.'],
      ['A good F1 pit stop takes more than 30 seconds.', false, 'Top crews change all four tyres in about 2 to 3 seconds.'],
      ['The drivers’ champion is the driver with the most points across the whole season.', true, 'Points from every race add up, which is why one weekend can swing a title race.'],
      ['Marina Bay was built on land reclaimed from the sea.', true, 'Much of the Marina Bay area is reclaimed land, created over several decades.'],
    ],
    politics: [
      ['Singapore’s President is elected by citizens.', true, 'Singapore has held elections for President since 1993.'],
      ['The Prime Minister is Singapore’s head of state.', false, 'The President is head of state. The Prime Minister leads the government.'],
      ['You can vote in Singapore’s elections at 18.', false, 'The voting age in Singapore is 21.'],
      ['Voting is compulsory for Singapore citizens.', true, 'Voters who don’t vote have their names taken off the register until they apply to restore them.'],
      ['SkillsFuture Credit can be used on approved courses.', true, 'It’s meant to help Singaporeans keep learning new skills after school.'],
      ['An entry-level job usually needs years of work experience.', false, 'Entry-level jobs are the “first rung” for people starting out, like fresh grads.'],
      ['The IMF and World Bank hold their annual meetings together.', true, 'Their joint Annual Meetings bring finance ministers and central bankers from around the world.'],
      ['Internships can count as “applied learning”.', true, 'Learning by doing real work, like internships and work-study, is what applied learning means.'],
    ],
    tech: [
      ['AI models can state wrong facts confidently.', true, 'This is called “hallucination”, and it’s one reason AI answers need checking.'],
      ['An MOU is always a legally binding contract.', false, 'A memorandum of understanding usually sets out shared plans and intentions. It’s often not legally binding.'],
      ['An IPO is when a private company first sells shares to the public.', true, 'IPO stands for initial public offering.'],
      ['Claude is made by OpenAI.', false, 'Claude is made by Anthropic. OpenAI makes ChatGPT.'],
      ['AI agents can carry out multi-step tasks with little human input.', true, 'That’s what makes them useful, and why safety testing them matters.'],
      ['A sovereign wealth fund invests money on behalf of a country.', true, 'GIC is one of the funds that manages Singapore’s reserves.'],
      ['Red-teaming means testing an AI by trying to make it misbehave.', true, 'Testers deliberately try to break the system so problems are found before it’s released.'],
      ['Once an AI is released, it can’t be tested any more.', false, 'Models keep being evaluated and monitored after release.'],
    ],
    world: [
      ['Kyiv is the capital of Ukraine.', true, 'Kyiv sits on the Dnipro River and is Ukraine’s largest city.'],
      ['Ukraine is the largest country entirely within Europe.', true, 'Russia is bigger, but it stretches across both Europe and Asia.'],
      ['Military drones always have a pilot on board.', false, 'Drones are uncrewed. They’re flown remotely or follow a programmed route.'],
      ['Russia launched its full-scale invasion of Ukraine in 2024.', false, 'The full-scale invasion began in February 2022.'],
      ['Ukraine’s flag is blue and yellow.', true, 'The two bands are often said to stand for blue sky over yellow wheat fields.'],
      ['Ukraine is a member of NATO.', false, 'Ukraine has applied to join NATO but is not a member.'],
      ['Air-raid sirens warn people to take shelter.', true, 'In Ukraine, apps also send alerts when attacks are expected.'],
      ['The Black Sea lies to Ukraine’s south.', true, 'Ukraine’s southern coast runs along the Black Sea and the Sea of Azov.'],
    ],
    culture: [
      ['“Chinamaxxing” is an online trend of copying everyday habits linked to China.', true, 'Think warm water, boiled apples and house slippers, shared as short videos.'],
      ['Copying a culture’s habits makes you part of that culture.', false, 'That’s the point the headline makes: boiling apples won’t make you Chinese. Culture is more than habits.'],
      ['Drinking warm water is a common habit in China.', true, 'Many people prefer warm or hot water over iced drinks.'],
      ['Lunar New Year falls on the same date every year.', false, 'It follows the lunar calendar, so it lands somewhere between late January and mid-February.'],
      ['Tanghulu is candied fruit on a stick.', true, 'It’s a street snack from northern China, traditionally made with hawthorn berries.'],
      ['Hanfu means traditional Han Chinese clothing.', true, 'It’s having a big revival among young people, partly thanks to social media.'],
      ['Chopsticks are only used in China.', false, 'They’re used across East and Southeast Asia, including Japan, Korea, Vietnam and Singapore.'],
      ['Mandarin has more native speakers than any other language.', true, 'Counting first languages only, Mandarin Chinese is number one.'],
    ],
    environment: [
      ['Haze over Singapore mainly comes from forest and peatland fires in the region.', true, 'Smoke from fires, often linked to clearing land, drifts across borders on the wind.'],
      ['PSI stands for Pollutant Standards Index.', true, 'It’s the number Singapore uses to report air quality.'],
      ['A 24-hour PSI above 100 is in the “unhealthy” range.', true, '0 to 50 is good, 51 to 100 moderate, 101 to 200 unhealthy.'],
      ['A cloth mask blocks haze as well as an N95 mask.', false, 'N95 masks filter tiny particles. Cloth and surgical masks let most of them through.'],
      ['Peat fires can keep burning underground.', true, 'Peat is old, carbon-rich soil, so fires can smoulder below the surface for weeks.'],
      ['Haze in Singapore is mostly caused by car exhaust.', false, 'Local traffic adds pollution, but haze episodes come from regional fires.'],
      ['PM2.5 particles are small enough to get deep into your lungs.', true, 'They’re 2.5 micrometres or smaller, much thinner than a human hair.'],
      ['People who work outdoors are more exposed to haze.', true, 'Delivery riders, cleaners and construction workers breathe outdoor air for hours.'],
    ],
  },

  // ------------------------------------------------------------------ World: GeoGuesser
  geo: [
    { name: 'Kyiv, Ukraine', lat: 50.45, lon: 30.52, clue: 'Golden domes, a wide river called the Dnipro, and the capital of the largest country entirely within Europe.',
      fact: 'Kyiv’s Arsenalna metro station is one of the deepest in the world, about 105 m underground.' },
    { name: 'Giza, Egypt', lat: 29.98, lon: 31.13, clue: 'Three giant stone pyramids sit at the edge of the desert, next to a huge city on the Nile.',
      fact: 'The Great Pyramid was the tallest human-made structure on Earth for nearly 4,000 years.' },
    { name: 'Rio de Janeiro, Brazil', lat: -22.95, lon: -43.21, clue: 'A giant statue with open arms looks over beaches, mountains and a famous carnival city.',
      fact: 'Christ the Redeemer was voted one of the New Seven Wonders of the World in 2007.' },
    { name: 'Reykjavík, Iceland', lat: 64.15, lon: -21.94, clue: 'A small capital near the Arctic Circle, with volcanoes, geysers and the northern lights.',
      fact: 'Iceland heats most of its homes with geothermal energy from deep underground.' },
    { name: 'Sydney, Australia', lat: -33.86, lon: 151.21, clue: 'A harbour city with an opera house shaped like sails and a big steel arch bridge.',
      fact: 'The Sydney Opera House roof is covered in over a million tiles.' },
    { name: 'Nairobi, Kenya', lat: -1.29, lon: 36.82, clue: 'A capital city in East Africa where you can spot giraffes and lions with skyscrapers in the background.',
      fact: 'Nairobi National Park sits right next to the city, so wildlife lives minutes from downtown.' },
  ],

  // ------------------------------------------------------------------ Wikirace (Singapore + Culture)
  // page text: [[Link]] makes a clickable link to another page in the same set
  wiki: {
    singapore: {
      races: [['Merlion', 'Formula One'], ['Jewel Changi Airport', 'UNESCO']],
      pages: {
        'Singapore': 'A city-state in [[Southeast Asia]] that became independent in 1965. Visitors know it for [[Marina Bay]], [[Changi Airport]] and its [[hawker culture]].',
        'Southeast Asia': 'A region south of China and east of India, made up of 11 countries including [[Singapore]].',
        'Marina Bay': 'A bay in the city centre of [[Singapore]], largely built on reclaimed land. It’s home to [[Gardens by the Bay]], the [[Merlion]] and the [[Marina Bay Street Circuit]].',
        'Merlion': 'Singapore’s half-lion, half-fish mascot. The best-known statue spouts water into [[Marina Bay]].',
        'Gardens by the Bay': 'A nature park that opened in 2012, famous for its giant Supertrees. It sits beside [[Marina Bay]] in [[Singapore]].',
        'Marina Bay Street Circuit': 'A street circuit made from public roads around [[Marina Bay]]. It hosts the [[Singapore Grand Prix]].',
        'Singapore Grand Prix': 'A race held at night under floodlights since 2008, on the [[Marina Bay Street Circuit]]. It’s part of the [[Formula One]] world championship.',
        'Formula One': 'The top level of single-seater motor racing, with races around the world, including the [[Singapore Grand Prix]].',
        'Changi Airport': 'Singapore’s main airport, opened in 1981. It’s linked to [[Jewel Changi Airport]] and is a gateway to [[Singapore]].',
        'Jewel Changi Airport': 'A dome of shops and gardens at [[Changi Airport]], opened in 2019. Its Rain Vortex is the world’s tallest indoor waterfall.',
        'Hawker culture': 'Eating and cooking at hawker centres is part of daily life in [[Singapore]]. In 2020 it was added to a list by [[UNESCO]].',
        'UNESCO': 'The United Nations agency for education, science and culture. It keeps lists of World Heritage sites and of cultural traditions worth protecting, like [[hawker culture]].',
      },
    },
    culture: {
      races: [['Chinamaxxing', 'Forbidden City'], ['Warm water', 'Hanfu']],
      pages: {
        'Chinamaxxing': 'An online trend where people copy everyday habits linked to China, like drinking [[warm water]] or snacking on [[tanghulu]]. It spread as a [[social media trend]].',
        'Warm water': 'Many people in China drink warm or hot water instead of iced drinks. The habit is often linked to ideas from [[traditional Chinese medicine]].',
        'Traditional Chinese medicine': 'A system of health practices from China, including herbal remedies and acupuncture. A famous herbal encyclopedia was written during the [[Ming dynasty]].',
        'Tanghulu': 'Candied hawthorn berries on a stick, a street snack from northern China. It’s closely linked to [[Beijing]] and sold at [[Lunar New Year]] temple fairs.',
        'Beijing': 'The capital of China. Its landmarks include the [[Forbidden City]], and it’s known for snacks like [[tanghulu]].',
        'Forbidden City': 'The palace of China’s emperors in [[Beijing]], built during the [[Ming dynasty]]. It’s now a museum and a UNESCO World Heritage site.',
        'Ming dynasty': 'A dynasty that ruled China from 1368 to 1644. It built the [[Forbidden City]], and its clothing styles inspire today’s [[hanfu]] revival.',
        'Hanfu': 'Traditional clothing of the Han Chinese. Young people are wearing it again, partly because of [[social media trend]]s.',
        'Social media trend': 'A style, habit or challenge that spreads quickly online, like [[Chinamaxxing]] or the [[hanfu]] revival.',
        'Lunar New Year': 'A festival that follows the lunar calendar, celebrated with family reunions and [[red packets]].',
        'Red packets': 'Red envelopes of money given at [[Lunar New Year]] for good luck.',
      },
    },
  },

  // ------------------------------------------------------------------ SG Politics: Guess Who
  // 4 rounds, 5 cards each. Answers alternate party (2 PAP, 2 WP) and each round mixes both parties,
  // so neither side gets more turns as the answer. Facts checked Oct 2026 against PMO cabinet pages
  // (after the 27 Jul 2026 reshuffle), Workers' Party candidate pages and GE2025 results.
  guesswho: {
    checked: 'Checked against PMO cabinet pages, Workers’ Party profiles and GE2025 results (Oct 2026).',
    people: {
      'Josephine Teo': 'PAP', 'Grace Fu': 'PAP', 'Desmond Lee': 'PAP', 'Chan Chun Sing': 'PAP', 'Jeffrey Siow': 'PAP',
      'Chee Hong Tat': 'PAP', 'Edwin Tong': 'PAP', 'Indranee Rajah': 'PAP', 'Sim Ann': 'PAP', 'Ong Ye Kung': 'PAP',
      'Sylvia Lim': 'WP', 'He Ting Ru': 'WP', 'Dennis Tan': 'WP', 'Jamus Lim': 'WP', 'Gerald Giam': 'WP',
      'Pritam Singh': 'WP', 'Louis Chua': 'WP', 'Fadli Fawzi': 'WP', 'Kenneth Tiong': 'WP', 'Abdul Muhaimin': 'WP',
    },
    rounds: [
      { answer: 'Josephine Teo', cards: ['Josephine Teo', 'Grace Fu', 'Desmond Lee', 'He Ting Ru', 'Sylvia Lim'],
        facts: [
          ['I’m a woman.', ['Desmond Lee']],
          ['I first entered Parliament in 2006.', ['He Ting Ru']],
          ['I’m a PAP minister.', ['Sylvia Lim']],
          ['I was Minister for Manpower from 2018 to 2021.', ['Grace Fu']],
          ['Today my ministry looks after digital development, AI and media.', []],
        ],
        role: 'Minister for Digital Development and Information · MP for Jalan Besar GRC',
        didyou: 'She spent eight years at the Ministry of Home Affairs and was its first woman political office holder.' },
      { answer: 'Dennis Tan', cards: ['Dennis Tan', 'Jamus Lim', 'Gerald Giam', 'Chee Hong Tat', 'Edwin Tong'],
        facts: [
          ['I’m a Workers’ Party MP.', ['Chee Hong Tat', 'Edwin Tong']],
          ['I first sat in Parliament as a Non-Constituency MP.', ['Jamus Lim']],
          ['I’m a lawyer.', ['Gerald Giam']],
          ['I won Hougang SMC in 2020, and again in 2025.', []],
          ['My speciality is shipping and maritime law.', []],
        ],
        role: 'Workers’ Party MP for Hougang SMC',
        didyou: 'He narrowly lost Fengshan SMC in 2015, then served as a Non-Constituency MP until he won Hougang in 2020.' },
      { answer: 'Desmond Lee', cards: ['Desmond Lee', 'Chan Chun Sing', 'Jeffrey Siow', 'Pritam Singh', 'Louis Chua'],
        facts: [
          ['I first became an MP in 2011.', ['Jeffrey Siow', 'Louis Chua']],
          ['I’m a minister.', ['Pritam Singh']],
          ['I trained as a lawyer.', ['Chan Chun Sing']],
          ['Before politics, I was a prosecutor at the Attorney-General’s Chambers.', []],
          ['Today I’m Minister for Education: schools, polys, ITE and universities.', []],
        ],
        role: 'Minister for Education · MP for West Coast-Jurong West GRC',
        didyou: 'Before Education, he was Minister for National Development, the ministry in charge of housing and land use.' },
      { answer: 'Sylvia Lim', cards: ['Sylvia Lim', 'He Ting Ru', 'Jamus Lim', 'Indranee Rajah', 'Sim Ann'],
        facts: [
          ['I’m a woman.', ['Jamus Lim']],
          ['I’m a Workers’ Party MP.', ['Indranee Rajah', 'Sim Ann']],
          ['I first entered Parliament in 2006, as a Non-Constituency MP.', ['He Ting Ru']],
          ['I’ve been the Workers’ Party chair since 2003.', []],
          ['I spent 12 years as a lecturer at Temasek Polytechnic.', []],
        ],
        role: 'Workers’ Party chair · MP for Aljunied GRC',
        didyou: 'She started her career as a police officer before becoming a lawyer.' },
    ],
  },

  // ------------------------------------------------------------------ Environment: Hole-some Recycling
  // Items: [key, label, size(px), kind] kind: 'rec' recyclable · 'bottle' deposit bottle (+1 coin)
  // 'dirty' looks recyclable but is contaminated · 'trash' general waste · 'ewaste' e-waste
  // 'crushed' crushed bottle (still recyclable, no deposit) · 'full' bottle with drink inside
  hole: {
    items: {
      bottle: ['Empty bottle', 26, 'bottle'], can: ['Drink can', 24, 'bottle'], paper: ['Clean paper', 26, 'rec'],
      box: ['Cardboard box', 46, 'rec'], jar: ['Glass jar', 28, 'rec'], carton: ['Rinsed carton', 30, 'rec'], mag: ['Old magazine', 34, 'rec'],
      tissue: ['Used tissue', 20, 'trash'], peel: ['Banana peel', 26, 'trash'], foam: ['Styrofoam box', 40, 'trash'],
      cutlery: ['Plastic cutlery', 24, 'trash'], cup: ['Stained coffee cup', 28, 'dirty'], pizza: ['Greasy pizza box', 48, 'dirty'],
      tub: ['Oily takeaway tub', 30, 'dirty'], dbottle: ['Unrinsed bottle', 26, 'dirty'],
      battery: ['Battery', 18, 'ewaste'], phone: ['Old phone', 24, 'ewaste'], bank: ['Powerbank', 26, 'ewaste'], toy: ['Soft toy', 36, 'trash'],
      crushed: ['Crushed bottle', 22, 'crushed'], full: ['Half-full bottle', 26, 'full'],
    },
    // dirty items count as recyclable in wave 1 (rule not taught yet) and as contamination from wave 2
    waves: [
      { name: 'Blue bin basics', time: 40, goal: 90, spawn: ['bottle', 'can', 'paper', 'box', 'jar', 'mag', 'tissue', 'peel', 'foam'],
        rule: 'Swallow what goes in the blue bin. Food, tissue and styrofoam shrink your hole.',
        learn: 'About 40% of what goes into recycling bins in Singapore can’t be recycled because it’s contaminated.' },
      { name: 'Rinse it first', time: 40, goal: 130, spawn: ['bottle', 'can', 'paper', 'box', 'carton', 'cup', 'pizza', 'tub', 'dbottle', 'tissue', 'cutlery'],
        rule: 'New rule: dirty items now cost you. Stained cups, greasy pizza boxes and unrinsed bottles are contamination.',
        learn: 'Food and grease can spoil a whole bin of clean recyclables. Empty it, rinse it, then recycle it.' },
      { name: 'Not for the blue bin', time: 40, goal: 160, spawn: ['bottle', 'can', 'paper', 'box', 'jar', 'carton', 'battery', 'phone', 'bank', 'toy', 'cup', 'foam'],
        rule: 'New rule: batteries, phones and powerbanks are e-waste. They go to e-waste points, never the blue bin.',
        learn: 'E-waste like batteries and powerbanks can catch fire in recycling trucks. Drop them at an e-waste collection point.' },
      { name: 'Empty and uncrushed', time: 40, goal: 180, spawn: ['bottle', 'can', 'crushed', 'full', 'paper', 'box', 'mag', 'tub', 'dbottle', 'battery', 'peel'],
        rule: 'New rule: half-full bottles are a mess. Crushed bottles still recycle, but they earn no 10¢ deposit.',
        learn: 'Since 1 April 2026, drinks with the deposit mark cost 10¢ more. Return them empty and uncrushed to a reverse vending machine to get it back.' },
      { name: 'Rush hour', time: 45, goal: 220, fast: true, spawn: ['bottle', 'can', 'crushed', 'full', 'paper', 'box', 'jar', 'carton', 'mag', 'cup', 'pizza', 'tub', 'dbottle', 'battery', 'phone', 'bank', 'toy', 'tissue', 'peel', 'foam', 'cutlery'],
        rule: 'Everything at once, and it keeps coming. Every rule still counts.',
        learn: 'Not sure about an item? NEA’s recycling guide and its Bloobin chatbot tell you which bin it goes in.' },
    ],
    perks: [
      { key: 'wash', name: 'Auto Wash', cost: 4, uses: 5, after: 1, desc: 'Tap to rinse every dirty item near your hole, so it becomes recyclable. 5 washes.' },
      { key: 'nty', name: 'No Thank You', cost: 6, uses: 3, after: 2, desc: 'Switches on by itself. Your hole snaps shut on trash, even if you drive right over it. Blocks 3 mistakes.' },
      { key: 'frog', name: 'Captain Green', cost: 8, uses: 2, after: 3, desc: 'A frog sidekick grabs nearby recyclables with its tongue for 10 seconds. 2 uses.' },
    ],
  },

  // ------------------------------------------------------------------ Tech: Real or Fake?
  // kind 'img': ans 'real' | 'ai'. kind 'news': ans 'real' | 'fake'. Real headlines are exact headlines of
  // articles used in the Knowseum wings. Fake headlines are made up for this game and labelled as such.
  realfake: {
    rounds: [
      { name: 'Is this AI?', note: 'Photos', items: [
        { kind: 'img', src: 'assets/realfake/ai-merlion.webp', ans: 'ai', tell: 'It never snows in Singapore. When a scene breaks real-world rules, be suspicious.' },
        { kind: 'img', src: 'assets/realfake/real-1.jpg', ans: 'real', tell: '' },
        { kind: 'img', src: 'assets/realfake/ai-hawker.webp', ans: 'ai', tell: 'Hard one! The signs are readable, so look for other clues: everything is a bit too tidy and evenly lit. When a photo looks perfect, ask who posted it first.' },
        { kind: 'img', src: 'assets/realfake/real-2.jpg', ans: 'real', tell: '' },
      ] },
      { name: 'Real or fake news?', note: 'Headlines', items: [
        { kind: 'news', head: 'Anthropic to work with Singapore to evaluate AI models for safety and security', src: 'The Straits Times · 14 Oct 2026', ans: 'real', tell: 'It’s from a trusted outlet, with a date, and other outlets reported it too.' },
        { kind: 'news', head: 'BREAKING: MOE to replace O-Level exams with AI chatbot interviews from next year!!', src: 'Forwarded many times', ans: 'fake', tell: 'ALL CAPS, “BREAKING” and !!! are made to rush you. A big policy change like this would be on moe.gov.sg first.' },
        { kind: 'news', head: 'Central Ukrainian region hit by vast drone attack, killing three', src: 'Reuters · 15 Oct 2026', ans: 'real', tell: 'A news agency, a date and plain, specific wording are good signs.' },
        { kind: 'news', head: 'Doctors confirm boiling apples every morning cures haze cough in 3 days', src: 'healthtips-sg.blog', ans: 'fake', tell: 'Miracle cures with exact promises are a classic fake. Which doctors? The post never says.' },
      ] },
      { name: 'Mixed and tricky', note: 'No easy tells', items: [
        { kind: 'img', src: 'assets/realfake/ai-voiddeck.webp', ans: 'ai', tell: 'Zoom into the notice board: the posters are blurry blobs with no words you can read. Real notices are full of tiny, readable text.' },
        { kind: 'news', head: 'Govts must incentivise private sector to hire fresh grads amid declining entry-level roles: President', src: 'The Straits Times · 12 Oct 2026', ans: 'real', tell: 'Long, careful headlines that name who said it are typical of real reporting.' },
        { kind: 'news', head: 'Singapore to fine drivers who use Waze in tunnels from 1 January', src: 'Shared on a group chat', ans: 'fake', tell: 'It sounds official and boring, which is why it spreads. Check gov.sg or a news site before you forward it.' },
        { kind: 'img', src: 'assets/realfake/real-3.jpg', ans: 'real', tell: '' },
        { kind: 'img', src: 'assets/realfake/ai-mrt.webp', ans: 'ai', tell: 'Very convincing, even the station code is right. When the picture can’t tell you, the source can: who took it, and does a trusted outlet stand behind it?' },
      ] },
    ],
    realTip: 'This one was a real photo. Real photos have messy, specific details: readable signs, natural shadows, people doing different things.',
  },
};
