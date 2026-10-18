# The Knowseum

An interactive mobile web app for a gamified news museum built for young readers in Singapore. Visitors walk the museum's wings, step into illustrated news stories, hear every side in a Messages-style thread, take three-level quizzes, and fill a visitor passport with travel stamps and Van Gogh–style badges.

The app is plain HTML, CSS and JavaScript, with no frameworks and no build step.

## Run it

**Easiest:** double-click `index.html`. It opens in your browser, and every screen works from a local file.

**On your phone, or to share on your Wi-Fi:** start a tiny web server in this folder, then open the address it prints.

```bash
python3 -m http.server 8000
# then open http://localhost:8000 (or http://<your-computer's-IP>:8000 on your phone)
```

On a computer it shows inside a phone frame. On a phone it fills the screen.

## What's in it

| Screen | What you can do |
|---|---|
| Sign in → Username → Welcome | Email or Google (mock), pick an `@handle` with live checking |
| Make your look | Girl/boy toggle, shuffle and colour buttons, and four tabs: **Hair** (6 styles + 6 colours), **Outfit** (6 outfits + 6 colours), **Accessories** (6 to start, wear up to 2, plus 6 earned in the museum), **Secret** (9 items unlocked by your streak and quiz count) |
| Lobby | The isometric museum fills the screen. Hold your character and drag it to a doorway to walk in (or tap the floor or a door). Wings drawer at the bottom opens the full list |
| Wing room | Each wing's isometric room. Tap the Newsworthy wall to walk up to it. Furnish the room by finishing quizzes there (couch, coffee table, trophy, then 3 more). World, Environment and Culture rooms show their painting; their wall has the headline, a link to the article, "coming soon" activities and a one-question warm-up quiz |
| Newsworthy Wall | Gilded painting, headline plaque, three activity cards with completion ticks |
| Newsworthy Wall | Swipe the gilded frames (or use the arrows). Frame 1 is this week's story; the others are "coming soon" placeholders for the demo |
| Step into the story | 14 interactive frames per article: swipe the panel, tap to reveal, hold for the F1 lights-out start, drag the race replay, toggle comparisons, run a scan, read the incident log, and a 3-question checkpoint quiz. Continue lights up once you've done each frame's thing |
| Perspectives | iMessage-style thread with typing dots: 3 people from the article, then "What this means for you" |
| Quiz | Pick Easy la / Not bad leh / Dam hard sia; 5 questions each with green/red feedback, shake and explanations |
| Results → Rewards → Bonus | Counting score, travel-stamp reveal, unlocked items, article badge after finishing everything |
| Badge unlocked | Animated Van Gogh night sky when a streak or quiz milestone is reached |
| Passport | Points, latest stamps, all badges; a stamp page per wing; tap stamps and badges for details |
| Map | Full-screen museum floor plan. Hold your character and drag it into a room (or tap a spot, or use the arrow keys), then tap Enter. Includes the Lobby and the Hall of Fame |
| Hall of Fame | Leaderboards for quiz points, streak and stamps, with a podium. Other players are made up for the demo |
| Profile | Stats, edit your look, simulate tomorrow or a week to test streak badges, reset progress |

Progress saves in the browser (`localStorage`), so each person keeps their own run. Reset it from Profile.

## Files

```
index.html        page shell
css/app.css       all styles and animations
js/data.js        article content: threads, 45 quiz questions, rewards, badges
js/world.js       lobby + room layout (door, wall and avatar positions), furniture and accessory doodles
js/avatar.js      draws the avatar from your look (hair, colours, outfit, accessories)
js/stories.js     content for the interactive story frames (facts from the articles)
js/story.js       story engine: draws each frame and runs its interaction
js/app.js         screens, navigation, game logic, animations
assets/
  paintings/      wing paintings
  stamps/         9 travel stamps (Higgsfield)
  badges/         Van Gogh streak, quiz and article badges (Higgsfield), plus greyed locked copies
  lobby.webp      isometric museum lobby
  rooms/          each wing room, empty to fully furnished
  map.svg, facade.svg
```

## Change things

- **Edit a story frame:** `js/stories.js` → `<wing>.frames[n]`. Each frame has a kicker, a two-line headline, body text and a list of `blocks` (cards, reveal, tabs, chips, quiz, etc).
- **Add or edit questions:** `js/data.js` → `articles.<wing>.quiz.easy | mid | hard`. Each question has `q`, `opts` (4 options), `ans` (index of the right one) and `why` (explanation).
- **Open a new wing:** add the article to `js/data.js`, set `open: true` for it in `wings`, add its key to `OPEN` in `js/app.js`, and add its images to `assets/`.
- **Colours and fonts:** the `:root` variables at the top of `css/app.css`.

## Sources

Every fact in the stories, threads and quizzes comes from three Straits Times reports:

- "Govts must incentivise private sector to hire fresh grads amid declining entry-level roles: President", Tham Yuen-C, 12 Oct 2026
- "Mercedes' Kimi Antonelli within touching distance of maiden F1 title after finishing 3rd at S'pore GP", Laura Chia, 11 Oct 2026
- "Anthropic to work with Singapore to evaluate AI models for safety and security", Sarah Koh, 14 Oct 2026

This is a prototype for a COMM121 class project. Sign-in is pretend and nothing is sent anywhere.
