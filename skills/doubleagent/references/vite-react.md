# Vite (React, Vue, Svelte, Solid)

- Edit `index.html` at the project root. It is the HTML entry, not the one under `public/`.
- Put the lines inside `<head>`, before `<script type="module" src="/src/main.tsx">` and any other script.

<!-- snippet:vite -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

## Notes
- **Create React App:** edit `public/index.html` in the same way.
- **SPAs:** install the SDK once in the HTML entry; do not inject another copy on
  each route. The SDK observes route changes and uses `sessionStorage` for the tab session.
- **Lovable, Bolt:** these are Vite projects. See [ai-builders.md](ai-builders.md).
- **Verify:** follow [the published-site checks](verify.md), including navigation
  to a second route after the initial load.
