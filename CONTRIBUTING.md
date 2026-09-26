# Contributing

Thank you for helping improve Double Agent's installation experience.

## Report an issue

Use this repository's [issue forms](https://github.com/doubleagent-so/skills/issues/new/choose)
for skill instructions, platform guidance and helper problems. Include the
framework and version, Node.js version, command, expected result, actual result
and a minimal reproduction. Redact credentials and private customer information.

For SDK behavior or classification errors, use the
[Double Agent issue tracker](https://github.com/doubleagent-so/doubleagent/issues).
Report credential exposures and vulnerabilities through [Security](SECURITY.md).

## Propose a change

This repository is a distribution mirror. Durable changes belong in the
[source monorepo](https://github.com/doubleagent-so/doubleagent), which generates
the published files. If you cannot access that repository, open an issue here with
the proposed wording or reproduction; maintainers can apply it upstream.

| Change | Source location in the monorepo |
| --- | --- |
| Skill runbook and platform guidance | `skills/doubleagent/` |
| Distribution README, documentation and GitHub templates | `skills/repository/` |
| Bundled helper behavior | `packages/cli/src/` |
| Repository publication | `scripts/publish-skills.sh` |

Do not manually patch generated `skills/doubleagent/scripts/*.mjs` files. Rebuild
them from the CLI source and include the generated result. See
[Maintenance](docs/maintenance.md) for the validation and publishing process.

Keep examples executable and placeholders explicit. Distinguish automated edits
from manual platform instructions, optional account creation from keyless setup,
and installation verification from detection accuracy. Avoid unsupported claims
about compatibility, accuracy or service guarantees.

Describe the problem, the resulting behavior and the checks performed in your pull
request. Changes remain under the repository's [MIT License](LICENSE).
