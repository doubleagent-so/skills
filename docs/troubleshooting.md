# Troubleshooting

[Documentation home](../README.md) · [Command reference](command-reference.md)

Find the symptom below, check the likely cause and repeat the affected verification
step. When requesting help, include the platform, command and redacted error output.

## The coding agent cannot find the skill

From the project where you installed the skill, list the installed skills:

```sh
npx skills list
```

Check that the installer selected your coding agent and intended project or user
scope. Reload the project or start a new agent session if your agent requires it.
Ask the agent to use the skill named `doubleagent`.

If installation failed because GitHub requested authentication, use an account
with access to the repository. See the [skills CLI documentation](https://github.com/vercel-labs/skills)
for authentication and installation scopes.

## The CLI does not recognize the project

From the website root, where its framework configuration and entry files live,
preview the installation:

```sh
npx @doubleagent-so/cli init --dry-run
```

In a monorepo, point the CLI at the website package. Replace `/path/to/site`:

```sh
npx @doubleagent-so/cli init --cwd /path/to/site --dry-run
```

Check the reported stack before applying changes. For an unsupported or unusual
layout, use the [platform guide](../README.md#supported-platforms) to make the
manual edit. Framework guidance does not imply every directory layout can be
edited automatically.

## The script or queue stub is missing

1. Confirm that the deployed files include both snippet tags in the intended order.
2. Check whether a cache, consent manager, tag manager or optimization plugin delays
   or changes the scripts.
3. Open the published page in a browser and follow the
   [runtime checks](../skills/doubleagent/references/verify.md#check-loading-and-collection).

A script added after page load may be absent from the returned HTML. An HTML-only
failure therefore needs a browser check. For framework placement, use the
[Next.js guide](../skills/doubleagent/references/nextjs.md) or the matching platform guide.

## The browser blocks the SDK or collection request

Inspect the browser **Console** and **Network** panels for the failed URL and
error. The standard installation loads its SDK from the CDN and sends collection
requests to the API.

| Request | Origin | Relevant CSP directive |
| --- | --- | --- |
| SDK script | `https://cdn.doubleagent.so` | `script-src`, or `script-src-elem` when set |
| Collection | `https://api.doubleagent.so` | `connect-src` |

Add the needed origins to your existing Content Security Policy (CSP). Authorize
the inline queue stub through the site's nonce or hash mechanism. A framework or
proxy may require additional policy configuration; retain the rest of the site's
policy. Also check privacy extensions, network filtering and consent settings.

## Verification passes but data is missing

The verifier checks HTML presence and key format. Read `status`, `problems` and
`installCheck` even when its exit code is zero.

1. Follow the [browser checks](../skills/doubleagent/references/verify.md) to inspect
   loading and collection requests.
2. Confirm that consent permits reporting and the SDK loads once.
3. In HQ, check the site, date range and live/test environment.
4. If the installation is keyless, [claim and verify the domain](../skills/doubleagent/references/claim.md)
   before trying to view its data in your account.

If the API check fails or no collection request arrives, retain that failure in
the report and investigate it. HTML success does not resolve a reporting failure.

## A token method reports key_required

The standard keyless snippet can classify visits. Signed-token methods need the
site's public key and a verified origin. Follow the
[claiming guide](../skills/doubleagent/references/claim.md), configure that key and
check the [capability matrix](https://doubleagent.so/docs/capabilities/).

If a secret key was placed in client code, remove it and rotate or revoke it.
See [Security](../SECURITY.md).

## A hosted platform does not show the integration

Check the published domain, the site-wide header setting and the platform's custom
code requirements. Editor previews can behave differently from published pages.

For Shopify, confirm the snippet is in the published theme and a cart exists.
Check its attributes after visiting the cart page with consent granted. Follow the
[Shopify guide](../skills/doubleagent/references/shopify.md).

## A domain is not verified yet

Publish the exact proof shown in HQ or by the CLI, then repeat the check. Confirm
that it is on the hostname being verified. DNS changes may take time to become
visible; HTML and file proofs must be accessible on the published site.

See [Claim a domain](../skills/doubleagent/references/claim.md) for complete examples
and the distinction between DNS, meta, file and script methods.

## A human, bot or agent is classified incorrectly

Record the session ID, time and timezone, SDK/model version, verdict and reason
codes if available. Describe the interaction sequence and the evidence for the
expected classification. State whether the result came from the SDK, Labs or HQ.
Installation verification does not evaluate classification accuracy.

Send a minimal reproduction through the [issue form](https://github.com/doubleagent-so/skills/issues/new/choose),
or contact [support@doubleagent.so](mailto:support@doubleagent.so) for private session
evidence. Maintainers can route detector issues to the product repository. Remove
cookies, tokens, personal input and private session exports from issue attachments.
