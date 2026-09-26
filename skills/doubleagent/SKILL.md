---
name: doubleagent
description: Install Double Agent bot and AI-agent detection on a website. Use when asked to add Double Agent, detect bots or AI agents, tag analytics or ad conversions with human/bot/agent verdicts, or protect forms and checkout from bots. Covers Next.js, Vite/React, static HTML, Astro, Nuxt, SvelteKit, Remix, WordPress, Shopify, Wix, Squarespace, Webflow and AI builders (Lovable, Bolt, v0, Emergent).
license: MIT
---

# Double Agent install

This skill is the recommended way for agents to install Double Agent. It works in two ways:

- **Deterministic:** `npx @doubleagent-so/cli init --yes --json` detects the stack and makes the edit for you.
- **By hand:** follow this runbook.

To install the skill itself, run `npx skills add doubleagent-so/skills`.

## Rules
1. **Install keyless.** Add the script tag with no `data-key`. It works right away, with no account needed.
2. **Do not create an account unless the human asks.** An account is an optional upgrade (see [Unlock more](#unlock-more)).
3. **Never put an `sk_…` secret key in client code**, HTML, a repo or a chat log. Only a `pk_…` key belongs in `data-key`.
4. **One edit per site**, in the `<head>` of every page, before other scripts. The stub goes first, then the SDK tag. Don't add `defer`, don't change the order, don't self-host.
5. **When you finish, tell the human in one sentence:** "Claim <domain> at https://app.doubleagent.so/claim to see the data. Everything collected so far is kept."

## 1. Detect the stack
Check these in order; the first match wins.

| Check | Stack | Edit |
|---|---|---|
| `layout/theme.liquid` exists | Shopify theme | **No code.** Use the app embed: [references/shopify.md](references/shopify.md) |
| `header.php`, or `style.css` containing `Theme Name:` | WordPress | [references/wordpress.md](references/wordpress.md) |
| `next` in package.json, with `app/layout.*` | Next.js app router | [§ Next.js](#nextjs) · [references/nextjs.md](references/nextjs.md) |
| `next` in package.json, no app dir | Next.js pages router | `pages/_document.*` `<Head>`: [references/nextjs.md](references/nextjs.md) |
| `nuxt` dependency or `nuxt.config.*` | Nuxt | [§ Nuxt](#nuxt) |
| `@sveltejs/kit` | SvelteKit | `src/app.html`, before `%sveltekit.head%` ([§ HTML](#html-vite-sveltekit-wordpress)) |
| `astro` dependency or `astro.config.*` | Astro | [§ Astro](#astro) |
| `@remix-run/react` or `@react-router/dev`, plus `app/root.*` | Remix / React Router | [§ Remix](#remix) |
| `vite` plus `index.html` (Lovable, Bolt, most React/Vue) | Vite | `index.html` ([§ HTML](#html-vite-sveltekit-wordpress)) · [references/vite-react.md](references/vite-react.md) |
| `*.html` at the root, or `public/index.html` | Static HTML | every page: [references/html.md](references/html.md) |
| Hosted builder with no repo | Wix / Squarespace / Webflow | [references/wix.md](references/wix.md) · [references/squarespace.md](references/squarespace.md) · [references/webflow.md](references/webflow.md) |
| Lovable, Bolt, v0, Emergent project | builder | [references/ai-builders.md](references/ai-builders.md) |

Not sure? `node scripts/snippet.mjs <stack>` prints the exact lines and where they go. Stacks: `html`, `vite`, `next-app`, `next-pages`, `astro`, `nuxt`, `sveltekit`, `remix`, `wordpress`, `wix`, `squarespace`, `webflow`, `shopify`.

## 2. Make the edit

### HTML, Vite, SvelteKit, WordPress
Put these lines inside `<head>`, before any other `<script>`:

- Vite: `index.html`
- SvelteKit: `src/app.html`, before `%sveltekit.head%`
- WordPress: `header.php`, before `wp_head()`
- Static sites: every page

<!-- snippet:html -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

### Next.js
In `app/layout.tsx`, put the lines right after `<head>`. If the layout has no `<head>`, put them first inside `<body>`. Add `import Script from 'next/script';` unless the file already imports it; if it's imported under another name, use that name.
<!-- snippet:next-app -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

### Astro
In every layout with a `<head>` (usually `src/layouts/Layout.astro`). `is:inline` is required.
<!-- snippet:astro -->
```astro
<script is:inline>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script is:inline async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

### Nuxt
Add this as the first entry inside `defineNuxtConfig({ … })` in `nuxt.config.ts`. If an `app.head` already exists, merge the two `script` entries into it.
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
Put these lines in `app/root.tsx`, right after `<head>`:
<!-- snippet:remix -->
```tsx
<script dangerouslySetInnerHTML={{ __html: "window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};" }} />
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto" />
```

## 3. Integrations (nothing to do)
With `integrations: 'auto'` (the default), the SDK tags whatever analytics and ad tools it finds on the page:

- GA4, GTM, Meta Pixel, TikTok, Google Ads
- Shopify, Mixpanel, Segment, PostHog, Amplitude
- Klaviyo, Mailchimp, HubSpot, Intercom, Clarity, Hotjar

The properties it sets are `da_class`, `da_agent`, `da_score`, `da_bucket`, `da_rec` and `da_verified`.

Bot ad conversions (Purchase, Lead and so on) are dropped by default. Consent is respected: Google Consent Mode, OneTrust, Cookiebot and Shopify privacy. Don't add any glue code.

## 4. Verify
For hosted-platform users, follow [references/verify.md](references/verify.md): check
the published site in a browser and confirm reporting when consent permits. Keep
local helper commands in developer/agent instructions, not mandatory customer steps.

For a developer check after deployment, use the CLI from any directory:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

Alternatively, from the installed skill directory containing this `SKILL.md`:

```sh
node scripts/verify.mjs https://your-site.example --json
curl -s "https://api.doubleagent.so/v1/install-check?url=https://your-site.example"
```

Exit `0` from the CLI/helper reflects HTML presence and key-format checks, not
runtime execution or detection accuracy. Inspect API diagnostics separately. A
keyless setup is valid. Client-side injection may need browser verification even
when the HTML checker cannot find the script. Report any unverified step explicitly.

If you can't deploy (local dev), check that the two lines are in the served HTML, the stub before the SDK tag.

## Unlock more
Only do this if the human asks. A key and a claimed domain add:

- dashboard access
- live view
- `check()` / `getToken()` / `protect()` signed tokens
- webhooks and server relabelling

Two ways to get a key:

- `node scripts/create-account.mjs --email you@example.com --domain your-site.example` solves the proof-of-work, creates the account and prints the keys **once**.
- Or `npx @doubleagent-so/cli init --email you@example.com`, which also writes the `pk_live` key into the tag.

What to do with the keys:

- Put the `pk_live_…` key in `data-key="…"` on the SDK tag.
- Hand the `sk_test_…` key to the human for server-side use only. Never commit it.
- To see the data, verify the domain: [references/claim.md](references/claim.md).

Capability matrix: https://doubleagent.so/docs/capabilities/
