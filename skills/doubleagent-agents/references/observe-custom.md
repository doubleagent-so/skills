# Observe another protocol

For A2A or MCP, use [Observe A2A](observe-a2a.md) or [Observe MCP](observe-mcp.md). For a hand-rolled stdio MCP
server, or any other protocol, use the recorder directly: start an operation, record its messages and task states,
then finish it. Get a key first in [Observe](observe.md).

## Record an operation

In the code that handles one request:

<!-- check:ts node -->
```ts
import { createRecorder } from '@doubleagent-so/observe';

/** The caller's conversation or session id, when your protocol has one. */
declare const sessionId: string;
/** The name the caller gave for itself (a claim, not verified). */
declare const callerName: string;
declare const request: Record<string, unknown>;
declare const quote: Record<string, unknown> | null;

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'quote-api@1.0.0' });

const op = recorder.startOperation({
  protocol: { name: 'custom:quote-api', version: '1.0', binding: 'http-json' },
  direction: 'inbound',
  method: 'quotes.create',
  kind: 'tool',
  target: 'flight-quote',
  conversationRef: sessionId,
  counterparty: { declared_name: callerName },
  custom: { region: 'eu', priority: true },
});
op.message({ role: 'caller', parts: [{ kind: 'data', json: request }] });
if (quote) {
  op.message({ role: 'agent', parts: [{ kind: 'data', json: quote }] });
  op.finish({ outcome: 'ok' });
} else {
  op.finish({ outcome: 'protocol_error', error: { nativeCode: '422', code: 'no_quote' } });
}
```

- **Protocol name:** `custom:<name>`, where the name is 1 to 32 lowercase letters, digits and dashes.
- **The `custom` block:** your own fields, with string, number or boolean values. It is allowed only on a `custom:`
  protocol.
- **Conversations:** pass the same `conversationRef` for every operation of one session or conversation. When the
  conversation is known only from the response (your agent assigned it), pass `conversationRef` to `op.message(…)` or
  `op.taskState(…)` instead; the operation joins that conversation. If one operation names different conversations,
  the first one Double Agent sees wins.
- **Callers:** pass `counterparty.authenticated` as `{ issuer, subject }` only from authentication you verified; the
  subject is hashed before it leaves the process.
- Finish every operation you start. One that never finishes is recorded as `incomplete`.

## Abandon a task

When your agent gives up on a task itself (shutdown, timeout, operator cancel), end it with a reason of up to 128
characters. The task gets a terminal transition with that reason:

<!-- check:ts node -->
```ts
import type { Protocol, Recorder } from '@doubleagent-so/observe';

declare const recorder: Recorder;
declare const protocol: Protocol;

recorder.abandonTask('task-9', { protocol, direction: 'inbound', state: 'canceled', reason: 'shutdown' });
```

On an `@a2a-js/sdk` server, the instrumented task store does this for every open task. Opt in with
`instrumentTaskStore(store, { recorder, abandonOpenTasksOnShutdown: true })`, then on shutdown call
`await taskStore.abandonOpenTasks()` before `await recorder.shutdown()`. Without the option, open tasks stay open.

## Flush

The recorder buffers events and sends them in batches every 2 seconds (`flushIntervalMs`).

- `await recorder.flush()` sends what is buffered now. It never rejects. While the recorder backs off after a failure
  it does nothing, unless 5 seconds or less of backoff are left; `flush({ force: true })` sends anyway.
- `await recorder.shutdown()` flushes (forced), stops the timer and ignores later events. Call it before a
  long-running process exits.
- On Workers and other serverless runtimes, set `flushIntervalMs: 0` and flush at the end of each request inside
  `waitUntil`. See [Observe runtimes](observe-runtimes.md).

The recorder never throws into your code. Events it cannot send are counted in `recorder.stats().dropped` and
reported to the server with the next batch.
