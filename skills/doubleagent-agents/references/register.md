# Register with Double Agent

## Before you start

Register only when your human or operator asked you to, with an owner email they gave you. The owner must expect the
approval email. Registration needs no account and no token.

## Steps

The helper does steps 1–3 and stores the token:

```sh
node scripts/portal.mjs register --name "Travel booker" --owner-email owner@example.com
```

1. Call `register_agent` with `name` (1–100 characters) and, optionally, `owner_email`, `requested_role` (`viewer` or
   `admin`, default `viewer`; the owner decides), `card_url`, `mcp_url` and `token_name`. Without `pow` it fails with
   `pow_required`, and `details` holds `{ challenge, difficulty, format, expires_at }`.
2. Find a `solution` of 1–64 characters of `[A-Za-z0-9_-]` so that the SHA-256 of the UTF-8 string
   `da-agents|<challenge>|<solution>` has `difficulty` leading zero bits (18 by default). The challenge expires after
   10 minutes and works once; reusing it gives `invalid_pow`.
3. Call `register_agent` again with `pow: { challenge, solution }`. The answer has `agent_id`, `registration_id`
   (`arg_…`), `status`, `token` (`daa_…`), `token_id`, `owner_email_masked`, `expires_at`, `next[]` and
   `owner_email_sent`. Store the token at once (a 0600 file or a secret manager): it is shown only in this answer.
4. Without an owner email the status is `needs_owner_email`. Call `set_owner_email` (at most 3 changes per
   registration; each change voids the previous approval link; `owner_email_sent: false` means fix the address or
   retry), or on A2A reply on the registration task with the data part `{ "owner_email": "…" }`.
5. The owner gets a fixed email with no text from your agent and signs in with that address. They see the name, the
   unverified URLs, the request's country and the requested role, pick an account they own or administer (or a new
   one) and a role (`viewer` or `admin`, never `owner`), and approve or decline.
6. Learn the outcome by polling `get_registration` or `whoami` no faster than once a minute, with A2A `GetTask` (the
   task id is the registration id), or by push.
7. A registration expires after 7 days without approval, and its token is revoked.

## Statuses

| Status | A2A task state | Means |
| --- | --- | --- |
| `needs_owner_email` | `input-required` | Give the owner email |
| `pending` | `input-required` | Waiting for the owner |
| `approved` | `completed` | The token works for your role |
| `declined` | `rejected` | The token no longer works; tell your human, do not register again |
| `expired` | `canceled` | Nobody approved within 7 days; register again only if your human asks |

## URLs you give

Nothing is fetched at registration. `card_url` and `mcp_url` must be public HTTPS on the default port with a DNS name:
no IP address, no credentials. The owner sees them as unverified until a proof passes; see [proofs](proofs.md).

## Roles and what the owner keeps

An agent is a `viewer` or an `admin`, never `owner`. Whatever the role, an agent never holds a team or account
permission: it cannot see or change members, invitations, ownership or account settings. Person-only routes (agent
approval, device approval, invitations) answer `403` with `human_only`.

A viewer reads sites, analytics and managed agents. An admin also manages sites, domains and keys, and creates managed
agents and their ingest keys; ask your human first. Agent actions appear in the account's audit log as the agent.
People list, edit and remove agents and revoke their tokens on the portal's Team page. Agents cannot.

## Without the helper

Send the two `register_agent` calls yourself. On A2A (`POST https://app.doubleagent.so/a2a`), the request bodies' data
part:

```json
{ "skill": "register_agent", "name": "Travel booker", "owner_email": "owner@example.com" }
```

and the second call:

```json
{
  "skill": "register_agent",
  "name": "Travel booker",
  "owner_email": "owner@example.com",
  "pow": { "challenge": "<challenge>", "solution": "<solution>" }
}
```

On MCP (`POST https://app.doubleagent.so/mcp`), the same arguments in `tools/call`:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "register_agent",
    "arguments": { "name": "Travel booker", "owner_email": "owner@example.com" }
  }
}
```

To solve the proof of work in any language, increment a counter, hash `da-agents|<challenge>|<counter>` with SHA-256,
and stop when the first `difficulty` bits are zero. Give up after 60 seconds or above 24 bits, and report.

## After approval

`whoami` shows your accounts and roles. Next: [tokens](tokens.md), [tools](tools.md).
