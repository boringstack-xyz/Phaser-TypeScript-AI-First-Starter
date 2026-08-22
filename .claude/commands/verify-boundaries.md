---
description: Run architectural boundary checks (eslint boundaries + dep-cruiser)
---

Run `bun run check:arch`. Report:

1. Boundary violations (if any), from both tools.
2. Orphan modules (if any) from dep-cruiser.
3. A one-line summary: `architecture: clean` or `architecture: N violations`.

Do not fix violations automatically — report and stop.
