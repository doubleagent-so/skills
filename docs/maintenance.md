# Maintenance and publishing

[Documentation home](../README.md) · [Contributing](../CONTRIBUTING.md)

This guide is for maintainers: what is generated, how to check a distribution tree, and how publication works.

## Source of truth

Double Agent's private source repository owns every file here. This repository distributes self-contained skills and
their documentation.

| Published path | What it is | How it is produced |
| --- | --- | --- |
| `skills/<name>/SKILL.md` | A skill's runbook | Copied from source |
| `skills/<name>/references/` | The skill's references | Copied from source |
| `skills/<name>/scripts/` | The skill's helpers | Bundled from the CLI source; never edited by hand |
| Repository root files | This README, `docs/`, templates and `tools/` | Copied from source, including dotfiles |
| `LICENSE` | MIT | Copied from source |

Helpers have no runtime dependencies. Installation helpers support Node.js 18+. Website simulation needs Node.js 20+,
Playwright and Chromium, and its `simulation-probe.js` browser asset must ship beside `simulate.mjs`. The `agents.mjs`
registry helper bundles its ABI codec and needs an HTTPS RPC for direct lookups. The `doubleagent-agents` helpers
(`portal.mjs`, `proof.mjs`, `card.mjs`, `observe.mjs`) need Node.js 20+.

## Check a distribution tree

From the root of this repository:

```sh
node tools/check-docs.mjs
```

The check validates local Markdown links and anchors, language-tagged code fences, command formatting, the brand
asset, helper syntax and the website helpers' snippet output. It makes no network requests and creates no accounts.
GitHub Actions runs it on every push and pull request. External product links and hosted-platform instructions still
need editorial review: inspect rendered Markdown, especially code blocks and tables, before publishing.

## Publish

Maintainers publish from the source repository. Publication replaces this repository's tree, commits the difference
and pushes **directly to `main`**; it is not a dry run. Review a proposed update on a branch and pull request first. A
change made only here is overwritten by the next publication, so make durable changes at the source. Never hand-edit
the generated helpers.

## Compatibility and change history

Review the [commit history](https://github.com/doubleagent-so/skills/commits/main/) for the version installed from
this repository. The npm CLI and browser SDK have their own releases; a skills-repository commit does not deploy either
service. Record the skills commit and relevant CLI/SDK version when investigating an issue.
