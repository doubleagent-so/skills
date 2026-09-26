# Install Double Agent on WordPress

Add the keyless snippet once through a site-wide header setting or a child theme.
You need permission to manage the relevant plugin or theme files and publish changes.

## Use a header-code plugin

If your site already uses a header-code plugin, paste both tags into its site-wide
head field and save. Check that the field accepts script tags and applies to all
intended pages:

<!-- snippet:wordpress -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

Use one installation method. A second copy in the theme or another plugin can
produce duplicate initialization.

## Use a child theme

For a classic theme with `header.php`, add the same tags inside the head, before
the WordPress head hook. Make the edit in a child theme so a parent-theme update
does not overwrite it.

For a block theme or a theme without a suitable header file, add this PHP fragment
to the child theme's `functions.php`, inside its existing PHP context:

```php
add_action('wp_head', function () {
  echo '<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>';
  echo '<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>';
}, 1);
```

Use the hook as an alternative to the plugin or header edit. See the
[WordPress head-hook reference](https://developer.wordpress.org/reference/hooks/wp_head/)
and [child-theme guide](https://developer.wordpress.org/themes/advanced-topics/child-themes/).

## Check the installation

Publish the change, clear the site's page cache and follow
[Verify a published installation](verify.md). If an optimization plugin delays or
combines scripts, preserve the stub's order and the SDK's loading behavior in its
exclusion settings.

For WooCommerce, check the storefront and checkout separately. Third-party payment
iframes do not expose their contents to the page's SDK; loading the SDK does not
establish payment-field coverage or compliance. To view data in HQ,
[claim the domain](claim.md).
