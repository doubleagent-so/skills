# Claim a domain

Verify domain ownership to view your site's data in HQ. A standard keyless
installation can collect before you create an account. Claiming links retained
data for that hostname to your account; retention and collection limits still
apply. It does not recover data that has already expired.

## Before you start

You need a Double Agent account and permission to manage the domain's DNS records
or published website. In [HQ](https://app.doubleagent.so/claim), select the site and
hostname you want to claim. Use the exact proof supplied for that site.

## Verify through HQ

1. Open [Claim your domain](https://app.doubleagent.so/claim) and enter the hostname.
2. Choose a verification method and publish the supplied proof.
3. Return to HQ and select **Check now**.

After verification succeeds, retained history may take time to appear while the
service links it to the account. Repeat the [installation checks](verify.md) if
new visits are still missing.

## Publish a proof

Choose one method. The examples below use `your-site.example` and
`REPLACE_WITH_VERIFICATION_TOKEN`; replace both with the values HQ provides.

### DNS record

Create a TXT record using the name and value supplied by HQ. Example record:

```text
Type: TXT
Name: _doubleagent.your-site.example
Value: da-verify=REPLACE_WITH_VERIFICATION_TOKEN
```

Some DNS providers append your domain to the name automatically. Follow your
provider's field format so the domain is not repeated. An apex DNS proof also
covers subdomains; the other methods verify the exact hostname.

### Meta tag

Add this tag to the published home page's head, with your verification token:

```html
<meta name="doubleagent-verification" content="REPLACE_WITH_VERIFICATION_TOKEN">
```

### Verification file

Serve a plain-text file at this path on the hostname you are verifying:

```text
/.well-known/doubleagent.txt
```

File contents:

```text
da-verify=REPLACE_WITH_VERIFICATION_TOKEN
```

Check that the public URL returns the file directly, without a sign-in page.

### SDK public key

For a site you have already installed, add its own public key to the existing
SDK tag. Replace the marked key; keep the queue stub before the tag:

```html
<script async src="https://cdn.doubleagent.so/v1/doubleagent.js" data-profile="auto" data-key="pk_live_REPLACEWITHYOURPUBLICKEY"></script>
```

Update the existing tag instead of adding another SDK installation. If another
site already holds a verified claim on the hostname, use DNS or file proof to
transfer it; meta and script proof cannot perform that transfer.

## Verify through the CLI

From a terminal, sign in:

```sh
npx @doubleagent-so/cli login
```

List your sites to find the intended site ID:

```sh
npx @doubleagent-so/cli sites
```

Replace the hostname and site ID, then check the DNS proof:

```sh
npx @doubleagent-so/cli verify-domain your-site.example --method dns --site st_REPLACEWITHYOURSITE
```

If the proof is missing, the command prints instructions and exits with `1`.
Publish the proof and run the same command again. A verified domain returns `0`.
For another method, replace the method value with `meta`, `file` or `script`.

Domain verification grants account access to the site's data. It does not prove
that the SDK executes, that consent permits reporting or that a verdict is correct.
Keep secret keys out of the website and shared command output.
