# Observe an A2A agent

Three integrations, one per kind of A2A code. Get a key and choose first in [Observe](observe.md).

## Workers, Hono or any fetch handler

`withA2ATelemetry` wraps a `fetch` handler. It observes JSON-RPC `POST`s and `GET /.well-known/agent-card.json`, and
passes every other request through untouched.

A Cloudflare Worker on Hono, in the Worker's entry file:

<!-- check:ts workers -->
```ts
import { Hono } from 'hono';
import { createRecorder } from '@doubleagent-so/observe';
import { withA2ATelemetry } from '@doubleagent-so/observe/a2a';

type Env = { DOUBLEAGENT_AGENT_KEY: string };

const app = new Hono<{ Bindings: Env }>();
// ... your A2A routes

let handle: ((request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>) | undefined;

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    // Created on the first request, when the secret is available; reused after that.
    handle ??= withA2ATelemetry(app.fetch, {
      recorder: createRecorder({ key: env.DOUBLEAGENT_AGENT_KEY, adapter: 'my-agent@1.0.0', flushIntervalMs: 0 }),
      waitUntil: true,
    });
    return handle(request, env, ctx);
  },
};
```

- **Always set `waitUntil` on Workers and other serverless runtimes.** Telemetry parses responses and sends events in
  the background; without `waitUntil` the runtime can stop that work when the response returns, and events are lost.
  `waitUntil: true` uses the handler argument that has a `waitUntil` method (the Workers `ctx`). You can also pass a
  function, such as `waitUntil: (promise) => ctx.waitUntil(promise)`.
- With `waitUntil` set, the wrapper flushes after each operation, so set `flushIntervalMs: 0` to turn off the timer.
- Request bodies are read from a clone, up to 1 MiB; a larger body is recorded with method `unknown`. Responses, and
  each SSE event, are parsed up to 4 MiB; streams pass through without buffering.
- `identify(request)` names the caller from authentication you already verified. It returns counterparty evidence,
  such as `{ authenticated: { issuer, subject } }`; the subject is hashed before it leaves the process.
- `cardPath` sets the Agent Card path recorded as `GetAgentCard` (default `/.well-known/agent-card.json`).
- `log(event, fields)` receives telemetry problems (default: one JSON line on `console.warn`).
- x402 payments are recorded as charges, from A2A metadata or the x402 HTTP headers. [Observe money](observe-money.md)
  covers charges and costs.

## @a2a-js/sdk servers

Wrap the request handler and the task store. The task store records state changes that background executions save,
including after the response has been sent.

<!-- check:ts node -->
```ts
import type { AgentCard } from '@a2a-js/sdk';
import { type AgentExecutor, DefaultRequestHandler, InMemoryTaskStore } from '@a2a-js/sdk/server';
import { createRecorder } from '@doubleagent-so/observe';
import { instrumentA2AHandler, instrumentTaskStore } from '@doubleagent-so/observe/a2a';

declare const card: AgentCard;
declare const executor: AgentExecutor;

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-agent@1.0.0' });

const taskStore = instrumentTaskStore(new InMemoryTaskStore(), { recorder });
const handler = instrumentA2AHandler(new DefaultRequestHandler(card, taskStore, executor), {
  recorder,
  issuer: 'https://auth.your-agent.example',
});
// Serve `handler` with the SDK's transports as usual.
```

- Give each request its own `ServerCallContext`, as the SDK's transports do. The wrappers use it to link a new task
  to the request that created it; a shared context can attach a task's first states to another operation.
- An authenticated `context.user` is recorded as `{ issuer, subject }`, with the subject hashed.
- The SDK handler does not know its transport: set `binding` if it is not JSON-RPC over HTTP.
- The wrappers check method names, not the SDK's argument types, and return your object's own types. If a newer SDK
  1.x adds a handler method, wait for an update of `@doubleagent-so/observe` before using it through the wrapper.
- `instrumentTaskStore(store, { recorder, abandonOpenTasksOnShutdown: true })` can end every open task on shutdown:
  see [Observe custom](observe-custom.md#abandon-a-task).

## Outbound calls

Record each call your agent makes to another agent, with the called agent's card URL. Put the interceptor first in
`interceptors`, so it sees every call and the final result.

<!-- check:ts node -->
```ts
import { ClientFactory, ClientFactoryOptions } from '@a2a-js/sdk/client';
import { createRecorder } from '@doubleagent-so/observe';
import { a2aTelemetryInterceptor } from '@doubleagent-so/observe/a2a';

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-agent@1.0.0' });

const factory = new ClientFactory(
  ClientFactoryOptions.createFrom(ClientFactoryOptions.default, {
    clientConfig: { interceptors: [a2aTelemetryInterceptor({ recorder })] },
  }),
);
const client = await factory.createFromUrl('https://other-agent.example');
```

- A call that fails is recorded as started with no finish (`incomplete`); the error reaches your code unchanged.
- A stream finishes on the event after which the server closes it (a message, a terminal state or
  `input_required`). A stream your code stops reading early stays `incomplete`.
- Outbound calls record the extensions they request, not the ones the called agent activates: the SDK does not give
  interceptors the response headers.

## What is recorded for A2A

- **Methods** use their A2A 1.0 names on every path: a 0.3 `message/send` is `SendMessage`, `tasks/get` is `GetTask`.
  `protocol.version` and `protocol.binding` still say which wire form was used. A method A2A does not define keeps its
  own name if it is a valid method name, else `unknown`.
- **Outcomes:** a result is `ok`; a JSON-RPC error is `protocol_error` with its code. An HTTP error status without a
  JSON-RPC error (an HTML 5xx page, `404`, `413`, `429`) is `protocol_error` with code `http_error`; `401` and `403`
  are `auth_rejected`. A handler that throws is `protocol_error` with code `internal_error` (an SDK `A2AError` keeps its
  own reason), and the error is rethrown unchanged. A client disconnect or a broken stream is `transport_error`.
- **Ids:** context, task and message ids are kept only as 1–256 printable ASCII characters without spaces. Other ids
  are left out, and the operation is still recorded.
- **Conversations:** one `contextId` is one conversation. Reuse the `contextId` the agent returned on every follow-up
  message, so the turns group into one conversation. A first message without a `contextId` joins the conversation
  the agent assigns in its reply.
- **The `a2a` block:** the caller message's `message_id` and `reference_task_ids`, the extensions the caller requested
  (`A2A-Extensions`, or `X-A2A-Extensions` for 0.3) and, when the operation finishes, the extensions the agent
  activated.
