# Domain Module Template

**Do not hand-write new domain modules. Run:**

```sh
bun run new:module <Name>
```

…which scaffolds the 8-file layout below.

## File shape

```
src/domain/<name>/
├── <Name>.types.ts       # public types
├── <Name>.model.ts       # create<Name>() factory
├── <Name>.constants.ts   # named constants
├── <Name>.behavior.ts    # pure functions
├── <Name>.system.ts      # orchestration (optional)
├── <Name>.contracts.ts   # module-local ports (optional)
├── <Name>.test.ts        # unit tests
└── index.ts              # named re-exports
```

## Rules

- `behavior.ts` contains **only pure functions**. No `Date.now`, `Math.random`, side effects, or network.
- `system.ts` may combine behaviors but still returns state — it does not call Phaser or ports directly.
- `contracts.ts` declares module-local port interfaces. Cross-cutting ports live in `src/shared/types/ports.ts`.
- `index.ts` exports only what external code should see. Internal helpers stay unexported.

## Example

See `src/domain/player/` and `src/domain/interaction/` for reference implementations.
