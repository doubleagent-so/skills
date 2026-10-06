#!/usr/bin/env node
// Generated helper from Double Agent (source and issues: github.com/doubleagent-so/skills). Do not edit.

// ../../tools/skill-scripts/src/agent-skill/observe.ts
import { resolve as resolve2 } from "node:path";
import { parseArgs } from "node:util";

// src/api.ts
var DEFAULT_API = "https://api.doubleagent.so";
var ApiError = class extends Error {
  constructor(status2, code, message, body, headers) {
    super(message);
    this.status = status2;
    this.code = code;
    this.body = body;
    this.headers = headers;
    this.name = "ApiError";
  }
};
function parseBody(text) {
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}
function apiErrorOf(method, path, res, data) {
  const err = data?.error;
  const code = typeof err === "string" ? err : err?.code ?? `http_${res.status}`;
  const message = typeof err === "object" && err?.message || `${method} ${path} \u2192 ${res.status}${typeof err === "string" ? ` ${err}` : ""}`;
  return new ApiError(res.status, code, message, data, res.headers);
}
var API_TIMEOUT_MS = 3e4;
var isTimeout = (error) => error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
function createApi(base, session, f = fetch, { timeoutMs = API_TIMEOUT_MS } = {}) {
  const root = base.replace(/\/+$/, "");
  return {
    base: root,
    async request(method, path, body, headers = {}) {
      let res;
      const signal = AbortSignal.timeout(timeoutMs);
      try {
        const hasBody = body !== void 0;
        res = await f(`${root}${path}`, {
          method,
          headers: {
            accept: "application/json",
            ...hasBody ? { "content-type": "application/json" } : {},
            ...session ? { authorization: `Bearer ${session}` } : {},
            "user-agent": "doubleagent-cli",
            ...headers
          },
          body: hasBody ? JSON.stringify(body) : void 0,
          signal
        });
      } catch (e) {
        if (isTimeout(e)) throw new ApiError(0, "timeout", `${root} did not answer within ${timeoutMs / 1e3} s`);
        throw new ApiError(0, "network", `cannot reach ${root}: ${e.message}`);
      }
      let text;
      try {
        text = await res.text();
      } catch (e) {
        if (isTimeout(e)) throw new ApiError(0, "timeout", `${root} did not answer within ${timeoutMs / 1e3} s`);
        throw new ApiError(0, "network", `lost the connection to ${root}: ${e.message}`);
      }
      const data = parseBody(text);
      if (!res.ok) throw apiErrorOf(method, path, res, data);
      return { status: res.status, data, headers: res.headers };
    }
  };
}

// src/config.ts
import { chmodSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
function configDir(env) {
  return env.DOUBLEAGENT_CONFIG_DIR ?? join(env.XDG_CONFIG_HOME || join(env.HOME || homedir(), ".config"), "doubleagent");
}
var credentialsPath = (env) => join(configDir(env), "credentials.json");
function loadCredentials(env) {
  try {
    const c = JSON.parse(readFileSync(credentialsPath(env), "utf8"));
    return typeof c.session === "string" && typeof c.api === "string" ? c : null;
  } catch {
    return null;
  }
}

// src/io.ts
var CliError = class extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
    this.name = "CliError";
  }
};

// ../../tools/skill-scripts/src/agent-skill/run.ts
var EXIT = { ok: 0, failed: 1, usage: 2, waiting: 3, closed: 4 };
async function runAgentCommand(command) {
  process.exitCode = await command(process.argv.slice(2), {
    cwd: process.cwd(),
    env: process.env,
    out: (line) => process.stdout.write(`${line}
`),
    err: (line) => process.stderr.write(`${line}
`)
  });
}
function isParseArgsError(error) {
  const code = error instanceof Error ? error.code : void 0;
  return typeof code === "string" && code.startsWith("ERR_PARSE_ARGS");
}
async function guarded(io, work) {
  try {
    return await work();
  } catch (error) {
    if (error instanceof CliError) {
      io.err(error.message);
      return error.exitCode;
    }
    if (isParseArgsError(error)) {
      io.err(error.message);
      return EXIT.usage;
    }
    io.err(`failed: ${error instanceof Error ? error.message : String(error)}`);
    return EXIT.failed;
  }
}

// ../../tools/skill-scripts/src/agent-skill/origin.ts
var LOOPBACK = /* @__PURE__ */ new Set(["127.0.0.1", "localhost", "[::1]"]);
function originOf(value, flag) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new CliError(`${flag} must be an https origin (http only on loopback)`, EXIT.usage);
  }
  const secure = url.protocol === "https:" || url.protocol === "http:" && LOOPBACK.has(url.hostname);
  if (!secure || url.username || url.password) throw new CliError(`${flag} must be an https origin (http only on loopback)`, EXIT.usage);
  return url.origin;
}

