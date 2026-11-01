/* Knowseum · "Step into the story" for the Environment, World and Culture wings.
   Facts come only from each article (see `source`). Anything worked out or illustrative says so on the frame.
   Same frame format as js/stories.js; the new block types (gauge, shift, profiles, poll, sort, habits,
   combine, scale, map, intercept) are drawn by js/story.js. */
Object.assign(window.KN_STORY, {

  // ---------------------------------------------------------------- environment (haze riders)
  environment: {
    theme: 'haze', label: 'Environment Wing · Rider’s choice', accent: '#ff7a1a',
    source: 'The Straits Times, Joyce ZK Lim, 15 Oct 2026',
    url: 'https://www.asiaone.com/singapore/haze-delivery-rider-health',
    frames: [
      { cover: true, dark: true, img: 'haze', kick: 'Clementi · 14–15 Oct 2026', h: ['Would you', 'ride today?'],
        body: 'The haze hit a new high for the year. Some delivery riders are cutting their hours. Others are riding on. Your call.',
        blocks: [{ t: 'meta', items: [['24-hr PSI', '212'], ['Where', 'West'], ['Level', 'Very unhealthy']] }],
        cta: 'Step inside', hint: 'Tap to step inside' },

      { kick: 'The air · 15 Oct', h: ['PSI', 'right now.'],
        body: 'The Pollutant Standards Index (PSI) tells you how dirty the air is. Drag the dial to see each band.',
        blocks: [{ t: 'gauge', start: 60, target: 212, mark: '15 Oct, west' },
          { t: 'note', k: 'Also in the article', v: 'The one-hour PM2.5 reading in the west hit 288 on 14 Oct, its highest level since 2015.' }],
        hint: 'Drag the dial to 212, the reading on 15 Oct' },

      { kick: 'Rider profiles', h: ['Three riders,', 'three calls.'],
        body: 'ST spoke to riders working around Clementi. Swipe to meet them.',
        blocks: [{ t: 'profiles', label: 'The riders', items: [
          { name: 'Zareth Tan', age: 33, tag: 'Taking a break', stats: [['Works', '5–6 days a week'], ['Orders', 'About 20 a day']],
            line: 'Took 15 Oct off after his eyes got itchy. He’ll keep an eye on the haze and go back when the air gets better.' },
          { name: 'Md Amri', age: 40, tag: 'Riding, for now', stats: [['Works', 'Part-time'], ['Pay', '$50–70 per 2.5 h shift']],
            line: 'Married with kids, he delivers to pay off his car. He already has a sore throat and cough.', q: 'Why would I want to harm myself?' },
          { name: 'Darren Tan', age: 49, tag: 'Riding on', stats: [['Works', 'About 10 h a day, 6 days a week'], ['Pay', 'About $200 per 10 h shift, before petrol and CPF']],
            line: 'A father of two who has been a rider for about 10 years. He’d rather stay off the roads, but he’s still riding.' }] }],
        hint: 'Swipe to meet all three riders' },

      { kick: 'The dilemma', h: ['Cut hours', 'or ride on?'],
        body: 'Both choices cost something. Flip between them.',
        blocks: [{ t: 'tabs', tabs: [
          { name: 'Cut hours', rows: [['01', 'Protect your health', 'Riders in Clementi said their eyes were irritated and throats sore after hours in the haze.'], ['02', 'Lose a day’s pay', 'Zareth Tan took 15 Oct off. Md Amri said he would stop once it gets really hazardous.']] },
          { name: 'Ride on', rows: [['01', 'Maybe earn more', 'With fewer riders out and more people ordering in, those who keep riding could earn more, Darren Tan said.'], ['02', 'Breathe the haze', 'Hours on the road in “very unhealthy” air.']] }] }],
        hint: 'Toggle to see both sides' },

      { kick: 'Shift simulator', h: ['See the', 'trade-off.'],
        body: 'Slide to plan a shift. Pay is worked out from what two riders told ST, about $20 to $28 an hour.',
        blocks: [{ t: 'shift', low: 20, high: 28, max: 10, psi: 212 }],
        hint: 'Slide to pick your hours' },

      { kick: 'What the haze does', h: ['Felt on', 'every ride.'],
        body: 'What riders told ST about working in the haze. Tap each card.',
        blocks: [{ t: 'reveal', num: true, items: [
          ['01', 'Irritated eyes', 'Riders around Clementi said their eyes were irritated after hours on the roads.'],
          ['02', 'Sore throats', 'Md Amri has a sore throat and a cough from the haze.'],
          ['03', 'Sweaty masks', 'Some riders skip masks because they trap sweat and get uncomfortable.']] }],
        hint: 'Tap each card to reveal' },

      { kick: 'Myth or fact', h: ['Call it.', ''],
        body: 'Three claims about the haze. Myth or fact?',
        blocks: [{ t: 'sort', opts: ['Myth', 'Fact'], items: [
          { c: 'Every rider wears a mask in the haze.', a: 0, w: 'Myth. Some riders don’t, because masks trap sweat and get uncomfortable.' },
          { c: 'The haze can mean more money for riders who keep going.', a: 1, w: 'Fact, for some. Fewer riders and more orders could mean more earnings, Darren Tan said.' },
          { c: 'The 288 PM2.5 reading on 14 Oct was the worst ever.', a: 0, w: 'Myth. It was the highest since 2015, so it has been worse before.' }] }],
        hint: 'Sort all three' },

      { kick: 'The platforms', h: ['What the apps', 'are doing.'],
        blocks: [{ t: 'tabs', tabs: [
          { name: 'Foodpanda', rows: [['01', 'Air-quality advisories', 'Regular updates on the haze for riders'], ['02', 'Flexible hours', 'Plus short breaks without losing applicable incentives'], ['03', 'Haze support incentive', 'Extra earnings during this period. It said rider numbers are stable.']] },
          { name: 'Grab', rows: [['01', 'Free N95 masks', 'For riders who keep working, including members of the National Delivery Champions Association'], ['02', 'Health advisories', 'Hydrate, take breaks, see a doctor if unwell'], ['03', 'Your call', 'Riders have “full autonomy” to put their safety first']] }] }],
        hint: 'Toggle between the two apps' },

      { kick: 'Your call', h: ['PSI 212.', 'What do you do?'],
        body: 'Pretend you ride for a living. There’s no right answer here, just trade-offs.',
        blocks: [{ t: 'poll', opts: [
          { h: 'Take the day off', s: 'Like Zareth Tan', r: 'Your eyes and lungs get a break. Your wallet doesn’t. Zareth will go back when the air improves.' },
          { h: 'Short shift, mask on', s: 'Like Md Amri', r: 'A 2.5-hour shift earns Amri about $50 to $70. He says he’ll stop if it gets really hazardous.' },
          { h: 'Ride the full day', s: 'Like Darren Tan', r: 'About $200 for 10 hours, before petrol and CPF. More orders, fewer riders, more haze in your lungs.' }] }],
        hint: 'Make your call' },

      { dark: true, kick: 'A rider’s advice', h: ['', ''],
        body: 'Darren Tan caught Covid-19 three times while delivering during the pandemic. Before riding off into the haze with a Subway order, he had one tip.',
        blocks: [{ t: 'quote2', a: 'Wear your', b: 'mask.', by: 'Darren Tan, 49', sub: 'Delivery rider for about 10 years' }],
        hint: 'Tap the quote' },

      { kick: 'Quick quiz', h: ['Knowledge', 'changes the ride.'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'What did the 24-hour PSI hit in western Singapore on 15 Oct?', o: ['112, “moderate”', '212, “very unhealthy”', '312, “hazardous”'], a: 1, w: '212, a new high for the year. Anything from 201 to 300 is “very unhealthy”.' },
          { q: 'Why do some riders skip masks?', o: ['They trap sweat and get uncomfortable', 'Masks are banned on bikes', 'The apps don’t allow them'], a: 0, w: 'Riders said masks trap sweat. Darren Tan’s advice is still: wear your mask.' },
          { q: 'Why might riders who keep going earn more?', o: ['Petrol got cheaper', 'Fewer riders and more orders', 'Tips doubled by law'], a: 1, w: 'With fellow riders staying off the roads and demand rising, those still riding could earn more.' }] }],
        hint: 'Answer all three' },

      { end: true, dark: true, kick: 'Thank you, rider', h: ['Your story', 'matters.'],
        blocks: [{ t: 'list', items: ['Above 200, the PSI is “very unhealthy”. Riders breathe it for hours.', 'Some riders cut hours to stay well. Others ride on because they need the pay.', 'Platforms offer masks, breaks and advice, but each rider still makes the call.'] }],
        hint: 'Source: The Straits Times, 15 Oct 2026' },
    ],
  },

  // ---------------------------------------------------------------- world (Kirovohrad drone attack)
  world: {
    theme: 'noir', label: 'World Wing · Interactive story', accent: '#d9c9a3',
    source: 'Reuters, via The Straits Times, 15 Oct 2026',
    url: 'https://www.straitstimes.com/world/europe/central-ukrainian-region-hit-by-vast-drone-attack-killing-three',
    frames: [
      { cover: true, dark: true, img: 'ukraine', kick: 'Ukraine · 15 Oct 2026', h: ['Step inside', 'the story'],
        body: 'Overnight, Ukraine’s central Kirovohrad region was hit by the largest Russian attack on its territory in the war. Three people were killed.',
        blocks: [{ t: 'meta', items: [['Killed', '3'], ['Wounded', '6'], ['Drones', '360+']] }],
        cta: 'Begin', hint: 'Tap to begin' },

      { dark: true, kick: 'Where it happened', h: ['Find', 'Kirovohrad.'],
        body: 'The region sits in central Ukraine. Tap the map where you think it is.',
        blocks: [{ t: 'map' },
          { t: 'note', dark: true, k: 'Why it stands out', v: 'Kirovohrad is a relatively infrequent target of bombardment. This was the largest attack on it in the war.' }],
        hint: 'Tap the map to drop your guess' },

      { dark: true, kick: 'The scale', h: ['One night,', 'one region.'],
        blocks: [{ t: 'bignum', n: 360, plus: true, v: 'drones hit the Kirovohrad region overnight, its governor, Andriy Raikovych, wrote on Telegram.' },
          { t: 'statrow', items: [['26', 'places hit'], ['3', 'killed'], ['6', 'wounded']] }],
        hint: 'Take it in, then continue' },

      { dark: true, kick: 'Across Ukraine', h: ['The whole', 'night.'],
        body: 'Kirovohrad was one part of a bigger attack. Hold the button to play the night, using the air force’s numbers.',
        blocks: [{ t: 'intercept', total: 580, down: 536 }],
        hint: 'Press and hold to play the night' },

      { dark: true, kick: 'What was hit', h: ['Tap each', 'target.'],
        body: 'The governor listed four kinds of places he said were hit on purpose.',
        blocks: [{ t: 'reveal', num: true, items: [
          ['01', 'Critical infrastructure', 'The systems a region needs to keep running'],
          ['02', 'Transport enterprises', 'Companies that move people and goods'],
          ['03', 'Logistics facilities', 'Places that store and send out supplies'],
          ['04', 'Homes', 'Where people live']],
          after: { q: 'The enemy deliberately hit critical infrastructure, transport enterprises, logistics facilities and residential homes.', by: 'Andriy Raikovych, Kirovohrad governor, on Telegram' } }],
        hint: 'Tap all four' },

      { dark: true, kick: 'Strategic context', h: ['A rare', 'target.'],
        body: 'How often is Kirovohrad usually attacked, according to the report?',
        blocks: [{ t: 'choice', ans: 1, stamp: ['Rarely hit', 'Largest attack on the region in the war'], opts: [
          { k: 'Option A', h: 'All the time', pts: ['One of the most-hit regions'], no: 'Not quite. Reuters called it a relatively infrequent target.' },
          { k: 'Option B', h: 'Not often', pts: ['A relatively infrequent target'] }] }],
        hint: 'Pick an answer' },

      { dark: true, kick: 'Who said it?', h: ['Check', 'the source.'],
        body: 'War numbers come from named people. Match each fact to who gave it.',
        blocks: [{ t: 'sort', opts: ['Governor', 'Air force'], items: [
          { c: 'Over 360 drones hit the region.', a: 0, w: 'Governor Andriy Raikovych, on Telegram.' },
          { c: '580 Russian drones attacked Ukraine overnight.', a: 1, w: 'Ukraine’s air force, for the whole country.' },
          { c: '26 different places were hit.', a: 0, w: 'The governor again. He was counting his region.' },
          { c: '536 drones were shot down.', a: 1, w: 'The air force. 580 − 536 = 44 were not shot down (our maths, not theirs).' }] }],
        hint: 'Match all four' },

      { dark: true, kick: 'How we know', h: ['Where the', 'facts come from.'],
        blocks: [{ t: 'rows', items: [
          ['I', 'The governor', 'Andriy Raikovych posted the regional numbers on Telegram.'],
          ['II', 'Ukraine’s air force', 'Gave the national count of drones launched and shot down.'],
          ['III', 'Reuters', 'Max Hunder reported from Kyiv. The Straits Times ran the report.']] },
          { t: 'note', dark: true, k: 'Reading war news', v: 'The figures here come from Ukrainian officials. Good reports tell you who is counting, so you can weigh it yourself.' }],
        hint: 'Read, then continue' },

      { dark: true, kick: 'The full picture', h: ['Behind', 'the numbers.'],
        body: 'Three people were killed and six were wounded. In Kropyvnytskyi, the regional capital, firefighters worked at the site of a business hit by a drone.',
        blocks: [{ t: 'note', dark: true, k: 'Every number is a person', v: 'Each figure on these frames stands for someone’s family, home or workplace.' }],
        hint: 'Take a moment, then continue' },

      { dark: true, kick: 'Understanding, not a test', h: ['What', 'stuck?'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'About how many drones hit the Kirovohrad region?', o: ['Around 36', 'Over 360', 'Over 3,600'], a: 1, w: 'Over 360, according to the regional governor.' },
          { q: 'Why did this attack stand out?', o: ['The region is rarely targeted', 'It happened in the daytime', 'No one was hurt'], a: 0, w: 'Kirovohrad is a relatively infrequent target. This was its largest attack in the war.' },
          { q: 'Who gave the national figure of 580 drones?', o: ['The governor', 'Reuters', 'Ukraine’s air force'], a: 2, w: 'The air force counted for the whole country. The governor counted for his region.' }] }],
        hint: 'Answer all three' },

      { end: true, dark: true, kick: 'Take your time', h: ['When you’re', 'ready.'],
        blocks: [{ t: 'list', items: ['Kirovohrad, rarely a target, had its largest attack of the war: 3 killed, 6 wounded.', 'Region figures came from the governor. National figures came from the air force.', 'In war news, always ask who is counting.'] }],
        hint: 'Source: Reuters via The Straits Times, 15 Oct 2026' },
    ],
  },

  // ---------------------------------------------------------------- culture (Chinamaxxing)
  culture: {
    theme: 'tea', label: 'Culture Wing · Step inside', accent: '#c8261f',
    source: 'The Straits Times, Tan Dawn Wei, 1 Mar 2026',
    url: 'https://www.pressreader.com/singapore/the-straits-times/20260301/281844355118509',
    frames: [
      { cover: true, dark: true, img: 'chinamaxxing', kick: 'TikTok · 2026', h: ['A very Chinese', 'time?'],
        body: 'Hot water, congee and herbal remedies have become TikTok’s answer to a “very Chinese life”. If only it were that simple.',
        blocks: [{ t: 'meta', items: [['Type', 'Column'], ['By', 'Tan Dawn Wei'], ['Paper', 'The Straits Times']] }],
        cta: 'Start the quiz', hint: 'Tap to start' },

      { kick: 'A quick quiz', h: ['Diagnose your', 'Chinese-ness.'],
        body: 'Tick the habits you already have. Zero judgement.',
        blocks: [{ t: 'habits', items: ['Sip hot water', 'Shuffle around at home in slippers', 'Boil apples', 'Practise qigong in the park', 'Spoon up congee'] }],
        hint: 'Tick your habits, then see your score' },

      { dark: true, kick: 'Plot twist', h: ['', ''],
        blocks: [{ t: 'quote2', a: 'Boiling apples', b: 'won’t make you Chinese.', by: 'The column’s headline', sub: 'Tan Dawn Wei, senior columnist, The Straits Times' }],
        hint: 'Tap for the rest' },

      { kick: 'What’s in a word', h: ['China +', '-maxxing.'],
        body: 'For a few weeks, TikTok was swamped with young people saying they were in a “very Chinese time” of their lives. They gave it a name.',
        blocks: [{ t: 'combine', a: 'China', b: '-maxxing', word: 'Chinamaxxing', def: 'Optimising your whole self around one obsession. In this case, being “Chinese”.', more: ['gymmaxxing', 'looksmaxxing', 'fibermaxxing'] }],
        hint: 'Tap Combine' },

      { kick: 'Trend vs tradition', h: ['Same habit,', 'same thing?'],
        body: 'A grandma in Singapore boils apples. A TikToker on the other side of the world does too. Is it the same?',
        blocks: [{ t: 'poll', opts: [
          { h: 'Same thing', s: 'A habit is a habit', r: 'The apples are the same. The column’s point is that the habit alone isn’t the culture.' },
          { h: 'Not quite', s: 'Context matters', r: 'One grew up with it, one picked it up online. The headline’s argument: copying habits doesn’t make you Chinese.' },
          { h: 'It depends', s: 'On why they do it', r: 'Fair. Curiosity is a good start. The column asks whether a trend can stand in for a whole culture.' }] }],
        hint: 'Pick where you land' },

      { kick: 'Where do you land?', h: ['Appreciation', 'or costume?'],
        body: 'Drag to where you think Chinamaxxing sits. This is your take, not a fact.',
        blocks: [{ t: 'scale', l: 'Appreciation', r: 'Costume', msgs: ['Respect and curiosity. Learning the why behind a habit makes it more than a trend.', 'Somewhere in between. A habit can be a door in, if you keep going past the video.', 'Dressing up in a culture for views. The column’s headline suggests it isn’t that simple.'] }],
        hint: 'Drag the slider' },

      { kick: 'Read it right', h: ['Fact or', 'opinion?'],
        body: 'This piece is a column: a writer arguing a point. Sort each line.',
        blocks: [{ t: 'sort', opts: ['Fact', 'Opinion'], items: [
          { c: 'TikTok has been swamped with “very Chinese time” videos.', a: 0, w: 'Fact. You can check it by scrolling.' },
          { c: '“Chinamaxxing” is “China” plus “-maxxing”.', a: 0, w: 'Fact. It describes how the word was built.' },
          { c: 'Boiling apples won’t make you Chinese.', a: 1, w: 'Opinion. It’s the writer’s argument, and you can agree or disagree.' }] }],
        hint: 'Sort all three' },

      { kick: 'Quick check', h: ['Who', 'knew?'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'What does “-maxxing” mean?', o: ['Doing the bare minimum', 'Optimising yourself around one obsession', 'A Chinese word for tea'], a: 1, w: 'Like gymmaxxing or looksmaxxing: going all in on one thing.' },
          { q: 'Which habit is part of the trend?', o: ['Iced coffee', 'Boiling apples', 'Cold showers'], a: 1, w: 'Hot water, slippers, boiled apples, qigong and congee all feature.' },
          { q: 'What kind of piece is this article?', o: ['A news report', 'A column with an opinion', 'An advert'], a: 1, w: 'A column by senior columnist Tan Dawn Wei. It argues a point.' }] }],
        hint: 'Answer all three' },

      { end: true, kick: 'Thanks for playing', h: ['Culture isn’t', 'a checklist.'],
        blocks: [{ t: 'list', items: ['Trying a habit is fine. Saying it makes you part of a culture is a bigger claim.', 'Columns argue. News reports. Know which one you’re reading.', 'Curious? Ask the people who grew up with it.'] }],
        hint: 'Source: The Straits Times, 1 Mar 2026' },
    ],
  },
});
