# Security Policy

## Reporting a vulnerability

**Please do not file public issues for security vulnerabilities.**

Use GitHub's private vulnerability reporting:

1. Go to the **Security** tab of this repository.
2. Click **Report a vulnerability**.
3. Fill in the form with reproduction steps.

Reports are handled on a best-effort basis. This is a starter template, not a production service — expect human-scale response times, not SLA-backed ones.

## Scope

**In scope:**

- Code in this repository (`src/`, `scripts/`, `tests/`, configs, workflows)
- Examples and default configurations that could mislead forks into insecure setups

**Out of scope (report upstream):**

- [Phaser](https://github.com/phaserjs/phaser) — report to the Phaser team
- Node.js, Bun, Vite, Vitest, ESLint, TypeScript, Zod, Playwright, and other transitive dependencies — report upstream
- Vulnerabilities that require you to have already compromised the developer's machine
- Social engineering of forks

## Supply-chain hygiene

This template ships with the same security triad as BoringStack and tsforge:

- Pinned exact versions in `package.json` (no `^` or `~`)
- `osv-scanner` on `bun.lock` (fails PRs on un-allowlisted findings)
- `bun audit --audit-level=high` (ignores stay in lockstep with `osv-scanner.toml` via `scripts/ci/bun-audit.sh`)
- Semgrep SAST (`p/owasp-top-ten`, `p/javascript`, `p/typescript`)
- Gitleaks secret scan (pinned CLI, SHA256-verified)
- CodeQL with `security-and-quality` queries
- OpenSSF Scorecard (SARIF uploaded on `main`)
- Dependabot weekly updates
- Desired GitHub settings in `.github/desired-repo-settings.json` (audit with `./scripts/audit-repo-settings.sh`)

Accepted-risk dependency findings, if any, live in `osv-scanner.toml` with a reason and a re-evaluation date. Prefer `package.json` `overrides` over adding an ignore.

If you fork this template and remove any of these, you're opting out of the baseline we ship with.

## Disclosure

When a vulnerability is confirmed and fixed, the fix will be released with a `fix!:` or `feat!:` conventional-commit prefix (to trigger a release via release-please) and a `SECURITY` section in the release notes describing the issue and remediation.

Thank you for helping keep the template safe for everyone who forks it.
