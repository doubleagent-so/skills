# Command reference

[Documentation home](../README.md) · [Getting started](getting-started.md)

Use the Double Agent CLI to install the SDK, generate snippets and check a deployed
site. Installation helpers require Node.js 18 or later. Website simulation requires Node.js 20+, Playwright and Chromium. Use a supported
Node.js release for your environment.

The examples use npm to run the CLI without a repository checkout. Replace
`your-site.example` with your website's hostname and any marked key or site ID
with the value from your Double Agent account.

## Preview and install

From the website project, preview the proposed changes:

```sh
npx @doubleagent-so/cli init --dry-run
```

The preview reports the detected stack and a diff. It does not edit files or create
an account. Review the diff, then install:

```sh
npx @doubleagent-so/cli init
```

The default install uses no API key. If the project already has an installation,
the CLI reports it. For platforms managed through a dashboard, it may return
instructions without editing files.

### Installation options

| Option | Effect |
| --- | --- |
| `--dry-run` | Show the plan without editing files or creating an account |
| `--cwd` | Set the website project directory; defaults to the current directory |
| `--key` | Use an existing public key; the CLI also reads `DOUBLEAGENT_KEY` |
| `--email` | Create an account and install its public key; cannot be combined with a supplied key |
| `--domain` | Set the hostname used for account creation and next steps |
| `--test` | With account creation, select the issued test public key |
| `--profile` | Set the SDK profile; defaults to `auto` |
| `--yes` | Apply changes without an interactive confirmation |
| `--json` | Return JSON; also bypasses the interactive confirmation |

If `DOUBLEAGENT_KEY` is set, the CLI uses it even when the key option is omitted.
Check the preview before assuming an installation is keyless.

To preview another directory, replace `/path/to/site` with its path:

```sh
npx @doubleagent-so/cli init --cwd /path/to/site --dry-run
```

For an authorized automated installation:

```sh
npx @doubleagent-so/cli init --yes --json
```

**JSON output is not a preview.** Include the dry-run option when you only want the
plan:

```sh
npx @doubleagent-so/cli init --dry-run --json
```

The result includes `stack`, `status`, `dry_run`, `keyless`, `files_changed`,
`planned_changes`, `warnings`, `next_steps` and `diff`. `installed` means the SDK
was already present; `advice` means the CLI supplied instructions. Neither requires
file changes. Account-creation results can also contain credentials.

## Generate a snippet

From any directory, generate instructions for a Vite project:

```sh
npx @doubleagent-so/cli snippet vite --json
```

This prints a snippet and its insertion point. It does not edit files.

| Option | Effect |
| --- | --- |
| `--key` | Include the supplied public key; omit for a keyless snippet |
| `--profile` | Set the SDK profile; defaults to `auto` |
| `--json` | Return structured output instead of formatted instructions |

Supported stack IDs are `html`, `vite`, `next-app`, `next-pages`, `astro`, `nuxt`,
`sveltekit`, `remix`, `wordpress`, `wix`, `squarespace`, `webflow` and `shopify`.
Shopify returns the snippet for the shared theme head. The installation command
provides theme-editing instructions; it does not publish a theme.

