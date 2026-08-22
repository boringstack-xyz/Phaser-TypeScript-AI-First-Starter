---
description: Run bun run check and summarize any failures
---

Run `bun run check` and report the result:

- If it passes: say "check: green". Mention that `bun run validate` is the full bar (check + Playwright smoke) if they asked whether they can ship.
- If it fails: show the first failing step and the first 20 lines of its output, then stop. Do not attempt fixes unless I ask.
