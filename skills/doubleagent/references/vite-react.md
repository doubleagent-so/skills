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
- **SPAs:** the SDK handles route changes itself. It sends one beacon per page load, and verdicts carry over through `sessionStorage`.
- **Lovable, Bolt:** these are Vite projects. See [ai-builders.md](ai-builders.md).
