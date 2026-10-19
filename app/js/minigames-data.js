/* Knowseum · mini game content (2 per wing).
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

  // ------------------------------------------------------------------ Tech: Jargon Match
  jargon: [
    ['MOU', 'A written agreement that sets out plans two sides want to work on together'],
    ['IPO', 'When a private company first sells shares to the public'],
    ['AI agent', 'An AI that can carry out multi-step tasks with little human help'],
    ['Red-teaming', 'Testing a system by deliberately trying to make it fail'],
    ['Hallucination', 'When an AI states something false as if it were true'],
    ['Sovereign wealth fund', 'A fund that invests money on behalf of a country'],
    ['Model evaluation', 'Testing an AI model to measure what it can do and how safe it is'],
    ['Cyberincident', 'A security breach or attack on computer systems or data'],
  ],

  // ------------------------------------------------------------------ SG Politics: Who Am I
  whoami: [
    { clue: 'I’m the Prime Minister, and I’m also the Minister for Finance. I took over as PM in May 2024.', opts: ['Lawrence Wong', 'Gan Kim Yong', 'Lee Hsien Loong'], a: 0, kind: 'Minister' },
    { clue: 'I’m the Minister for Digital Development and Information. My ministry signed the AI safety deal with Anthropic.', opts: ['Grace Fu', 'Josephine Teo', 'Ong Ye Kung'], a: 1, kind: 'Minister' },
    { clue: 'I’m the Minister for Education. Schools, polys, ITE and universities are my patch.', opts: ['Chan Chun Sing', 'Edwin Tong', 'Desmond Lee'], a: 2, kind: 'Minister' },
    { clue: 'I give Singaporeans credit to spend on approved training courses, so you can keep learning after you start work.', opts: ['SkillsFuture Credit', 'GST Voucher', 'Baby Bonus'], a: 0, kind: 'Policy' },
    { clue: 'Part of your pay, plus a top-up from your employer, goes into me. I help with housing, healthcare and retirement.', opts: ['MediShield Life', 'CPF', 'SkillsFuture Credit'], a: 1, kind: 'Policy' },
    { clue: 'I’m Singapore’s head of state, chosen by citizens in an election. I spoke about fresh grads and AI in Bangkok.', opts: ['The Prime Minister', 'The Speaker of Parliament', 'The President'], a: 2, kind: 'Office' },
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

  // ------------------------------------------------------------------ Environment: Earth quests
  quests: [
    { key: 'beach', title: 'Clean the beach', kind: 'tap',
      intro: 'Tap the rubbish to pick it up. Leave the shells and the crab alone!',
      items: [['bottle', 'Plastic bottle', 1], ['bag', 'Plastic bag', 1], ['straw', 'Straw', 1], ['can', 'Drink can', 1], ['wrapper', 'Snack wrapper', 1], ['shell', 'Shell', 0], ['crab', 'Crab', 0], ['shell2', 'Shell', 0]],
      impact: 'Plastic doesn’t rot away. It breaks into tiny microplastics that fish and seabirds swallow. Every piece you pick up is one that never reaches the sea.' },
    { key: 'byo', title: 'Bring your own', kind: 'choose',
      intro: 'You’re buying chicken rice to go. What do you pack it in?',
      opts: [['Styrofoam box', 0, 'Used once, then thrown away.'], ['Plastic bag + box', 0, 'Two bits of trash in one meal.'], ['Your own reusable tub', 1, 'Wash it, use it again tomorrow.']],
      impact: 'Singapore’s only landfill, on Pulau Semakau, is expected to fill up by around 2035. Reusing containers means less waste to burn and bury.' },
    { key: 'sort', title: 'Sort it right', kind: 'sort',
      intro: 'Which items go in the blue recycling bin? Tap to send each one to Recycle or Trash.',
      items: [['Clean paper', 1], ['Rinsed plastic bottle', 1], ['Drink can', 1], ['Greasy pizza box', 0], ['Used tissue', 0], ['Food scraps', 0]],
      impact: 'Food and grease can spoil a whole bin of recyclables. Rinse it, then recycle it.' },
    { key: 'power', title: 'Switch it off', kind: 'tap',
      intro: 'Nobody’s home. Tap everything that’s been left on.',
      items: [['fan', 'Fan', 1], ['light', 'Lights', 1], ['tv', 'TV', 1], ['aircon', 'Aircon', 1], ['fridge', 'Fridge (leave it!)', 0]],
      impact: 'Most of Singapore’s electricity comes from burning natural gas, so saving power cuts carbon emissions.' },
  ],
};
