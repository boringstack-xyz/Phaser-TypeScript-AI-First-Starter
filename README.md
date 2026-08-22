<p align="center">
  <a href="https://boringstack.xyz">
    <img src="./public/assets/images/phaserjs-logo.png" alt="Phaser" width="320">
  </a>
</p>

<p align="center">
  <a href="https://boringstack.xyz"><img src="https://img.shields.io/badge/boringstack.xyz-4ade80?style=for-the-badge&logo=safari&logoColor=4ade80&labelColor=090909" alt="boringstack.xyz"></a>
  <a href="https://github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter"><img src="https://img.shields.io/badge/GitHub-2563eb?style=for-the-badge&logo=github&logoColor=2563eb&labelColor=090909" alt="GitHub"></a>
  <a href="https://boringstack-xyz.github.io/Phaser-TypeScript-AI-First-Starter/"><img src="https://img.shields.io/badge/Play_the_demo-2563eb?style=for-the-badge&logo=phaser&logoColor=2563eb&labelColor=090909" alt="Play the demo"></a>
</p>

<p align="center">
  <a href="https://github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter/actions/workflows/ci.yml"><img src="https://github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter/actions/workflows/codeql.yml"><img src="https://github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter/actions/workflows/codeql.yml/badge.svg" alt="CodeQL"></a>
  <a href="https://scorecard.dev/viewer/?uri=github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter"><img src="https://api.securityscorecards.dev/projects/github.com/boringstack-xyz/Phaser-TypeScript-AI-First-Starter/badge" alt="OpenSSF Scorecard"></a>
  <img src="https://img.shields.io/badge/License-MIT-e8e8ed?style=for-the-badge&labelColor=090909" alt="MIT">
  <img src="https://img.shields.io/badge/Phaser-4.2-2563eb?style=for-the-badge&labelColor=090909" alt="Phaser 4">
  <img src="https://img.shields.io/badge/TypeScript-6-3178c6?style=for-the-badge&logo=typescript&logoColor=3178c6&labelColor=090909" alt="TypeScript 6">
  <img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=fbf0df&labelColor=090909" alt="Bun">
</p>

<p align="center">
  <strong>Phaser + TypeScript, AI-first.</strong><br />
  A BoringStack template.
</p>

<p align="center">
  <a href="https://github.com/boringstack-xyz/boringstack"><img src="https://img.shields.io/badge/boringstack-4ade80?style=for-the-badge&labelColor=090909" alt="boringstack"></a>
  <a href="https://tsforge.dev"><img src="https://img.shields.io/badge/tsforge-2563eb?style=for-the-badge&labelColor=090909" alt="tsforge"></a>
  <a href="https://github.com/boringstack-xyz/eslint-plugins"><img src="https://img.shields.io/badge/eslint--plugins-4ade80?style=for-the-badge&labelColor=090909" alt="eslint-plugins"></a>
</p>

A reusable, strictly-typed Phaser 4 starter so AI agents can ship at high velocity without eroding structure — and so a programmer who has never shipped a game can become a one-person studio in a weekend.

