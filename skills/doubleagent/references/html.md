# Install Double Agent on an HTML site

Add the standard keyless snippet to your shared page head. You need permission to
edit and deploy the site's HTML; no Double Agent account is required.

## Add the snippet

Open the template that supplies the head for every page. If the site has no shared
template, update each HTML page. Insert both tags inside the head, before other
scripts, keeping the queue stub first:

<!-- snippet:html -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Keep `async` on the SDK tag. For a static-site generator, use its shared base
layout rather than editing generated output that the next build will overwrite.

## Check the installation

Deploy the site and follow [Verify a published installation](verify.md). Check the
home page and a second page that uses a different layout, if the site has one.

If a Content Security Policy blocks the script or the inline stub, ask the site's
developer to add the required origins and authorize the stub with a nonce or hash.
See [verification troubleshooting](verify.md#if-a-check-fails).
To view collected data in HQ, [claim the domain](claim.md).
