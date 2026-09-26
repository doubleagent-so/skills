# Shopify

**Do not edit `theme.liquid`.** Use the app instead: it survives theme updates, respects Shopify customer privacy, and covers checkout through a web pixel.

1. Install the **Double Agent** Shopify app.
2. Go to Online Store → Themes → **Customize** → **App embeds** (left sidebar) → enable **Double Agent** → Save.
3. Settings → Customer events: make sure the **Double Agent** pixel is connected.
4. A public key is optional. The embed works keyless and has a key field for claimed stores.

What you get:
- `integrations: 'auto'` includes the Shopify adapter. It writes cart attributes `_da_class`, `_da_score`, `_da_agent` and `_da_sid`, which end up on the order.
- Verdicts are published to customer events as `da_classified` / `da_final`.

## Check the installation

Follow [Verify a published installation](verify.md) on the storefront, outside the
theme editor. Check the app embed and customer-events pixel separately; a storefront
script check alone does not verify checkout coverage. No terminal is required for
the browser checks. To access data in HQ, [claim and verify the domain](claim.md).
