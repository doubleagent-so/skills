# WordPress

## Classic theme (`header.php` exists)

- Put the lines inside `<head>`, before `<?php wp_head(); ?>`.
- Use a **child theme** so theme updates don't remove the lines.

<!-- snippet:wordpress -->
```html
<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>
```

## Block theme (no `header.php`), or you'd rather not touch theme files
- Use a header-code plugin, such as **WPCode** or "Insert Headers and Footers". Paste the same two lines into **Header**.
- Or, in a child theme's `functions.php`:

```php
add_action('wp_head', function () {
  echo '<script>window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};</script>';
  echo '<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto"></script>';
}, 1);
```

## Notes
- **Caching and optimisation plugins** (WP Rocket, Autoptimize, LiteSpeed): exclude `cdn.doubleagent.so` from "delay/defer JavaScript" and don't combine the inline stub.
- **WooCommerce:** checkout and payment are detected automatically (PCI-lite mode on card fields).
