# Simulate a visit on a website

Use a fresh browser to compare repeated bot actions and agent-style pause-and-act behavior on a website the user wants to test. No Double Agent account or SDK
installation is required for the local detector. The installed SDK verdict is
also recorded when available.

## Run the public CLI

Use Node.js 20 or later. The npm CLI includes Playwright as an optional dependency;
do not omit optional dependencies when installing it for simulation. Install its
Chromium browser once, then run from any directory:

```sh
npx @doubleagent-so/cli simulate --install-browser
npx @doubleagent-so/cli simulate https://your-site.example --scenario observe --duration 15
npx @doubleagent-so/cli simulate https://your-site.example --scenario agent --pause 2200 --duration 20 --json
```

Replace the example URL. The command opens the website. Bot and agent behavior scenarios use real browser
input on temporary, inert test controls added to that page. They do not act on
the site’s own forms or buttons. These scripted patterns are not real LLM agents. It writes
`doubleagent-simulation.json` in the current directory; use `--output` for another
path. `--json` also prints the report and suppresses progress output.

## Use the installed skill helper

The helper is bundled from the same source as the CLI and includes the detector
asset. It needs Playwright in the current project's dependencies or beside the
installed skill. In a temporary working directory, for example:

```sh
npm install --no-save --package-lock=false playwright@1.63.0
node /path/to/doubleagent/scripts/simulate.mjs --install-browser
node /path/to/doubleagent/scripts/simulate.mjs https://your-site.example --scenario bot --json
```

Replace `/path/to/doubleagent` with the installed skill directory. The installation
command downloads a dependency into that working directory; browser setup downloads
Chromium. Keep `simulation-probe.js` beside `simulate.mjs`.

## Choose parameters

| Option | Meaning |
| --- | --- |
| `--scenario observe` | No supplied fixture. Playwright is still automation; this is not a human control. |
| `--scenario bot` | Repeat precise actions with short pauses (350 ms by default). |
| `--scenario agent` | Insert text and act between quiet pauses (2200 ms by default). No agent marker. |
| `--evidence marker --agent browser-use.agent` | Explicitly test an agent marker; with bot scenario, supply the Playwright global fixture. |
| `--pause 2200` | Pause between behavior actions, 100–10000 ms. Shorter pauses may change the detected class. |
| `--list` | List available agent IDs and site profiles without launching a browser. |
| `--profile generic` | Detector profile; choose a listed profile such as `saas` or `ecommerce`. |
| `--duration 20` | Observation seconds, 2–120; default 20. |
| `--delay 1500` | First action or fixture delay in milliseconds, shorter than the duration. Global scans can take a few seconds. |
| `--scroll 300 --interval 1500` | Scroll pixels per interval; default 0. Scrolling during pauses can change rhythm evidence. |
| `--user-agent 'ExampleClient/1.0'` | Override the browser UA declaration; cannot supply a verified IP or signature. |
| `--headed` | Show Chromium. It remains an instrumented browser. |
| `--output ./results/visit.json` | Save a report at this path, creating parent directories. |

For a real human control, ask a person to interact with the website in a normal
browser or use the lab's Observe demo. For a real agent validation, drive the
website with that actual agent without a fixture and record its provenance.
Do not relabel a scripted run as a real human or actual provider session.

## Optional dashboard reporting

The default blocks standard Double Agent collection/check/presence/hit/evaluation
paths and disables service workers in the fresh context. The site still receives
ordinary requests and its other analytics can run. The independent probe never
sends telemetry or overwrites the installed SDK's storage.

Only add `--report` when the user wants synthetic visits in the site's configured
dashboard. It allows the site's installed SDK to report under its existing consent
and configuration. Prefer a dedicated test site. Visits are not automatically
marked as synthetic in HQ, and the fixture can influence the installed SDK and its
analytics integrations. No account creation or secret key is needed.

```sh
npx @doubleagent-so/cli simulate https://your-test-site.example --scenario agent --report
```

`reporting.outcome=accepted` means a collection request received a 2xx response;
it does not establish that the desired final class is indexed in the dashboard.
`not-confirmed` means no collection succeeded; check the installed SDK and consent.

## Interpret the report

Compare `snapshots[].behaviorOnly` (diagnostic excluding identity/environment),
`features` and `stats` with `snapshots[].verdict` (the bundled local detector),
`snapshots[].installed.verdict` (the website SDK), `injected`, `signals` and model
versions. `pass` means the requested fixture's signal was collected; it does not
assert a particular class or measure real-world accuracy. `observed` has no fixture
assertion and does not mean the requested class was detected. `actionsCompleted`
counts completed behavior steps. The full verdict is never forced by the preset. Exit `1` indicates invalid input, browser/navigation failure, missing
fixture evidence or unconfirmed requested reporting. A normal completed observation
or collected fixture exits `0`. Check `errors` for target-page script problems.

Generic webdriver/headless signals establish automation, not an LLM controller.
Agent markers and interaction patterns are clues that can be imitated. IP/signature
verification and authorization are separate server-side questions. When the local
and installed results differ, inspect both versions and evidence before changing
classification rules; do not force a desired verdict.

## Declare and authenticate identity

`--agent-name acme.shopping-assistant` appends a declaration to the browser's real
User-Agent. `--token-id 22` adds an ERC-8004 reference (chain 1 by default); neither
requires an RPC or changes the behavioral class. `--report` allows the installed
SDK to report the declaration to an API deployment supporting it.

Add `--resolve-identity` with `DOUBLEAGENT_ETHEREUM_RPC_URL` configured to attach a
read-only chain snapshot to the local report. For Ethereum-signed telemetry use
`--sign-requests --sign-api https://api.doubleagent.so --report`, with the private
key in the local environment. See [identity and signing](erc8004.md) for setup,
badge meanings and limitations.

## Confirm that a run happened

The terminal prints whether Chromium is visible or headless and whether dashboard
reporting is enabled. During a behavior run it prints each completed click/text
entry, detector changes and collection responses. The temporary browser panel
also shows the latest completed action. Use `--headed` to watch the browser; it
closes when the run finishes.

The report contains `actions` with step, elapsed time and description, plus
`reporting.receipts` with the API endpoint (without its query), SDK session ID,
HTTP status and acceptance result. A 2xx response with `DA-Telemetry-Accepted: 0`
is rejected telemetry, not a successful collection. `--json` prints only the report.

With reporting enabled, search the printed SDK session ID in the site's dashboard.
The report's run ID and the independent local detector's session ID are different
from the installed SDK's session ID. Collection acceptance does not confirm indexing.
A declared name needs the updated API ingestion code in production; the name alone
does not prove wallet ownership or determine the behavioral class.
