# Install Double Agent on Shopify

Add the Double Agent snippet to your shared Shopify theme. The SDK detects Shopify
and adds classification attributes to the cart. This setup is keyless; it needs
no app installation or checkout pixel.

## Before you start

You need permission to edit and publish the storefront theme. Check whether the
theme or an existing integration already loads Double Agent so each page has one
SDK installation.

## Add the snippet

Open the theme's code editor and select `layout/theme.liquid`. Insert both tags
inside the head, before other scripts. Keep the queue stub first:

<!-- snippet:shopify -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Save the file. If you edited an unpublished theme, publish it when you are ready
to use the integration on the live storefront. Keep Shopify's required template
content in place. Recheck the snippet when you switch to a different theme.

## What gets added to the cart

The SDK loads [Shopify's Customer Privacy API](https://shopify.dev/docs/api/customer-privacy)
and waits for permission before reporting or tagging in the default analytics mode.
If the API is unavailable, these operations remain paused; the local verdict is
still available.

When a cart exists and consent permits, the SDK uses Shopify's Cart API to write
classification attributes. It also watches for carts created later on the same
page, including AJAX cart drawers. You do not need a separate cart-update script.

| Attribute | Meaning |
| --- | --- |
| `_da_class` | The visitor classification: human, bot or agent |
| `_da_score` | The non-human score, stored as a string from 0 to 100 |
| `_da_agent` | The detected agent family, or `none` |
| `_da_sid` | The Double Agent session ID |

These are cart attributes. They do not create Shopify order tags by themselves.
See [Shopify's Cart API](https://shopify.dev/docs/api/ajax/reference/cart#post-locale-cart-update-js)
for the cart-attribute mechanism.

## Check the installation

1. Open the published storefront and follow [Verify a published installation](verify.md).
2. Use the store's consent controls, then add an item to the cart. If the theme uses
   an AJAX cart drawer, keep the page open to check tagging without a reload.
3. In the browser's Network panel, inspect the cart update request for the attributes
   above. A read of the cart can confirm the stored values.

For a developer check, run this read-only example in the storefront browser console:

```js
fetch(window.Shopify.routes.root + 'cart.js')
  .then((response) => response.json())
  .then((cart) => console.table(cart.attributes));
```

Allow a moment for the cart update to finish. If attributes are missing, check SDK
loading, Shopify's privacy API, consent and the cart update response. Cart attributes
are client-controlled context; they are not proof of authorization. Tagging is
asynchronous, so a visitor who leaves immediately can interrupt an update.

To view collected data in HQ, [claim the domain](claim.md). A separate checkout
integration is only needed if you want reporting from checkout itself.
