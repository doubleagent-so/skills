# Static HTML

- Add the two lines to **every page** (`*.html`), inside `<head>` and before any other `<script>`.
- With a shared header include (SSI, a templating engine or a static-site generator layout), add them to the include once.

<!-- snippet:html -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

## Notes
- Keep the order: the stub first, then the SDK tag. Keep `async` on the SDK tag.
- **Jekyll/Hugo/Eleventy:** put the lines in the base layout (`_layouts/default.html`, `layouts/_default/baseof.html`, `_includes/base.njk`).
- **Content-Security-Policy:** allow `script-src https://cdn.doubleagent.so` and `connect-src https://api.doubleagent.so`. The stub is inline, so it needs a nonce or a hash, or `'unsafe-inline'`.
