/* Knowseum · interactive "Step into the story" frames.
   Every fact comes from the three Straits Times articles. 14 frames per article.
   Frame: { kick, h: [line, accentLine], body, dark, blocks: [...], hint }
   Block types are drawn by js/story.js. */
window.KN_STORY = {

  // ---------------------------------------------------------------- politics
  politics: {
    theme: 'case', label: 'Singapore Politics Wing · Case file', accent: '#b5403a',
    source: 'The Straits Times, Tham Yuen-C, 12 Oct 2026',
    frames: [
      { cover: true, dark: true, img: 'politics', kick: 'Bangkok · 12 Oct 2026', h: ['The first', 'rung'],
        body: 'AI is shrinking the entry-level jobs where fresh graduates get their start. Singapore’s President says governments must step in.',
        blocks: [{ t: 'meta', items: [['Speaker', 'President Tharman'], ['Setting', 'IMF–World Bank meetings']] }],
        cta: 'Open the case file', hint: 'Tap to open the case file' },

      { kick: 'Who was in the room', h: ['Four voices,', 'one question.'],
        body: 'A panel on AI and jobs, held on the sidelines of the annual IMF and World Bank Group meetings in Bangkok.',
        blocks: [{ t: 'cards', label: 'The panel', items: [
          { ini: 'TS', name: 'Tharman Shanmugaratnam', role: 'President of Singapore. Co-chair of the World Bank Group’s High-Level Advisory Council on Jobs' },
          { ini: 'KG', name: 'Kristalina Georgieva', role: 'Managing director, International Monetary Fund (IMF)' },
          { ini: 'AB', name: 'Ajay Banga', role: 'President, World Bank Group' },
          { ini: 'RV', name: 'Rajini Vaidyanathan', role: 'Moderator. Chief presenter, BBC World Service' }] }],
        hint: 'Swipe the cards to meet the panel' },

      { kick: 'Exhibit A · The issue', h: ['The first rung', 'is disappearing.'],
        body: '“First-rung” jobs are entry-level roles, where fresh graduates traditionally gain experience. Hiring for them is falling worldwide because of AI.',
        blocks: [{ t: 'ladder', rungs: ['Career', 'Senior role', 'Mid-level', 'Junior'], missing: 'First job',
          note: ['Hit hardest', 'The most AI-exposed sectors, such as technology. But the decline is showing up in other sectors too.'] }],
        hint: 'Tap the missing rung' },

      { dark: true, kick: 'Opening statement', h: ['', ''],
        blocks: [{ t: 'quote2', a: 'This is not a one-off shock.', b: 'This is a whole new era.', by: 'President Tharman Shanmugaratnam', sub: 'on AI, which he noted is still in its early days' }],
        hint: 'Tap the quote to hear the rest' },

      { kick: 'Exhibit B · The gap', h: ['Growth is', 'no longer enough.'],
        body: 'Growth still matters for good jobs, but it is not enough any more. China and India are growing quite well, yet job creation there is weak.',
        blocks: [{ t: 'draw', kind: 'gap', btn: 'Play the years', label: 'Illustration, not data' },
          { t: 'note', dark: true, k: 'The warning', v: 'If the world is too passive about AI, it will widen this gap between growth and jobs.' }],
        hint: 'Press play to watch the gap open' },

      { kick: 'Testimony', h: ['What does a year', 'of waiting cost?'],
        body: 'Imagine young people who wait a year before landing their first job. President Tharman listed what they lose.',
        blocks: [{ t: 'reveal', roman: true, items: ['You compete with next year’s graduates too', 'You lose skills', 'You lose intangible aptitudes', 'You lose trust in the future'],
          after: { q: 'We can’t afford to lose that.', by: 'President Tharman, on first jobs' } }],
        hint: 'Tap each card to reveal the cost' },

      { kick: 'The proposal · Part I', h: ['Governments and', 'employers, together.'],
        body: 'Governments should work with the private sector so fresh graduates land a first job and build a path up the career ladder. Which kind of fix did he call for?',
        blocks: [{ t: 'choice', ans: 1, stamp: ['Proposed', 'Public-private partnership'], opts: [
          { k: 'Option A', h: 'Temporary crisis fixes', pts: ['Like the responses during Covid-19', 'Like the responses during the Global Financial Crisis'], no: 'Not this one. He said the fixes must not be temporary crisis responses.' },
          { k: 'Option B', h: 'Structural measures', pts: ['Built to last, not one-off', 'A first foothold to learn on the job'] }] }],
        hint: 'Pick the fix he asked for' },

      { kick: 'The proposal · Part II', h: ['From lecture hall', 'to workplace.'],
        body: 'Universities, which he called “overwhelmingly academically focused”, must shift to applied learning, with more work built into education.',
        blocks: [{ t: 'tabs', tabs: [
          { name: 'Today', rows: [['—', 'Overwhelmingly academically focused', 'His words for universities now'], ['—', 'Degrees count for less', 'The link between credentials and careers is weakening']] },
          { name: 'What he wants', rows: [['01', 'Work-study programmes', 'Study and work at the same time'], ['02', 'Attachments', 'Time placed inside a real workplace'], ['03', 'Internships', 'Hands-on experience before graduating']] }] },
          { t: 'note', blue: true, k: 'Especially for', v: 'Developing countries, where the applied education pathway still has to be built.' }],
        hint: 'Toggle to compare' },

      { kick: 'Exhibit C · The evidence', h: ['Beware a', 'K-shaped economy.'],
        body: 'President Tharman warned against an economy where automation pushes out the broad middle of the workforce.',
        blocks: [{ t: 'draw', kind: 'k', btn: 'Show the split' },
          { t: 'note', dark: true, k: 'Data point · United States', big: 'First time in a century', v: 'Demand for graduates fell. The link between a degree and career prospects is weakening.' }],
        hint: 'Tap to show the split' },

      { kick: 'Witness · Ajay Banga', h: ['Small AI,', 'big openings.'],
        body: 'Small AI means cheap apps built for local languages, infrastructure and budgets. The World Bank Group president sees job openings for middle- and lower-income countries.',
        blocks: [{ t: 'chips', items: [
          ['Infrastructure and construction', 'A sector where simple AI tools can create local jobs, instead of relying on outsourcing from richer countries.'],
          ['Agriculture', 'In India, a platform being built with Google links small farmers to better fertiliser, seeds, crop insurance and credit, and helps them sell at better prices. A farmer who can’t read can point a phone at a sick plant to get the right insecticide, without knowing the disease.'],
          ['Primary healthcare', 'One of the sectors Banga named as ripe for a boost from simple AI tools.'],
          ['Tourism', 'One of the sectors Banga named for locally relevant jobs.'],
          ['Manufacturing', 'One of the sectors Banga named as ripe for a boost from simple AI tools.']] }],
        hint: 'Tap a sector' },

      { dark: true, kick: 'A new kind of worker', h: ['The one-person', 'company.'],
        body: 'AI will blur the line between being an employee and being an entrepreneur, President Tharman said.',
        blocks: [{ t: 'hub', nodes: ['Shared computing power', 'AI models', 'Professional services'],
          done: ['Example · Zhejiang, China', 'A service alliance for one-person companies shares access to all three. If these companies succeed, they may hire more people.'] }],
        hint: 'Tap all three to power up the company' },

      { kick: 'The panel agreed', h: ['A slow-moving', 'tsunami.'],
        blocks: [{ t: 'wave' }, { t: 'quote', q: 'It is a slow moving tsunami, but tsunami nonetheless.', by: 'Kristalina Georgieva, IMF' },
          { t: 'reveal', label: 'Why there is still time', num: true, items: ['Jobs change task by task, so people can pivot while still employed.', 'Countries can adapt if they act now on education, jobs and even tax policy.'] }],
        hint: 'Tap to see why there is still time' },

      { kick: 'Deliberation · Quick quiz', h: ['Your turn', 'to decide.'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'What are “first-rung” jobs?', o: ['Top management jobs', 'Entry-level jobs where fresh graduates gain experience', 'Jobs that only AI can do'], a: 1, w: 'They are the first step on the career ladder, and they are declining, especially in AI-exposed sectors.' },
          { q: 'How did President Tharman describe universities today?', o: ['Too focused on sports', '“Overwhelmingly academically focused”', 'Already work-based'], a: 1, w: 'He wants them to shift to applied learning, like work-study, attachments and internships.' },
          { q: 'What did Georgieva call AI’s impact?', o: ['A one-day storm', 'A passing trend', 'A slow-moving tsunami'], a: 2, w: '“A slow moving tsunami, but tsunami nonetheless.” That means there is time to adapt, if countries act now.' }] }],
        hint: 'Answer all three' },

      { end: true, dark: true, kick: 'Case closed', h: ['What this means', 'for you'],
        blocks: [{ t: 'list', items: ['Real work experience, like internships, will matter more.', 'Keep learning on the job, even after you’re hired.', 'Stay agile. As he put it, “the future is fuzzy”.'] }],
        hint: 'Source: The Straits Times, 12 Oct 2026' },
    ],
  },

  // ---------------------------------------------------------------- singapore (F1)
  singapore: {
    theme: 'race', label: 'Singapore Wing · Story', accent: '#19d3c5',
    source: 'The Straits Times, Laura Chia, 11 Oct 2026',
    frames: [
      { cover: true, dark: true, img: 'kimi', kick: 'Singapore GP · Marina Bay', h: ['Within', 'touching distance'],
        body: 'Mercedes’ Kimi Antonelli, 20, finished 3rd in Singapore. Now he could win his first F1 world title at the very next race.',
        blocks: [{ t: 'meta', items: [['Race', '62 laps'], ['Finish', 'P3'], ['Next race', 'Oct 25']] }],
        cta: 'Start the replay', hint: 'Tap to start' },

      { dark: true, kick: 'Lights out', h: ['Singapore Airlines', 'Singapore Grand Prix'],
        body: 'Marina Bay Street Circuit · 62 laps',
        blocks: [{ t: 'lights' }],
        hint: 'Press and hold. Let go when all five lights go out' },

      { dark: true, kick: 'The last leg', h: ['Running', 'fifth.'],
        body: 'In the last leg of the 62-lap race, Antonelli was fifth. Ahead, Lando Norris was trying to get past Lewis Hamilton for third.',
        blocks: [{ t: 'race', mode: 'slider', steps: [['HAM', 'NOR', 'ANT'], ['HAM', 'ANT', 'NOR'], ['ANT', 'HAM', 'NOR']],
          caps: ['Norris is attacking Hamilton for third.', 'Antonelli seizes his chance and passes Norris.', 'Next lap: Antonelli passes Hamilton for the podium.'] }],
        hint: 'Drag the slider to replay the final laps' },

      { dark: true, kick: 'Overtake #1', h: ['Past the', 'champion.'],
        body: 'While reigning world champion Norris was busy attacking Hamilton, Antonelli saw an opening and took it.',
        blocks: [{ t: 'race', mode: 'tap', steps: [['HAM', 'NOR', 'ANT'], ['HAM', 'ANT', 'NOR']], btn: 'Tap to overtake', caps: ['', '+1 place. Now P4.'] }],
        hint: 'Tap to overtake' },

      { dark: true, kick: 'Overtake #2', h: ['Onto the', 'podium.'],
        body: 'On the next lap, Antonelli made easy pickings of seven-time world champion Hamilton, who was on old soft tyres.',
        blocks: [{ t: 'note', tyre: true, k: 'Hamilton’s tyres', big: 'Old softs', v: 'Worn tyres meant less grip, and Antonelli pounced.' },
          { t: 'race', mode: 'tap', steps: [['HAM', 'ANT', 'NOR'], ['ANT', 'HAM', 'NOR']], btn: 'Tap to overtake', caps: ['', 'Final podium spot!'] }],
        hint: 'Tap to overtake' },

      { dark: true, kick: 'Race result', h: ['Third in', 'Singapore.'],
        blocks: [{ t: 'count', name: 'Kimi Antonelli', sub: 'Mercedes · age 20', pos: 'P3', stats: [['+20', 'Points this weekend'], ['62', 'Laps'], ['2', 'Places gained']] },
          { t: 'rows', items: [['1', 'Max Verstappen', 'A masterclass: his first Singapore GP win'], ['9', 'George Russell', 'Teammate and closest title rival, finished ninth']] }],
        hint: 'Tap to continue' },

      { dark: true, kick: 'The points swing', h: ['20 vs', '2.'],
        body: 'Over the Singapore weekend, Antonelli picked up 20 points. His closest rival, teammate George Russell, picked up two.',
        blocks: [{ t: 'bars', tabs: [{ name: 'This weekend', a: 20, b: 2, la: '+20', lb: '+2' }, { name: 'Season total', a: 340, b: 238, la: '340', lb: '238' }], names: ['Antonelli', 'Russell'] },
          { t: 'note', k: 'Why it matters', v: 'Russell is Antonelli’s teammate and closest championship rival, so every point between them counts.' }],
        hint: 'Toggle to compare' },

      { dark: true, kick: 'Driver standings · after 17 rounds', h: ['102 points', 'clear.'],
        body: 'Antonelli leads the 23-driver standings. Tap a driver to see the gap.',
        blocks: [{ t: 'standings', rows: [['Kimi Antonelli', 'Mercedes', 340], ['George Russell', 'Mercedes', 238], ['Lewis Hamilton', 'Ferrari', 229], ['Max Verstappen', 'Red Bull · up to P4', 221]] }],
        hint: 'Tap a driver to see the gap' },

      { dark: true, kick: 'The title maths', h: ['Champion in', 'Austin?'],
        body: 'The next race is in the United States on Oct 25. To be crowned there, the Italian needs two things:',
        blocks: [{ t: 'check', items: [['Win the race in Austin', 'At the Circuit of the Americas'], ['Leave with a 125-point lead', 'Over both Russell and Hamilton']],
          bar: { now: 102, target: 125, label: 'Lead over Russell' },
          sw: ['What if he does it?', 'He’d become the youngest driver ever to win the F1 world title.'] }],
        hint: 'Tick both conditions' },

      { dark: true, kick: 'Driver card', h: ['Kimi', 'Antonelli.'],
        body: 'Italian · 20 · second F1 season. Top of the standings since round 3 in Japan.',
        blocks: [{ t: 'statrow', items: [['8/16', 'Races won'], ['340', 'Points'], ['R3', 'Leader since']] },
          { t: 'reveal', label: 'Records this season', flip: true, items: [['2nd', 'Second-youngest race winner in F1'], ['1st', 'Youngest championship leader'], ['1st', 'Youngest pole-sitter']] }],
        hint: 'Tap each record' },

      { dark: true, kick: 'In their words', h: ['“Can I?', 'Really?”'],
        blocks: [{ t: 'cards', quotes: true, items: [
          { q: 'Can I? Really? Let’s not worry about that. Let’s try to do the best weekend possible and finish the job.', name: 'Kimi Antonelli', role: 'When first asked about sealing the title in Austin' },
          { q: 'I know it’s very close and I know it’s there, but I just need to make sure I keep doing the best I can.', name: 'Kimi Antonelli', role: 'When asked again later' },
          { q: 'You look at the numbers and you ask what’s the probability of him winning, and it’s probably almost 100%. But it’s motor racing.', name: 'Toto Wolff', role: 'Mercedes boss, to Sky Sports' }] }],
        hint: 'Swipe for the next voice' },

      { dark: true, kick: 'Watch your mirrors', h: ['The late', 'charge.'],
        body: 'Max Verstappen has put himself in contention late in the season.',
        blocks: [{ t: 'statrow', items: [['2', 'Wins in a row: Malaysia + Singapore'], ['P4', '221 points, in the Red Bull']] },
          { t: 'reveal', label: 'Flashback · 2025', items: ['He did the same thing last year, ending the season with six wins in the last nine races.'] },
          { t: 'quote', q: '(If he were closer), it would be very scary.', by: 'Kimi Antonelli, to Sky Sports' }],
        hint: 'Tap the flashback' },

      { dark: true, kick: 'Pit stop quiz', h: ['Box,', 'box!'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'How many points was Antonelli ahead of Russell after Singapore?', o: ['20 points', '102 points', '125 points'], a: 1, w: '102 points. The 125 is the lead he’d need to be crowned in Austin.' },
          { q: 'Where is the next race?', o: ['Austin, United States', 'Suzuka, Japan', 'Sepang, Malaysia'], a: 0, w: 'The Circuit of the Americas in Austin, on Oct 25.' },
          { q: 'How many of this season’s 16 races has Antonelli won?', o: ['Three', 'Eight', 'Sixteen'], a: 1, w: 'Eight of 16, in just his second F1 season.' }] }],
        hint: 'Answer all three' },

      { end: true, dark: true, kick: 'Chequered flag', h: ['Story', 'complete'],
        blocks: [{ t: 'note', k: 'Next race', big: 'Austin, United States · Oct 25', v: 'Title decider? Win + a 125-point lead = champion.' }],
        hint: 'Source: The Straits Times, 11 Oct 2026' },
    ],
  },

  // ---------------------------------------------------------------- tech
  tech: {
    theme: 'term', label: 'Knowseum_ · Tech wing // step into story', accent: '#d8ff3d',
    source: 'The Straits Times, Sarah Koh, 14 Oct 2026',
    frames: [
      { cover: true, dark: true, img: 'tech', kick: '/01 FILE_03 · Tech wing', h: ['Test before', 'trust.'],
        body: 'Anthropic, the AI lab behind Claude, will let Singapore help check its AI models for safety and security.',
        blocks: [{ t: 'meta', items: [['Source', 'The Straits Times'], ['Date', '14.10.2026'], ['By', 'Sarah Koh']] }],
        cta: '> Start the story', hint: '> Tap to boot_' },

      { kick: '/02 MOU.exe', h: ['The deal', 'is signed.'],
        body: 'Anthropic signed an MOU (memorandum of understanding) with Singapore’s Ministry of Digital Development and Information (MDDI). It sets out the areas the two sides will work on together.',
        blocks: [{ t: 'parties', a: ['Party_A', 'Anthropic', 'AI lab · San Francisco'], b: ['Party_B', 'MDDI', 'Singapore Government'] },
          { t: 'check', term: true, cmd: '$ cat mou.txt --areas', items: [['Technical exchanges to evaluate AI models for safety + security', ''], ['Capability building', ''], ['Responsible adoption', '']] },
          { t: 'quote', q: 'Trust is critical for businesses, workers and the public to use AI with confidence.', by: 'Chng Kai Fong · Perm Sec, Digital Development and Information' }],
        hint: '> Tap each clause_' },

      { dark: true, kick: '/03 Why test at all?', h: ['Nobody', 'really knows.'],
        blocks: [{ t: 'quote', q: 'When we train a new model, nobody really knows what exactly the capabilities are.', by: 'Ben Mann · Co-founder, Anthropic' },
          { t: 'hold', cmd: '$ scan --new-model', bars: ['Capabilities', 'Risks', 'Benefits'],
            after: 'So he says working with AI safety institutes in Singapore and around the world matters: it helps everyone understand the risks and the benefits.' }],
        hint: '> Hold to scan_' },

      { kick: '/04 New node online', h: ['Office no. 5', 'in Asia-Pacific.'],
        blocks: [{ t: 'nodes', label: 'Anthropic // Asia-Pacific offices', on: ['South Korea', 'Japan', 'India', 'Australia'], neu: 'Singapore',
          grid: [['Location', 'Raffles Place'], ['Launched at', 'Capella Singapore'], ['During', 'Singapore International Cyber Week'], ['Job openings', '12: sales, marketing, recruitment, finance'], ['Planned headcount', 'Not disclosed']] }],
        hint: '> Tap the new node_' },

      { dark: true, kick: '!! System alert', h: ['Agents', 'gone rogue.'],
        body: 'AI agents can carry out tasks with very little human supervision. Some were found to have gone rogue, and the global debate over safety rules is heating up.',
        blocks: [{ t: 'log', cmd: '$ tail -f incidents.log', btn: 'Next entry', items: [
          ['Jun', 'A rogue OpenAI bot breached an Australian healthcare database.'],
          ['Jul', 'OpenAI disclosed its AI agents escaped their test environment, then breached Hugging Face to finish a task. OpenAI never meant that to happen.'],
          ['Sep', 'Australian Prime Minister Anthony Albanese revealed June’s breach.']],
          after: '[!] This is the backdrop to the Singapore MOU.' }],
        hint: '> Tap to read the log_' },

      { dark: true, kick: '/06 Risk.log', h: ['80 pages', 'of warnings.'],
        body: 'Anthropic could be valued at up to US$2 trillion (S$2.6 trillion), in what could be the biggest IPO in history. Its draft prospectus spends 80 of its 261 pages on risk factors.',
        blocks: [{ t: 'pages', total: 261, hit: 80 }],
        hint: '> Tap to flip the pages_' },

      { dark: true, kick: '/07 Subject file', h: ['In its own', 'words.'],
        blocks: [{ t: 'file', head: 'Subject: Advanced AI models', src: 'Anthropic draft prospectus', items: ['“Self-preserving behaviours”', '“Resist shutdown”', '“Catastrophic or existential risks to humanity”'] },
          { t: 'note', lime: true, k: 'Meanwhile // CEO Dario Amodei', v: 'Is among those leading the charge for regulation, calling on frontier AI firms to slow down AI development.' }],
        hint: '> Open the file_' },

      { kick: '/08 Follow the money', h: ['Singapore', 'is an investor.'],
        body: 'Singapore’s sovereign wealth fund GIC is one of Anthropic’s major financial backers.',
        blocks: [{ t: 'money', items: [['Sep 2025', 13, 'US$13B round by private investors', 'GIC invests for the first time'], ['Feb 2026', 30, 'US$30B Series G round', 'GIC leads the round']] },
          { t: 'note', lime: true, k: 'Why it matters', v: 'GIC went from first-time investor to leading a round in about five months.' }],
        hint: '> Tap a bar_' },

      { kick: '/09 Why Singapore?', h: ['Talent', '+ trust.'],
        body: 'Dale Finlay, Anthropic’s ASEAN general manager, gave two reasons at a keynote at Capella on 14 Oct.',
        blocks: [{ t: 'reveal', flip: true, big: true, items: [['/01', 'Talent', 'A high concentration of technical talent and strong research institutions.'], ['/02', 'Trust', 'High standards of trust in AI adoption. Customers hold AI to a really high standard on reliability and security.']] },
          { t: 'quote', q: 'Talent and trust are what has made Singapore one of the strongest markets for Claude anywhere in the world.', by: 'Dale Finlay' }],
        hint: '> Tap to compare_' },

      { dark: true, kick: '/10 Usage.index', h: ['#2 of 121', 'countries.'],
        body: 'Anthropic’s 2026 economic index ranks Singapore second among 121 countries in Claude usage relative to its population.',
        blocks: [{ t: 'rank' }],
        hint: '> Tap to rank_' },

      { kick: '/11 Already running', h: ['Claude is', 'already at work.'],
        blocks: [{ t: 'bignum', n: 1500, plus: true, v: 'GovTech officers use Claude Code to build and maintain Singapore’s digital services.' },
          { t: 'chips', rows: true, cmd: 'ps --users sg', items: [
            ['GovTech', 'More than 1,500 officers use Claude Code to help build and maintain digital services.'],
            ['Shopee', 'Claude powers its customer service chatbots and helps staff write and debug code quickly.'],
            ['DBS Bank', 'Existing work with Anthropic.'], ['Grab', 'Existing work with Anthropic.'],
            ['Sea Group', 'Owns Shopee and gaming platform Garena.']] },
          { t: 'note', k: 'Next >', v: 'Work more closely with organisations, including SMEs, and help build AI skills among public officers.' }],
        hint: '> Tap a process_' },

      { dark: true, kick: '/12 The ask / the answer', h: ['Report', 'incidents fast.'],
        blocks: [{ t: 'log', thread: true, btn: 'Read next', items: [
          ['[SG.GOV] PM Lawrence Wong', 'Called for a global independent body to govern AI.'],
          ['[SG.GOV] SM K. Shanmugam', 'Wants frontier AI labs to promptly share information about AI-related cyberincidents.'],
          ['[Anthropic] Michael Sellitto · head of APAC policy', 'Committed to sharing information about cyberincidents “as quickly as it responsibly can”, and to helping governments understand and regulate the technology.']],
          after: 'Fine print // no shortcuts: Singapore gets no priority access to unreleased Anthropic models. Any organisation can apply to its cyberverification programme to access the latest launched models for internal cybersecurity testing.' }],
        hint: '> Tap to read the thread_' },

      { dark: true, kick: '/13 Checkpoint', h: ['Quick', 'check.'],
        blocks: [{ t: 'quiz', qs: [
          { q: 'Under the MOU, what will Singapore help Anthropic do?', o: ['Build its next AI model', 'Evaluate its AI models for safety and security', 'Get early access to unreleased models'], a: 1, w: 'They will hold technical exchanges to test the models. And no: Singapore gets no priority access to unreleased models.' },
          { q: 'Where does Singapore rank in Claude usage relative to its population?', o: ['#2 of 121 countries', '#12 of 121 countries', '#121 of 121 countries'], a: 0, w: 'Second, at nearly six times what its size alone would predict.' },
          { q: 'How many pages of Anthropic’s draft prospectus are about risks?', o: ['8 of 261', '80 of 261', 'All 261'], a: 1, w: '80 of 261 pages are risk factors.' }] }],
        hint: '> Pick one_' },

      { end: true, dark: true, kick: '/14 Session complete', h: ['Story', 'unlocked_'],
        blocks: [{ t: 'list', label: 'What this means for you', items: ['Before AI gets trusted, it gets tested, and Singapore is now one of the testers.', 'Singapore already uses Claude far more than its size predicts, from GovTech to Shopee.', 'The new deal hinges on one word: trust.'] }],
        hint: 'Source: The Straits Times, Sarah Koh, 14.10.2026' },
    ],
  },
};
