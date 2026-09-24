# Wix

Needs a Premium plan and a connected domain.

1. Open the Dashboard → **Settings** → **Custom code** (under Advanced) → **+ Add Custom Code**.
2. Paste the snippet below. Choose **All pages**, **Load code once** and **Place code in: Head**, then Apply.
3. Publish the site.

<!-- snippet:wix -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Verify: `node scripts/verify.mjs https://<your-domain>`. Wix injects custom code server-side, so verify can see it.
