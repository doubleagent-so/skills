# Portal tools

The portal agent offers the same 16 tools on A2A and on MCP. On A2A, send `POST https://app.doubleagent.so/a2a` with a
data part `{ "skill": "<tool>", …arguments }`. On MCP, call `tools/call` on `POST https://app.doubleagent.so/mcp`. See
[protocols](protocols.md) for the envelopes and versions.

## Auth levels

- `none`: no token. Only `register_agent`.
- `pending`: any valid `daa_` token, including one the owner has not approved yet.
- `token`: an approved token. Before approval the answer is `agent_pending`.

Send the token as `Authorization: Bearer daa_…`.

## Tools

| Tool | Auth | Read-only | Arguments | Result |
| --- | --- | --- | --- | --- |
| `register_agent` | none | no | `name` (1–100, required), `owner_email` (≤ 254), `requested_role` (`viewer` or `admin`), `card_url`, `mcp_url` (URLs ≤ 2048), `token_name` (≤ 60), `pow` (`{ challenge, solution }`) | First `pow_required` with a challenge; then `agent_id`, `registration_id`, `status`, `token` (shown once), `token_id`, `owner_email_masked`, `owner_email_sent`, `expires_at`, `next[]` |
| `set_owner_email` | pending | no | `owner_email` (≤ 254, required) | The `whoami` view and `owner_email_sent` |
| `get_registration` | pending | yes | — | The `whoami` view |
| `whoami` | pending | yes | — | `agent_id`, `name`, `card_url`, `mcp_url`, `registration` (`id`, `status`, `owner_email_masked`, `expires_at`, `context_id`), `memberships[]` (`account_id`, `account_name`, `role`), `proofs[]` (`method`, `label`, `subject`, `verified_at`) |
| `list_tokens` | token | yes | — | `tokens[]` (`id`, `name`, `status`, `created_at`, `last_used_at`), never values |
| `create_token` | token | no | `name` (1–60, required) | `token` (shown once) and its `view` |
| `rotate_token` | token | no | `id` (`atk_…`, required) | A new `token` (shown once) with the same name; the old value stops at once |
| `revoke_token` | token | no | `id` (`atk_…`, required; not the calling token) | The `view`, `status` `revoked` |
| `update_profile` | token | no | `name` (1–100), `card_url`, `mcp_url` (≤ 2048, or `null` to clear) | The `whoami` view; a changed URL drops the proofs that depended on it |
| `start_verification` | token | no | `method` (`a2a_callback`, `mcp_callback`, `card_key`, `mcp_registry_key`, `well_known`, `dns`; required), `target` (≤ 2048) | `proof`, `secret` (shown once) and `instructions[]` |
| `check_verification` | token | no | `proof_id` (`apf_…`, required), `jws` (`card_key`, ≤ 8192), `signature` (`mcp_registry_key`, ≤ 200) | The proof view |
| `list_verifications` | token | yes | — | `proofs[]`, newest first, with the current `nonce` of a pending signed proof |
| `list_sites` | token | yes | `account_id` (`acc_…`) | Sites in your accounts, within your role |
| `site_summary` | token | yes | `site_id` (`st_…`, required), `from`, `to` (unix seconds or ISO date; default the last 7 days) | Humans, bots and agents for the site |
| `list_managed_agents` | token | yes | `account_id` (`acc_…`, required) | The account's managed agents |
| `agent_summary` | token | yes | `agent_id` (`agt_…`, required), `range` (`24h`, `7d`, `30d`, `90d`) | Operations, conversations, errors and latency |

Arguments outside a tool's list are refused with `invalid_argument` and `details.field`. Results carry a one-line text
summary and the JSON data; act on the data.
