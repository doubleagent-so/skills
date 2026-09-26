# Troubleshooting

[Documentation home](../README.md) · [Command reference](command-reference.md)

Start by recording the framework, Node.js version, command and exact error. Share
redacted output when requesting help. Installation failures and detection errors
need different evidence: the verifier checks integration structure, not accuracy.

## The coding agent cannot find the skill

Confirm that the skills installer selected the coding agent you are using and the
intended project or user scope. Check its installed skill list with `npx skills list`.
If required by your agent, reload the project or start a new agent session.

The skill is named `doubleagent`. Ask explicitly to use it. The installation
mechanism is maintained by the [skills CLI project](https://github.com/vercel-labs/skills).

## The CLI does not recognize the project

Run `init --dry-run` from the website root, where its framework configuration and
entry files live. In a monorepo, use `--cwd` for the website package. Check the
reported stack before applying the diff.

If it returns unsupported-stack advice, follow the relevant
[platform guide](../README.md#supported-platforms). A custom repository layout can
require a manual edit even when the framework itself is documented.

## The script or queue stub is missing

Inspect the HTML returned by the deployed URL, not only the source template. Check
that the stub precedes the SDK tag and that the deployment includes your change.
Look for a cache, tag manager, optimization plugin or platform setting that may
delay, remove or duplicate the scripts.

Use the [Next.js guide](../skills/doubleagent/references/nextjs.md) for `next/script`
placement. A script injected only after hydration may not be visible to the HTML
verifier; confirm its execution in a real browser as well.

## The browser blocks the SDK or collection request

Check the browser console and Network panel for CSP errors, request blocking or
failed responses. The standard installation loads from `https://cdn.doubleagent.so`
and reports to `https://api.doubleagent.so`.

For a restrictive Content Security Policy, allow the required script and connection
origins within your existing policy. Authorize the inline queue stub with the site's
nonce or hash mechanism. Do not broadly disable the policy to resolve an install error.
Also check privacy extensions and the site's consent state.

## Verification passes but data is missing

The verifier's exit status checks that the returned HTML contains the SDK, stub and
a valid key format or keyless setup. Read `installCheck` and its reported problems
separately. A successful HTML check does not establish successful runtime reporting.

Visit the published site in a browser and inspect collection requests. Confirm that
consent permits reporting, the intended SDK is loaded once, and you are looking at
the correct site and data environment in HQ. Keyless data requires a verified
domain before it can be accessed in an account.

An unavailable API install check or a missing last-beacon timestamp needs follow-up;
do not substitute demonstration data to make the installation appear successful.

## The site is keyless or a token method reports `key_required`

Keyless is the default, valid installation. Signed-token methods require a public
key and a verified site origin. Follow the
[claiming guide](../skills/doubleagent/references/claim.md), add the site's public
key, and check the [capability matrix](https://doubleagent.so/docs/capabilities/).

If a secret key was placed in client code, remove and rotate it. See
[Security](../SECURITY.md) for the private reporting channel.

## A hosted platform does not show the integration

Check the published domain and all-pages/header settings. Editor previews and
production pages can behave differently. Confirm the platform plan allows custom
code. For Shopify, use the app embed and customer-events setup described in its
[guide](../skills/doubleagent/references/shopify.md), rather than a second theme edit.

## A human, bot or agent is classified incorrectly

Installation verification cannot determine whether a verdict is correct. Record
the session ID, observation time and timezone, SDK/model version, verdict and
reason codes if available. Describe the actual interaction sequence and what
independently establishes the expected class. Note whether the result came from
the SDK, Labs or HQ.

File a [detection issue](https://github.com/doubleagent-so/doubleagent/issues) with a
minimal reproduction, or contact support privately for sensitive session evidence.
Do not publish cookies, tokens, personal input contents or unredacted session exports.
