# Build the Game — the AI-First Guide

This document is the end-to-end walkthrough for building a game using this template. It's written for two audiences at once: a human who just clicked **"Use this template"**, and an AI agent that has joined the project mid-flight. Read it front-to-back once; come back for the sections you need.

> **First time making a game?** Read [`docs/learn/`](./docs/learn/README.md) **before** this document. It covers the mental-model shift, AI asset generation, game-design fundamentals, and the solo-dev workflow. This document assumes you already know what a sprite, tilemap, and core loop are. The `learn/` primer will teach you all three in 2.5 hours.

---

## 1. Why AI-first?

Most game-dev tutorials assume a human writing every line. This template assumes you'll spend a lot of time in a chat window asking an AI to write code for you. That's a different design problem.

AI agents don't get tired, don't skip tests, and will cheerfully refactor for 12 hours straight. They also:

- **Invent structure** when none is imposed — you'll end up with three ways to do the same thing.
- **Re-derive boilerplate** from scratch each session, burning tokens.
- **Drift** from your architecture when the rules are implicit — "this one time, just put it in the scene".
- **Forget** what exists — they'll re-implement a helper that's already in `src/shared/utils/`.

This template answers each of those failure modes with a concrete mechanism:

| Failure mode               | Mechanism                                                                 |
| -------------------------- | ------------------------------------------------------------------------- |
| Invented structure         | `eslint-plugin-boundaries` + `dependency-cruiser` enforce layer rules    |
| Re-derived boilerplate     | `bun run new:*` generators produce the canonical file layout                |
| Architectural drift        | `.specify/memory/constitution.md` + ADRs require deviations to be named  |
| Forgotten state            | `docs/ai/catalog.md` (auto-generated) lists every module, feature, scene |

If those sound like over-engineering for a solo project, try asking an AI to "add a second player" to a freshly-forked repo and watch where the code ends up.

---

## 2. Mental model

Four pillars. Hold these in your head; everything else derives from them.

### Pillar 1 — Deterministic core (`src/domain/`)

Pure functions only. No `Math.random`, no `Date.now`, no `window`, no `phaser`. State goes in, new state comes out. Everything domain-related (combat math, movement, progression, AI scoring) lives here.

**Why:** pure functions are trivial to unit test, trivial to run deterministically for replay/netcode, and trivial for an AI to reason about.

### Pillar 2 — Thin imperative shell (`src/runtime/`)

Phaser scenes, sprites, input, audio, physics — anything engine-specific. Each piece is thin: receive input, call a feature, render the result. No rules live here.

**Why:** engine APIs change. Your game logic shouldn't. Isolating the shell lets you swap Phaser 4 for Phaser 5 (or even a different engine) without rewriting gameplay.

### Pillar 3 — Declarative content (`src/content/`)

Enemies, weapons, levels, power-ups — all defined as Zod-validated JSON. Schemas live in `content/schemas/`, definitions in `content/definitions/`. Broken JSON fails the build.

**Why:** balancing a game is mostly data, not code. AI agents are good at producing data. Making content data-first puts their strengths to work without letting them touch load-bearing code.

### Pillar 4 — Repeatable workflow (spec-kit + generators + ADRs)

Every non-trivial change walks the same pipeline: specify → clarify → plan → tasks → analyze → implement. Generators scaffold the files. ADRs record the decisions.

**Why:** consistency compounds. When every feature follows the same shape, reviewing each one is faster, and AI agents have a concrete pattern to mimic instead of reinventing every time.

---

## 3. Zero to first commit

### Step 1 — Fork from the template

Click **"Use this template"** on the GitHub page. Give your new repo a name. Clone locally.

```sh
gh repo create my-game --template boringstack-xyz/Phaser-TypeScript-AI-First-Starter --public --clone
cd my-game
```

### Step 2 — Rename

```sh
# Update the package name
sed -i '' 's/"name": "phaser-ts-starter"/"name": "my-game"/' package.json

# Update the HTML title
sed -i '' 's/<title>Phaser TS Starter/<title>My Game/' index.html

# Update the localStorage save key (src/shared/constants/saveKey.ts)
sed -i '' 's/phaser-ts-starter:save/my-game:save/' src/shared/constants/saveKey.ts

# If you want a non-MIT license, replace LICENSE now
```

