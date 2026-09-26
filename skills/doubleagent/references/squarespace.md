# Install Double Agent on Squarespace

Use site-wide header injection to add the keyless Double Agent snippet. You do not
need a Double Agent account for the initial installation.

## Before you start

Your Squarespace plan must support **Code Injection**. Squarespace currently lists
Core, Plus, Advanced and some legacy plans; check the feature in your account.
Checkout pages do not support injected code, so this installation does not establish
coverage of checkout. [Squarespace code-injection documentation](https://support.squarespace.com/hc/en-us/articles/205815908-Customize-parts-of-your-site-with-code-injection).

## Add the snippet

1. Open the site's **Code Injection** panel. Use Squarespace's settings search if
   the panel is not visible in your current navigation.
2. Paste both tags below into the site-wide **Header** field.
3. Select **Save**, then open your live website.

<!-- snippet:squarespace -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Keep the tags together and in order. Page-specific header injection covers only
that page; use the site-wide field for this installation.

## Check the installation

Follow [Verify a published installation](verify.md) on the live site, outside the
editing interface. Check a normal content page and a second page reached through
navigation. The verification guide explains the expected requests and reporting results.

If data is missing, inspect the site's consent settings and check that a second
copy of the snippet was not added through another integration. To see collected
data in HQ, [claim and verify the domain](claim.md).
