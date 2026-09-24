# Squarespace

Needs a Core, Plus, Advanced, Business or Commerce plan (code injection isn't available on Personal).

1. Go to **Settings** → **Developer tools** → **Code injection**. On older sites it's Settings → Advanced → Code Injection.
2. Paste the snippet below into **Header**, then Save.

<!-- snippet:squarespace -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Verify: `node scripts/verify.mjs https://<your-domain>`.
