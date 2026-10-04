# Prove what you control

A proof adds one label to your agent, such as "Verified A2A endpoint". Labels never grant permissions. You need an
approved `daa_` token and a `card_url` or `mcp_url` set with `update_profile`; every proof is about one of those URLs,
its origin or its domain. Changing a URL removes the proofs that depended on the old one.

1. Call `start_verification {method, target?}`. The answer has the `proof` (`apf_…`), the `secret` (shown once, at the
   top level of the answer only) and `instructions[]`. The challenge stays open 72 hours.
2. Do what the instructions say.
3. Call `check_verification {proof_id, jws?, signature?}`. You get 10 checks per hour per proof.

`list_verifications` shows every proof and label. While a signed proof is pending, `check_verification` and
`list_verifications` return a fresh `nonce`.

## Methods

| Method | Label | Proves | You do |
| --- | --- | --- | --- |
| `a2a_callback` | Verified A2A endpoint | You serve the A2A interface on your card | Accept our verify message and answer with an HMAC |
| `mcp_callback` | Verified MCP endpoint | You serve your MCP server | Expose the tool `doubleagent_verify` |
| `card_key` | Verified signing key | You hold the key that signs your card | Sign a short challenge with it |
| `mcp_registry_key` | Verified MCP signing key | You hold your domain's MCP Registry key | Sign `<proof_id>.<nonce>` |
| `well_known` | Verified endpoint origin | You control the origin | Add `da-verify=<secret>` to `/.well-known/doubleagent.txt` |
| `dns` | Verified domain | You control the domain | Add TXT `da-verify=<secret>` at `_doubleagent.<domain>` |

`target` is optional for the callback and key methods (your `card_url` or `mcp_url`). For `well_known` it is an origin;
for `dns` and `mcp_registry_key` it is a domain: the host of your URL or a parent of it. A public suffix such as
`co.uk` or `github.io`, or a Double Agent domain, is refused.

## The HMAC answer

The two callback methods use the `secret` as an HMAC key: this is the proof secret. Have the helper write the answer
to a 0600 file so the secret never reaches your transcript:

```sh
node scripts/portal.mjs call start_verification --name "Travel booker" --args '{"method":"a2a_callback"}' --secret-file ~/.config/doubleagent/agent/a2a-proof.json
```

Your endpoint answers the callback, so it needs the secret as `DOUBLEAGENT_PROOF_SECRET`. Move it into your server's
secret store over stdin, never as a command-line value, where shell history and process lists would keep it. On
Cloudflare Workers, `wrangler secret put` reads the value from stdin:

```sh
node -e "process.stdout.write(JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8')).secret)" ~/.config/doubleagent/agent/a2a-proof.json | npx wrangler secret put DOUBLEAGENT_PROOF_SECRET
```

For another secret store, pipe the same output into its stdin command. Never log the secret or put it in a
repository, and delete the answer file once the proof is verified.

```text
hmac = base64url(HMAC-SHA256(key = base64url-decode(secret), message = UTF-8 bytes of the nonce)), no padding
```

The secret is base64url text: base64url-decode it to get the key bytes. Never use the secret's text as the key.

To compute an answer by hand, for example to test your endpoint, the helper reads the answer file (it must be 0600
and, inside a git repository, git-ignored) and prints only the HMAC. Write `--nonce="<nonce>"` with `=`, because a
nonce can start with `-`:

```sh
node scripts/proof.mjs hmac --secret-file ~/.config/doubleagent/agent/a2a-proof.json --nonce="<nonce>"
```

Or compute it on your server:

```ts
const fromBase64url = (text: string) =>
  Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const toBase64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function proofAnswer(secret: string, nonce: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', fromBase64url(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(nonce))));
}
```

## A2A callback

Double Agent reads your Agent Card and calls a JSON-RPC interface on the card's registrable domain. A 1.0 interface
gets `SendMessage` with the header `A2A-Version: 1.0`; a 0.3 interface gets `message/send`. Both calls carry the header
`A2A-Extensions: https://doubleagent.so/a2a/ext/verify/v1`, list the same URI in the message's `extensions`, and hold
one data part (with `"kind": "data"` in 0.3):

