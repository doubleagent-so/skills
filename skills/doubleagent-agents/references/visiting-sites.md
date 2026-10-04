# Visiting websites as an agent

Sites that run Double Agent classify each browser session as `human`, `bot` or `agent`. This page says what such a
site sees and how to be identified correctly. Installing Double Agent on a site is the `doubleagent` skill's job.

## What a site sees

- `class` with a `probability` for each class, and a `confidence`.
- `agent`: `{ family, id, operator, controller, verified, method }`.
- `reasons`: the evidence codes behind the verdict.
- `recommendation`: `allow`, `tag`, `challenge`, `step_up`, `rate_limit` or `deny`. The site may act on it; Double
  Agent never blocks by default.

The detection engine is open source: [agent-detector](https://github.com/doubleagent-so/agent-detector). The full
shape is on [Verdict](https://doubleagent.so/docs/verdict/).

## Evidence, strongest first

| `method` | Means |
| --- | --- |
| `signed` | Web Bot Auth: an RFC 9421 signature with `tag="web-bot-auth"`, checked against `<Signature-Agent>/.well-known/http-message-signatures-directory` |
| `authenticated` | An identity the server authenticated |
| `ip` | The request came from the operator's published IP ranges |
| `rdns` | Reverse DNS matched the operator |
| `declared` | A User-Agent product names the family; it proves nothing |
| `marker` | Automation or agent-browser artefacts |
| `detected` | Behavior alone |
| `spoofed` | A claim the evidence contradicts |

A declared operator that disagrees with the verified one is flagged as an attribution conflict. Only server-checked
evidence sets `verified`; an agent cannot prove who it is from the browser alone
([Declared cover](https://doubleagent.so/docs/cover/)).

## Be identified correctly

1. Sign your requests with Web Bot Auth, and publish your key directory at
   `/.well-known/http-message-signatures-directory` on the host your `Signature-Agent` header names.
2. Keep a stable User-Agent product, `operator.agent-name/1.0`, optionally with your ERC-8004 identity:
   `operator.agent-name/1.0 (erc8004=eip155:1:0x8004a169fb4a3325136eb29fa0ceb6d2e539a432:22)`.
3. Publish an Agent Card ([Agent Cards](https://doubleagent.so/docs/agent-cards/)).
4. Optionally sign telemetry with an Ethereum wallet (ERC-8128), as the `doubleagent` skill's ERC-8004 reference
   describes.

Do not spoof a browser or another agent's family: spoofing is detected and recorded as `spoofed`.

## If you operate a site

Read a verdict on your server with `POST https://api.doubleagent.so/v1/check`, or verify the signed token with
`POST https://api.doubleagent.so/v1/verify`. Token keys are at `https://api.doubleagent.so/.well-known/jwks.json`, not
the portal agent's JWKS. Routes and keys: [REST API](https://doubleagent.so/docs/rest/).
