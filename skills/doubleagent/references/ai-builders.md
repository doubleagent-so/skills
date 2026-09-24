# AI app builders (Lovable, Bolt, v0, Emergent)

These builders generate ordinary projects. Make the normal edit for the stack underneath:

| Builder | Stack | File |
|---|---|---|
| Lovable | Vite + React | `index.html` |
| Bolt (bolt.new) | Vite (usually) | `index.html` (check for `next` in package.json → [nextjs.md](nextjs.md)) |
| v0 | Next.js app router | `app/layout.tsx`: [nextjs.md](nextjs.md) |
| Emergent | React frontend | `frontend/public/index.html` (or `frontend/index.html` with Vite) |

<!-- snippet:vite -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

## Notes
- **With repo or file access:** edit the file directly, or run `npx @doubleagent-so/cli init --yes --json`, which detects `lovable-tagger`, `.bolt/` and v0 automatically.
- **Chat only:** ask the builder: "Add these two script tags to the `<head>` of index.html, before any other script, exactly as written", and paste the snippet.
- **Verify** on the published URL (`*.lovable.app`, `*.vercel.app`, and so on). For a custom domain, verify that domain too.
