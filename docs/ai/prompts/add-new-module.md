# Prompt: add a new domain module

Use this as a prompt template when asking an AI agent to add a module.

---

Add a new domain module `<Name>` to this codebase.

**Do this in exactly this order:**

1. Run `bun run new:module <Name>` — do not hand-write the files.
2. Edit `src/domain/<name>/<Name>.types.ts` to describe the state shape.
3. Edit `src/domain/<name>/<Name>.behavior.ts` to add the pure function(s) I described.
4. Write unit tests in `src/domain/<name>/<Name>.test.ts` covering happy path + edge cases.
5. Update `src/domain/<name>/index.ts` to export the new names.
6. Run `bun run catalog` to refresh `docs/ai/catalog.md`.
7. Run `bun run check`. Fix any failures at the root cause.

**Rules:**
- Pure functions only in `behavior.ts`. No `Date.now`, `Math.random`, or engine calls.
- If you need time or randomness, add a port to `src/shared/types/ports.ts`.
- If you need Phaser, you are in the wrong layer — features or runtime.
