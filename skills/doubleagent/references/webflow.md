# Install Double Agent on Webflow

Add the keyless Double Agent snippet through site-wide head code. A Double Agent
account is optional for the initial installation.

## Before you start

You need access to **Custom code** through a paid Site plan or an eligible Workspace
plan. A paid Site plan is not the only way to enable custom code; eligible Workspace
plans can also support staging sites. Check [Webflow's plan guidance](https://help.webflow.com/hc/en-us/articles/33961218263059-Choose-a-Workspace-plan)
and the options available in your workspace.

## Add the snippet

1. Open **Site settings → Custom code → Head code**.
2. Paste both tags below, before other scripts you manage in that field, and select
   **Save changes**.
3. **Publish** to the domain you want to test. Saving custom code does not publish it.

<!-- snippet:webflow -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Use site-wide head code rather than adding another copy in each page's settings.
Keep the tags in order and retain `async` on the SDK tag.
[Webflow's custom-code instructions](https://help.webflow.com/hc/en-us/articles/33961357265299-Custom-code-in-head-and-body-tags)
explain site-wide placement and publishing.

## Check the installation

Follow [Verify a published installation](verify.md). Check the published staging
URL if that is your test environment, then repeat on the production domain when
you publish there. A working preview does not establish that the live site has
received the change.

These browser checks do not require a terminal or repository checkout. To access
site data in HQ, [claim and verify the relevant domain](claim.md).
