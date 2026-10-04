# A2A and MCP

The portal agent offers the same tools on A2A and on MCP. Send `Authorization: Bearer daa_…` on every request except
`register_agent`. A request body is at most 64 KiB, and each POST carries one JSON-RPC message.

## A2A

Send `POST https://app.doubleagent.so/a2a` with the header `A2A-Version: 1.0` or `0.3`; another version answers
`-32009` with `data.supported`. Methods: 1.0 `SendMessage`, `GetTask`, `CancelTask`, `ListTasks`; 0.3 `message/send`,
`tasks/get`, `tasks/cancel`. The push config methods of both versions are in the [push](push.md) reference.

Put the tool in a data part `{ "skill": "<tool>", …arguments }`; a message without one gets the help artifact. A tool
answers with a completed Task carrying one artifact named after the tool: a text summary and the JSON data. A failure
is a Task in `TASK_STATE_AUTH_REQUIRED` / `auth-required` (`unauthorized`, `agent_pending`), `TASK_STATE_INPUT_REQUIRED`
/ `input-required` (`pow_required`) or `TASK_STATE_FAILED` / `failed` (every other code), named in 1.0 / 0.3. Its status
message has the data part `{ "error": { code, message, details? } }`. `invalid_argument` and an unknown tool are a
JSON-RPC `-32602` instead. Other JSON-RPC errors: `-32700` parse, `-32600` invalid request, `-32601` unknown method,
`-32001` a task that is not your own registration, `-32002` canceling a registration (it expires instead), `-32004`
streaming (`streaming: false`), `-32007` extended card. `ListTasks` answers an empty list: only registrations persist.

### Registration task and conversations

`register_agent` answers a Task whose `id` is the registration id; `GetTask` with that id and your token reads it back.
Reply on it with `message.taskId` and a data part `{ "owner_email": "…" }`. States: [register](register.md#statuses).

The agent's card says: "Keep the `contextId` from my first answer and send it on every later message; to answer a
task, send its `taskId` with the same `contextId` (or none)." Without a `contextId`, the agent mints `ctx_…`. Your
own must be 1–128 characters of `[A-Za-z0-9_.:-]` and not token-shaped; anything else is `-32602`, and so is a reply
whose `contextId` differs from its task's. Prefer the minted `ctx_…`.

### Example: whoami on A2A 1.0

`POST /a2a` with `A2A-Version: 1.0`, `Authorization: Bearer daa_…` and `Content-Type: application/json`:

<!-- check:a2a version=1.0 -->
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "SendMessage",
  "params": {
    "message": {
      "messageId": "msg-1",
      "role": "ROLE_USER",
      "parts": [{ "data": { "skill": "whoami" }, "mediaType": "application/json" }]
    }
  }
}
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "task": {
      "id": "…",
      "contextId": "ctx_…",
      "status": {
        "state": "TASK_STATE_COMPLETED",
        "message": {
          "messageId": "…",
          "role": "ROLE_AGENT",
          "parts": [{ "text": "Done.", "mediaType": "text/plain" }],
          "taskId": "…",
          "contextId": "ctx_…"
        },
        "timestamp": "…"
      },
      "artifacts": [
        {
          "artifactId": "…",
          "name": "whoami",
          "parts": [
            {
              "text": "Travel booker (usr_…). Registration approved, owner o***@example.com. Accounts: Shop as viewer.",
              "mediaType": "text/plain"
            },
            {
              "data": {
                "agent_id": "usr_…",
                "name": "Travel booker",
                "card_url": "https://agent.example/.well-known/agent-card.json",
                "mcp_url": null,
                "registration": {
                  "id": "arg_…",
                  "status": "approved",
                  "owner_email_masked": "o***@example.com",
                  "expires_at": 1760000000,
                  "context_id": "ctx_…"
                },
                "memberships": [{ "account_id": "acc_…", "account_name": "Shop", "role": "viewer" }],
                "proofs": []
              },
              "mediaType": "application/json"
            }
          ]
        }
      ]
    }
  }
}
```

Send the `contextId` from this answer on your next message.

### Example: a missing token on A2A 0.3

`message/send` with `A2A-Version: 0.3` and no `Authorization` header:

<!-- check:a2a version=0.3 token=none -->
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "message/send",
  "params": {
    "message": {
      "kind": "message",
      "messageId": "msg-2",
      "role": "user",
      "parts": [{ "kind": "data", "data": { "skill": "whoami" } }]
    }
  }
}
```

Response (0.3 returns the Task itself):

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "kind": "task",
    "id": "…",
    "contextId": "ctx_…",
    "status": {
      "state": "auth-required",
      "message": {
        "kind": "message",
        "messageId": "…",
        "role": "agent",
        "parts": [
          { "kind": "text", "text": "Error unauthorized: This tool needs Authorization: Bearer daa_… (the token register_agent returned)." },
          {
            "kind": "data",
            "data": {
              "error": {
                "code": "unauthorized",
                "message": "This tool needs Authorization: Bearer daa_… (the token register_agent returned)."
              }
            }
          }
        ],
        "taskId": "…",
        "contextId": "ctx_…"
      },
      "timestamp": "…"
    }
  }
}
```

## MCP

Send `POST https://app.doubleagent.so/mcp`: Streamable HTTP with JSON responses, no SSE (`GET` and `DELETE` answer
405). Versions: `2025-11-25`, `2025-06-18`, `2025-03-26`; `initialize` answers with yours when listed, else the
newest, and an unlisted `MCP-Protocol-Version` header is HTTP 400. Methods: `initialize`, then
`notifications/initialized` (no `id`; 202, no body), `ping`, `tools/list`, `tools/call`; others are `-32601`, and a
batch (an array) is `-32600`. A tool failure is a result with `isError: true` and `structuredContent.error`; only an
unknown tool is a protocol error (`-32602`).

### Sessions

Keep the `Mcp-Session-Id` from `initialize` and send it on every request; on 404, initialize again. The id is `mcs_…`
and lives 24 hours. A session the portal did not issue, or one that expired, answers HTTP 404 with JSON-RPC `-32001`;
initialize again without the header. A request without a session is still served. A session groups your calls into
one conversation; it grants nothing.

### Example: initialize

<!-- check:mcp -->
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-11-25",
    "capabilities": {},
    "clientInfo": { "name": "travel-booker", "version": "1.0.0" }
  }
}
```

Response (with the header `Mcp-Session-Id: mcs_…`):

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-11-25",
    "capabilities": { "tools": { "listChanged": false } },
    "serverInfo": { "name": "doubleagent", "title": "Double Agent", "version": "…" },
    "instructions": "Double Agent's account tools. …"
  }
}
```

### Example: tools/call

<!-- check:mcp -->
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": { "name": "whoami", "arguments": {} } }
```

Response:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "content": [
      { "type": "text", "text": "Travel booker (usr_…). Registration approved, owner o***@example.com. Accounts: Shop as viewer." }
    ],
    "structuredContent": {
      "agent_id": "usr_…",
      "name": "Travel booker",
      "card_url": "https://agent.example/.well-known/agent-card.json",
      "mcp_url": null,
      "registration": {
        "id": "arg_…",
        "status": "approved",
        "owner_email_masked": "o***@example.com",
        "expires_at": 1760000000,
        "context_id": "ctx_…"
      },
      "memberships": [{ "account_id": "acc_…", "account_name": "Shop", "role": "viewer" }],
      "proofs": []
    },
    "isError": false
  }
}
```
