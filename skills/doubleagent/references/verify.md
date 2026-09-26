# Verify a published installation

Use this guide after adding Double Agent to a website. Start with the published
site in a browser; terminal commands are optional developer tools.

## Check the live site

1. Open the published URL in a normal browser tab, outside the platform's editor.
   Reload after deploying or saving the integration.
2. Use the site's normal consent controls, then interact with the page and navigate
   to another page. Double Agent does not add a visible widget, so the page's
   appearance is not an installation check.
3. If the domain is already connected to your Double Agent account, open the site
   in [HQ](https://app.doubleagent.so) and check for the visit after processing.
   A keyless installation can collect without an account, but viewing its data
   requires [claiming and verifying the domain](claim.md).

If you need to check execution directly, ask the site's developer to inspect the
browser **Network** panel while reloading. For the standard CDN installation,
`doubleagent.js` should load successfully from `cdn.doubleagent.so`. When reporting
is permitted, look for collection requests to `api.doubleagent.so/v1/collect`.
Inspect failed requests and console errors rather than assuming missing dashboard
data means the snippet itself is absent.

Consent, request blocking, deployment caches and duplicate installations can all
affect what you observe. A script download confirms loading; a successful collection
response confirms that request. Neither proves classification accuracy or that
every platform surface is covered.

## Optional developer check

With Node.js and npm installed, run this from a terminal on your computer:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

Replace `https://your-site.example` with the published URL. Do not paste this command
into Wix, Squarespace or Webflow's custom-code field. No clone of this repository
is needed to use the CLI.

The verifier reads returned HTML and requests an API install check. It does not
launch a browser. Exit `0` means the HTML contains the expected SDK, queue stub and
keyless/public-key format; inspect `installCheck` for API problems separately.
Client-side or consent-gated injection may require browser verification even when
the HTML check cannot find the tag.

## Installation and domain ownership are separate

Domain verification establishes access to a site's account data. It does not
replace a runtime installation check. Likewise, finding a script in HTML does not
prove ownership of the domain or that analytics integrations receive the intended
properties.

If a visitor's classification appears incorrect, capture the session ID, time,
model version and reason codes, along with the actual interaction sequence. Keep
private session exports and credentials out of public support requests.
