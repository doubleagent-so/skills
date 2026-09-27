# Install Double Agent in an AI-generated app

Use the generated project's framework to choose the integration. Builder names
are hints; inspect the files and dependencies before making changes.

## Identify the entry point

| Project | What to check | Guide |
| --- | --- | --- |
| Lovable or Bolt | A Vite dependency and root `index.html`; use the Next.js route if the project uses Next.js | [Vite](vite-react.md) or [Next.js](nextjs.md) |
| v0 | Next.js dependencies and an App Router or Pages Router directory | [Next.js](nextjs.md) |
| Emergent | The frontend package's framework and HTML entry; it may live under `frontend/` | [Vite](vite-react.md) or [HTML](html.md) |
| Another builder | Framework dependencies, build configuration and shared layout | [Framework runbook](../SKILL.md#1-detect-the-stack) |

## With project access

From the website package, preview the integration:

```sh
npx @doubleagent-so/cli init --dry-run
```

Review the detected framework and diff, then apply the installation:

```sh
npx @doubleagent-so/cli init
```

For a monorepo, use the frontend package directory. If the CLI cannot edit the
layout, follow the matching framework guide manually.

## With builder chat access

For a confirmed Vite or HTML project, give the builder this instruction:

```text
Add the two Double Agent tags below to the site's shared HTML head, before other
scripts. Keep them in order, preserve async on the SDK tag, and avoid duplicates.
Show which file you changed. Use a keyless installation and do not create an account.
```

Then supply the snippet:

<!-- snippet:vite -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

For Next.js or another framework, supply that framework's guide instead of asking
for an HTML entry file that may not exist.

## Check the installation

Publish the app and follow [Verify a published installation](verify.md). Check the
published builder URL first, then repeat on the custom domain when you connect it.
An editor preview does not establish that the production site has the change.