### Step 3 — Install and verify

```sh
bun install
bun run check    # typecheck + lint + format + dep-cruise + test
bun run dev      # confirm it boots
```

If `bun run check` is green, you're good to go. If not, fix the root cause before writing any code — the rails need to work.

### Step 3.5 — One-time repo settings (per fork)

There are three GitHub settings the template can't flip for you, because the default `GITHUB_TOKEN` doesn't have `administration: write`. Do these once right after forking:

| Setting | Path | Why |
| --- | --- | --- |
| **Pages** | Settings → Pages → Build and deployment → Source: **"GitHub Actions"** | The `deploy-pages` workflow 404s without this; the workflow can't enable Pages itself without a broader token. |
| **Actions may open PRs** | Settings → Actions → General → Workflow permissions → **[x] Allow GitHub Actions to create and approve pull requests** | So `release-please` can cut release PRs from conventional commits. |
| **Template repository** | Settings → General → **[x] Template repository** | So *your* forkers see the "Use this template" button. |

Alternatively you can do the first two from the CLI:

```sh
# Pages (Source = Actions) — needs a PAT with `administration: write`
gh api -X POST /repos/<owner>/<repo>/pages -f 'build_type=workflow'

# Let workflows open PRs
gh api -X PUT /repos/<owner>/<repo>/actions/permissions/workflow \
  -f default_workflow_permissions=write -F can_approve_pull_request_reviews=true
```

### Step 4 — Understand the demo slice

The forked repo ships with a tiny vertical slice:

- One player (green square) moves with arrow keys / WASD
- Three interactables (yellow circles) sit on the map
- Walking onto one increments a score in the HUD
- **S** saves to localStorage; reload the page and the score comes back
- **R** resets

Read these files in order — they're the canonical pattern to copy:

1. [`src/domain/player/Player.behavior.ts`](./src/domain/player/Player.behavior.ts) — a pure function
2. [`src/domain/player/Player.test.ts`](./src/domain/player/Player.test.ts) — how to test it
3. [`src/features/movement/MovementFeature.ts`](./src/features/movement/MovementFeature.ts) — orchestration
4. [`src/features/movement/MovementFeature.test.ts`](./src/features/movement/MovementFeature.test.ts) — with fake ports
5. [`src/runtime/phaser/scenes/WorldScene/WorldScene.setup.ts`](./src/runtime/phaser/scenes/WorldScene/WorldScene.setup.ts) — scene wiring (no adapter construction)
6. [`src/app/composition/composeRuntime.ts`](./src/app/composition/composeRuntime.ts) — the composition root (ports + content)
7. [`src/content/levels/example-level.json`](./src/content/levels/example-level.json) — demo walls, pickups, player start

### Step 5 — Delete the demo (later)

Once you understand it, the demo is in your way. Leave it during the first feature or two so your AI has a reference; delete it (`src/domain/player`, `interaction`, `progression`, the corresponding features, and the WorldScene contents) when you're ready. The architecture stays; the code goes.

---

## 4. The feature loop

This is the heart of the template. Every non-trivial feature walks this pipeline in Claude Code (or any agent that supports slash commands):

```
/speckit:specify  ──►  docs/specs/<NNN>/spec.md          (what)
/speckit:clarify  ──►  resolves [NEEDS CLARIFICATION]    (ambiguity)
/speckit:plan     ──►  plan.md + research/data-model/contracts (how)
/speckit:tasks    ──►  tasks.md                          (atomic steps)
/speckit:analyze  ──►  cross-check for gaps              (sanity)
/speckit:implement──►  walk tasks one at a time          (do)
```

Every step is anchored to [`.specify/memory/constitution.md`](./.specify/memory/constitution.md), which points back to [`docs/ai/architecture.md`](./docs/ai/architecture.md) and [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md). Specs, plans, and tasks that violate the constitution must be revised — the AI agent should flag the conflict instead of silently routing around it.

