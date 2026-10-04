# Observe an MCP server or client

Use the official SDK, `@modelcontextprotocol/sdk` 1.29 or later and below 2. The adapter never imports it: it works on
the SDK's transports through their shape. Get a key and choose first in [Observe](observe.md).

Use one of the two wrappers for a server, never both.

## SDK servers and clients

`instrumentMcpTransport` wraps the transport before you connect it. Requests, responses and notifications pass
through unchanged and in order, and every other transport method (`handleRequest`, `closeSSEStream`, `start`,
`close`) works as before.

A Streamable HTTP server on Node:

<!-- check:ts node -->
```ts
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createRecorder } from '@doubleagent-so/observe';
import { instrumentMcpTransport } from '@doubleagent-so/observe/mcp';

declare const server: McpServer;

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-mcp-server@1.0.0' });

const transport = instrumentMcpTransport(new StreamableHTTPServerTransport({ sessionIdGenerator: randomUUID }), {
  recorder,
  role: 'server',
  binding: 'streamable-http',
  issuer: 'https://auth.your-agent.example',
});
await server.connect(transport);
```

An MCP client records its outbound calls the same way:

<!-- check:ts node -->
```ts
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { createRecorder } from '@doubleagent-so/observe';
import { instrumentMcpTransport } from '@doubleagent-so/observe/mcp';

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-mcp-client@1.0.0' });

const serverUrl = 'https://mcp.other-agent.example/mcp';
const client = new Client({ name: 'my-agent', version: '1.0.0' });
const transport = instrumentMcpTransport(new StreamableHTTPClientTransport(new URL(serverUrl)), {
  recorder,
  role: 'client',
  binding: 'streamable-http',
  serverUrl,
});
await client.connect(transport);
```

| Option | Meaning |
| --- | --- |
| `recorder` | The recorder from `createRecorder`. |
| `role` | `'server'`: requests received are inbound. `'client'`: requests sent are outbound. Server-to-client callbacks are the reverse. |
| `binding` | `'stdio'`, `'sse'`, `'streamable-http'` or `'other'`. |
| `issuer` | Server role: the issuer recorded with the SDK's `authInfo.clientId`, which is hashed. Default `mcp`. The token is never read. |
| `serverUrl` | Client role: the server's URL. Only its origin is recorded, as the counterparty's `card_url`. |
| `onOperation` | `(op, info) => void`, called as each operation starts, with the method, kind, direction, target, request id, session id and params. |
| `log` | `(event, fields) => void` for telemetry failures. Default: JSON lines on `console.warn`. |

The wrapped transport keeps the type of the one you pass in. A stdio server or client wraps its stdio transport with
`binding: 'stdio'`.

## Hand-rolled Streamable HTTP

For a server that does not use the SDK, wrap the fetch handler with `withMcpTelemetry`. In a Worker's entry file:

<!-- check:ts workers -->
```ts
import { createRecorder, type CounterpartyInput } from '@doubleagent-so/observe';
import { withMcpTelemetry } from '@doubleagent-so/observe/mcp';

type Env = { DOUBLEAGENT_AGENT_KEY: string };

/** Your MCP endpoint. */
declare function handleMcp(request: Request, env: Env, ctx: ExecutionContext): Promise<Response>;
/** Names the caller from authentication your code already verified. */
declare function identify(request: Request): CounterpartyInput;

let handle: ((request: Request, env: Env, ctx: ExecutionContext) => Promise<Response>) | undefined;

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    handle ??= withMcpTelemetry(handleMcp, {
      recorder: createRecorder({ key: env.DOUBLEAGENT_AGENT_KEY, adapter: 'my-mcp-server@1.0.0', flushIntervalMs: 0 }),
      identify,
      waitUntil: true,
    });
    return handle(request, env, ctx);
  },
};
```

- **POST:** every JSON-RPC request in the body (one message or a batch) is an operation. A body that is not JSON-RPC
  passes through unrecorded; a body over 1 MiB is one operation named `unknown`. JSON responses are read from a copy
  in the background, up to 4 MiB; SSE responses are observed as they stream, never buffered.
- **GET** streams in a session are observed for the messages the server sends on them. **DELETE** with a session id
  is the `management` operation `session/delete`.
- `waitUntil: true` hands background work to the Workers `ctx`, and the recorder is flushed after each request.
- A handler that throws is recorded as `protocol_error` with code `internal_error`, and the error is rethrown
  unchanged.

## Paid tools

x402 payments in the JSON-RPC `_meta` (and, with `withMcpTelemetry`, in the x402 HTTP headers) are recorded as charges
automatically. To record your own charge or cost, `mcpOperation(recorder, extra)` returns the operation a tool
handler is serving:

<!-- check:ts node -->
```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { createRecorder } from '@doubleagent-so/observe';
import { mcpOperation } from '@doubleagent-so/observe/mcp';
import { z } from 'zod';

declare function search(query: string): Promise<string>;

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'my-mcp-server@1.0.0' });
const server = new McpServer({ name: 'search', version: '1.0.0' });

server.registerTool('search', { inputSchema: { q: z.string() } }, async ({ q }, extra) => {
  mcpOperation(recorder, extra)?.charge({ amount: 5, currency: 'USD', method: 'credits', status: 'settled', basis: 'reported' });
  return { content: [{ type: 'text', text: await search(q) }] };
});
```

It returns `undefined` when the transport is not instrumented with this recorder, the request already finished, or
the request cannot be told apart from another one in flight. It never returns another request's operation. Behind
`withMcpTelemetry`, a hand-rolled handler passes `{ sessionId, requestId, requestInfo: request }`, where `request` is
the very `Request` object it received.

## Conversations

One `Mcp-Session-Id` is one conversation; stateless servers record operations without a conversation. One stdio
connection is also one conversation. A client should keep the `Mcp-Session-Id` the server returned and send it on
every later request, so its calls group into one conversation. An SDK client learns its session id from the
`initialize` response, so its own `initialize` has no conversation.

## What is recorded for MCP

- **Kinds:** `tools/call` is `tool`, `resources/read` is `resource`, `prompts/get` is `prompt`; `initialize` and the
  `*/list` methods are `discovery`; `sampling/createMessage`, `elicitation/create` and `roots/list` are `callback`;
  `ping`, `logging/setLevel`, `completion/complete`, subscriptions and `tasks/*` are `management`; anything else is
  `other`. Other notifications are not operations.
- **Targets:** the tool or prompt name; for resources, the URI without credentials, query or fragment. URIs that can
  carry personal data (`mailto:`, `tel:`, `data:`, `file:`) keep only their scheme.
- **Outcomes:** a result is `ok`; a tool result with `isError: true` is `tool_error`; a JSON-RPC error is
  `protocol_error` with its code; `notifications/cancelled` is `canceled`; a closed connection or broken stream with
  the request pending is `transport_error`. With `withMcpTelemetry`, `401` and `403` are `auth_rejected` and other
  HTTP errors are `protocol_error` with code `http_error`.
- **Counterparty:** for servers, the client's `clientInfo`, its protocol version and capabilities from `initialize`,
  and the principal from `authInfo`; for clients, the server's name and the origin of `serverUrl`.
- **Tasks** (MCP `2025-11-25`): each task state is recorded once per change.
- **Content:** tool arguments and results, prompt and sampling messages, and resource text. Images, audio and binary
  resources are recorded by media type and size only.
