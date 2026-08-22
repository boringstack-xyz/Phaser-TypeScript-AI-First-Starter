# 05 — Solo Dev Workflow

The mechanical question isn't "can I make a game" — you can. It's "how do I structure my time so I actually finish one?" This doc is the production plan that has worked for programmers shipping their first game.

## The three-phase plan

### Phase 1 — Prototype (1–2 weekends)

**Goal**: prove the core loop is fun.

- Placeholder art (colored rectangles, the demo slice shape)
- No menus, no title screen, no save system
- One level or one arena
- One character, one enemy type, one obstacle
- **Player can play the core verbs end-to-end**

At the end of phase 1, you hand your prototype to a friend and watch them play. If they smile within 5 minutes, continue. If not, **cut and restart**, don't iterate. Prototypes that aren't fun rarely become fun with more features.

### Phase 2 — Vertical slice (2–6 weeks)

**Goal**: one level, fully polished, that represents the whole game.

- Real art for this level (even if rough)
- Real sound for every action
- Menu → play → game over → menu loop works
- Save/load works
- This slice should be **shippable as a free demo**. Treat it as such.

The vertical slice is where 80% of solo games die. Not because it's hard to build — because it reveals every weakness of the core loop at the same time. Push through. If you survive the vertical slice, you'll probably ship.

### Phase 3 — Content + ship (1–6 months)

**Goal**: add levels, enemies, weapons, stories until the game feels whole.

- Each new level/enemy/mechanic should take 1–3 days, not 1–3 weeks. If it takes weeks, your tooling is wrong; fix the tooling first.
- **Content is easier than systems.** Systems should be locked by end of vertical slice.
- Playtest every new chunk. Iterate tuning based on real humans.
- Fix all the blocking bugs, then ship. Do not polish indefinitely.

## The weekly cadence that works for solo devs

Pick a pace you can sustain. Most successful solo devs who have day jobs run something like:

- **Weekdays (5–10 hours/week)**: one system, one level, one art pass at a time. Focused sessions, not marathons.
- **Weekends (4–12 hours/week)**: bigger chunks — playtesting, asset generation runs, refactors.
- **One day per week off, guilt-free.** Burnout ships no games.
- **Weekly ritual**: Sunday 30 min — play your own game, take notes, plan next week.

Don't treat the hobby like your dayjob. Treat it like a second craft you're patient with.

## Development discipline this template gives you for free

Because this template ships the rails already, you don't spend your first weeks on:

- "What testing library?" (Vitest)
- "How do I structure the code?" (the architecture is already enforced)
- "What if AI writes sloppy code?" (the constitution + lint boundaries stop it)
- "How do I deploy?" (GitHub Pages via the workflow)
- "How do I version?" (release-please)
- "How do I spec features before coding?" (`/speckit:specify`)

That usually saves 2–4 weekends right at the start. Don't waste the savings by ignoring the rails later.

## The spec-kit workflow, condensed for solo use

Even for solo dev, **writing a spec before coding** catches the bad ideas before they become bad code. Especially when AI is writing most of the code — the spec is what keeps it aligned.

```
idea → /speckit:specify → spec.md
     → /speckit:plan     → plan.md
     → /speckit:tasks    → tasks.md
     → /speckit:implement → code
```

For a 20-minute feature, skip the pipeline. For a 2-day feature, always run it. The spec is the only artifact that survives the session.

## Playtesting schedule

- **Alpha** (end of vertical slice): 3 friends who owe you a favor
- **Beta** (mid-content phase): 5–10 strangers on r/playmygame or Discord
- **Release candidate**: anyone who will play it
- **Post-launch**: you are now a service provider; treat feedback accordingly

**The single most valuable piece of feedback you'll ever get**: watch a stranger play. Don't explain anything. Record their screen + voice (or sit behind them). 30 minutes of video will tell you more than 100 survey responses.

## Where to ship

### itch.io — start here
- Free to publish
- HTML5 games are supported (this template builds to HTML5)
- Generous revenue cuts (default 10%; you can set it lower or zero)
- Game jams are your community — participate in one even without a finished game

### Steam (later, when it's real)
- $100 per title to publish
- Takes 2–4 weeks for review
- Way more visibility than itch for premium games
- Overwhelmingly a Windows-first audience; test with `electron` or an HTML5 wrapper if you're staying in Phaser

### Newgrounds / Kongregate / CrazyGames
- Higher traffic for short arcade-style games
- Lower revenue
- Good for "calling card" games while you build up to bigger titles

### GitHub Pages (this template)
- Free, one-click
- Perfect for prototypes, devlogs, and portfolio pieces
- URL format `https://<user>.github.io/<repo>/` is fine for sharing

### Your own domain
- Worth it once you have a name / brand
- Cloudflare Pages or Vercel give you CI deploys and preview URLs
- Not necessary for game 1

## The publishing checklist (itch.io)

- [ ] Title, one-line pitch, three-paragraph description
- [ ] 4–6 screenshots, 16:9 or 4:3
- [ ] A 30-second gameplay GIF or video
- [ ] A cover image (630×500 is itch's sweet spot)
- [ ] A controls screen in-game (keyboard + gamepad)
- [ ] An in-game or README credits page (tools, assets, fonts, music, people)
- [ ] Price set ($0 / name your price / fixed)
- [ ] `game.html` works standalone when opened in a browser
- [ ] Zipped build with `index.html` at the root — itch expects this shape

### Build for itch (from this template)

```sh
bun run build
cd dist
zip -r ../my-game.zip .
cd ..
# upload my-game.zip to itch, check "This file will be played in the browser"
```

## Common solo-dev graveyards

### The MMO
A 12-player real-time game. No. Ever. Maybe after game 3.

### The "engine project"
You build a game engine on top of a game engine. Months later, no game. The engine you need is the one your game reveals — write it inside a real game, not outside.

### The perfect art style
Six months iterating on character silhouettes, no gameplay. Fix the gameplay; the art follows.

### The roguelike with no combat
A "roguelike" with procedural generation but no core verb. It plays like a screensaver. Build combat first; procgen second.

### The puzzle game with 200 levels
You will not make 200 good puzzles by yourself. Make 30 great ones.

### The story-heavy first game
If you're not a writer, don't lead with writing. Gameplay first; story later if at all.

### The ambitious scope defended as "a series"
"Game 1 is just the first chapter." No. Game 1 is a full game. If you can't finish one, you can't finish three.

## A workable 3-month plan for your first game

| Month | Focus | Hours | Output |
|---|---|---|---|
| 1 | Prototype + vertical slice | ~40 | One polished level, core loop locked |
| 2 | Content + tuning | ~40 | 5–8 levels, progression + save, art passes |
| 3 | Polish + ship | ~40 | Juice, sound, menus, itch.io release |

That's ~10 hours/week, sustainable for someone with a dayjob. It ships a small but real game.

## After shipping

- **Rest for a week.** Genuinely.
- **Read the feedback.** Don't respond for 48 hours.
- **Decide**: patch, sequel, or next game. All three are valid. Sequels are the safest path to a second game.
- **Write a devlog.** Your future self will want the notes. Your audience will want the story.
- **Start the next one.** The second game always ships faster than the first.

## Next

The only thing left is where to keep learning. [06 — Resources](./06-resources.md) is a curated list, not a link dump.