### Worked example: "Add a power-up that doubles speed for 5 seconds"

```
You:  /speckit:specify A green capsule spawns randomly. Picking it up
      doubles the player's speed for 5 seconds. An HUD timer shows the
      remaining duration. Stacking a second pickup refreshes the timer.

AI:   (writes docs/specs/001-speed-powerup/spec.md)

You:  /speckit:clarify

AI:   "Question 1: On a second pickup during an active buff, does the
       effect stack multiplicatively, or just refresh the timer?"
You:  Just refresh.

AI:   (updates spec.md)

You:  /speckit:plan

AI:   (writes plan.md — identifies domain/powerup as a new module, a
       pickup spawner in the interaction domain, a new PowerUpFeature, a
       new IHudRenderer method for the timer, and a tweak to
       Player.applyMoveIntent to respect a speed multiplier)

You:  /speckit:tasks

AI:   (writes tasks.md — ~12 tasks, each atomic, starting with
       "bun run new:module PowerUp" and ending with "update catalog")

You:  /speckit:analyze

AI:   "Gap: plan.md proposes IRandomPort use for spawn location, but
       the spec does not specify spawn bounds. Should I loop back to
       /speckit:clarify?"
You:  Yes.

...   (one more clarify loop)

You:  /speckit:implement
AI:   (works through tasks.md one at a time, running bun run check after
       each and asking before taking anything risky)
```

**For tiny changes — fixing a typo, renaming a constant — skip the pipeline and just make the change.** The pipeline is for features, not everything.

### When spec-kit flags a constitutional conflict

If `/speckit:plan` wants to put damage math in a Phaser scene, it should refuse and surface the conflict. You then have two choices:

1. **Fix the plan** — move the math to `domain/` where it belongs. Usually right.
2. **Change the constitution** via ADR — if the rule itself is wrong for your project, use `bun run new:adr "<Title>"` to propose amending it. Bar is high.

---

## 5. Using the generators

Before hand-writing any of these, run the generator. AI agents especially: using the generator saves several hundred tokens and guarantees consistent structure.

| You want...                      | Run...                            |
| -------------------------------- | --------------------------------- |
| A new domain module              | `bun run new:module Combat`          |
| A new Phaser scene               | `bun run new:scene MenuScene`        |
| A new feature                    | `bun run new:feature Respawn`        |
| A new port + fake for testing    | `bun run new:port Network`           |
| A new content type + schema      | `bun run new:content Enemy`          |
| A new ADR                        | `bun run new:adr "Allow ECS"`        |

After adding anything that belongs in the catalog, run `bun run catalog` to refresh `docs/ai/catalog.md`.

### What the generators DO produce

- The standard file layout (e.g. 8 files for a domain module)
- A stub behavior + test so the module is immediately compilable and checked
- Named exports in `index.ts`

### What the generators do NOT produce

- The actual logic of your feature — you (and your AI) write that
- Wiring into a scene or composition root — you do that by hand as the last step

---

## 6. When to write an ADR

An ADR (Architecture Decision Record) is a short markdown file in `docs/adr/` that captures a decision that's bigger than a commit and smaller than a rewrite.

**Write one when:**

- You need to break a rule in `docs/ai/contribution-contract.md` or the constitution
- You're introducing a new architectural pattern (ECS, a state machine library, a new boundary layer)
- You're picking between two non-obvious approaches and the decision will outlast the current PR
- A spec-kit `/speckit:plan` surfaces a constitutional conflict you want to resolve in the rule, not the plan

**Don't write one for:**

- "I renamed a function"
- "I added a new domain module following the existing pattern"
- "I picked blue as the player color"

Run `bun run new:adr "Allow ECS for combat simulation"` to scaffold one. Set `Status:` to `proposed`, write the Context/Decision/Consequences/Alternatives sections, open a PR. Set `Status:` to `accepted` when the PR merges.

---

## 7. Architecture — the short version

Full details: [`docs/ai/architecture.md`](./docs/ai/architecture.md). The rules, in one glance:

