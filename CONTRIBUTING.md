# Contributing

Thanks for considering a contribution. This template is intentionally opinionated — the rules exist so AI agents can work on the codebase safely, and they apply to humans the same way.

> **Read [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md) first.** It's the end-to-end walkthrough for the full workflow. This document is the short version.

## Local setup

Requirements: Bun `1.3.14` (`packageManager` in `package.json`). Node `>=24` if a tool shells out to Node. A [`.nvmrc`](./.nvmrc) pins Node 24.

```sh
bun install
bun run check       # the gate
bun run dev         # http://localhost:5173
```

If `bun run check` isn't green on a fresh clone, that's a bug — please file an issue before changing code.

`bun run validate` is the full bar (`check` + Playwright smoke). Desired GitHub repository settings for this template live in [`.github/desired-repo-settings.json`](./.github/desired-repo-settings.json).

## Proposing a change

The canonical workflow is **spec-driven**, using GitHub Spec Kit:

```
/speckit:specify  →  docs/specs/<NNN>/spec.md
/speckit:clarify  →  resolve [NEEDS CLARIFICATION] markers
/speckit:plan     →  plan.md (+ research, data-model, contracts)
/speckit:tasks    →  tasks.md
/speckit:analyze  →  sanity-check the pipeline
/speckit:implement→  walk tasks one at a time
```

Commit the generated spec artifacts — they're part of the change, not scratch work.

**For trivial changes** (typo, rename, one-line fix), skip the pipeline and open a PR directly.

## Architectural rules

These are non-negotiable and enforced by lint + dep-cruiser + CI:

1. **No `phaser` imports in `src/domain/**`.** Domain is pure.
2. **No `Math.random`, `Date.now`, `new Date()`, `localStorage`, `window`, `document`, `fetch` in `src/domain/**`.** Inject a port instead.
3. **Content is schema-validated at import time.** Broken JSON fails the build.
4. **Named exports only** outside a handful of entry points.
5. **`bun run check` must pass** before a change is considered done.

Full rules: [`docs/ai/contribution-contract.md`](./docs/ai/contribution-contract.md). Constitution (spec-kit): [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).

If you need to break a rule, write an ADR first: `bun run new:adr "<Title>"`.

## Generators

Before hand-writing anything, check if a generator exists:

| Change                       | Command                       |
| ---------------------------- | ----------------------------- |
| New domain module            | `bun run new:module <Name>`      |
| New Phaser scene             | `bun run new:scene <Name>`       |
| New feature                  | `bun run new:feature <Name>`     |
| New port + fake              | `bun run new:port <Name>`        |
| New content schema + sample  | `bun run new:content <Name>`     |
| New ADR                      | `bun run new:adr "<Title>"`      |
| Refresh codebase catalog     | `bun run catalog`                |

After adding/removing modules, scenes, features, ports, or content types, run `bun run catalog` so `docs/ai/catalog.md` stays accurate.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/). release-please consumes them on each push to `main`.

| Prefix     | Effect                                   |
| ---------- | ---------------------------------------- |
| `feat:`    | minor bump, listed under "Features"      |
| `fix:`     | patch bump, "Bug Fixes"                  |
| `perf:`    | patch bump, "Performance"                |
| `refactor:`, `revert:` | listed in release notes      |
| `chore:`, `docs:`, `test:`, `ci:`, `build:` | hidden (no release bump) |

Breaking change: include `!` after the type (`feat!:`) or add a `BREAKING CHANGE:` footer.

## PR checklist

Before requesting review:

- [ ] If non-trivial, `docs/specs/<NNN>/` exists with spec, plan, and tasks
- [ ] `bun run check` passes locally (`bun run validate` if the change can affect boot)
- [ ] Tests added/updated for changed domain behaviors
- [ ] `bun run catalog` regenerated if modules/features/scenes/ports/content changed
- [ ] ADR added under `docs/adr/` if you deviated from an architectural rule
- [ ] Commit message follows Conventional Commits

CI re-runs `bun run check` plus Playwright smoke, CodeQL, Semgrep, OSV + `bun audit`, Gitleaks, and `arch-invariants` on every PR. Audit repo settings with `./scripts/audit-repo-settings.sh`.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
