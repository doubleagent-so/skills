# Maintenance and publishing

[Documentation home](../README.md) · [Contributing](../CONTRIBUTING.md)

## Source of truth

The [Double Agent monorepo](https://github.com/doubleagent-so/doubleagent) owns the
source. This repository distributes a self-contained skill and its documentation.

| Source | Published destination | How it is produced |
| --- | --- | --- |
| `skills/doubleagent/SKILL.md` | `skills/doubleagent/SKILL.md` | Copied from source |
| `skills/doubleagent/references/` | Same relative path | Copied from source |
| `packages/cli/src/skill-bin/` and shared CLI code | `skills/doubleagent/scripts/*.mjs` | Bundled by the CLI build |
| `skills/repository/` | Repository root | Copied by the publisher, including dotfiles |
| `skills/LICENSE` | `LICENSE` | Copied by the publisher |

The published helper scripts are generated and have no external runtime
dependencies. Their compatibility floor is Node.js 18. Their entry points call the
same CLI implementation used by the npm package.

## Validate a source change

From the monorepo root:

```sh
npm ci
npm run build -w @doubleagent-so/cli
npm run typecheck -w @doubleagent-so/cli
npx vitest run packages/cli/test/skill.test.ts
```

The skill tests check frontmatter, local references, exact snippet agreement with
the installer, generated-script freshness and helper behavior against a local API.
They do not provision real accounts.

For the distribution repository documentation, assemble a local preview and run its checker:

```sh
SKILLS_PREVIEW="$(mktemp -d)"
mkdir -p "$SKILLS_PREVIEW/skills"
cp -R skills/doubleagent "$SKILLS_PREVIEW/skills/"
cp -R skills/repository/. "$SKILLS_PREVIEW/"
cp skills/LICENSE "$SKILLS_PREVIEW/LICENSE"
node "$SKILLS_PREVIEW/tools/check-docs.mjs"
```

The documentation check validates local Markdown links and anchors, the referenced
brand asset, helper syntax and stack-snippet output. It makes no network requests
and does not create accounts. GitHub Actions runs it on pushes and pull requests.
External product links and hosted-platform instructions still need editorial review.

## Publish

Review the generated tree and source changes before publication. The existing
publisher is run from the monorepo:

```sh
bash scripts/publish-skills.sh "Sync Double Agent skills and documentation"
```

This command clones the distribution repository, replaces its generated tree,
commits differences and pushes **directly to `main`**. It requires write access and
SSH authentication. It is not a dry run or a pull-request preview. Use a separate
branch and pull request when reviewing a proposed distribution update.

Keep source and distribution changes together: a distribution edit that is
not reflected in `skills/repository/` or `skills/doubleagent/` will be overwritten
by a later publication. Do not hand-edit the compiled helpers.

## Compatibility and change history

Review the [commit history](https://github.com/doubleagent-so/skills/commits/main/)
for the version installed from this repository. The npm CLI and browser SDK have
their own releases; a skills-repository commit does not deploy either service.
Record the skills commit and relevant CLI/SDK version when investigating an issue.
