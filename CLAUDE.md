# Claude Code

Follow [`AGENTS.md`](./AGENTS.md). That file is the contract; this file is Claude-only wiring.

## Slash commands

| Command              | What it does                                      |
| -------------------- | ------------------------------------------------- |
| `/check`             | Run `bun run check` and stop on the first failure    |
| `/new-module`        | Scaffold a domain module                          |
| `/new-feature`       | Scaffold a feature                                |
| `/new-scene`         | Scaffold a Phaser scene                           |
| `/review-slice`      | Review a slice against the architecture           |
| `/verify-boundaries` | Lint boundaries + dep-cruise                      |
| `/speckit:*`         | Spec Kit pipeline (specify → implement)           |

Full walkthrough: [`BUILD_THE_GAME.md`](./BUILD_THE_GAME.md). Constitution: [`.specify/memory/constitution.md`](./.specify/memory/constitution.md).