| From layer | May import from                                      |
| ---------- | ---------------------------------------------------- |
| `app`      | everywhere                                           |
| `features` | `features`, `domain`, `runtime`, `content`, `shared` |
| `runtime`  | `runtime`, `domain`, `features`, `shared`            |
| `domain`   | `domain`, `shared` — **no `phaser`, no side effects** |
| `content`  | `content`, `shared`                                  |
| `shared`   | `shared` only                                        |

Two independent tools enforce this: `eslint-plugin-boundaries` (in your editor and on PRs) and `dependency-cruiser` (in CI). A third layer — a grep-based `arch-invariants.yml` workflow — checks for banned patterns like `Math.random` or `localStorage` in `src/domain/` even if someone manages to confuse the first two.

**The golden rule:** one obvious home per concern. See the table in [`docs/ai/architecture.md`](./docs/ai/architecture.md).

---

## 8. Testing philosophy

| What                                    | How                                             | Where                                   |
| --------------------------------------- | ----------------------------------------------- | --------------------------------------- |
| Domain behaviors                        | Plain unit tests, pure input → output           | `src/domain/**/*.test.ts`               |
| Features                                | Vitest + fake ports from `@shared/testing`      | `src/features/**/*.test.ts`             |
| Save/load roundtrips, cross-feature     | Vitest integration                              | `tests/integration/**/*.test.ts`        |
| App boots and renders                   | Playwright smoke                                | `tests/smoke/**/*.spec.ts`              |

**What not to test:** Phaser internals. The engine tests itself. Your tests should cover the logic you own.

Run them:

```sh
bun run test              # unit + integration (fast)
bun run test:watch        # TDD mode
bun run test:coverage     # with HTML report
bun run test:smoke        # Playwright (slower; requires browser install)
```

---

## 9. The gate — `bun run check`

Before claiming a task is done, run:

```sh
bun run check
```

It runs: `typecheck → lint → format:check → knip → catalog --check → dep-cruise → test`. If any step fails, fix the root cause. Do not bypass with `--no-verify`. AI agents: this rule applies to you too — if a hook rejects your commit, read the error, fix the underlying issue, and commit again.

`bun run validate` is `check` plus the Playwright smoke.

Two faster inner loops:

- `bun run check:arch` — just the boundary checks (lint + dep-cruiser). Good for when you're restructuring imports.
- `bun run test:watch` — just the tests, live. Good for TDD.

---

## 9.5 Using tsforge

