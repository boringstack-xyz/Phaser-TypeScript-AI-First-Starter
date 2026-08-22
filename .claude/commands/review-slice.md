---
description: Review a feature slice for adherence to the architecture
argument-hint: <path/to/feature>
---

Review the feature at `$ARGUMENTS` (or the most recently-changed feature if no path). Check:

1. Does the feature import only from `domain`, `runtime`, `content`, `shared`, or other features? (No `phaser`.)
2. Does it define `I<Name>FeatureDeps` with an event bus + any ports it needs?
3. Does it have a `.test.ts` with fake ports from `@shared/testing`?
4. Does it register in a scene's `*.setup.ts`?
5. Does `docs/ai/catalog.md` list it? (Run `bun run catalog` and check.)

Report as a short checklist. Do not fix issues automatically — list them.