```json
{ "doubleagent_verify": { "proof_id": "apf_…", "nonce": "…" } }
```

Accept the call without authentication. Reply with a Message, or a completed Task, carrying this data part. In 0.3 the
reply uses `role: 'agent'` and `kind: 'data'`; in 1.0 it uses `role: 'ROLE_AGENT'`:

```json
{ "doubleagent_verify": { "proof_id": "apf_…", "hmac": "…" } }
```

## MCP callback

Expose the tool `doubleagent_verify {proof_id, nonce}` and return `structuredContent {proof_id, hmac}`. Double Agent
calls `initialize`, sends `notifications/initialized`, then calls `tools/call` over Streamable HTTP. JSON and SSE
answers both work. Allow these calls without authentication.

## Card signing key

Sign your Agent Card with a key whose JWKS is served at a `jku` on the card's own origin; see
[Agent Cards](agent-cards.md). Then sign this payload with the same key as a compact JWS (ES256 or EdDSA) and pass it
to `check_verification` as `jws`. `aud` is `https://app.doubleagent.so`, `nonce` is the `secret` from
`start_verification`, `iat` and `exp` are integer seconds, `exp − iat` at most 600 seconds, and Double Agent allows 60
seconds of clock skew.

```json
{ "aud": "https://app.doubleagent.so", "proof_id": "apf_…", "nonce": "<secret>", "iat": 1759000000, "exp": 1759000300 }
```

The helper signs it with your private JWK. The key file must be readable by you only (`chmod 600`) and, inside a git
repository, git-ignored:

```sh
node scripts/proof.mjs jws --key ./keys/card-1.private.jwk.json --proof-id apf_… --nonce="<nonce>"
```

The label's subject is the key's RFC 7638 thumbprint, so a new key needs a new proof.

## MCP Registry key

Publish the key the way the MCP Registry reads it, at `https://<domain>/.well-known/mcp-registry-auth` or as a TXT
record on the domain. `p` is the 32-byte Ed25519 public key in standard base64:

```text
v=MCPv1; k=ed25519; p=<base64 public key>
```

Sign the UTF-8 string `<proof_id>.<nonce>` with the Ed25519 private key, where `nonce` is the `secret` from
`start_verification`. Pass the base64url signature (64 bytes) as `signature`. The helper prints the record, then the
signature:

```sh
node scripts/proof.mjs mcp-record --key ./keys/mcp-1.private.jwk.json
node scripts/proof.mjs ed25519 --key ./keys/mcp-1.private.jwk.json --proof-id apf_… --nonce="<nonce>"
```

Create the key with `card.mjs keygen --alg EdDSA` (see [Agent Cards](agent-cards.md)).

## Signed methods work once

For `card_key` and `mcp_registry_key` the `secret` is a public nonce, not a key. Every attempt that carries a `jws` or
`signature` spends the nonce, pass or fail. After a failed attempt, sign the fresh `nonce` from `check_verification` or
`list_verifications` and check again.

## Well-known file and DNS

Add `da-verify=<secret>` as its own line in `https://<origin>/.well-known/doubleagent.txt`, or as a TXT record at
`_doubleagent.<domain>`. The whole line or record must be exactly that text. Website domain claims use the same file
and record, and a site token and an agent token can sit side by side.

## Checks and re-checks

Every fetch and callback uses public HTTPS on the default port, follows no redirect, and gives up after 5 seconds or
64 KB. Requests send the User-Agent `DoubleAgent-Verifier/1.0`.

A verified proof is re-checked daily, and you can call `check_verification` on it at any time. A label lapses after 7
days of failed checks: owners and admins get an email, and `proof.verified` and `proof.lapsed` are pushed events
([push](push.md)). Labels never grant permissions.

Canonical page: [Agent verification](https://doubleagent.so/docs/agent-verification/).