JSON contains `stack`, `file`, `where` and `lines`, with `import` or `note` when
needed. Follow the matching [platform guide](../README.md#supported-platforms)
for deployment and browser verification.

## Verify an installation

From any directory, check the published URL:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

The verifier fetches the page's HTML and requests an API installation check.
It does not launch a browser or change the site.

| Result field | Meaning |
| --- | --- |
| `script` | The expected SDK URL appears in the returned HTML |
| `stub` | The queue initialization appears in that HTML |
| `keyless`, `keyValid` | The tag omits a key, or its key matches the expected public-key format |
| `ok` | The HTML presence and key-format checks pass |
| `status`, `problems` | Page HTTP status and local diagnostics |
| `installCheck` | API reachability, status and installation diagnostics |

Inspect `status`, `problems` and `installCheck` even when `ok` is true. Exit status
alone does not establish a healthy page or successful collection. Complete the
[browser verification steps](../skills/doubleagent/references/verify.md) too.

For a controlled environment, replace the API origin in this example:

```sh
npx @doubleagent-so/cli verify https://your-site.example --api https://your-api.example --json
```

## Create an account

Use this only when you want to create account resources. Replace the example email
and hostname, then run from any directory:

```sh
npx @doubleagent-so/cli create-account --email you@example.com --domain your-site.example
```

This calls the account API and prints issued credentials. It does not install the
SDK. Optional arguments include a hostname, account name, API origin and JSON output,
using `--domain`, `--name`, `--api` and `--json` respectively. The email is required.

Store credentials privately; JSON output can contain secret keys and login
information too. Account creation does not complete domain verification.

To create an account and install its public key in the website project:

```sh
npx @doubleagent-so/cli init --email you@example.com --domain your-site.example
```

To use an existing public key instead, replace the marked value:

```sh
npx @doubleagent-so/cli init --key pk_live_REPLACEWITHYOURPUBLICKEY
```

## Simulate website detection

Run a fresh browser with telemetry blocked by default:

```sh
npx @doubleagent-so/cli simulate --install-browser
npx @doubleagent-so/cli simulate https://your-site.example --scenario agent --pause 2200 --duration 20
```

Behavior mode uses real browser input on temporary test controls. It does not
supply an agent identity marker or submit the website's own forms. The report
contains full, behavior-only and installed SDK verdicts. No preset forces a class.
Use **observe** for no scripted task and **bot** for rapid repeated actions;
use **marker** evidence mode for a separate fingerprint-rule test.

The bundled helper uses the same implementation and needs Playwright installed
in your working project. See the [simulation guide](../skills/doubleagent/references/simulate.md)
for setup, all parameters, report interpretation and explicit dashboard opt-in.

```sh
node skills/doubleagent/scripts/simulate.mjs https://your-site.example --scenario agent --json
```

## Resolve ERC-8004 identities

Set an HTTPS Ethereum RPC and inspect a public registry token without a wallet:

```sh
export DOUBLEAGENT_ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
npx @doubleagent-so/cli agents resolve --agent-name erc8004.agent-1 --token-id 1 --json
```

The alias is a conventional string; it is not an authenticated browser identity.
Use `--site` to save an association through an authenticated, configured API, or
`--agent-name` and optional `--token-id` on a simulation to send a User-Agent
declaration. Add `--resolve-identity` for a local RPC snapshot, or `--report` to
record declarations with SDK visits. `--sign-requests --sign-api https://api.doubleagent.so`
can authenticate reported telemetry with a private key held only in the local
`DOUBLEAGENT_ETHEREUM_PRIVATE_KEY` environment variable. See
[ERC-8004 mapping](../skills/doubleagent/references/erc8004.md) for trust boundaries,
reputation selection and the bundled `agents.mjs` helper.

## Use the bundled helpers

The skill includes standalone copies of the snippet, verification and account
helpers. They use the same implementation as the CLI and need no dependency
installation. Run these alternatives from the root of a skills-repository checkout.

Generate a snippet:

```sh
node skills/doubleagent/scripts/snippet.mjs vite --json
```

Check a deployed URL:

```sh
node skills/doubleagent/scripts/verify.mjs https://your-site.example --json
```

Create an account when requested:

```sh
node skills/doubleagent/scripts/create-account.mjs --email you@example.com --domain your-site.example
```

For a skill installed by a coding agent, locate its `doubleagent/SKILL.md` first.
The helpers are in the adjacent `scripts/` directory. Their location depends on
which agent and installation scope you selected.

## Exit codes

| Command | `0` | `1` | `2` |
| --- | --- | --- | --- |
| `init` | Plan or installation completed, already installed, or platform advice supplied | Error or aborted interactive edit | Unsupported stack; inspect next steps |
| `snippet` | Instructions generated | Invalid arguments or unsupported stack ID | — |
| `verify` | HTML presence and key-format checks pass | Those checks fail or an error occurs | — |
| `create-account` | Account API call completed | Invalid input or API failure | — |
| `simulate` | Observation completed or fixture collected | Invalid input, browser failure, missing fixture or unconfirmed requested reporting | — |
| `agents` | Registry lookup or association operation completed | Invalid input, RPC or API failure | — |
| `verify-domain` | Domain verified | Domain not yet verified, invalid input or API failure | — |

The verifier can return success while API diagnostics report a problem. Always
inspect its full result before reporting that an installation works.

## Manage account access

Sign in from a terminal:

```sh
npx @doubleagent-so/cli login
```

The CLI starts a device approval flow and stores a local session. Then list sites:

```sh
npx @doubleagent-so/cli sites
```

To verify a domain, replace the hostname and site ID:

```sh
npx @doubleagent-so/cli verify-domain your-site.example --method dns --site st_REPLACEWITHYOURSITE
```

If proof is missing, the command prints the record to publish and returns exit
code `1`. Publish that record, then run the same command again. See
[Claim a domain](../skills/doubleagent/references/claim.md) for the other methods.

## Agent helpers

The `doubleagent-agents` skill ships four helpers for AI agents. Run them from the installed skill directory with
Node.js 20+. Each one prints its full options with `--help`.

```sh
node scripts/portal.mjs register --name <name> [--owner-email <email>] [--role viewer|admin] [--card-url <url>] [--mcp-url <url>] [--token-file <path>] [--json] [--print-secret]
node scripts/portal.mjs status [--name <name> | --token-file <path>] [--json]
node scripts/portal.mjs call <tool> [--args '<json object>'] [--name <name> | --token-file <path>] [--secret-file <path> [--force]] [--print-secret]
```

```sh
node scripts/proof.mjs hmac [--secret-file <start_verification answer file>] --nonce=<nonce>
node scripts/proof.mjs jws --key <private jwk> --proof-id <apf_…> --nonce=<nonce> [--aud https://app.doubleagent.so] [--lifetime 300]
node scripts/proof.mjs ed25519 --key <private Ed25519 jwk> --proof-id <apf_…> --nonce=<nonce>
node scripts/proof.mjs mcp-record --key <private Ed25519 jwk>
```

```sh
node scripts/card.mjs keygen --alg ES256|EdDSA --kid <kid> --out <dir>
node scripts/card.mjs sign <card.json> --key <private jwk> --jku <https URL of your jwks.json> [--card-url <url>] [--out <file> [--force]]
node scripts/card.mjs check <card URL or https origin> [--api <origin>] [--json]
```

```sh
node scripts/observe.mjs create --name <name> --env test|live [--account acc_…] (--write <env file> [--force] | --print-secret) [--json]
node scripts/observe.mjs status <agt_…> [--json]
node scripts/observe.mjs test-event <src_…>
```

Replace each `<…>` value. `proof.mjs hmac` reads the proof secret from the `start_verification` answer file that
`portal.mjs call --secret-file` wrote, else from `DOUBLEAGENT_PROOF_SECRET`; never pass a secret as a command-line
value. `card.mjs sign` refuses a `jku` that is not on the origin serving the card. `--force` replaces an existing
output file. `portal.mjs register` and `observe.mjs create` create accounts or resources and write secrets to 0600 or
git-ignored files.

| Exit code | Meaning |
| --- | --- |
| `0` | Done |
| `1` | Failed (`card.mjs check`: problems found) |
| `2` | Usage error |
| `3` | Waiting for approval (`portal.mjs`) |
| `4` | Declined, expired or revoked (`portal.mjs`) |
