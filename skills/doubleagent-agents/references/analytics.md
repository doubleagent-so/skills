# Read your agent's analytics

Once events arrive from [Observe](observe.md), read them back over the HTTP API. All routes are `GET` requests to
`https://api.doubleagent.so`, for one managed agent (`:id`, an `agt_…` id). Only a human or an agent with access to
the agent's account can read it; another account's agent is `404`.

## Auth

Send a `daa_` token or a CLI session (see [Tokens](tokens.md)):

```text
Authorization: Bearer daa_…
```

An approved agent token reads within its role. Two reads need more than reading the agent:

- Message content needs `agents.content.read`, and every content read is audited.
- Money and the revenue routes need `agents.revenue.read`. Without it, the money fields are left out and the revenue
  routes answer `403`.

With a `daa_` token, the portal tools `list_managed_agents` (`account_id` required) and `agent_summary` (`range`)
give the same totals without calling the API. See [Tools](tools.md).

Quick look at sources and health:

```sh
node scripts/observe.mjs status agt_…
```

## Routes

| Route | Returns |
| --- | --- |
| `GET /v1/managed-agents/:id/summary` | Totals with change against the comparison, a chart, and whether the data is complete |
| `GET /v1/managed-agents/:id/panels` | Counterparty, target, task and error panels |
| `GET /v1/managed-agents/:id/filters` | The values the other reads accept as filters |
| `GET /v1/managed-agents/:id/operations` | Operations, newest first by default |
| `GET /v1/managed-agents/:id/operations/:operation/content` | Captured messages of one operation (content permission) |
| `GET /v1/managed-agents/:id/conversations` | Conversations by last activity |
| `GET /v1/managed-agents/:id/conversations/:conversationId` | One conversation: timeline and tasks |
| `GET /v1/managed-agents/:id/conversations/:conversationId/content` | Captured messages of one conversation (content permission) |
| `GET /v1/managed-agents/:id/counterparties` | Who called, with counts per kind |
| `GET /v1/managed-agents/:id/counterparties/:cp` | One counterparty and its recent conversations |
| `GET /v1/managed-agents/:id/tasks` | Tasks with their status |
| `GET /v1/managed-agents/:id/tasks/:task` | One task with its transitions |
| `GET /v1/managed-agents/:id/transactions` | Transactions (revenue permission) |
| `GET /v1/managed-agents/:id/transactions/:transaction` | One transaction with its versions (revenue permission) |
| `GET /v1/managed-agents/:id/revenue/summary` | Revenue, cost and margin (revenue permission) |
| `GET /v1/managed-agents/:id/revenue/breakdown` | Revenue ranked by tasks, conversations, counterparties or tools (revenue permission) |

## Parameters

Most routes share these query parameters. An unknown parameter is `400`.

| Parameter | Values |
| --- | --- |
| `env` | `test` or `live` |
| `range` | `24h`, `7d`, `30d` or `90d` |
| `from`, `to` | ISO-8601 instants, instead of `range`; never both (`400 invalid_range`) |
| `compare` | `prev` (the default), `week`, `month`, `custom` or `off` |
| `compare_from` | `YYYY-MM-DD`, only with `compare=custom` |

- Lists take `limit` (at most 100) and page with the opaque `cursor` from the previous answer's `next`. A cursor is
  bound to its query; with a different query it is `400 invalid_cursor`.
- A comparison that does not exist, such as `compare=off`, is `null` in the answer.
- Test operations are listed but never counted.
- Amounts are minor units of the account currency, and each answer names its `currency` and `currency_exponent`.
- Report a `429` as in [Errors](errors.md): wait `Retry-After` once, then stop.
