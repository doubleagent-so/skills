<p align="center">
  <img src="assets/doubleagent.svg" width="80" height="80" alt="Double Agent">
</p>

<h1 align="center">Double Agent Skills</h1>

<p align="center">Official agent skills for installing and testing Double Agent on your website.</p>

<p align="center">
  <a href="https://doubleagent.so">Website</a> ·
  <a href="https://doubleagent.so/docs/">Product docs</a> ·
  <a href="docs/getting-started.md">Getting started</a> ·
  <a href="https://github.com/doubleagent-so/skills/issues">Support</a> ·
  <a href="LICENSE">MIT license</a>
</p>

Double Agent helps you understand whether website traffic comes from humans, bots
or AI agents. This repository gives coding agents the instructions, platform
guides and tools to install the browser SDK and verify the integration.

Start without an account or API key. Claim your domain when you want access to its
data in HQ.

## Get started

With Node.js and npm available, install the skill from your website project:

```sh
npx skills add doubleagent-so/skills
```

Then ask your coding agent:

```text
Install Double Agent on this website. Use the keyless setup and verify the integration.
```

The agent follows a stack-specific runbook: detect the framework, place the SDK
correctly, preserve the queue stub, and check the published page. Account creation
is optional and requires your request.

To use the CLI directly, preview the changes from your website project:

```sh
npx @doubleagent-so/cli init --dry-run
```

Review the proposed diff, then install:

```sh
npx @doubleagent-so/cli init
```

See [Getting started](docs/getting-started.md) for prerequisites, deployment checks
and an optional account upgrade.

## Available skills

| Skill | Purpose | Included resources |
| --- | --- | --- |
| [doubleagent](skills/doubleagent/SKILL.md) | Install, verify, simulate detection and resolve ERC-8004 identities | Framework runbook, platform references and five Node.js helpers |

The skill guides installation and controlled simulations for your coding agent. Visitor classification
runs in the Double Agent SDK and service; the skill itself is not a detector.

## Supported platforms

| Platform | Integration path | Guide |
| --- | --- | --- |
| Next.js | App Router or Pages Router using `next/script` | [Next.js](skills/doubleagent/references/nextjs.md) |
| Vite, React, Vue and other Vite apps | Project HTML entry point | [Vite](skills/doubleagent/references/vite-react.md) |
| Static HTML and shared HTML layouts | Site-wide head snippet | [HTML](skills/doubleagent/references/html.md) |
| Astro, Nuxt, SvelteKit, Remix / React Router | Framework-specific layout or configuration | [Framework runbook](skills/doubleagent/SKILL.md#2-make-the-edit) |
| WordPress / WooCommerce | Theme header or header-code plugin | [WordPress](skills/doubleagent/references/wordpress.md) |
| Shopify | Shared theme snippet with automatic cart attributes | [Shopify](skills/doubleagent/references/shopify.md) |
| Wix, Squarespace and Webflow | Platform custom-code settings | [Wix](skills/doubleagent/references/wix.md) · [Squarespace](skills/doubleagent/references/squarespace.md) · [Webflow](skills/doubleagent/references/webflow.md) |
| Lovable, Bolt, v0 and Emergent | Follow the generated project's framework | [AI builders](skills/doubleagent/references/ai-builders.md) |

Hosted platforms may require a plan that supports custom code. Framework guidance
and automated editing support are distinct: the CLI provides instructions when a
platform requires changes in its own editor.

## What an installation enables

- **Visitor classification:** human, bot and agent verdicts in the browser.
- **Integration tagging:** detection results for supported analytics and marketing
  integrations, subject to their setup and consent state.
- **HQ access:** claim and verify the domain to view retained site data.
- **Signed tokens:** configure a public key and verified origin for token workflows.

Detection is evidence-based and can be uncertain. A bot or agent classification
does not, by itself, mean malicious behavior. See the
[capability matrix](https://doubleagent.so/docs/capabilities/) for feature requirements.

## Documentation

| Guide | What you will find |
| --- | --- |
| [Getting started](docs/getting-started.md) | Install the skill, integrate the SDK and verify a deployment |
| [Command reference](docs/command-reference.md) | CLI commands, bundled helpers, options, outputs and exit codes |
| [Troubleshooting](docs/troubleshooting.md) | Missing tags, framework issues, account access and verification limits |
| [Contributing](CONTRIBUTING.md) | Report a reproducible issue or propose a change |
| [Maintenance](docs/maintenance.md) | Source ownership, generated files, validation and publishing |
| [Security](SECURITY.md) | Credential handling and private vulnerability reporting |

## Maintenance and support

Maintained by [Double Agent](https://github.com/doubleagent-so). This is the official
distribution repository; its source lives in the
[Double Agent monorepo](https://github.com/doubleagent-so/doubleagent/tree/main/skills).
Documentation and helpers are published together so installation guidance stays
aligned with the CLI.

For installation issues, [open an issue](https://github.com/doubleagent-so/skills/issues/new/choose).
For private account or credential issues, contact
[support@doubleagent.so](mailto:support@doubleagent.so). Never include secret keys
or session tokens in a public issue.

Licensed under the [MIT License](LICENSE).
