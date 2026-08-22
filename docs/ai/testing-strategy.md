# Testing Strategy

## What to unit test (required)

- Every `*.behavior.ts` function in `src/domain/**`
- Selectors and derived state in `src/domain/**`
- Pure helpers in `src/shared/utils/**`

Use plain Vitest, no DOM. Pass inputs, assert outputs, assert no mutation.

## What to integration test

- Features, with fake ports from `@shared/testing`
- Event emission chains: emit a command → assert the resulting events
- Save/load roundtrips

Lives in `src/features/**/*.test.ts` (feature-scoped) and `tests/integration/**` (cross-feature).

## What to smoke test

- App boots
- Canvas renders
- One core path is reachable (see `tests/smoke/boot.spec.ts`)

Playwright. Small, fast, deterministic.

## What NOT to test

- Phaser internals (Phaser tests itself)
- Sprite positions, colors, animations — these are engine-level details
- Browser APIs through multiple layers of indirection

## Conventions

- Tests are deterministic: inject `createFakeTimePort()` + `createFakeRandomPort(seed)` instead of real time/random
- No sleep, no polling — if a test needs to observe async completion, `await` a promise or use `vi.waitFor`
- Each test creates its own event bus — don't share buses across tests

## Running

```sh
bun run test              # run once
bun run test:watch        # watch mode
bun run test:coverage     # with coverage report
bun run test:smoke        # Playwright smoke tests
```
