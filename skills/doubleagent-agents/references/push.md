# Push notifications

Set up push only when your human asked for it. Double Agent can push events to your own webhook instead of you polling.
Push works over A2A only; on MCP or the HTTP API, poll `get_registration` or `whoami`. The canonical page is
[Push notifications](https://doubleagent.so/docs/agent-push/).

## Set a config

Each registration has one push config; its config id is always `default`. Use your own registration id (`arg_…`) as
`taskId`, and always set a `token`.

A2A 1.0, flat params:

```json
{"jsonrpc":"2.0","id":3,"method":"CreateTaskPushNotificationConfig","params":{"taskId":"arg_…","url":"https://agent.example/webhooks/doubleagent","token":"…"}}
```

A2A 0.3, nested:

```json
{"jsonrpc":"2.0","id":3,"method":"tasks/pushNotificationConfig/set","params":{"taskId":"arg_…","pushNotificationConfig":{"url":"https://agent.example/webhooks/doubleagent","token":"…"}}}
```

Optional `authentication` is `{ "scheme": "Bearer", "credentials": "…" }` in 1.0 and
`{ "schemes": ["Bearer"], "credentials": "…" }` in 0.3. Credentials are never returned.

Get, list and delete name the task: `taskId` in 1.0, `id` in 0.3. Get (1.0) and delete also need the config id: `id` in
1.0, `pushNotificationConfigId` in 0.3. A rate-limited set answers JSON-RPC `-32603` with a message that says when to
retry; nothing is saved or fetched.

## Events

| Event | When |
| --- | --- |
| `registration.approved` | The owner approved the registration |
| `registration.declined` | The owner declined it |
| `registration.expired` | It expired after 7 days without approval |
| `token.revoked` | One of your tokens was revoked |
| `proof.verified` | A verification proof passed |
| `proof.lapsed` | A verified proof lapsed after 7 days of failed daily checks, or was revoked |

The body is `{ "task": … }` for registration events and `{ "statusUpdate": … }` for the others. With protocol 0.3 the
body is the bare Task. Proof events carry `{ method, subject }` only.

`proof.lapsed` is not delivered to a webhook covered only by the proof that lapsed. You still see the lapse in
`list_verifications` or `check_verification`.

## Where a webhook may point

Push only to an endpoint you own:

- The webhook host must equal the host of your `card_url` or `mcp_url`, or be covered by one of your verified proofs:
  an endpoint proof covers its exact host, a `dns` or `mcp_registry_key` proof its domain and subdomains. Set a URL or
  verify first.
- Double Agent's own domains are refused.
- The URL must be public HTTPS on the default port, with no credentials.
- The endpoint must pass the challenge handshake below.

Changing `card_url` or `mcp_url` to a different host stops deliveries to the old webhook. So does losing the proof that
covered the host.

## Challenge handshake

When you set a config, Double Agent POSTs a signed challenge to the webhook. The config is saved either way, but
nothing is pushed to it until the endpoint answers correctly.

```text
POST https://<your host>/<your webhook path>
Content-Type: application/json
X-DoubleAgent-Signature: <ES256 JWT>

{"type":"doubleagent.webhook.verify","challenge":"<43 characters>","task_id":"<registration id>"}
```

The endpoint must answer all of these:

- Status exactly `200`.
- `Content-Type: application/json`.
- A body that is exactly `{"challenge":"<the same value>"}`, at most 4 KiB. Extra keys, a reflected request and
  `text/plain` all fail.
- An answer within 5 seconds, with no redirect.

Your endpoint must check, on every handshake and every push:

- `task_id` is your own registration id. Another agent can set its config to a URL on your host; if your endpoint
  echoed any challenge, that agent's webhook would be verified on your endpoint.
- `X-A2A-Notification-Token` is the token you set, compared in constant time.
- `X-DoubleAgent-Signature` verifies, as described in [Verify every delivery](#verify-every-delivery).

To retry a failed handshake, set the config again: it gets a new challenge, valid for 10 minutes. Handshakes are limited
to 5 per hour per registration and 30 per hour per webhook host across all agents (see [errors](errors.md)).

A Cloudflare Worker endpoint (the same code runs in any runtime with `fetch` and WebCrypto). Set `REGISTRATION_ID`
(the task id `register_agent` returned), `WEBHOOK_URL` (exactly the URL you set) and `NOTIFICATION_TOKEN`:

```js
const ISSUER = 'https://app.doubleagent.so';
const JWKS_URL = 'https://app.doubleagent.so/.well-known/jwks.json';

const fromB64url = (text) => Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
const toB64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const decodeJson = (part) => JSON.parse(new TextDecoder().decode(fromB64url(part)));

/** Equal strings, compared over their SHA-256 digests in constant time, so the token's length and prefix do not leak. */
async function sameSecret(given, expected) {
  if (!expected) return false; // An unset NOTIFICATION_TOKEN must never match a missing header.
  const digest = async (text) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)));
  const [a, b] = await Promise.all([digest(given ?? ''), digest(expected)]);
  return a.reduce((diff, byte, index) => diff | (byte ^ b[index]), 0) === 0;
}

// The JWKS, kept for this isolate's lifetime and refetched on a kid we do not have, at most once a minute.
let cachedKeys = [];
let fetchedAt = 0;
async function keyFor(kid) {
  let jwk = cachedKeys.find((key) => key.kid === kid);
  if (!jwk && Date.now() - fetchedAt > 60_000) {
    fetchedAt = Date.now();
    const res = await fetch(JWKS_URL);
    if (res.ok) cachedKeys = (await res.json()).keys ?? [];
    jwk = cachedKeys.find((key) => key.kid === kid);
  }
  return jwk;
}

/** The JWT's claims when it is ours, for this endpoint and registration, unexpired and over these exact bytes; else null. */
async function verifiedClaims(jwt, rawBody, env) {
  try {
    const [header, payload, signature] = (jwt ?? '').split('.');
    if (!signature || decodeJson(header).alg !== 'ES256') return null;
    const jwk = await keyFor(decodeJson(header).kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
    const signed = new TextEncoder().encode(`${header}.${payload}`);
    if (!(await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, key, fromB64url(signature), signed))) return null;
    const claims = decodeJson(payload);
    const sha256 = toB64url(new Uint8Array(await crypto.subtle.digest('SHA-256', rawBody)));
    const valid =
      claims.iss === ISSUER &&
      claims.aud === env.WEBHOOK_URL &&
      claims.exp > Date.now() / 1000 &&
      claims.sha256 === sha256 &&
      claims.task_id === env.REGISTRATION_ID;
    return valid ? claims : null;
  } catch {
    // A malformed JWT (bad base64, bad JSON, a key that does not import) is an unauthenticated request, not a crash.
    return null;
  }
}

export default {
  async fetch(request, env) {
    const rawBody = new Uint8Array(await request.arrayBuffer());
    const claims = await verifiedClaims(request.headers.get('x-doubleagent-signature'), rawBody, env);
    const isOurToken = await sameSecret(request.headers.get('x-a2a-notification-token'), env.NOTIFICATION_TOKEN);
    if (!claims || !isOurToken) return new Response(null, { status: 401 });
    // The JWT binds these exact bytes, so only Double Agent can send a body that is not JSON.
    const body = JSON.parse(new TextDecoder().decode(rawBody));
    if (body.type === 'doubleagent.webhook.verify') {
      // Answer only for your own registration.
      if (body.task_id !== env.REGISTRATION_ID) return new Response(null, { status: 403 });
      return Response.json({ challenge: body.challenge });
    }
    // A push: dedupe on claims.jti, then act on body.task or body.statusUpdate.
    return new Response(null, { status: 204 });
  },
};
```

The create, get and list answers report the handshake only to clients that activate the verify extension. Send this
header (the URI is in the Agent Card's `capabilities.extensions`):

```text
A2A-Extensions: https://doubleagent.so/a2a/ext/verify/v1
```

Those answers carry `verified` (boolean), and a failed handshake also returns `verification`, a short reason: `refused_url`,
`denied_host`, `timeout`, `network`, `no_echo`, `http_<status>`, `too_large`, `bad_header`, `not_confirmed` or
`unsigned`. In 1.0 both fields sit at the top level of the answer; in 0.3 they sit inside `pushNotificationConfig`.
Without the header both fields are left out.

## Verify every delivery

Verify the JWT in `X-DoubleAgent-Signature` before trusting the body. Fetch the keys from
`https://app.doubleagent.so/.well-known/jwks.json` and match the `kid` in the JWT header. When the `kid` is unknown,
refetch the JWKS once: the key may have rotated. Check these claims:

| Claim | Check |
| --- | --- |
| `iss` | `https://app.doubleagent.so` |
| `aud` | The webhook URL you configured |
| `iat`, `exp` | Now is inside the window (it lasts 5 minutes) |
| `sha256` | The base64url SHA-256 of the raw request body bytes |
| `jti` | The event id. It is the same on every retry of one event: dedupe on it. |
| `task_id` | Your own registration id |

The handshake request carries the same kind of JWT, with a fresh `jti`.

## Delivery

Each delivery has these headers:

- `X-DoubleAgent-Signature`: an ES256 JWT.
- `Authorization`: the scheme and credentials you gave in the config, otherwise `Bearer <the same JWT>`.
- `X-A2A-Notification-Token`: the token you set, when you set one.

A delivery waits 5 seconds and follows no redirects. A failed delivery is retried 5 times with backoff, starting at 30
seconds and doubling up to an hour. After 5 retries (about 15 minutes) the event is dead-lettered. A config that has
been failing for 7 days is dropped; set it again to resume.
