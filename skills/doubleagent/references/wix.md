# Install Double Agent on Wix

Add Double Agent through Wix's site-wide Custom Code settings. The default
installation is keyless: you can start without creating a Double Agent account.

## Before you start

You need a published Wix site, a connected domain and permission to manage its
Custom Code settings. See [Wix's custom-code guide](https://support.wix.com/en/article/embedding-custom-code-on-your-site)
if the setting is unavailable.

## Add the snippet

1. In your Wix site dashboard, open **Settings → Custom Code** under
   **Development & integrations**.
2. Select **+ Add Custom Code**, paste both script tags below and name the entry
   **Double Agent**.
3. Set **Add Code to Pages** to **All pages**, with **Load code once**.
4. Set **Place Code in** to **Head**, then select **Apply**.
5. Open the published site on its connected domain to check the installation.

<!-- snippet:wix -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Keep the two tags together and in this order. Use the site-wide Custom Code setting,
not an HTML embed element inside a page.

## Check the installation

Follow [Verify a published installation](verify.md). No terminal or repository
checkout is required for the browser checks. Double Agent does not add a visible
widget to your page.

Test the published site, including navigation to another page. Wix custom code runs
in the browser and does not run in the editor; Wix recommends checking the live
site with browser developer tools. A raw-HTML check alone cannot establish that
the SDK executed. [Wix verification guidance](https://dev.wix.com/docs/develop-websites-sdk/code-your-site/build-a-custom-frontend/custom-code/about-custom-code#verify-your-custom-code).

## Analytics and account access

Configure Google Analytics, Google Tag Manager and advertising pixels through
Wix's marketing integrations, as [Wix instructs](https://support.wix.com/en/article/embedding-custom-code-on-your-site).
Check integration tagging on the published site; adding this snippet does not
configure those services for you.

To access your site's data in HQ, [claim and verify the domain](claim.md).
If you change the primary Wix domain, recheck the custom-code entry: Wix associates
snippets with the domain.
