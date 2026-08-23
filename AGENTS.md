# AGENTS.md

Tool-neutral contract for AI contributors (Claude Code, Cursor, Codex, Copilot, tsforge, others).

This is a **BoringStack** Phaser template (`boringstack-xyz/Phaser-TypeScript-AI-First-Starter`). Before editing, read:

- `docs/ai/architecture.md` — layers and import rules
- `docs/ai/contribution-contract.md` — ten non-negotiable rules
- `docs/ai/catalog.md` — canonical index of modules, features, scenes, ports, content

`bun run check` is the oracle. If prose here disagrees with what `check` says, the tools win — flag the drift.

## Golden rule

One obvious home per concern. Do not place domain logic in Phaser scenes. Do not import `phaser` from `src/domain/**`. Features do not import `src/runtime/**`.

Process-wide ports are constructed in `src/app/composition/`. Scenes read them from the Phaser registry. Do not `new` browser adapters inside a scene.

## Generators (use these; do not hand-write the layout)

| Intent            | Command                    |
| ----------------- | -------------------------- |
| New domain module | `bun run new:module <Name>`   |
| New Phaser scene  | `bun run new:scene <Name>`    |
| New feature       | `bun run new:feature <Name>`  |
| New port + fake   | `bun run new:port <Name>`     |
| New content schema| `bun run new:content <Name>`  |
| New ADR           | `bun run new:adr "<Title>"`   |
| Refresh catalog   | `bun run catalog`             |

## Feature workflow

Non-trivial features: `/speckit:specify` → `:clarify` → `:plan` → `:tasks` → `:analyze` → `:implement`. Artifacts land in `docs/specs/<NNN-feature>/`. Walkthrough: `BUILD_THE_GAME.md`.

Tiny changes (typo, one-liner): skip spec-kit.

## Gate

```sh
bun run check      # typecheck + lint + format + knip + catalog --check + dep-cruise + test
bun run validate   # check + Playwright smoke
```

Must pass. Fix root causes; do not skip hooks.

## tsforge

[tsforge](https://tsforge.dev) is the org TypeScript harness. The gate is `bun run check`.

**New game:** `/scaffold` → Phaser (or `tsforge scaffold --archetype phaser --dest ./my-game`). First prompt in that folder plans with a Phaser view-intent schema (scene / feature / content), not SaaS screens. Requires a tsforge with the Phaser adapter (tsforge `main`; next npm release after 0.51.1).

**This tree:** the **`phaser` rule pack** auto-applies when `phaser` is in package.json (scene SHUTDOWN, no global emitter leaks, no Phaser factories in `update`/`tick`, branded keys, no `ignoreDestroy`). `eslint.config.js` covers a syntactic subset of that pack so `bun run check` stays honest without depending on a published tsforge.

Do **not** add `.tsforge/scaffold-manifest.json` — that file is the fullstack BoringStack env surface. A Phaser scaffold writes `.tsforge/scaffold.json` (receipt); leave it.

## Deviations

Breaking an architectural rule requires an ADR: `bun run new:adr "<Title>"`. Silent deviation is a rule violation.
