# Prompt: add a new gameplay feature

Use this as a prompt template when asking an AI agent to add a feature.

---

Add a new feature `<Name>` that does `<what the feature does>`.

**Do this in exactly this order:**

1. Ensure the relevant domain module(s) exist. If not, run `bun run new:module <Name>` first.
2. Run `bun run new:feature <Name>`.
3. Edit `src/features/<name>/<Name>Feature.ts`:
   - Declare deps in `I<Name>FeatureDeps` (always includes `events: IEventBus<GameEventMap>`).
   - Implement the feature as `create<Name>Feature(deps) → I<Name>Feature`.
   - Emit events via `deps.events.emit(...)` for observable outcomes.
4. Add events to `src/domain/core/events.ts` if you emit new event types.
5. Add a test in `<Name>Feature.test.ts` using fake ports from `@shared/testing`.
6. Wire the feature into `src/runtime/phaser/scenes/<Scene>/<Scene>.setup.ts`.
7. Run `bun run catalog`, then `bun run check`.

**Rules:**
- Features import from domain + content + shared. No `phaser` imports, no `src/runtime/**` imports.
- Feature tests must not require a real Phaser instance.
- If the feature needs a new side effect, add a port to `shared/types/ports.ts` and implement it in `runtime/adapters/`.