[tsforge](https://tsforge.dev) is the BoringStack TypeScript build harness. After forking:

```sh
# from the fork
tsforge
```

Point it at this tree. The gate it should run is `bun run check`. The **`phaser` rule pack** auto-applies from the `phaser` dependency (scene shutdown, no factories in `update`, branded keys). This template's ESLint already covers a syntactic subset of that pack.

A dedicated Phaser **adapter** (greenfield clone, planner schema, Phaser conventions instead of React/Elysia) is planned in tsforge and **not shipped**. Do not add `.tsforge/scaffold-manifest.json` here — that file is how tsforge detects the fullstack BoringStack template.

---

## 10. CI & release flow

Every push/PR runs:

1. **`ci.yml`** — `bun run check` plus Playwright smoke.
2. **`codeql.yml`** — GitHub static analysis with `security-and-quality` queries.
3. **`security-deps.yml`** — osv-scanner on `bun.lock` + `bun audit --audit-level=high`.
4. **`security-sast.yml`** — Semgrep (OWASP top ten + JS/TS).
5. **`security-secrets.yml`** — Gitleaks, pinned binary with SHA256.
6. **`arch-invariants.yml`** — grep-based banned-pattern check as belt-and-suspenders on top of lint + dep-cruiser.
7. **`release-please.yml`** — on `main`, opens/updates a release PR using conventional commits.
8. **Dependabot** — weekly bun + GitHub Actions groups.

On `main`, **`security-scorecard.yml`** publishes OpenSSF Scorecard SARIF.

### Conventional commit prefixes release-please cares about

| Prefix     | Effect on release notes              |
| ---------- | ------------------------------------ |
| `feat:`    | minor bump, "Features" section       |
| `fix:`     | patch bump, "Bug Fixes"              |
| `perf:`    | patch bump, "Performance"            |
| `refactor:`, `revert:` | listed              |
| `chore:`, `docs:`, `test:`, `ci:`, `build:` | hidden (no release) |

Breaking change? Include `!` after the type (`feat!:`) or a `BREAKING CHANGE:` footer to force a major bump.

---

## 11. Cost-optimization tips for AI agents

If you're an AI reading this mid-session, save yourself tokens:

1. **Read `docs/ai/catalog.md` before searching the codebase.** It's auto-generated; it tells you exactly what exists and where.
2. **Check for a generator before writing boilerplate.** `bun run new:module` beats re-deriving eight files every time.
3. **Use the golden-rule table** ([`docs/ai/architecture.md`](./docs/ai/architecture.md)) to answer "where does X go?" without re-exploring.
4. **Don't re-lint.** `bun run check:arch` is faster than the full gate when you only changed imports.
5. **Run `bun run catalog` after adding anything** so future sessions can find it without searching.
6. **Use `/speckit:specify`, `/speckit:plan`, `/speckit:tasks` in order.** Each produces a persistent artifact that survives the session — you never re-derive them.
7. **Mimic the demo slice** for the first few features. It's the pattern you're expected to produce.

---

## 12. Common pitfalls

**"I'll just put this math in the scene for now."**
No you won't. eslint-plugin-boundaries and dep-cruiser will reject it at commit time. Move it to `domain/`.

**"I need `Date.now` in my behavior."**
Inject `ITimePort` instead. Look at [`src/features/save-game/SaveGameFeature.ts`](./src/features/save-game/SaveGameFeature.ts) for an example of port injection.

**"The generator gave me a stub I don't want."**
Delete the stub lines, keep the file structure. The structure is the whole point.

**"I forgot what exists."**
`bun run catalog` and open `docs/ai/catalog.md`. If the catalog is stale, regenerate.

**"Phaser 4 doesn't have a default export."**
Correct — all runtime files use `import * as Phaser from 'phaser'`. Copy that pattern.

**"My test needs randomness."**
Use `createFakeRandomPort(seed)` from `@shared/testing`. Same for time (`createFakeTimePort`).

**"The pre-commit hook fails on a huge file."**
Split it. `max-lines` is a 400-line soft limit for a reason.

---

## 13. Further reading

| Document                                                              | Covers                                     |
| --------------------------------------------------------------------- | ------------------------------------------ |
| [`docs/learn/`](./docs/learn/README.md)                               | **Start here if new to game dev** — mental model, core concepts, AI asset generation, game design, solo workflow |
| [`docs/ai/architecture.md`](./docs/ai/architecture.md)                | Full layer diagram + golden rule           |
| [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md) | Ten non-negotiable rules                 |
| [`docs/ai/naming-conventions.md`](./docs/ai/naming-conventions.md)    | File suffixes, interface names, imports    |
| [`docs/ai/testing-strategy.md`](./docs/ai/testing-strategy.md)        | Deeper testing doctrine                    |
| [`docs/ai/feature-checklist.md`](./docs/ai/feature-checklist.md)      | Checklist for shipping a feature           |
| [`docs/ai/catalog.md`](./docs/ai/catalog.md)                          | Auto-generated codebase index              |
| [`docs/adr/`](./docs/adr/)                                            | Architectural decision history             |
| [`.specify/memory/constitution.md`](./.specify/memory/constitution.md)| The rules spec-kit commands enforce        |
| [`CLAUDE.md`](./CLAUDE.md) / [`AGENTS.md`](./AGENTS.md)               | AI entry point (terse, pointer-heavy)      |

---

## 14. TL;DR

1. Fork via "Use this template", rename, `bun install && bun run check && bun run dev`.
2. For each feature: `/speckit:specify → :clarify → :plan → :tasks → :analyze → :implement`.
3. Use `bun run new:*` generators for all boilerplate.
4. `bun run check` must be green before claiming done.
5. Architecture rules are enforced by three independent tools. Trust the errors; don't work around them.
6. Write ADRs for deviations. Don't silently break rules.
