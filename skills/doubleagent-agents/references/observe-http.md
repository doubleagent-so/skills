# Raw HTTP ingest (any language)

Use this when your agent is not written in JavaScript or TypeScript: build the events yourself and post them in
batches. Get an `ak_` key first in [Observe](observe.md).

## Send a batch

```text
POST https://api.doubleagent.so/v1/agent-events
Authorization: Bearer ak_…
Content-Type: application/json
```

The key alone decides the account, agent, source and environment. The body is `{ adapter, dropped?, events[] }`:

- `adapter`: your sender's name and version, such as `quote-api@1.0.0`.
- `dropped`: how many events you gave up on since the last batch, so Double Agent can show the gap.
- `events`: at most 100 events, and the whole body at most 1 MiB.

## Limits

- Content on a `message.observed` event: at most 96 KiB per message, 32 KiB per part and 64 parts.
- At most 16 costs per operation.
- Event times within the last 7 days and at most 5 minutes ahead.
- Event ids and operation ids are ULIDs.
- Content is stored only for sources with content capture on; otherwise it is dropped and counted in
  `content_dropped`.

## Answers

| Status | Meaning | What to do |
| --- | --- | --- |
| `202 { accepted, content_dropped, rejected }` | Queued, not yet stored. Each entry in `rejected` has the event's `index` and a `code`. | Fix the cause; do not resend a rejected event unchanged. |
| `400` | Not JSON, or the batch itself is invalid. | Fix the batch; do not retry it unchanged. |
| `401`, `410` | A bad, revoked or expired key (`401`), or a deleted source or agent (`410`). | Stop for good and report. |
| `413` | The batch is over 1 MiB. | Split it and send the parts. |
| `429` | Over 1,000 requests per minute for the source. | Wait the `Retry-After` seconds once. |
| `5xx`, or a network error | Not queued, or queued in part. | Retry with the same `event_id`s; they deduplicate. |

## Event shape

Every event has the envelope keys `schema_version` (`1`), `event_id`, `type`, `occurred_at`, `protocol` (`name`,
`version`, `binding`), `direction` (`inbound` or `outbound`) and `operation_id`. It may add `conversation_ref` and
`task_ref`. Then come the fields of its type. Unknown keys are rejected.

Types: `operation.started`, `operation.finished`, `message.observed`, `task.state_changed`, `transaction.recorded`
and `cost.recorded`. The money types are in [Observe money](observe-money.md). Start an operation, then finish it:

<!-- check:batch -->
```json
{
  "adapter": "quote-api@1.0.0",
  "events": [
    {
      "schema_version": 1,
      "event_id": "01K6QZ8M7N2V3W4X5Y6Z7A8B9C",
      "type": "operation.started",
      "occurred_at": "2026-10-04T12:00:00.000Z",
      "protocol": { "name": "custom:quote-api", "version": "1.0", "binding": "http-json" },
      "direction": "inbound",
      "operation_id": "01K6QZ8M7N2V3W4X5Y6Z7A8B9D",
      "conversation_ref": "session-42",
      "method": "quotes.create",
      "kind": "tool",
      "target": "flight-quote",
      "counterparty": { "declared_name": "travel-planner" },
      "custom": { "region": "eu" }
    },
    {
      "schema_version": 1,
      "event_id": "01K6QZ8M7N2V3W4X5Y6Z7A8B9E",
      "type": "operation.finished",
      "occurred_at": "2026-10-04T12:00:00.250Z",
      "protocol": { "name": "custom:quote-api", "version": "1.0", "binding": "http-json" },
      "direction": "inbound",
      "operation_id": "01K6QZ8M7N2V3W4X5Y6Z7A8B9D",
      "outcome": "ok",
      "started_at": "2026-10-04T12:00:00.000Z",
      "duration_ms": 250
    }
  ]
}
```

In JavaScript, prefer the package: `validateBatch` from `@doubleagent-so/observe` is the same check the API runs.
