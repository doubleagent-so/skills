# Install Double Agent in a Vite app

Add the keyless snippet to the app's HTML entry point. This applies to Vite projects
using React, Vue, Svelte or Solid. You need access to the project and its deployment.

## Add the snippet

Open `index.html` at the project root. Insert both tags inside the head, before
the module script that loads the app:

<!-- snippet:vite -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

The Vite entry point is normally at the project root, not inside `public/`.
For an existing Create React App project, use `public/index.html` instead.

Install the SDK once in the HTML entry. The SDK observes route changes, so route
components do not need to inject another copy. It uses browser session storage
with an in-memory fallback when storage is unavailable.

## Check the installation

Build and deploy through your project's normal process. Follow
[Verify a published installation](verify.md), including navigation to a second
route after the first page loads.

For generated projects, inspect the actual framework before editing. See
[AI app builders](ai-builders.md). To view collected data in HQ,
[claim the domain](claim.md).