// ../../tools/skill-scripts/src/agent-skill/secret-files.ts
import { execFile } from "node:child_process";
import { chmodSync as chmodSync2, existsSync, mkdirSync as mkdirSync2, readFileSync as readFileSync2, statSync, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
var exec = promisify(execFile);
function maskSecret(value) {
  const prefix = /^[a-z]{2,4}_(?:live_|test_)?/.exec(value)?.[0] ?? "";
  return `${prefix}\u2026${value.slice(-4)}`;
}
function writeSecretFile(path, contents) {
  mkdirSync2(dirname(path), { recursive: true, mode: 448 });
  writeFileSync2(path, contents, { mode: 384 });
  chmodSync2(path, 384);
}
function existingFolderOf(path) {
  let folder = dirname(path);
  while (!existsSync(folder) && dirname(folder) !== folder) folder = dirname(folder);
  return folder;
}
async function assertSafeSecretPath(path, cwd) {
  const file = resolve(cwd, path);
  const folder = existingFolderOf(file);
  try {
    await exec("git", ["rev-parse", "--is-inside-work-tree"], { cwd: folder });
  } catch {
    return;
  }
  try {
    await exec("git", ["ls-files", "--error-unmatch", "--", file], { cwd: folder });
    throw new CliError(`${file} is tracked by git: refusing to write a secret into it`, EXIT.usage);
  } catch (error) {
    if (error instanceof CliError) throw error;
  }
  try {
    await exec("git", ["check-ignore", "-q", "--", file], { cwd: folder });
  } catch {
    throw new CliError(`${file} is not git-ignored: add it to .gitignore first`, EXIT.usage);
  }
}
function _envPrefix(line, name) {
  const match = /^(export\s+)?([A-Za-z_][A-Za-z0-9_]*)=/.exec(line);
  return match?.[2] === name ? match[1] ?? "" : null;
}
function hasEnvVar(path, name) {
  return existsSync(path) && readFileSync2(path, "utf8").split("\n").some((line) => _envPrefix(line, name) !== null);
}
function upsertEnvVar(path, name, value) {
  const lines = existsSync(path) ? readFileSync2(path, "utf8").split("\n").filter((line, index2, all) => line || index2 < all.length - 1) : [];
  const index = lines.findIndex((line) => _envPrefix(line, name) !== null);
  if (index >= 0) lines[index] = `${_envPrefix(lines[index], name)}${name}=${value}`;
  else lines.push(`${name}=${value}`);
  writeSecretFile(path, `${lines.join("\n")}
`);
  return index >= 0 ? "replaced" : "added";
}

// ../../tools/skill-scripts/src/agent-skill/observe.ts
var USAGE = `usage: observe.mjs create --name <name> --env test|live [--account acc_\u2026] (--write <env file> [--force] | --print-secret) [--json]
       observe.mjs status <agt_\u2026> [--json]
       observe.mjs test-event <src_\u2026>
Create an agent only when your human asked for it. --force replaces a DOUBLEAGENT_AGENT_KEY already in the env file.
Auth: DOUBLEAGENT_SESSION or the CLI login; an approved admin agent may use DOUBLEAGENT_AGENT_TOKEN. --api <origin> or DOUBLEAGENT_API.
Exit codes: 0 done, 1 failed, 2 usage. Guide: references/observe.md. Source and issues: github.com/doubleagent-so/skills`;
var OPTIONS = {
  name: { type: "string" },
  env: { type: "string" },
  account: { type: "string" },
  write: { type: "string" },
  force: { type: "boolean" },
  api: { type: "string" },
  json: { type: "boolean" },
  "print-secret": { type: "boolean" },
  help: { type: "boolean" }
};
var KEY_VAR = "DOUBLEAGENT_AGENT_KEY";
function client(values, io) {
  const creds = loadCredentials(io.env);
  const bearer = io.env.DOUBLEAGENT_SESSION ?? creds?.session ?? io.env.DOUBLEAGENT_AGENT_TOKEN;
  if (!bearer) throw new CliError("no credentials: log in with the CLI (see references/observe.md) or set DOUBLEAGENT_SESSION", EXIT.usage);
  return createApi(originOf(values.api ?? io.env.DOUBLEAGENT_API ?? creds?.api ?? DEFAULT_API, "--api"), bearer, io.fetch);
}
async function accountFor(api, values) {
  if (values.account) return values.account;
  const me = (await api.request("GET", "/v1/me")).data;
  const managed = me.accounts.filter((account) => account.permissions.includes("agents.manage"));
  if (managed.length === 1) return managed[0].id;
  const choices = managed.map((account) => `${account.id} (${account.name})`).join(", ") || "none";
  throw new CliError(`pass --account: accounts you can add agents to: ${choices}`, EXIT.usage);
}
async function keyFileFor(values, io) {
  if (!values.write) return null;
  const file = resolve2(io.cwd, values.write);
  await assertSafeSecretPath(file, io.cwd);
  if (hasEnvVar(file, KEY_VAR) && !values.force) {
    throw new CliError(`${file} already holds ${KEY_VAR}: pass --force to replace it, or choose another file`, EXIT.usage);
  }
  return file;
}
function saveKey(file, created) {
  try {
    return upsertEnvVar(file, KEY_VAR, created.secret);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new CliError(
      `created ${created.agent.id} with source ${created.source.id}, but could not write key ${created.key.prefix}\u2026 to ${file} (${reason}): revoke that key and add a new one to the source`,
      EXIT.failed
    );
  }
}
async function create(values, io) {
  if (!values.name) throw new CliError(`create needs --name
${USAGE}`, EXIT.usage);
  if (values.env !== "test" && values.env !== "live") throw new CliError("--env must be test or live", EXIT.usage);
  if (!values.write && !values["print-secret"]) {
    throw new CliError("the key is shown once: pass --write <git-ignored env file> or --print-secret", EXIT.usage);
  }
  const file = await keyFileFor(values, io);
  const api = client(values, io);
  const accountId = await accountFor(api, values);
  const body = { account_id: accountId, name: values.name, env: values.env };
  const created = (await api.request("POST", "/v1/managed-agents", body)).data;
  const change = file ? saveKey(file, created) : null;
  const shown = values["print-secret"] ? created.secret : maskSecret(created.secret);
  if (values.json) {
    const written = file ? { written_to: file, change } : {};
    io.out(JSON.stringify({ agent: created.agent, source: created.source, key: created.key, secret: shown, ...written }, null, 2));
    return EXIT.ok;
  }
  io.out(`Created ${created.agent.id} with ${created.source.env} source ${created.source.id} and key ${created.key.id} (${shown}).`);
  if (file) io.out(`${KEY_VAR} ${change} in ${file} (0600, git-ignored). Use it as a server secret, never in client code.`);
  io.out(`Next: wire the recorder, then run "test-event ${created.source.id}".`);
  return EXIT.ok;
}
async function status(agentId, values, io) {
  if (!agentId) throw new CliError(`status needs an agent id (agt_\u2026)
${USAGE}`, EXIT.usage);
  const path = `/v1/managed-agents/${encodeURIComponent(agentId)}`;
  const view = (await client(values, io).request("GET", path)).data;
  if (values.json) {
    io.out(JSON.stringify(view, null, 2));
    return EXIT.ok;
  }
  io.out(`${view.agent.name} (${view.agent.id})`);
  for (const source of view.sources) {
    const keys = source.keys.map((key) => `${key.prefix}\u2026`).join(", ") || "no active key";
    const lastEvent = source.health.last_event_at ?? "never";
    io.out(`  ${source.env} ${source.id} ${source.name}: ${source.health.health}, last event ${lastEvent}; keys ${keys}`);
  }
  return EXIT.ok;
}
async function testEvent(sourceId, values, io, { pollMs = 5e3, deadlineMs = 75e3 }) {
  if (!sourceId) throw new CliError(`test-event needs a source id (src_\u2026)
${USAGE}`, EXIT.usage);
  const api = client(values, io);
  const path = `/v1/agent-sources/${encodeURIComponent(sourceId)}/test-event`;
  const { test_id: testId } = (await api.request("POST", path, {})).data;
  const sleep = io.sleep ?? (async (ms) => await new Promise((done) => {
    setTimeout(done, ms);
  }));
  for (let waited = 0; waited <= deadlineMs; waited += pollMs) {
    const progress = (await api.request("GET", `${path}/${encodeURIComponent(testId)}`)).data;
    if (progress.visible_at) {
      io.out(`Test event ${testId} is visible (stored ${progress.persisted_at}).`);
      return EXIT.ok;
    }
    if (progress.timed_out) break;
    await sleep(pollMs);
  }
  io.err(`Test event ${testId} was not visible within a minute: check the key, the source and ingest health with "status".`);
  return EXIT.failed;
}
async function observeCommand(argv, io, options = {}) {
  return await guarded(io, async () => {
    const { values, positionals } = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: true });
    const [command, id] = positionals;
    if (values.help || !command) {
      io.out(USAGE);
      return values.help ? EXIT.ok : EXIT.usage;
    }
    try {
      if (command === "create") return await create(values, io);
      if (command === "status") return await status(id, values, io);
      if (command === "test-event") return await testEvent(id, values, io, options);
    } catch (error) {
      if (error instanceof ApiError) throw new CliError(`${error.code}: ${error.message}`, error.status === 401 ? EXIT.usage : EXIT.failed);
      throw error;
    }
    throw new CliError(`unknown command "${command}"
${USAGE}`, EXIT.usage);
  });
}

// ../../tools/skill-scripts/src/skill-bin/observe.ts
await runAgentCommand(async (argv, io) => await observeCommand(argv, io));
