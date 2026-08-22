# 0001. Record architecture decisions

Date: 2026-04-21
Status: accepted

## Context

This codebase is AI-first. Agents and humans will want to change patterns. Some
changes are good, some are drift. Without a record, every session re-litigates
decisions already made.

## Decision

We will keep an Architecture Decision Record (ADR) for every meaningful
architectural choice in `docs/adr/`, numbered sequentially, starting from 0001.

Rules:

1. Any change that adds a new layer, pattern, cross-cutting concept, or breaks
   an existing non-negotiable rule requires an ADR before the code change lands.
2. Use `bun run new:adr "<Title>"` to scaffold; do not copy-paste an old file.
3. ADRs are immutable once accepted. To supersede, write a new ADR and update
   the old one's Status to "superseded by ADR-NNNN".
4. PR descriptions that deviate from `docs/ai/contribution-contract.md` must
   link to an ADR or the change is rejected.

## Consequences

Easier:
- Agents have a paper trail for why rules exist and a legitimate escape hatch when a rule is wrong.
- Code reviewers can push back with "this needs an ADR" instead of arguing patterns.

Harder:
- Slightly more overhead to change architectural patterns (deliberate friction).

## Alternatives considered

- Rely on commit messages and PR descriptions — rejected: these decay and scatter.
- Long-form doc in README — rejected: doesn't support decision history well.
