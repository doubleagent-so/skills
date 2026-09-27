# Install Double Agent in Next.js

Use the Next.js Script component to load Double Agent across your application.
Choose the section for your router. The default setup is keyless and requires
access to the project and deployment.

## App Router

Open the root layout, `app/layout.tsx` or `src/app/layout.tsx`. Add this import if
the file does not already import the Script component:

```tsx
import Script from 'next/script';
```

Insert these elements inside the root layout's head. If it has no explicit head,
place them first inside the body. Reuse the local import name if it differs:

<!-- snippet:next-app -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

These are elements to insert into the existing layout, not a replacement layout.
Next.js hoists before-interactive scripts into the document head. See the
[App Router Script reference](https://nextjs.org/docs/app/api-reference/components/script#beforeinteractive).

## Pages Router

Open `pages/_document.tsx` or `src/pages/_document.tsx`. Add the Script import:

```tsx
import Script from 'next/script';
```

Insert the following elements inside the document's Head component:

<!-- snippet:next-pages -->
```tsx
<Script id="doubleagent-stub" strategy="beforeInteractive">
  {`window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};`}
</Script>
<Script src="https://cdn.doubleagent.so/v1/doubleagent.js" strategy="beforeInteractive" data-profile="auto" />
```

If the project has no custom document, create one following the
[Next.js custom Document guide](https://nextjs.org/docs/pages/building-your-application/routing/custom-document),
then insert the elements there. Keep the required Html, Head, Main and NextScript
components. Before-interactive scripts belong in the custom document for this router.
See the [Pages Router Script reference](https://nextjs.org/docs/pages/api-reference/components/script#beforeinteractive).

## Check the installation

Use one installation method: check for an existing CDN tag or npm SDK setup before
adding these elements. Deploy the app and follow [Verify a published installation](verify.md),
including a client-side route change.

For an additional HTML check, replace the URL and run from a terminal:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

Confirm browser execution as well as script presence. To view collected data in
HQ, [claim the domain](claim.md).