This repo is part of **[boringstack-xyz](https://github.com/boringstack-xyz)**. Sister projects: the [BoringStack](https://github.com/boringstack-xyz/boringstack) fullstack template, [tsforge](https://tsforge.dev) (the TypeScript build harness), and [eslint-plugins](https://github.com/boringstack-xyz/eslint-plugins).

Backend engineer, tech lead, web developer who always wanted to make games? Start with [`docs/learn/`](./docs/learn/README.md) — a 2.5-hour primer that bridges "I can write code" to "I can generate art, design a core loop, and ship on itch.io."

> **Use this as a GitHub template.** Click **"Use this template"** on the repo page, then read [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md).

### After forking: one-time repo setup

1. **Enable GitHub Pages** — `Settings → Pages → Build and deployment → Source: "GitHub Actions"`. Without this the `deploy-pages` workflow 404s on the first run.
2. **Allow Actions to open PRs** (so release-please can cut release PRs) — `Settings → Actions → General → Workflow permissions → [x] Allow GitHub Actions to create and approve pull requests`.
3. **Flip "Template repository"** — `Settings → General → Template repository` so your own "Use this template" button works.

Everything else (CI, Scorecard, CodeQL, Dependabot) works out of the box. Desired GitHub settings live in [`.github/desired-repo-settings.json`](./.github/desired-repo-settings.json).

## What you get out of the box

- **Working vertical slice** — one player, three pickups, walls, live HUD, save/load to localStorage. Proves the architecture end-to-end and is the pattern to mimic.
- **Architectural boundaries enforced by two independent tools** — `eslint-plugin-boundaries` in the editor/PR, `dependency-cruiser` as belt-and-braces in CI. Try importing `phaser` from `src/domain/**` and watch both reject it.
- **Seven code generators** (`bun run new:module|scene|feature|port|content|adr`) so AI agents scaffold boilerplate instead of re-deriving it.
- **Spec-driven feature workflow** via GitHub Spec Kit (`/speckit:specify → :clarify → :plan → :tasks → :analyze → :implement`) with a project constitution pointing at the architectural rules.
- **Canonical AI-facing docs** (`AGENTS.md`, `docs/ai/*`) so every fresh session starts with the same context.
- **CI that enforces it all** — `bun run check`, Playwright smoke, CodeQL, Semgrep, OSV + `bun audit`, Gitleaks, OpenSSF Scorecard, plus a grep-based invariants job.
- **Release & dep automation** — release-please for semantic versioning from conventional commits; Dependabot for grouped weekly updates.

## Start here

| If you are...                             | Read next                                                                                         |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **A programmer who never shipped a game** | [`docs/learn/`](./docs/learn/README.md)                                                           |
| **A human forking this to build a game**  | [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md)                                                        |
| **An AI agent in a fresh session**        | [`AGENTS.md`](./AGENTS.md) + [`docs/ai/catalog.md`](./docs/ai/catalog.md)                          |
| **Just evaluating the architecture**      | [`docs/ai/architecture.md`](./docs/ai/architecture.md)                                            |
| **Looking for the rules**                 | [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md) + [`.specify/memory/constitution.md`](./.specify/memory/constitution.md) |

## Quickstart

```sh
bun install
bun run dev            # http://localhost:5173
```

Arrow keys or WASD to move. Walk onto a yellow circle to score. Press **S** to save, **R** to reset.

`bun run check` is the merge bar (typecheck, lint, format, knip, dep-cruise, tests). `bun run validate` is that plus the Playwright smoke.

## Using tsforge

[tsforge](https://tsforge.dev) is the BoringStack TypeScript build harness. Point it at a fork of this template; the gate is `bun run check`.

The **`phaser` rule pack** auto-applies from the `phaser` dependency (scene shutdown, no factories in `update`, branded keys). A dedicated Phaser **stack adapter** (planner schema, conventions, greenfield clone) is planned and **not shipped yet**. Do not add a `.tsforge/scaffold-manifest.json` here; that file is how tsforge detects the fullstack template.

## Architecture in 30 seconds

```
                 +--------+
                 |  app   |   composition root
                 +--------+
                     |
      +-----------+--+--+-----------+
      |           |     |           |
  +--------+  +--------+  +---------+
  | domain |  |content |  | shared  |   pure + data + common types
  +--------+  +--------+  +---------+
                     |
                 +--------+
                 |runtime |   Phaser, browser APIs
                 +--------+
```

| Layer      | Responsibility                                                    |
| ---------- | ----------------------------------------------------------------- |
| `domain`   | Pure state + behaviors. No engine. No wall-clock. No storage.     |
| `features` | Orchestrate domain + ports. Emit events. Never import Phaser.     |
| `runtime`  | Phaser scenes, entities, input, audio, adapters for shared ports. |
| `content`  | Zod-validated definitions, levels, balance.                       |
| `shared`   | Leaf utilities — types, event bus, test fakes.                    |
| `app`      | Composition root. Wires ports, content, and the web entrypoint.   |

Full story: [`docs/ai/architecture.md`](./docs/ai/architecture.md).

## Stack

Phaser 4 · TypeScript 6 (strict + `verbatimModuleSyntax` + `noUncheckedIndexedAccess`) · Vite 8 · Vitest 4 · ESLint 10 (flat) · dependency-cruiser · Playwright · Zod · husky + lint-staged · knip · Bun 1.3.14 · Node 24.

## Scripts

| Script            | What it does                                                        |
| ----------------- | ------------------------------------------------------------------- |
| `bun run dev`        | Start Vite dev server                                               |
| `bun run build`      | Typecheck, then production build                                    |
| `bun run test`       | Vitest unit + integration                                           |
| `bun run test:smoke` | Playwright smoke against a built bundle                             |
| `bun run check`      | **The gate**: typecheck + lint + format + knip + dep-cruise + test  |
| `bun run validate`   | `check` plus Playwright smoke                                       |
| `bun run check:arch` | Just architectural checks (lint boundaries + dep-cruiser)           |
| `bun run catalog`    | Regenerate [`docs/ai/catalog.md`](./docs/ai/catalog.md) from `src/` |

### Generators

| Script                   | Generates                                    |
| ------------------------ | -------------------------------------------- |
| `bun run new:module <Name>` | Domain module under `src/domain/<name>/`     |
| `bun run new:scene <Name>`  | Phaser scene                                 |
| `bun run new:feature <Name>`| Feature orchestrator + test                  |
| `bun run new:port <Name>`   | Port interface stub + matching fake          |
| `bun run new:content <Name>`| Zod schema + sample JSON + validated loader  |
| `bun run new:adr "<Title>"` | Numbered ADR in `docs/adr/`                  |

### Slash commands (Claude Code)

| Project commands     | Spec Kit commands (`/speckit:*`) |
| -------------------- | -------------------------------- |
| `/check`             | `/speckit:specify`               |
| `/new-module`        | `/speckit:clarify`               |
| `/new-feature`       | `/speckit:plan`                  |
| `/new-scene`         | `/speckit:tasks`                 |
| `/review-slice`      | `/speckit:analyze`               |
| `/verify-boundaries` | `/speckit:implement`             |
|                      | `/speckit:checklist`             |
|                      | `/speckit:constitution`          |

## CI & automation

Every push/PR runs:

- **`ci`** — `bun run check` (typecheck, lint, format, knip, catalog, dep-cruise, tests) plus Playwright smoke
- **`codeql`** — static analysis with `security-and-quality` queries
- **`security-deps`** — osv-scanner on `bun.lock` + `bun audit --audit-level=high`
- **`security-sast`** — Semgrep (OWASP top ten + JS/TS)
- **`security-secrets`** — Gitleaks (pinned binary, SHA256-verified)
- **`arch-invariants`** — grep-based banned-pattern guard (phaser/Math.random/Date.now/localStorage in `src/domain`)

On `main`, **OpenSSF Scorecard** publishes SARIF weekly. **release-please** opens/updates a release PR from conventional commits. **Dependabot** opens grouped weekly PRs for bun and GitHub Actions.

## License

MIT — see [`LICENSE`](./LICENSE).
