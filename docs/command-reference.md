# Command reference

[Documentation home](../README.md) · [Getting started](getting-started.md)

The skill's helpers are bundled from the same source as `@doubleagent-so/cli`.
Use Node.js 18 or later for the Double Agent CLI and helpers. The bundled helpers
need no `npm install` in this repository.

## Website installation

Run `init` from the target website project, or pass `--cwd /path/to/site`.

| Command | Effect |
| --- | --- |
| `npx @doubleagent-so/cli init --dry-run` | Show the proposed integration without writes or account creation |
| `npx @doubleagent-so/cli init` | Install keyless; print changes and next steps |
| `npx @doubleagent-so/cli init --yes --json` | Apply the integration without prompting; return JSON |
| `npx @doubleagent-so/cli init --key pk_live_REPLACEWITHYOURPUBLICKEY` | Install or update an existing public key |
| `npx @doubleagent-so/cli verify https://your-site.example --json` | Inspect served HTML and request an API install check |

`init` JSON includes `stack`, `status`, `dry_run`, `keyless`, `files_changed`,
`planned_changes`, `warnings`, `next_steps` and `diff`. A result can be `installed`
or `advice` without any files being edited. Check `status` and `next_steps`.

## Generate a platform snippet

From the root of a checkout of **this repository**:

```sh
node skills/doubleagent/scripts/snippet.mjs next-app
node skills/doubleagent/scripts/snippet.mjs vite --json
```

Equivalent CLI command:

```sh
npx @doubleagent-so/cli snippet vite --json
```

Supported stack IDs: `html`, `vite`, `next-app`, `next-pages`, `astro`, `nuxt`,
`sveltekit`, `remix`, `wordpress`, `wix`, `squarespace`, `webflow`, `shopify`.

Options: `--key pk_…`, `--profile auto`, `--json`. JSON contains `stack`, `file`,
`where` and `lines`, with `import` or `note` when needed. This command prints
instructions; it does not edit the site. Shopify returns app-embed guidance
instead of a theme snippet.

## Verify an installation

From this repository's root:

```sh
node skills/doubleagent/scripts/verify.mjs https://your-site.example --json
```

The result includes local HTML checks and an `installCheck` object containing the
API response when available. `--api https://your-api.example` overrides the install
check endpoint for a controlled environment. Verification does not create accounts
or edit files, but it makes requests to the target URL and API.

The command is not a browser test. It does not prove that scripts execute, consent
permits reporting, the domain is verified, or the detector correctly classifies a
particular session. See [Troubleshooting](troubleshooting.md).

## Optional account creation

Run this only when the person responsible for the site asks to create an account:

```sh
node skills/doubleagent/scripts/create-account.mjs --email you@example.com --domain your-site.example
```

This calls the account API and prints issued credentials. Options include
`--domain`, `--name`, `--api` and `--json`. The JSON form can also contain secret
keys and login information; do not attach its raw output to issues or CI logs.
This helper does not edit the website. Use CLI `init --email …` when you want both
account creation and installation.

For an installed skill, helper paths are relative to the installed
`doubleagent/SKILL.md` directory; that location depends on the chosen coding agent.

## Exit codes

| Command | `0` | `1` | `2` |
| --- | --- | --- | --- |
| `init` | Completed, already installed, or platform advice supplied | Error or aborted interactive edit | Unsupported stack; inspect suggested next steps |
| `snippet` | Instructions generated | Invalid arguments or unsupported stack ID | — |
| `verify` | SDK, stub and keyless/public-key format checks pass | These installation checks fail or an error occurs | — |
| `create-account` | Account API call completed | Invalid input or API failure | — |

The verifier's exit code is based on its HTML checks. API warnings and failed API
checks can still appear alongside exit `0`; inspect the complete output.

## Account administration

Use the CLI for account operations, separate from the installation helpers:

```sh
npx @doubleagent-so/cli login
npx @doubleagent-so/cli sites
npx @doubleagent-so/cli verify-domain your-site.example --method dns --site st_REPLACEWITHYOURSITE
```

Login opens a device approval flow and stores a local session. See the
[CLI documentation](https://github.com/doubleagent-so/doubleagent/tree/main/packages/cli)
for key rotation, revocation, credential storage and endpoint configuration.
