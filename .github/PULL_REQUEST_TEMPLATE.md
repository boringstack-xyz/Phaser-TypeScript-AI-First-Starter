## Summary

<!-- One-sentence what changed and why. -->

## Linked spec (non-trivial changes only)

<!-- Path to the spec-kit artifacts for this change. Delete this section if the change is trivial (typo, rename, one-liner). -->

- [ ] `docs/specs/NNN-feature-name/spec.md`
- [ ] `docs/specs/NNN-feature-name/plan.md`
- [ ] `docs/specs/NNN-feature-name/tasks.md`

## Checklist

- [ ] `bun run check` passes locally (`bun run validate` if boot/runtime changed)
- [ ] Tests added or updated for changed domain behaviors
- [ ] `bun run catalog` regenerated if I added/removed modules, features, scenes, ports, or content
- [ ] ADR added under `docs/adr/` if I deviated from an architectural rule
- [ ] Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/)

## Architectural impact

<!-- Delete if the change is self-contained within one layer. -->

<!--
- New import direction? (features → X, runtime → X, etc.)
- New port? (added to `src/shared/types/ports.ts` + fake in `src/shared/testing/`)
- New scene? (registered in `src/app/config/gameConfig.ts`)
- New content type? (schema in `src/content/schemas/`, validated at import)
-->

## Breaking changes

<!-- Describe any breaking change and include `BREAKING CHANGE:` in your commit message footer (or `feat!:` / `fix!:` prefix). -->

## Screenshots / recordings

<!-- Delete if not applicable. For gameplay/UI changes, a short recording helps reviewers. -->
