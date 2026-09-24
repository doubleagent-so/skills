# Claiming a domain (optional)

Keyless data is stored under the hostname. Nobody can see it until a domain is verified. When it is, everything collected since install (the last 30 days) moves into the account.

1. **Get an account**, only if the human asks: `node scripts/create-account.mjs --email you@example.com --domain your-site.example`, or https://app.doubleagent.so/claim?domain=your-site.example
2. **Publish the verification token**, using one of these methods:
   - DNS TXT record: `_doubleagent.<host>` = `da-verify=<token>`. An apex record also covers subdomains.
   - Meta tag: `<meta name="doubleagent-verification" content="<token>">` on the home page.
   - File: `https://<host>/.well-known/doubleagent.txt` containing `da-verify=<token>`.
   - Script: the site's own `pk_…` key in the tag's `data-key`.
3. **Check:** run `npx @doubleagent-so/cli login`, then `npx @doubleagent-so/cli verify-domain <host> --method dns|meta|file|script`. Or press **Check now** in the portal.

Never put the `sk_…` key in a page, a repo or a chat log.
