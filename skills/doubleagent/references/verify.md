# Verify a published installation

Check that the SDK loads on your published site and sends data when consent permits.
Start in a browser. Terminal commands provide an additional HTML check.

## Before you start

Deploy or save the integration, then use the published URL rather than a platform's
editor preview. Keep the site's consent controls in place. Double Agent does not
add a visible widget, so an unchanged page appearance is expected.

## Check the live site

1. Open the published URL in a normal browser tab and reload the page.
2. Use the site's consent controls, interact with the page and navigate to another page.
3. If the domain is already connected to your account, open the site in
   [HQ](https://app.doubleagent.so) and check for the visit after processing.

A keyless installation can collect without an account. Viewing that data in HQ
requires [claiming and verifying the domain](claim.md).

## Check loading and collection

Use browser developer tools, or ask the site's developer to perform these checks:

1. Open the **Network** panel, then reload the published page.
2. Find the SDK request. For the standard snippet, its URL is:

   ```text
   https://cdn.doubleagent.so/v1/doubleagent.js
   ```

3. Check that the request succeeds. Inspect the **Console** for errors that could
   prevent the script from running.
4. When reporting is permitted, find collection requests to the default API endpoint:

   ```text
   https://api.doubleagent.so/v1/collect
   ```

5. Inspect the response and any errors. If you use a configured collector endpoint,
   check that endpoint instead.

A successful SDK download establishes loading. An accepted collection response
establishes that request was accepted. Neither result proves classification
accuracy or coverage of every platform surface. Check integration-specific results,
such as Shopify cart attributes, in the relevant platform guide.

## Run an optional HTML check

With Node.js and npm installed, replace the example URL and run from a terminal
on your computer. No repository checkout is required:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

This command belongs in a terminal, not a platform's custom-code field. It reads
the returned HTML and requests API diagnostics; it does not launch a browser.

| Result | How to interpret it |
| --- | --- |
| `ok: true` | The SDK URL, queue stub and keyless/public-key format are present in the returned HTML |
| `status`, `problems` | The page's HTTP status and local diagnostics; inspect them even after exit `0` |
| `installCheck` | The API's response and reachability; inspect reported problems separately |
| Missing script | Check deployment and browser injection; consent-gated or client-injected scripts may be absent from fetched HTML |

## If a check fails

Review failed requests, console errors, consent state and duplicate installations.
A cache can also serve an older version of the page. If the problem persists,
contact [support@doubleagent.so](mailto:support@doubleagent.so) with the published
URL, failed check and redacted error output.

Domain ownership, runtime collection and classification accuracy require different
evidence. For an incorrect verdict, record the session ID, time, model version,
reason codes and interaction sequence. Keep private exports and credentials out
of issue attachments.
