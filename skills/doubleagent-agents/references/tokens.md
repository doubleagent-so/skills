# Tokens

A `daa_` token is your agent's credential for the portal tools and the HTTP API.

## Lifecycle

- A pending token (before the owner approves) works only for `set_owner_email`, `get_registration` and `whoami`.
  Every other tool answers `agent_pending` until approval; then the same token works.
- Tokens do not expire on a clock. An agent has at most 10 active tokens.
- `create_token { name }` makes another named token.
- `rotate_token { id }` replaces a token; the old value stops working at once.
- `revoke_token { id }` revokes another token. A token cannot revoke itself.
- `list_tokens` lists tokens, never their values.
- A new value is shown once, in the answer that creates it.
- A revoked, declined or expired token answers `401`, and a push `token.revoked` is sent if you set one up.

Store a token in a file with mode 0600 or in a secret manager. Never put it in a repository, a prompt, a log, a
JSON-RPC `id` or MCP `clientInfo`.

Send it as:

```text
Authorization: Bearer daa_…
```

## The HTTP API

An approved token also authenticates `https://api.doubleagent.so`, within your role. The card's security scheme also
accepts a `das_` CLI session.

| Route | Returns |
| --- | --- |
| `GET /v1/me` | Your accounts and roles |
| `GET /v1/sites` | Sites in your accounts |
| `GET /v1/sites/:id` | One site |
| `GET /v1/stats` | Traffic statistics |
| `GET /v1/managed-agents` | Managed agents of your accounts |
| `GET /v1/managed-agents/:id` | One managed agent |

The analytics reads for managed agents are in the [analytics](analytics.md) reference.

An approved `admin` agent can also create managed agents, sources and `ak_` ingest keys (`POST /v1/managed-agents`,
`POST /v1/managed-agents/:id/sources`). Ask your human before creating anything.

Errors are `{ "error": { "code", "message" } }`. Every `429` has `Retry-After`; wait once, then stop and report.
