# Feature Checklist

Adding a new gameplay feature? Walk this list.

## Domain

- [ ] Domain module exists for the concept (or create with `bun run new:module`)
- [ ] Pure behavior(s) written in `*.behavior.ts`
- [ ] Unit tests in `*.test.ts` cover happy path, boundary cases, and idempotence
- [ ] New types exported from the module's `index.ts`

## Feature

- [ ] Feature created with `bun run new:feature <Name>`
- [ ] `create<Name>Feature(deps)` takes only port interfaces and the event bus — no concrete engine objects
- [ ] Emits domain events (`events.emit(...)`) for observable outcomes
- [ ] Feature test uses fake ports from `@shared/testing`

## Runtime

- [ ] If new adapters are needed, implement them in `src/runtime/adapters/` or `src/runtime/phaser/` and construct them in `src/app/composition/`
- [ ] Scene wires the feature in `<Scene>.setup.ts` (do not construct browser ports there)
- [ ] `dispose()` is wired to scene `SHUTDOWN`

## Content

- [ ] If data-driven, add a Zod schema in `src/content/schemas/`
- [ ] Add at least one definition JSON and validate at import time
- [ ] Export both schema and validated definitions from their `index.ts`

## Docs + catalog

- [ ] `bun run catalog` runs clean and the new module/feature appears in `docs/ai/catalog.md`
- [ ] If you invented a new architectural pattern, write an ADR (`bun run new:adr`)

## Gate

- [ ] `bun run check` passes (typecheck + lint + format + knip + catalog --check + dep-cruise + test)
