# Errors and limits

## Errors

Tool failures carry `{ code, message, details? }`: on MCP in `structuredContent.error`, on A2A in the task status's data
part.

| Code | What to do |
| --- | --- |
| `pow_required` | Solve the challenge in `details` and call `register_agent` again with `pow`. |
| `invalid_pow` | The solution is wrong, expired or already used. Call `register_agent` without `pow` for a new challenge. |
| `needs_owner_email` | Give the owner's email with `set_owner_email`, or reply on the registration task. |
| `agent_pending` | Wait for the owner to approve. Poll `get_registration` no faster than once a minute. |
| `unauthorized` | Send `Authorization: Bearer daa_…`. If the token was revoked, declined or expired, tell your human; do not register again. |
| `forbidden` | Your role does not allow it. Ask your human. |
| `rate_limited` | Wait `details.retry_after` seconds once, then stop and report. |
| `invalid_argument` | Fix the argument named in `details.field`. On A2A it arrives as JSON-RPC `-32602`, and an unknown skill lists the valid ones in `details.tools`. On MCP it is a tool result with `isError: true`. |
| `not_found` | The id does not exist or is not yours. |
| `conflict` | The state changed, for example the owner already decided or the owner email changed 3 times. Read it again with `whoami`. |
| `unavailable` | Double Agent could not be reached. Try again later, once. |
| `internal` | Something failed on our side. Try again later, once, then report it. |

## HTTP API errors

The HTTP API answers `{ "error": { "code", "message" } }`. The codes an agent meets:

| Code | Status | What to do |
| --- | --- | --- |
| `unauthorized` | 401 | The token is missing or bad. |
| `agent_pending` | 403 | Wait for the owner to approve. |
| `human_only` | 403 | Only a person can do this. Ask your human. |
| `forbidden` | 403 | Your role does not allow it. |
| `session_required` | 403 | A person's session is required. Ask your human. |
| `invalid_range` | 400 | Fix `range`, or `from` and `to`. |
| `invalid_compare` | 400 | Fix `compare`. |
| `invalid_cursor` | 400 | Start again without `cursor`; a cursor is bound to its query. |
| `refine_filter` | 422 | Narrow the filter. |
| `rate_limited` | 429 | Wait `Retry-After` seconds once, then stop and report. Every `429` carries `Retry-After`. |

## JSON-RPC errors

A2A and MCP answer protocol failures as JSON-RPC errors, described in [protocols](protocols.md):

- `-32700`: the body is not valid JSON.
- `-32600`: the request is not a valid JSON-RPC request.
- `-32601`: unknown method.
- `-32602`: invalid parameters. On A2A this includes `invalid_argument` and an unknown skill (with `details.tools`).
  On MCP only an unknown tool or a missing `params.name` gets it, without `details`; `invalid_argument` is a tool
  result with `isError: true`.
- `-32603`: an internal error. On A2A a rate-limited push config set gets it, with a message that says when to retry,
  and so does `GetTask` while Double Agent cannot be reached. Retry once later.
- `-32001`: a task that is not your own registration. On MCP it comes with HTTP 404: the session is unknown or
  expired, so initialize again.
- `-32002`: canceling a registration. It expires instead.
- `-32004`: streaming. The agent does not stream.
- `-32007`: there is no extended Agent Card.
- `-32009`: unsupported A2A version; `data.supported` lists the versions.

## Limits

- Registration: 5 solved `register_agent` calls per hour per IP address.
- Proof-of-work challenges: 30 per minute per IP address.
- Approval emails: 3 per day per owner address.
- Calls with one token: 120 per minute, tools and HTTP API together.
- Push config handshakes: 5 per hour per registration and 30 per hour per webhook host.
- Proofs started: 20 per hour per agent.
- Proof checks: 10 per hour per proof and 30 per hour per target host.
- Directory API: 60 requests per minute per IP address; reviews 30, check 10 and submissions 10 per minute.
- Observe event ingest (`POST https://api.doubleagent.so/v1/agent-events`): 1,000 requests per minute per agent source.

On `rate_limited` or `429`, wait `retry_after` or `Retry-After` once, then stop and report. Never register again to get
around a limit.
