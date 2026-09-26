# Getting started

[Documentation home](../README.md) · [Command reference](command-reference.md) · [Troubleshooting](troubleshooting.md)

## Choose your installation route

| Route | Use it when |
| --- | --- |
| Agent skill | You want a coding agent to detect the stack and follow the integration runbook |
| Double Agent CLI | You want to preview and apply the supported file edits directly |
| Platform guide | Your site is managed in Shopify, WordPress or a hosted builder |

You need access to the website project or its platform settings. The Double Agent
CLI and bundled helpers require Node.js 18 or later; use a supported Node.js release
for your environment. Installing packages with `npx` requires npm and network access.

An account is not required for the default keyless integration. A compatible coding
agent is required only for the agent-skill route.

## Install the agent skill

From your website project, run:

```sh
npx skills add doubleagent-so/skills
```

Choose your coding agent in the installer. To inspect the available skill before
installation, use `npx skills add doubleagent-so/skills --list`. Installation scope
and agent selection are managed by the [skills CLI](https://github.com/vercel-labs/skills).

Repository access is required. If GitHub requests authentication, use an account
with access to `doubleagent-so/skills`; the skills installer can use your configured
Git or GitHub CLI authentication.

Ask the agent:

> Install Double Agent on this site using the doubleagent skill. Start keyless,
> explain which file or platform setting changes, and verify the deployed URL.

Installing the skill adds instructions to the coding agent. It does not install
the browser SDK into the website until the agent performs the integration.

## Install with the CLI

Run these commands from the website project, not this skills repository:

```sh
npx @doubleagent-so/cli init --dry-run
npx @doubleagent-so/cli init
```

The preview reports the detected stack and proposed diff without editing files or
creating an account. Review the result, then apply it. The default install is keyless.
The CLI may give platform instructions instead of editing files, particularly for
Shopify or a hosted editor.

For an authorized automated workflow, `init --yes --json` applies the changes and
returns a structured result. `--json` is not a preview; pair it with `--dry-run` when
you only want to inspect the plan.

Use the [platform table](../README.md#supported-platforms) if the detected framework
does not match your project. Avoid installing the SDK twice through a tag and an
npm integration, or through two separate plugins.

## Deploy and verify

Build and deploy through your site's normal process, then check its public URL:

```sh
npx @doubleagent-so/cli verify https://your-site.example
```

The verifier inspects the served HTML for the SDK, queue stub and key format, then
requests an API install check. A keyless result is valid. Read any API diagnostics
as well as the command's exit status: HTML presence alone does not prove a browser
has sent data or that classification is accurate.

For local development, inspect the served page and browser Network panel. A remote
install checker cannot fetch a service available only on your machine. See
[verification limits](troubleshooting.md#verification-passes-but-data-is-missing).

## Add an account when you need it

For HQ access, start at [Claim your domain](https://app.doubleagent.so/claim) and
complete domain verification. The [claiming guide](../skills/doubleagent/references/claim.md)
describes the available verification methods and retained keyless history.

To use an existing public key, update the installation from the website project:

```sh
npx @doubleagent-so/cli init --key pk_live_REPLACEWITHYOURPUBLICKEY
```

Replace the example with the site's actual public key. `pk_…` keys may appear in
browser configuration. `sk_…` keys belong only on the server and must not be placed
in HTML, frontend code or public logs.

If you explicitly want the CLI to create an account and install its public key:

```sh
npx @doubleagent-so/cli init --email you@example.com --domain your-site.example
```

This creates account resources and may print a secret key once. Store that output
privately. Domain verification and feature-specific configuration still apply;
creating an account alone does not complete every integration.
