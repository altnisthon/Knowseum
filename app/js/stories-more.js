/* Knowseum · "Step into the story" for the Environment, World and Culture wings.
   Layout follows Nisa's mockups (Rider's Choice, Kirovohrad, Chinamaxxing). Facts come only from each article
   (see `source`); anything worked out or illustrative says so on the frame. Photos in assets/story/ are
   AI-generated (Higgsfield) and carry no logos. Drawn by the mockup renderer in js/story.js. */
Object.assign(window.KN_STORY, {

  // ---------------------------------------------------------------- environment (haze riders)
  environment: {
    theme: 'haze', short: 'Rider’s choice', label: 'Environment Wing · Rider’s choice', accent: '#ff7a1a',
    source: 'The Straits Times, Joyce ZK Lim, 15 Oct 2026',
    url: 'https://www.asiaone.com/singapore/haze-delivery-rider-health',
    frames: [
      { cls: 'cover', bg: 'haze-skyline', bgpos: 'center bottom', kick: 'Rider’s choice', h: ['Would you', 'ride today?'],
        body: 'Air quality updates. Real riders. Your call.',
        blocks: [{ t: 'minigauge', v: 212 }], pill: 'Step inside  →', small: 'Your story. Your decision.', hint: 'Swipe to continue  ↓' },

      { kick: 'Rider profile · Clementi', h: ['Meet the', 'riders.'],
        body: 'ST spoke to delivery riders around Clementi on 14 Oct. Swipe to meet three of them.',
        blocks: [{ t: 'profiles', label: 'Swipe', items: [
          { name: 'Zareth Tan', age: 33, img: 'haze-rider', pos: '50% 70%', tag: 'Taking a break', stats: [['Works', '5–6 days a week'], ['Orders', 'About 20 a day']],
            line: 'Took 15 Oct off after his eyes got itchy. He’ll go back when the air gets better.' },
          { name: 'Md Amri', age: 40, img: 'haze-rider', pos: '30% 40%', tag: 'Riding, for now', stats: [['Works', 'Part-time'], ['Pay', '$50–70 per 2.5 h shift']],
            line: 'Delivers to pay off his car. He already has a sore throat and a cough.', q: 'Why would I want to harm myself?' },
          { name: 'Darren Tan', age: 49, img: 'haze-rider', pos: '70% 85%', tag: 'Riding on', stats: [['Works', '~10 h a day, 6 days a week'], ['Pay', '~$200 per 10 h, before petrol and CPF']],
            line: 'A rider for about 10 years. He’d rather stay off the roads, but he’s still riding.' }] }],
        hint: 'Swipe the cards to meet all three' },

      { h: ['Shift', 'simulator'], sub: 'See the trade-offs',
        blocks: [{ t: 'shift', low: 20, high: 28, max: 10, psi: 212, pill: 'Try a different time  →' }],
        small: 'Every choice affects both.', hint: 'Slide or tap the button to plan a shift' },

      { h: ['PSI', 'right now'], sub: 'Pollutant Standards Index · west, 15 Oct',
        blocks: [{ t: 'gauge', start: 60, target: 212, mark: '15 Oct' },
          { t: 'note', k: 'Platform advice', v: 'Hydrate. Take breaks. See a doctor if you feel unwell.', shield: true },
          { t: 'src', v: 'One-hour PM2.5 in the west hit 288 on 14 Oct, the highest since 2015.' }],
        hint: 'Drag the dial up to 212' },

      { kick: 'Tap to reveal', h: ['3 reasons', 'to rethink today’s shift'],
        blocks: [{ t: 'target', items: [
          ['The air is “very unhealthy”', 'The 24-hour PSI hit 212 in western Singapore on 15 Oct.'],
          ['Riders are feeling it', 'Riders around Clementi said their eyes were irritated and their throats sore.'],
          ['It’s the worst in years', 'One-hour PM2.5 hit 288 on 14 Oct, the highest since 2015.']] }],
        small: 'Knowledge changes the ride.', hint: 'Tap the circle three times' },

      { kick: 'Myth or fact', h: ['Call it.', ''],
        blocks: [{ t: 'claims', opts: ['Myth', 'Fact'], ico: 'mask', items: [
          { c: 'Every rider wears a mask in the haze.', a: 0, w: 'Some don’t, because masks trap sweat and get uncomfortable.' },
          { c: 'The haze can mean more money for riders who keep going.', a: 1, w: 'With fewer riders out and more orders, those still riding could earn more, Darren Tan said.' },
          { c: 'The 288 PM2.5 reading was Singapore’s worst ever.', a: 0, w: 'It was the highest since 2015, so it has been worse before.' }] }],
        hint: 'Answer all three claims' },

      { kick: 'The platforms', h: ['What the apps', 'are doing'],
        blocks: [{ t: 'tabs', tabs: [
          { name: 'Foodpanda', rows: [['01', 'Air-quality advisories', 'Regular haze updates for riders'], ['02', 'Flexible hours', 'Short breaks without losing applicable incentives'], ['03', 'Haze support incentive', 'Extra earnings for now. It said rider numbers are stable.']] },
          { name: 'Grab', rows: [['01', 'Free N95 masks', 'For riders who keep working, including National Delivery Champions Association members'], ['02', 'Health advisories', 'Hydrate, take breaks, see a doctor if unwell'], ['03', 'Your call', 'Riders have “full autonomy” to put their safety first']] }] }],
        hint: 'Flip between the two apps' },

      { kick: 'Quick quiz', h: ['At PSI 212,', 'what’s the smarter move?'],
        body: 'You’re Md Amri: a sore throat, a cough and a car to pay off.',
        blocks: [{ t: 'bigpic', title: 'Here’s the big picture', cap: 'No wrong answer. Every rider weighs the same two things.', opts: [
          { h: 'Push through, full day', s: 'More pay, more haze', c: 'About $200 for 10 hours, before petrol and CPF, like Darren Tan.', r: 'Hours of “very unhealthy” air on top of a cough.' },
          { h: 'Shorter shift, mask on', s: 'Some pay, less haze', c: 'A 2.5-hour shift earns Amri about $50 to $70.', r: 'He says he’ll stop if it gets really hazardous.' },
          { h: 'Take the day off', s: 'No pay, no haze', c: 'Zareth Tan did this after his eyes got itchy.', r: 'Your lungs get a break. Your wallet doesn’t.' }] }],
        hint: 'Tap your answer  ↑' },

      { dark: true, cls: 'mid', kick: 'A rider’s advice', h: ['', ''],
        body: 'Darren Tan caught Covid-19 three times while delivering in the pandemic. Before riding off into the haze, he had one tip.',
        blocks: [{ t: 'quote2', a: 'Wear your', b: 'mask.', by: 'Darren Tan, 49', sub: 'Delivery rider for about 10 years' }],
        hint: 'Tap the quote' },

      { kick: 'Quick quiz', h: ['Knowledge', 'changes the ride'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'What did the 24-hour PSI hit in western Singapore on 15 Oct?', o: ['112, “moderate”', '212, “very unhealthy”', '312, “hazardous”'], a: 1, w: '212, a new high for the year. 201 to 300 is “very unhealthy”.' },
          { q: 'Why do some riders skip masks?', o: ['They trap sweat and get uncomfortable', 'Masks are banned on bikes', 'The apps don’t allow them'], a: 0, w: 'Riders said masks trap sweat. Darren Tan still says: wear your mask.' },
          { q: 'Why might riders who keep going earn more?', o: ['Petrol got cheaper', 'Fewer riders and more orders', 'Tips doubled by law'], a: 1, w: 'With other riders off the roads and demand up, those still riding could earn more.' }] }],
        hint: 'Answer all three' },

      { cls: 'center', kick: 'Story complete', h: ['You made an', 'informed choice.'],
        body: 'That’s what keeps riders going.',
        blocks: [{ t: 'icon', n: 'check', s: 72, cls: 'circ' }, { t: 'reveal', label: 'View summary', items: [['01', 'PSI 212', '“Very unhealthy” air in the west on 15 Oct'], ['02', 'Two choices', 'Cut hours to stay well, or ride on for the pay'], ['03', 'Platforms help', 'Masks, breaks and advice, but the rider decides']] }],
        hint: 'Tap to view your summary' },

      { end: true, cls: 'cover thanks', bg: 'haze-rider', bgpos: '50% 60%', kick: 'Thank you, rider.', h: ['Your story', 'matters.'],
        body: 'Every ride. Every decision. Every day.', foot: 'Ride safe. Stay informed.', hint: '' },
    ],
  },

  // ---------------------------------------------------------------- world (Kirovohrad drone attack)
  world: {
    theme: 'noir', short: 'Kirovohrad', label: 'World Wing · Interactive story', accent: '#d9c9a3',
    source: 'Reuters, via The Straits Times, 15 Oct 2026',
    url: 'https://www.straitstimes.com/world/europe/central-ukrainian-region-hit-by-vast-drone-attack-killing-three',
    frames: [
      { cls: 'center', kick: 'Ukraine · 15 Oct 2026', h: ['Step inside', 'the story'], sub: 'Kirovohrad',
        blocks: [{ t: 'mapcover' }, { t: 'note', dark: true, k: 'Night attack summary', v: 'The largest Russian attack on the region in the war. Three people killed, six wounded.' }],
        hint: 'Swipe to begin' },

      { cls: 'center', h: ['The scale', ''], sub: 'Drone activity overnight',
        blocks: [{ t: 'scalecards', items: [
          { ico: 'target', pre: 'Over ', n: 360, k: 'Regional total', d: 'Drones that hit the Kirovohrad region, the governor said. 26 places were hit.' },
          { ico: 'shield', n: 580, k: 'National total', d: 'Drones that attacked Ukraine overnight, the air force said. 536 were shot down.' }] },
          { t: 'src', v: 'Sources: Governor Andriy Raikovych (Telegram) · Ukraine’s air force · Reuters' }],
        hint: 'Tap both cards' },

      { cls: 'center', h: ['Where it', 'happened'], sub: 'Tap the map to find Kirovohrad',
        blocks: [{ t: 'map' }, { t: 'note', dark: true, k: 'Central Ukraine', v: 'Kirovohrad sits in the middle of the country. Its regional capital is Kropyvnytskyi.' }],
        hint: 'Tap the map to drop your guess' },

      { cls: 'center', h: ['What was hit?', ''], sub: 'Tap each category to reveal',
        blocks: [{ t: 'catlist', items: [
          { ico: 'bolt', h: 'Infrastructure', s: 'Critical infrastructure', d: 'The governor said critical infrastructure was deliberately hit.' },
          { ico: 'train', h: 'Transport', s: 'Transport enterprises', d: 'Transport companies were on the governor’s list of places hit.' },
          { ico: 'box', h: 'Logistics', s: 'Logistics facilities', d: 'Places that store and send out goods were also hit, he said.' },
          { ico: 'home', h: 'Homes & civilian areas', s: 'Residential homes', d: 'Homes were hit too. Three people were killed and six wounded overnight.' }] }],
        hint: 'Open all four categories' },

      { cls: 'center', h: ['Strategic', 'context'], sub: 'Why Kirovohrad stands out',
        body: 'How often is the Kirovohrad region usually attacked?',
        blocks: [{ t: 'choice', ans: 1, stamp: ['Rarely hit', 'Largest attack on the region in the war'], opts: [
          { k: 'Option A', h: 'All the time', pts: ['One of the most-hit regions'], no: 'Not quite. Reuters called it a relatively infrequent target.' },
          { k: 'Option B', h: 'Not often', pts: ['A relatively infrequent target'] }] }],
        hint: 'Pick an answer' },

      { cls: 'center', h: ['The whole', 'night'], sub: 'Across Ukraine',
        blocks: [{ t: 'intercept', total: 580, down: 536 }],
        hint: 'Press and hold the button' },

      { cls: 'center', h: ['Understanding,', 'not a quiz'], sub: 'Let’s clarify what matters',
        blocks: [{ t: 'note', dark: true, k: 'Why it matters', v: 'War numbers come from named people. Knowing who is counting helps you weigh them.', bulb: true },
          { t: 'sort', opts: ['Governor', 'Air force'], items: [
            { c: 'Over 360 drones hit the region.', a: 0, w: 'Governor Andriy Raikovych, on Telegram.' },
            { c: '580 drones attacked Ukraine overnight.', a: 1, w: 'Ukraine’s air force, for the whole country.' },
            { c: '26 different places were hit.', a: 0, w: 'The governor, counting his region.' },
            { c: '536 drones were shot down.', a: 1, w: 'The air force. 580 − 536 = 44 were not (our maths).' }] }],
        hint: 'Match all four' },

      { cls: 'center', h: ['The full', 'picture'], sub: 'Beyond the headlines',
        body: 'Every attack has a human cost. Three people were killed and six wounded. In Kropyvnytskyi, firefighters worked at a business hit by a drone.',
        blocks: [{ t: 'reveal', items: [['', 'Who reported it?', 'Max Hunder for Reuters, from Kyiv. The Straits Times ran the report.']] }],
        hint: 'Tap to reveal' },

      { cls: 'center', h: ['What', 'stuck?'], sub: 'Check your understanding',
        blocks: [{ t: 'quiz', qs: [
          { q: 'About how many drones hit the Kirovohrad region?', o: ['Around 36', 'Over 360', 'Over 3,600'], a: 1, w: 'Over 360, according to the regional governor.' },
          { q: 'Why did this attack stand out?', o: ['The region is rarely targeted', 'It happened in the daytime', 'No one was hurt'], a: 0, w: 'Kirovohrad is a relatively infrequent target. This was its largest attack in the war.' },
          { q: 'Who gave the national figure of 580 drones?', o: ['The governor', 'Reuters', 'Ukraine’s air force'], a: 2, w: 'The air force counted for the country. The governor counted for his region.' }] }],
        hint: 'Answer all three' },

      { end: true, cls: 'center', h: ['Take your time', ''], sub: 'When you’re ready',
        body: 'This story is built to inform, not to overwhelm. Explore the cards, read the context, and understand what happened in Kirovohrad. The full article is always here when you’re ready.',
        blocks: [{ t: 'icon', n: 'star', s: 40 }], foot: 'Thank you for reading', hint: '' },
    ],
  },

  // ---------------------------------------------------------------- culture (Chinamaxxing)
  culture: {
    theme: 'tea', short: 'Chinamaxxing', label: 'Culture Wing · Step inside', accent: '#c8261f',
    source: 'The Straits Times, Tan Dawn Wei, 1 Mar 2026',
    url: 'https://www.pressreader.com/singapore/the-straits-times/20260301/281844355118509',
    frames: [
      { cls: 'full', bg: 'tea', bgpos: '60% 70%', h: ['Let’s diagnose your', 'Chinese-ness'],
        tag: 'A quick quiz  →', body: '5 quick habits. Zero judgement.',
        pill: 'Start quiz', hint: 'Swipe up' },

      { h: ['Your daily habits,', 'your score.'], body: 'Let’s see how Chinese your life really is, by TikTok’s rules.',
        blocks: [{ t: 'habits', items: ['Drink hot water', 'Wear house slippers', 'Spoon up congee', 'Boil apples', 'Practise qigong in the park'] }],
        hint: 'Tick yours, then see the breakdown' },

      { cls: 'twist', dark: true, kick: 'Plot twist:',
        blocks: [{ t: 'tear', a: 'Boiling apples won’t make you Chinese.', b: 'That’s the column’s headline.', btn: 'The real tea  →',
          more: 'Hot water, congee and herbal remedies have become TikTok’s answer to a “very Chinese life”. If only becoming Chinese were that simple.', by: 'Tan Dawn Wei, senior columnist, The Straits Times' }],
        hint: 'Tap “The real tea”' },

      { h: ['China +', '-maxxing'], body: 'For a few weeks, TikTok was swamped with young people saying they were in a “very Chinese time” of their lives.',
        blocks: [{ t: 'combine', a: 'China', b: '-maxxing', word: 'Chinamaxxing', def: 'Optimising your whole self around one obsession. This time: being “Chinese”.', more: ['gymmaxxing', 'looksmaxxing', 'fibermaxxing'] }],
        hint: 'Tap Combine' },

      { h: ['Trend vs', 'tradition'], body: 'Swipe to feel the difference. Tap one.',
        blocks: [{ t: 'pics', items: [
          { k: 'Trend', img: 'apples', h: 'Boiled apples', s: 'All over TikTok', r: 'A habit you can copy from a video in a day. The column asks if that’s enough to call it a culture.' },
          { k: 'Tradition', img: 'congee', h: 'Congee', s: 'Long before the trend', r: 'For many families it’s just breakfast. That’s the gap the headline points at.' }] }],
        hint: 'Tap the one that feels right' },

      { cls: 'full lightbg sm', bg: 'apples', bgpos: 'center 60%', kick: 'Perspective check:', h: ['Grandma boiled apples', 'before it was cool.'],
        blocks: [{ t: 'react', label: 'Save this vibe' }], hint: 'Swipe up' },

      { h: ['Appreciation', 'vs costume'], body: 'Where do you land? This is your take, not a fact.',
        blocks: [{ t: 'scale', l: 'Appreciation', r: 'Costume', msgs: ['Respect and curiosity. Learning the why behind a habit makes it more than a trend.', 'Somewhere in between. A habit can be a door in, if you keep going past the video.', 'Dressing up in a culture for views. The headline says it isn’t that simple.'] }],
        small: 'It’s not the slippers. It’s the respect (and research).', hint: 'Reflect & slide' },

      { cls: 'full brush', bg: 'slippers', bgpos: 'center 70%', h: ['Slippers are not just footwear.', 'They’re a trend now.'],
        body: 'Shuffling around in house slippers is all over “very Chinese time” videos.',
        blocks: [{ t: 'react', label: 'Agree?', heart: true }], hint: 'Swipe up' },

      { cls: 'full brush', dark: true, bg: 'hotwater', bgpos: 'center 60%', h: ['Hot water isn’t boring.', 'It’s the #1 habit.'],
        body: 'Sipping hot water tops the Chinamaxxing list.',
        blocks: [{ t: 'react', label: 'I get it' }], hint: 'Swipe up' },

      { cls: 'full lightbg', bg: 'congee', bgpos: 'center 40%', h: ['Congee is basically', 'a hug you can eat.'],
        body: 'Spooning up congee is on the list too.',
        blocks: [{ t: 'react', label: 'Yum' }], hint: 'Swipe up' },

      { h: ['Different lens,', 'same culture?'], body: 'This piece is a column: a writer arguing a point. Sort each line.',
        blocks: [{ t: 'sort', opts: ['Fact', 'Opinion'], items: [
          { c: 'TikTok has been swamped with “very Chinese time” videos.', a: 0, w: 'Fact. You can check it by scrolling.' },
          { c: '“Chinamaxxing” is “China” plus “-maxxing”.', a: 0, w: 'Fact. It describes how the word was built.' },
          { c: 'Boiling apples won’t make you Chinese.', a: 1, w: 'Opinion. It’s the writer’s argument. You can agree or disagree.' }] }],
        hint: 'Sort all three' },

      { h: ['Boiled apples:', 'who knew?'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'What does “-maxxing” mean?', o: ['Doing the bare minimum', 'Optimising yourself around one obsession', 'A Chinese word for tea'], a: 1, w: 'Like gymmaxxing or looksmaxxing: going all in on one thing.' },
          { q: 'Which habit is part of the trend?', o: ['Iced coffee', 'Boiling apples', 'Cold showers'], a: 1, w: 'Hot water, slippers, boiled apples, qigong and congee all feature.' },
          { q: 'What kind of piece is this article?', o: ['A news report', 'A column with an opinion', 'An advert'], a: 1, w: 'A column by senior columnist Tan Dawn Wei. It argues a point.' }] }],
        hint: 'Answer all three' },

      { end: true, kick: 'Thanks for playing', h: ['Culture isn’t a checklist.', 'It’s a life you live.'],
        body: 'Trying a habit is fine. Saying it makes you part of a culture is a bigger claim. Curious? Ask the people who grew up with it.',
        endBtn: 'Carry the vibe', foot: '', hint: '' },
    ],
  },
});
