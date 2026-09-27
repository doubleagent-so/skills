---
name: doubleagent
description: Install, verify and simulate Double Agent bot and agent detection on a website. Use when asked to add the browser SDK, configure analytics tagging, check an installation, reproduce human/bot/agent classification with controlled website simulations, or map conventional agent names to ERC-8004 registry identities. Covers Next.js, Vite, static HTML, Astro, Nuxt, SvelteKit, Remix, WordPress, Shopify, Wix, Squarespace, Webflow and AI-generated projects.
license: MIT
---

# Install and test Double Agent

For SDK installation, preview the change from the website project:

```sh
npx @doubleagent-so/cli init --dry-run
```

After reviewing the plan, apply an authorized installation:

```sh
npx @doubleagent-so/cli init --yes --json
```

To install this skill itself, run from the project:

```sh
npx skills add doubleagent-so/skills
```

## Simulate traffic

Follow [website simulation](references/simulate.md) without installing an SDK or creating an account. Keep reporting off unless requested.
With Node 20+, Playwright and Chromium installed, use the bundled helper:

```sh
node scripts/simulate.mjs https://your-site.example --scenario agent --pause 2200 --json
```

`scripts/simulation-probe.js` is its browser asset; keep both files together. For registry lookup use `scripts/agents.mjs` and [ERC-8004 identity mapping](references/erc8004.md); registration alone never verifies a visit. The same guide covers User-Agent declarations and Ethereum-signed telemetry. Keep signing keys in the local process environment; never pass them into a website.

## Integration rules

- Use the standard keyless snippet unless the user supplies a public key. Check
  whether `DOUBLEAGENT_KEY` is set before relying on the CLI's keyless default.
- Do not create an account unless the user asks. See [account access](#account-access).
- Never put an `sk_` secret key in client code, HTML, a repository or shared output.
- Install once per page through the shared head or framework layout. Keep the queue
  stub before the SDK, preserve loading attributes and use the official CDN.
- Report files changed, verification results and any step not completed. Link to
  [claiming](references/claim.md) for HQ access; retained history is subject to limits.

## 1. Detect the stack

Inspect the actual files and dependencies. In a monorepo, work in the website package.

| Evidence | Integration |
| --- | --- |
| `layout/theme.liquid` | Shared theme head: [Shopify](references/shopify.md) |
| Classic or block WordPress theme | Header plugin or child theme: [WordPress](references/wordpress.md) |
| Next.js with a root app layout | [Next.js App Router](references/nextjs.md#app-router) |
| Next.js with a pages directory | [Next.js Pages Router](references/nextjs.md#pages-router) |
| Nuxt dependency or configuration | [Nuxt](#nuxt) |
| SvelteKit dependency | Shared HTML template: [HTML snippet](#html-vite-and-sveltekit) |
| Astro dependency or configuration | [Astro](#astro) |
| Remix or React Router with `app/root.*` | [Remix](#remix) |
| Vite with root `index.html` | [Vite](references/vite-react.md) |
| Static HTML or shared HTML layout | [HTML](references/html.md) |
| Hosted platform settings | [Wix](references/wix.md), [Squarespace](references/squarespace.md), [Webflow](references/webflow.md) |
| Generated project | Inspect the framework: [AI builders](references/ai-builders.md) |

To generate exact snippet instructions, run from the installed skill directory
containing this file. Replace `vite` with the detected stack ID:

```sh
node scripts/snippet.mjs vite --json
```

The helper accepts `html`, `vite`, `next-app`, `next-pages`, `astro`, `nuxt`,
`sveltekit`, `remix`, `wordpress`, `shopify`, `wix`, `squarespace` and `webflow`.

## 2. Make the edit

### HTML, Vite and SvelteKit

Insert both tags inside the head, before other scripts. Use Vite's root
`index.html`, SvelteKit's `src/app.html` before its head placeholder, or the static
site's shared layout. The platform guides cover WordPress and Shopify placement.

<!-- snippet:html -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

### Next.js

In the App Router root layout, add the import if it is not already present:

```tsx
import Script from 'next/script';
```

Insert the elements inside the head, or first inside the body if there is no head.
Reuse the existing import name. For the Pages Router, use the [Next.js guide](references/nextjs.md).

<!-- snippet:next-app -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

### Astro

In each shared layout that supplies a head, insert the tags before other scripts.
Keep the inline directive so Astro preserves the snippet:

<!-- snippet:astro -->
```astro
<script is:inline>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script is:inline async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

### Nuxt

In `nuxt.config.ts`, insert this property fragment into the existing configuration
object. Merge its script entries into an existing app/head configuration:

<!-- snippet:nuxt -->
```ts
app: {
  head: {
    script: [
      { innerHTML: "window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};" },
      { src: 'https://cdn.doubleagent.so/v1/doubleagent.js', async: true, 'data-profile': 'auto' },
    ],
  },
},
```

### Remix

In `app/root.tsx`, insert these elements inside the head, before other scripts:

<!-- snippet:remix -->
```tsx
<script dangerouslySetInnerHTML={{ __html: "window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};" }} />
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto" />
```

## 3. Check integrations

Automatic integration detection is enabled by default. It uses supported analytics
and marketing SDKs already present on the page; it does not install those services.
Fields include `da_class`, `da_agent`, `da_score`, `da_bucket`, `da_rec` and `da_verified`.
Supported ad-conversion hooks suppress bot conversions by default. Confirm the
site's configuration and consent behavior before reporting that tagging works.

For Shopify, the standard snippet writes cart attributes when a cart exists and
consent permits. Follow the [cart verification steps](references/shopify.md#check-the-installation).

## 4. Verify

Follow [Verify a published installation](references/verify.md), including browser
execution and collection. Hosted-platform users do not need a terminal for that path.

For an additional HTML check, replace the example URL and run from any directory:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

Or use the bundled helper from the installed skill directory:

```sh
node scripts/verify.mjs https://your-site.example --json
```

For direct API diagnostics, use the published URL in this request:

```sh
curl -s "https://api.doubleagent.so/v1/install-check?url=https://your-site.example"
```

Inspect the complete result. Exit `0` checks HTML presence and key format; it does
not prove browser execution, successful reporting or classification accuracy.
For local-only sites, use browser checks and report remote verification as incomplete.

## Account access

Only create an account when the user asks. From the installed skill directory:

```sh
node scripts/create-account.mjs --email you@example.com --domain your-site.example
```

Replace the example email and hostname. The command can print credentials once;
store them privately. Use public keys in browser configuration and keep secret keys
server-side. Follow [Claim a domain](references/claim.md) for HQ access, and the
[capability matrix](https://doubleagent.so/docs/capabilities/) for signed-token and
other feature requirements.
