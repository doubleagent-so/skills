# Run observe on Workers, Node, Bun or Deno

The recorder buffers events and sends them in the background. What keeps that background work alive depends on the
runtime. Get a key and choose the integration first in [Observe](observe.md).

| Runtime | Timer | Flush |
| --- | --- | --- |
| Cloudflare Workers | `flushIntervalMs: 0` | `waitUntil: true` on the fetch wrappers, or `ctx.waitUntil(recorder.flush())` per request |
| Node | Default (every 2 seconds) | `await recorder.shutdown()` before the process exits |
| Bun, Deno | As Node | As Node |
| Other serverless | `flushIntervalMs: 0` | Pass `waitUntil` the platform's equivalent, or `await recorder.flush()` before returning |

## Cloudflare Workers

- Create the recorder on the first request, when the `DOUBLEAGENT_AGENT_KEY` secret is available, and reuse it for
  the life of the isolate. One recorder per isolate is fine: each flush sends what is buffered with its own request.
- Set `flushIntervalMs: 0`. A recorder created at module scope has no timer anyway (Workers forbid timers there) and
  logs `agent_telemetry_timer_unavailable` once.
- With `withA2ATelemetry` or `withMcpTelemetry`, set `waitUntil: true`: the wrapper flushes after each request.
- With the SDK wrappers or the generic recorder, call `ctx.waitUntil(recorder.flush())` at the end of each request.
- Without `waitUntil`, the runtime can stop the send when the response returns, and the events are lost.

The fetch wrapper examples in [Observe A2A](observe-a2a.md#workers-hono-or-any-fetch-handler) and
[Observe MCP](observe-mcp.md#hand-rolled-streamable-http) show the pattern.

## Node, Bun and Deno

A long-lived process keeps the default timer, which sends a batch every 2 seconds. Before the process exits, shut the
recorder down so it sends what is still buffered:

<!-- check:ts node -->
```ts
import { createRecorder } from '@doubleagent-so/observe';

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-agent@1.0.0' });

async function shutDown(): Promise<void> {
  // Stop accepting requests first, then send what is buffered.
  await recorder.shutdown();
  process.exit(0);
}

process.on('SIGTERM', async () => {
  await shutDown();
});
```

`shutdown()` waits up to the request timeout plus a second for flushes in flight, then makes one last forced attempt.
Events still unsent after that are counted as dropped and logged. Events recorded after `shutdown()` are dropped.

On an `@a2a-js/sdk` server with `abandonOpenTasksOnShutdown`, call `await taskStore.abandonOpenTasks()` before
`await recorder.shutdown()`. See [Observe custom](observe-custom.md#abandon-a-task).

## Other serverless platforms

Platforms that freeze or stop the function after the response need the same care as Workers:

- Set `flushIntervalMs: 0`.
- Pass the platform's own `waitUntil` function to the fetch wrappers as the `waitUntil` option. It receives a promise
  and keeps the function alive until it settles.
- If the platform has no `waitUntil`, call `await recorder.flush()` before returning the response. This adds the send
  to the response time.

## Delivery

- After a failed send or a `Retry-After`, the recorder backs off: up to 60 seconds after failures, up to 5 minutes for
  `Retry-After`. Network errors, timeouts, `429` and `5xx` answers delay telemetry; the batch is retried.
- A `401`, `403` or `410` answer stops the recorder for good: the key was refused or the source deleted.
- The buffer holds up to 5,000 events (`maxBufferEvents`). Overflow drops the oldest buffered events, counted in
  `recorder.stats().dropped`.
- A batch holds up to 100 events and 1 MiB.
