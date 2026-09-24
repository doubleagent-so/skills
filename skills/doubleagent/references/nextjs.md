# Next.js

## App router (`app/layout.tsx` or `src/app/layout.tsx`)

- Add `import Script from 'next/script';` unless the file already imports it; if it's imported under another name, use that name.
- Put the two `<Script>` elements right after `<head>`. If the layout has no `<head>`, put them first inside `<body>`. `beforeInteractive` scripts are hoisted into `<head>` either way.

<!-- snippet:next-app -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

## Pages router (`pages/_document.tsx`)

- Put the same two elements inside `<Head>` from `next/document`, and add the same import.
- If there is no `_document`, create one with `Html`, `Head`, `Main` and `NextScript`.
- `beforeInteractive` only works in `_document` for the pages router.

<!-- snippet:next-pages -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

## Notes
- Don't use `@doubleagent-so/js` from npm in the same app as the tag. Use one or the other.
- **v0:** projects are Next.js app router projects, so the same edit applies.
- **Verify:** `node scripts/verify.mjs https://<deployed-url>`. The tag is serialised into `self.__next_s` in the HTML, and verify understands that form.
