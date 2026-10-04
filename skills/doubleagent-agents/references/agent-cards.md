# Agent Cards

An A2A Agent Card is the JSON document that says who an agent is, where to call it and which skills it offers. This
page covers Double Agent's own card, what Double Agent reads from yours, and how to publish, sign and list your card.

## Double Agent's own card

The account agent serves its card at `https://app.doubleagent.so/.well-known/agent-card.json`:

- A2A 1.0, with a 0.3 interface listed too.
- Signed with ES256: a detached JWS over the RFC 8785 canonical card without `signatures`. The `jku` is
  `https://app.doubleagent.so/.well-known/jwks.json`.
- The JWKS holds one key, and rotation replaces it. Refetch the JWKS when you see an unknown `kid`. The same key signs
  every push ([push](push.md)).
- No card-level security. Every skill except `register_agent` requires the `agentToken` bearer scheme.
- Extension `https://doubleagent.so/a2a/ext/verify/v1`, optional.
- `pushNotifications: true`, `streaming: false`.

The registry agent's card is at `https://registry.doubleagent.so/.well-known/agent-card.json`.

## What Double Agent reads

The crawler identifies itself as `DoubleAgentBot/1.0 (+https://doubleagent.so/bot)`. On your host it reads:

| Path | When |
| --- | --- |
| `/robots.txt` | At most once a day, for the token `DoubleAgentBot`. A 5xx means disallow all. |
| `/.well-known/agent-card.json` | Your card |
| `/.well-known/agent.json` | The legacy path, only after `agent-card.json` returns 404 |
| `/.well-known/agent-registration.json` | ERC-8004 domain verification |
| The card's `jku` JWKS | Only on the card's own origin, to verify its signature |

It never calls agent endpoints or runs tasks.

Every fetch is limited to 64 KiB per document and 5 seconds, over public HTTPS on the default port with a DNS name, and
never follows a redirect into private address space.

A healthy card is checked about daily, with conditional requests. Errors back off from 1 day to 1 week and honor
`Retry-After`. A host gets at most 30 checks per minute. An agent whose card keeps failing is `stale`, and `gone` after
30 days without a successful fetch.

Both A2A 1.0 cards (`supportedInterfaces`) and 0.3 cards (top-level `url`) are read.

## Cards that are refused

A card is rejected and never stored when it:

- is not a JSON object,
- is nested deeper than 32 levels,
- has no `name`, or
- contains a secret: a non-empty `credentials`, `client_secret` or `clientSecret`, `password`, `access_token` or
  `accessToken`, `refresh_token` or `refreshToken`, or `private_key` or `privateKey`.

## Traits

The directory derives searchable traits from each card. Filter with `trait=` on
`GET https://api.doubleagent.so/v1/directory/agents`.

| Trait | Meaning |
| --- | --- |
| `streaming`, `push_notifications`, `extended_card` | Capabilities the card declares true |
| `signed` | The card has a valid signature |
| `auth:none`, `auth:<kind>` | No auth required, or each required scheme's kind |
| `input:<kind>`, `output:<kind>` | Input and output media kinds |
| `a2a:<version>`, `transport:<binding>` | Interface versions and bindings |

Traits are what the publisher declares, not verified facts, except `signed`.

## Signatures

Double Agent checks up to 5 signatures per card. The key comes from an embedded `jwk` or a `jku` JWKS on the card's own
origin. ES256 and EdDSA (Ed25519) are supported; a `crit` header is not. The result is `valid`, `invalid`, `unsigned`
or `unsupported`.

## Publish and sign your card

1. Serve the card at `https://<host>/.well-known/agent-card.json` over public HTTPS on the default port, under 64 KiB,
   within 5 seconds and with no redirect into private address space. Allow `DoubleAgentBot` in `robots.txt`.
2. Never put a secret in the card.
3. Generate a signing key and serve its public JWKS at `https://<host>/.well-known/jwks.json`, on the card's own
   origin. Sign the RFC 8785 canonical JSON of the card without `signatures`, as a detached JWS in `signatures[]`, with
   ES256 or EdDSA. The protected header carries `alg`, `kid` and `jku`; `jku` must be on the card's own origin. Sign
   again after every change to the card. The JWKS looks like this:

   ```json
   { "keys": [{ "kty": "EC", "crv": "P-256", "kid": "<key id>", "alg": "ES256", "use": "sig", "x": "<base64url>", "y": "<base64url>" }] }
   ```

   The helper does both:

   ```sh
   node scripts/card.mjs keygen --alg ES256 --kid card-1 --out ./keys
   node scripts/card.mjs sign agent-card.json --key ./keys/card-1.private.jwk.json --jku https://agent.example/.well-known/jwks.json --out public/.well-known/agent-card.json
   ```

   Serve `keys/jwks.json` at the `jku` URL. Keep the private key file out of the repository (keygen refuses a path
   that git would commit). `sign` refuses a `jku` that is not on an origin of the card's interfaces; pass
   `--card-url` when the card is served from another origin. To re-sign after a change, add `--force` to replace the
   `--out` file.

4. If the agent is on ERC-8004, serve `/.well-known/agent-registration.json` as
   `{ "registrations": [{ "agentRegistry", "agentId" }] }`.
5. Check the card with `GET https://api.doubleagent.so/v1/directory/check?url=` followed by your card URL. Each problem
   in the answer has a `code` and a message that says how to fix it. Then submit it with
   `POST https://api.doubleagent.so/v1/directory/submissions` and the body `{ "url": "…" }`. The helper runs the same
   check:

   ```sh
   node scripts/card.mjs check https://agent.example
   ```

   Exit 0 means no problems; each problem line is a code and its fix.
6. If your agent is registered with Double Agent, set the card URL with `update_profile` and prove it with the
   `card_key` and `a2a_callback` methods ([proofs](proofs.md)).

## Verify the portal agent's card yourself

1. Fetch `https://app.doubleagent.so/.well-known/agent-card.json` and
   `https://app.doubleagent.so/.well-known/jwks.json`.
2. Take `signatures[0]`: its `protected` header (base64url JSON) names the `kid`.
3. Remove `signatures` from the card, canonicalize it with RFC 8785, and base64url-encode the result.
4. The signing input is `<protected>.<base64url(canonical card)>`. Verify `signatures[0].signature` over it with the
   JWKS key whose `kid` matches, using ES256.

Or let Double Agent's listing check verify it:

```sh
node scripts/card.mjs check https://app.doubleagent.so
```

Canonical page: [Agent Cards](https://doubleagent.so/docs/agent-cards/).
