# Contributing

Help improve the skill, platform guides and installation helpers by reporting a
reproducible problem or proposing a focused change.

## Report an issue

Use this repository's [issue forms](https://github.com/doubleagent-so/skills/issues/new/choose)
for skill instructions, platform guidance and helper problems. Include the
framework and version, Node.js version, command, expected result, actual result
and a minimal reproduction. Redact credentials and private customer information.

You can report SDK behavior or classification errors here too; maintainers will
route them to the product repository. Use [Security](SECURITY.md) for credential
exposures and vulnerabilities.

## Propose a change

This repository is a distribution mirror: its files are generated from Double Agent's private source repository.
Open an issue here with the proposed wording or a reproduction, and maintainers apply it at the source. That covers
the skill runbooks and references, this README and its documentation and templates, and the bundled helpers.

The helpers in `skills/*/scripts/*.mjs` are generated from the CLI source, so a pull request that edits them cannot
be merged as is; describe the behavior you need instead. See [Maintenance](docs/maintenance.md) for the validation
and publishing process.

Keep examples executable and placeholders explicit. Distinguish automated edits
from manual platform instructions, optional account creation from keyless setup,
and installation verification from detection accuracy. Avoid unsupported claims
about compatibility, accuracy or service guarantees.

Describe the problem, the resulting behavior and the checks performed in your pull
request. Changes remain under the repository's [MIT License](LICENSE).
