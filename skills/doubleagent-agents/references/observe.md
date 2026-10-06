# Add observability to an agent you build

`@doubleagent-so/observe` records what your agent does at its protocol boundaries (A2A, MCP or your own protocol) and
sends it to Double Agent: every request and stream, the task states it went through, who called, and how it ended.

## The package

`@doubleagent-so/observe` 0.2.0 is on [npm](https://www.npmjs.com/package/@doubleagent-so/observe).

- ESM only. Runs on Node 20+, Cloudflare Workers, Bun and Deno, with no runtime dependencies.
- Optional peer dependencies: `@a2a-js/sdk` (`>=1.3 <2`) and `@modelcontextprotocol/sdk` (`>=1.29 <2`). Install them
  only for the SDK integrations.
- Entry points: `.` (the recorder), `./a2a` and `./mcp`.
- TypeScript projects need `moduleResolution` set to `node16`, `nodenext` or `bundler`.

From the agent's project directory:

```sh
npm i @doubleagent-so/observe
```

It records only what crosses the protocol boundary. Internal tool calls, model calls and reasoning are never recorded.

## Choose the integration

| Your agent | Use | Reference |
| --- | --- | --- |
| A2A on Workers, Hono or any fetch handler | `withA2ATelemetry` | [Observe A2A](observe-a2a.md) |
| A2A server on `@a2a-js/sdk` | `instrumentA2AHandler` + `instrumentTaskStore` | [Observe A2A](observe-a2a.md) |
| Outbound A2A calls with the `@a2a-js/sdk` client | `a2aTelemetryInterceptor`, first in `interceptors` | [Observe A2A](observe-a2a.md) |
| MCP server or client on the official SDK | `instrumentMcpTransport` | [Observe MCP](observe-mcp.md) |
| Hand-rolled MCP Streamable HTTP server | `withMcpTelemetry` | [Observe MCP](observe-mcp.md) |
| Hand-rolled stdio MCP, or any other protocol | The generic recorder | [Observe custom](observe-custom.md) |
| Another language | Raw HTTP | [Observe HTTP](observe-http.md) |

Use one entry point per server. For example, never wrap both an MCP transport and the fetch handler in front of it.
For flushing on each runtime, read [Observe runtimes](observe-runtimes.md).

## Get a key

A managed agent (`agt_…`) has one source (`src_…`) per environment, `test` or `live`. Each source has ingest keys,
`ak_test_…` or `ak_live_…`. A key's value is shown once, in the answer that creates it. Rotating a key keeps the old
value working for 24 hours; revoking a key stops it at once.

Create an agent, a source or a key only when your human asked you to. There are two ways.

**The portal.** Your human opens **Agents → Add agent** at `https://app.doubleagent.so` and copies the key.

**The API.** One call creates the agent, its first source and a key:

```text
POST https://api.doubleagent.so/v1/managed-agents
```

```json
{ "account_id": "acc_…", "name": "Quote agent", "env": "test" }
```

The answer is `201 { agent, source, key, secret }`; `secret` is the `ak_test_…` value. Read `account_id` from
`GET /v1/me`. To add the other environment's source, with its own key, where `:id` is the agent's `agt_…` id:

```text
POST https://api.doubleagent.so/v1/managed-agents/:id/sources
```

```json
{ "env": "live", "name": "production" }
```

The answer is `201 { source, key, secret }`. `POST /v1/agent-sources/:id/keys` adds a key to a source,
`POST /v1/agent-sources/:id/keys/:keyId/rotate` rotates one and `DELETE /v1/agent-sources/:id/keys/:keyId` revokes one.

Authenticate these calls with `Authorization: Bearer …` and one of:

- A CLI session. Your human approves the login in a browser, and the CLI stores a `das_` session in its 0600
  credentials file:

  ```sh
  npx @doubleagent-so/cli login
  ```

- The `daa_` token of an approved agent with the `admin` role in that account. See [Tokens](tokens.md).

The helper makes the same call. It reads `DOUBLEAGENT_SESSION`, then the CLI login, then `DOUBLEAGENT_AGENT_TOKEN`:

```sh
node scripts/observe.mjs create --name "Travel booker" --env test --write .dev.vars
```

It refuses a file git would commit, writes `DOUBLEAGENT_AGENT_KEY` 0600, and prints the key masked. Use `.dev.vars`
on Workers and `.env` (git-ignored) on Node. A file that already holds `DOUBLEAGENT_AGENT_KEY` is refused before
anything is created; `--force` replaces the key in it.

The CLI's `keys` command manages a site's `pk_` and `sk_` keys, not `ak_` keys.

Store the key as the server secret `DOUBLEAGENT_AGENT_KEY`. Never put it in code, a client bundle, a log or a
repository. Report the secret's name, never its value.

## Verify

The helper sends a test event and polls it for you; it exits 0 once the event is visible and 1 if it times out:

```sh
node scripts/observe.mjs test-event src_…
```

By hand:

1. Send a test event through the normal ingest path, where `:id` is the source's `src_…` id:

   ```text
   POST https://api.doubleagent.so/v1/agent-sources/:id/test-event
   ```

   The answer is `202 { test_id, operation_id }`.
2. Poll `GET /v1/agent-sources/:id/test-event/:test`, with the `tst_…` id as `:test`, once every few seconds until
   `visible_at` is set or `timed_out` is `true` (after 60 seconds). A visible test proves the source and the pipeline
   work; it does not prove your code sends events.
3. Make one real call to your agent, then find it in the portal's Agents page or through the [analytics](analytics.md)
   reference.

A source allows 10 test events per hour (`429 test_event_limit` after that). Test events appear in the operations
list, but never in counts or charts.

A source's health is `waiting` (no event yet), `connected` or `problem` (events dropped, or arriving late).

## What is recorded

- **Metadata, always:** the method, kind, target, direction, timing, outcome, task states, the conversation and the
  counterparty.
- **Content, unless you set `content: false`:** text and data parts of messages. Double Agent keeps content only for
  sources with content capture on (the default for a new source), for 30 days, and drops it otherwise. Set
  `redact(message)` on the recorder to change content before it leaves the process; if `redact` throws, that
  message's content is not sent.
- **Files:** name, media type and size only. File bytes and file URLs are never sent.
- **MCP ids, as the caller chose them:** the JSON-RPC request id, the client's `clientInfo` and task ids. Set
  `redactIds` on the MCP wrapper only when your human asks you to change or drop them (see
  [Redact MCP ids](observe-mcp.md#redact-mcp-ids)).
- **Authenticated callers:** the subject is hashed with HMAC-SHA256 under `subjectKey` before it leaves the process.
  `subjectKey` defaults to the agent key, so rotating the key changes every hash and returning callers look new. Set a
  stable secret, for example `DOUBLEAGENT_SUBJECT_KEY`, as `subjectKey` to keep hashes across rotations, and keep it
  as secret as the key.
- **Networks:** only as an `ip_prefix_hash` your `identify` function supplies, for example a salted hash of the /24
  or /48 prefix.
- **Never:** raw IP addresses, `Authorization` headers, cookies, signatures or payer addresses.

## Outcomes

Every operation ends with one outcome.

| Outcome | Meaning |
| --- | --- |
| `ok` | A result came back. |
| `protocol_error` | A JSON-RPC error, an HTTP error status (code `http_error`), or your handler threw (code `internal_error`). |
| `tool_error` | An MCP tool result with `isError: true`. |
| `auth_rejected` | The response was `401` or `403`. |
| `transport_error` | The client disconnected, or the connection or stream broke with the request pending. |
| `canceled` | The caller canceled the request (MCP `notifications/cancelled`). |
| `incomplete` | The operation started and never finished, for example an outbound stream your code stopped reading. |

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| No events | On Workers or serverless, `waitUntil` is missing and the runtime stops the send. | Set `waitUntil: true` and `flushIntervalMs: 0`, or flush in `waitUntil`. See [Observe runtimes](observe-runtimes.md). |
| No events | The key belongs to the other environment's source. | Look in that environment, or use the right source's key. |
| The recorder stopped sending | The API answered `401`, `403` or `410`: the key was revoked or the source deleted. The recorder stops for good. | Create or rotate a key, update `DOUBLEAGENT_AGENT_KEY`, restart. |
| Nothing is sent at all | The `endpoint` is not `https://`. | Leave `endpoint` unset. |
| Content missing | Content capture is off for the source, or `content: false` is set. | Ask your human before turning capture on. |
| MCP operations without a conversation | The server is stateless: there is no `Mcp-Session-Id`. | Run a stateful server, or accept per-operation records. |
