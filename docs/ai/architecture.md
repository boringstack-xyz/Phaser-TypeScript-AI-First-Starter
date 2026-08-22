# Architecture

## Layers

```
                 +--------+
                 |  app   |   composition root — wires everything
                 +--------+
                     |
      +-----------+--+--+-----------+
      |           |     |           |
  +--------+  +--------+  +---------+
  | domain |  |content |  | shared  |   pure + data + common types
  +--------+  +--------+  +---------+
                     |
                 +--------+
                 |runtime |   Phaser, browser APIs, transport
                 +--------+
```

## Allowed import directions

| From       | May import from                                                    |
| ---------- | ------------------------------------------------------------------ |
| `app`      | any layer                                                          |
| `features` | `features`, `domain`, `content`, `shared` — never `runtime`        |
| `runtime`  | `runtime`, `domain`, `features`, `content`, `shared` — never `app` |
| `domain`   | `domain`, `shared`                                                 |
| `content`  | `content`, `shared`                                                |
| `shared`   | `shared` only — it is a leaf                                       |

Violations are lint errors (eslint-plugin-boundaries) and dep-cruiser errors in CI.

## The golden rule: one obvious home per concern

| Kind of logic                    | Goes here                               |
| -------------------------------- | --------------------------------------- |
| Game rules, state transitions    | `src/domain/<context>/*.behavior.ts`    |
| Orchestration across domain/ports | `src/features/<feature>/*Feature.ts`   |
| Phaser scenes, sprites, tweens   | `src/runtime/phaser/scenes/<Scene>/`    |
| Input translation → commands     | `src/runtime/phaser/input/`             |
| Port interfaces (cross-cutting)  | `src/shared/types/ports.ts`             |
| Port implementations (browser)   | `src/runtime/adapters/` (constructed only in `src/app/composition/`) |
| Scene wiring                     | `src/runtime/phaser/scenes/<Scene>/<Scene>.setup.ts` |
| Enemy/item/level definitions     | `src/content/definitions/<kind>/`       |
| Schemas for content              | `src/content/schemas/`                  |
| Cross-cutting type utilities     | `src/shared/types/`                     |

## Non-negotiable

- **No `phaser` imports from `src/domain/**`.** Enforced by lint + dep-cruiser.
- **Domain is pure.** No `Math.random`, no `Date.now`, no `window`, no `localStorage` — inject via ports.
- **Content is schema-validated at import time.** A malformed JSON file breaks the build.
- **Named exports only** (default exports allowed only in `main.ts` and config files).

## When the rules feel wrong

Write an ADR in `docs/adr/` with `bun run new:adr "<Title>"`. Do not silently deviate.
