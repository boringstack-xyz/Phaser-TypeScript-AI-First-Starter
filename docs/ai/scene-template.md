# Phaser Scene Template

**Do not hand-write new scenes. Run:**

```sh
bun run new:scene <Name>
```

## What scenes are allowed to do

- create sprites, tweens, cameras
- bind input keys
- subscribe to events
- call `setupX()` to wire features
- dispatch to feature runtimes
- manage audio / particle adapters

## What scenes are NOT allowed to do

- contain combat formulas, progression rules, or any domain math
- mutate shared state directly (go through features)
- own gameplay decisions (features + domain decide)

## Shape

```
<Scene>/
├── <Scene>.ts            # the Phaser.Scene class — thin
├── <Scene>.setup.ts      # feature wiring — returns { update, dispose }
├── <Scene>.constants.ts  # scene key, dimensions
└── index.ts
```

The `.ts` class holds only lifecycle hooks. The `.setup.ts` does the wiring and returns a runtime object the class calls in `update(time, delta)`. Scene keys go through `asSceneKey` (never a string literal in `super()` / `scene.start`). Dispose run-lifetime resources on `Phaser.Scenes.Events.SHUTDOWN`. Do not construct GameObjects in `update()`.

## Example

See `src/runtime/phaser/scenes/WorldScene/` for the reference implementation.
