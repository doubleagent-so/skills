# Webflow

Needs a paid site plan (custom code doesn't run on the free webflow.io staging plan).

1. Go to **Site settings** → **Custom code** → **Head code**.
2. Paste the snippet below, then Save.
3. **Publish** to your custom domain.

<!-- snippet:webflow -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Verify: `node scripts/verify.mjs https://<your-domain>`.
