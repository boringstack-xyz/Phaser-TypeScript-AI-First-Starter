# Project Constitution

The binding rules for any AI or human contributor working on this codebase.

**This constitution is the authoritative source.** Commands under `/speckit:*` (specify, plan, tasks, implement) check their output against this document. Specs, plans, and tasks that violate the constitution must be revised, not merged.

## Article I — Architecture is non-negotiable

The full architecture layer rules live in `docs/ai/architecture.md`. Summary:

1. `src/domain/**` is pure. No `phaser` imports. No `Math.random`. No `Date.now`. No `window`, `document`, `localStorage`, `sessionStorage`, `fetch`. If a module needs one of these, it takes a port as a dependency.
2. Allowed import directions:
   - `app` → everywhere
   - `features` → domain, content, shared, features — never runtime
   - `runtime` → domain, features, content, shared, runtime — never app
   - `domain` → domain, shared
   - `content` → content, shared
   - `shared` → shared only
3. Violations are lint errors (eslint-plugin-boundaries) and dep-cruiser errors in CI.

## Article II — Ten non-negotiable rules

See `docs/ai/contribution-contract.md`. Rules 1–10 apply in full and without exception.

## Article III — Tests are part of every change

- Every domain behavior function added or modified must have an added or modified unit test.
- Features require an integration test using fake ports from `@shared/testing`.
- `bun run check` must pass before a change is considered done.

## Article IV — Content is schema-validated at import time

All JSON definitions under `src/content/definitions/` are validated by Zod schemas at import. A malformed definition must break the build, never silently pass.

## Article V — Use generators, not hand-written boilerplate

Before hand-writing a new module, scene, feature, port, content type, or ADR, run the corresponding `bun run new:*` generator. This keeps structure uniform and reduces the review surface.

## Article VI — Architectural deviations require an ADR

If the right thing to do violates one of the above articles, write an ADR with `bun run new:adr "<Title>"`, have it reviewed, and have it merged in `docs/adr/` before making the change. Silent deviation is a rule violation.

## Article VII — The plan is a living document

During `/speckit:plan`, if a constitutional constraint forces a different design than the spec implied, flag the conflict in the plan and loop back to `/speckit:clarify` or `/speckit:specify`. Do not paper over conflicts in the `/speckit:tasks` or `/speckit:implement` phases.

---

## Amendment procedure

This constitution may be amended only through the ADR process. An amendment:
1. Adds, removes, or changes an Article.
2. Must reference the ADR that authorized the change.
3. Must update `docs/ai/architecture.md` and `docs/ai/contribution-contract.md` if the surface of the rules changes.

Last amended: 2026-04-21 (initial version — see ADR-0001, ADR-0002).
