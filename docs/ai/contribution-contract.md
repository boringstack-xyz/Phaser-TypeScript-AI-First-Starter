# Contribution Contract

Ten non-negotiable rules for anyone (human or AI) changing this codebase.

1. **No domain logic in Phaser scenes.** Scenes create sprites and bind input. Gameplay rules live in `src/domain/**`.
2. **No Phaser imports in `src/domain/**`.** Enforced by lint and dep-cruiser. Move Phaser code to `src/runtime/phaser/**`.
3. **Keep modules small and single-purpose.** If a `*.behavior.ts` file approaches 400 lines, split it.
4. **Prefer adding a new behavior file over expanding a scene file.**
5. **Every changed domain behavior must have an added or updated test.**
6. **Content changes must validate against the schema.** Run `bun run dev` after editing JSON; validation errors fail early.
7. **Use the existing file naming conventions exactly.** See `docs/ai/naming-conventions.md`.
8. **Do not introduce new architectural patterns without an ADR.** Use `bun run new:adr "<Title>"`.
9. **Prefer explicit interfaces over hidden framework magic.** If you need something from the engine, go through a port.
10. **When in doubt, keep runtime imperative and domain pure.**

## Before you claim done

```sh
bun run check
```

Must pass. `bun run validate` adds Playwright smoke. Do not `--no-verify` past hooks. Fix the root cause.

This template is part of [boringstack-xyz](https://github.com/boringstack-xyz). The fullstack sister is [BoringStack](https://github.com/boringstack-xyz/boringstack); the TypeScript harness is [tsforge](https://tsforge.dev).
