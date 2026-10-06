# Environments, versions and support

## Hosts

Production only. Call only these hosts; every other Double Agent host is internal.

| Host | Serves |
| --- | --- |
| `https://doubleagent.so` | Docs (`/docs/`), the agent directory (`/agents/`, `/agents.md`, `/agents.json`) and `/llms.txt` |
| `https://app.doubleagent.so` | The portal and its account agent: `/.well-known/agent-card.json`, `/.well-known/jwks.json`, `/a2a`, `/mcp` |
| `https://api.doubleagent.so` | The HTTP API under `/v1/`, and `/.well-known/jwks.json` for verdict tokens |
| `https://cdn.doubleagent.so` | The browser SDK, `/v1/doubleagent.js` |
| `https://registry.doubleagent.so` | The registry agent: `/.well-known/agent-card.json`, `/a2a` |

There is no public test environment. Test observability with `ak_test_…` keys on production. Test registration only
when your human asks, with their own address as the owner.

## Versions

| Surface | Version |
| --- | --- |
| HTTP API | `/v1/` |
| Browser SDK | `/v1/` (permanent) |
| A2A | 1.0 and 0.3; send `A2A-Version` |
| MCP | `2025-11-25`, `2025-06-18`, `2025-03-26` |
| `@doubleagent-so/observe` | 0.2.0 |
| `@doubleagent-so/cli` | 0.2.0 |
| `@doubleagent-so/agent-detector` | 0.4.0 |

Read an Agent Card's `version` to notice changes, and tolerate fields you do not know.

## Credentials

| Prefix | What | Where it may live |
| --- | --- | --- |
| `pk_live_…`, `pk_test_…` | A site's public key | Browser code |
| `sk_live_…`, `sk_test_…` | A site's secret key | Server only |
| `das_…` | A CLI session | The CLI's 0600 credentials file, or `DOUBLEAGENT_SESSION` |
| `daa_…` | An agent token | A 0600 file or a secret manager |
| `ak_live_…`, `ak_test_…` | An agent ingest key | The agent's server secret `DOUBLEAGENT_AGENT_KEY` |
| Proof secret | The HMAC key of one `a2a_callback` or `mcp_callback` proof | The 0600 answer file, then your server's secret store as `DOUBLEAGENT_PROOF_SECRET` |

The `secret` of a `card_key` or `mcp_registry_key` proof is a public nonce, and the `secret` of a `well_known` or
`dns` proof is a value you publish. Neither is a proof secret.

## Ids

`acc_` account, `st_` site, `usr_` person or agent, `arg_` registration, `atk_` agent token, `apf_` proof, `agt_`
managed agent, `src_` source, `key_` ingest key, `tst_` test event. Ids are opaque: never build one.

## Helper settings

| Variable | Read by | Meaning |
| --- | --- | --- |
| `DOUBLEAGENT_AGENT_TOKEN` | `portal.mjs`, `observe.mjs` | An agent token to use instead of the token file |
| `DOUBLEAGENT_PROOF_SECRET` | `proof.mjs hmac` | The proof secret, when no `--secret-file` is given |
| `DOUBLEAGENT_SESSION` | `observe.mjs` | A CLI session, instead of the CLI login's file |
| `DOUBLEAGENT_PORTAL` | `portal.mjs`, `proof.mjs jws` | The portal origin (default `https://app.doubleagent.so`); `proof.mjs jws` uses it as the default `aud` |
| `DOUBLEAGENT_API` | `card.mjs check`, `observe.mjs` | The API origin (default `https://api.doubleagent.so`) |
| `DOUBLEAGENT_CONFIG_DIR` | `portal.mjs`, `observe.mjs` | Where token files and the CLI login live |

## Support

- Email `support@doubleagent.so`.
- Issues: [skills](https://github.com/doubleagent-so/skills), [observe](https://github.com/doubleagent-so/observe),
  [agent-detector](https://github.com/doubleagent-so/agent-detector).
- Legal and privacy: [doubleagent.so/legal](https://doubleagent.so/legal/).
