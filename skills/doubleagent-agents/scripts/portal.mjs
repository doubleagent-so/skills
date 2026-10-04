#!/usr/bin/env node
// Generated helper from Double Agent (source and issues: github.com/doubleagent-so/skills). Do not edit.

// src/agent-skill/portal.ts
import { accessSync, constants, existsSync as existsSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync2 } from "node:fs";
import { dirname as dirname2, join as join2, resolve as resolve2 } from "node:path";
import { parseArgs } from "node:util";

// src/api.ts
var DEFAULT_PORTAL = "https://app.doubleagent.so";

// src/config.ts
import { homedir } from "node:os";
import { join } from "node:path";
function configDir(env) {
  return env.DOUBLEAGENT_CONFIG_DIR ?? join(env.XDG_CONFIG_HOME || join(env.HOME || homedir(), ".config"), "doubleagent");
}

// src/io.ts
var CliError = class extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
    this.name = "CliError";
  }
};

// src/agent-skill/run.ts
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

// src/agent-skill/mcp-client.ts
var PROTOCOL_VERSION = "2025-11-25";
var McpClient = class {
  #endpoint;
  #token;
  #session;
  #fetch;
  #timeoutMs;
  #initialized;
  #nextId = 1;
  constructor({ endpoint, token = null, sessionId = null, fetch: fetcher = fetch, timeoutMs = 3e4 }) {
    this.#endpoint = endpoint;
    this.#token = token;
    this.#session = sessionId;
    this.#fetch = fetcher;
    this.#timeoutMs = timeoutMs;
    this.#initialized = sessionId !== null;
  }
  get sessionId() {
    return this.#session;
  }
  async callTool(name, args) {
    if (!this.#initialized) await this.#initialize();
    const call2 = { method: "tools/call", params: { name, arguments: args } };
    let reply = await this.#send(call2);
    if (reply.status === 404) {
      this.#session = null;
      await this.#initialize();
      reply = await this.#send(call2);
      if (reply.status === 404) throw new CliError("the MCP session was refused twice; stopping", EXIT.failed);
    }
    return this.#toolAnswer(reply);
  }
  async #initialize() {
    const params = { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: { name: "doubleagent-agents-skill", version: "1" } };
    const reply = await this.#send({ method: "initialize", params });
    if (reply.status !== 200 || !reply.body?.result) throw new CliError(`MCP initialize failed (HTTP ${reply.status})`, EXIT.failed);
    this.#session = reply.headers.get("mcp-session-id");
    await this.#send({ method: "notifications/initialized" }, { notification: true });
    this.#initialized = true;
  }
  #toolAnswer(reply) {
    if (reply.status !== 200 || !reply.body) throw new CliError(`the portal answered HTTP ${reply.status}`, EXIT.failed);
    if (reply.body.error) throw new CliError(`MCP error ${reply.body.error.code}: ${reply.body.error.message}`, EXIT.failed);
    const { structuredContent, isError } = reply.body.result ?? {};
    if (isError) {
      const error = structuredContent?.error;
      return { ok: false, error: error ?? { code: "internal", message: "unknown tool error" } };
    }
    return { ok: true, data: structuredContent ?? {} };
  }
  async #send(message, { notification = false } = {}) {
    const headers = {
      "content-type": "application/json",
      accept: "application/json, text/event-stream",
      "mcp-protocol-version": PROTOCOL_VERSION,
      ...this.#token ? { authorization: `Bearer ${this.#token}` } : {},
      ...this.#session ? { "mcp-session-id": this.#session } : {}
    };
    const body = JSON.stringify({ jsonrpc: "2.0", ...notification ? {} : { id: this.#nextId++ }, ...message });
    const response = await this.#fetch(this.#endpoint, { method: "POST", headers, body, signal: AbortSignal.timeout(this.#timeoutMs) });
    const text = await response.text();
    try {
      return { status: response.status, headers: response.headers, body: text ? JSON.parse(text) : null };
    } catch {
      throw new CliError(`the portal answered HTTP ${response.status} with a body that is not JSON`, EXIT.failed);
    }
  }
};

// src/agent-skill/origin.ts
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

// src/agent-skill/pow.ts
import { createHash } from "node:crypto";
var MAX_POW_BITS = 24;
var POW_DEADLINE_MS = 6e4;
var CHECK_CLOCK_EVERY = 4096;
function leadingZeroBits(hash) {
  let bits = 0;
  for (const byte of hash) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    return bits + Math.clz32(byte) - 24;
  }
  return bits;
}
function solveAgentPow(challenge, difficulty, { now = Date.now, deadlineMs = POW_DEADLINE_MS } = {}) {
  if (!Number.isInteger(difficulty) || difficulty < 0 || difficulty > MAX_POW_BITS) {
    throw new CliError(
      `the portal asked for ${difficulty} bits of proof of work; this helper solves at most ${MAX_POW_BITS}: stop and report it`,
      EXIT.failed
    );
  }
  const deadline = now() + deadlineMs;
  for (let counter = 0; ; counter++) {
    const solution = counter.toString(36);
    if (leadingZeroBits(createHash("sha256").update(`da-agents|${challenge}|${solution}`).digest()) >= difficulty) return solution;
    if (counter % CHECK_CLOCK_EVERY === 0 && now() > deadline) {
      throw new CliError(`gave up on the proof of work after ${deadlineMs / 1e3} s`, EXIT.failed);
    }
  }
}

// src/agent-skill/secret-files.ts
import { execFile } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
var exec = promisify(execFile);
var SECRET_KEYS = /* @__PURE__ */ new Set(["token", "secret"]);
function maskSecret(value) {
  const prefix = /^[a-z]{2,4}_(?:live_|test_)?/.exec(value)?.[0] ?? "";
  return `${prefix}\u2026${value.slice(-4)}`;
}
function collectSecrets(value) {
  if (Array.isArray(value)) return value.flatMap(collectSecrets);
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(
    ([key, item]) => SECRET_KEYS.has(key) && typeof item === "string" && item ? [item] : collectSecrets(item)
  );
}
function maskSecrets(value, secrets) {
  let text = JSON.stringify(value);
  for (const secret of secrets) text = text.split(secret).join(maskSecret(secret));
  return JSON.parse(text);
}
function writeSecretFile(path, contents) {
  mkdirSync(dirname(path), { recursive: true, mode: 448 });
  writeFileSync(path, contents, { mode: 384 });
  chmodSync(path, 384);
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

// src/agent-skill/portal.ts
var USAGE = `usage: portal.mjs register --name <name> [--owner-email <email>] [--role viewer|admin] [--card-url <url>] [--mcp-url <url>] [--token-file <path>] [--json] [--print-secret]
       portal.mjs status [--name <name> | --token-file <path>] [--json]
       portal.mjs call <tool> [--args '<json object>'] [--name <name> | --token-file <path>] [--secret-file <path> [--force]] [--print-secret]
--portal <origin> (default https://app.doubleagent.so or DOUBLEAGENT_PORTAL). DOUBLEAGENT_AGENT_TOKEN replaces the token file for status and call.
--force replaces an existing --secret-file: the secret in it is lost.
Exit codes: 0 done, 1 failed, 2 usage, 3 waiting for approval, 4 declined, expired or revoked.
Tools: references/tools.md. Source and issues: github.com/doubleagent-so/skills`;
var OPTIONS = {
  name: { type: "string" },
  "owner-email": { type: "string" },
  role: { type: "string" },
  "card-url": { type: "string" },
  "mcp-url": { type: "string" },
  "token-file": { type: "string" },
  "secret-file": { type: "string" },
  args: { type: "string" },
  portal: { type: "string" },
  json: { type: "boolean" },
  "print-secret": { type: "boolean" },
  force: { type: "boolean" },
  help: { type: "boolean" }
};
var SECRET_TOOLS = /* @__PURE__ */ new Set(["create_token", "rotate_token", "start_verification"]);
var MAX_RETRY_WAIT_S = 60;
var STATUS_EXIT = { approved: EXIT.ok, pending: EXIT.waiting, needs_owner_email: EXIT.waiting, declined: EXIT.closed, expired: EXIT.closed };
var ERROR_EXIT = { agent_pending: EXIT.waiting, unauthorized: EXIT.closed };
var slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64);
function tokenPath(values, io) {
  if (values["token-file"]) return resolve2(io.cwd, values["token-file"]);
  if (!values.name) return null;
  const name = slug(values.name);
  if (!name) throw new CliError("--name needs at least one letter or digit", EXIT.usage);
  return join2(configDir(io.env), "agent", `${name}.json`);
}
function portalOf(values, io) {
  return originOf(values.portal ?? io.env.DOUBLEAGENT_PORTAL ?? DEFAULT_PORTAL, "--portal");
}
function failure(io, error) {
  io.err(`error ${error.code}: ${error.message}`);
  return ERROR_EXIT[error.code] ?? EXIT.failed;
}
async function sleep(ms) {
  await new Promise((done) => {
    setTimeout(done, ms);
  });
}
async function callOnce(client, tool, args, io) {
  const first = await client.callTool(tool, args);
  if (first.ok || first.error.code !== "rate_limited") return first;
  const waitS = Number(first.error.details?.retry_after);
  if (!Number.isFinite(waitS) || waitS > MAX_RETRY_WAIT_S) return first;
  io.err(`rate limited: waiting ${waitS} s once`);
  await (io.sleep ?? sleep)(waitS * 1e3);
  return await client.callTool(tool, args);
}
async function prepareTokenFile(path, io) {
  await assertSafeSecretPath(path, io.cwd);
  try {
    mkdirSync2(dirname2(path), { recursive: true, mode: 448 });
    accessSync(dirname2(path), constants.W_OK);
  } catch {
    throw new CliError(`cannot write the token file in ${dirname2(path)}: pass another --token-file`, EXIT.usage);
  }
}
function registerArgs(values) {
  if (values.role && !["viewer", "admin"].includes(values.role)) throw new CliError("--role must be viewer or admin", EXIT.usage);
  return {
    name: values.name,
    ...values["owner-email"] ? { owner_email: values["owner-email"] } : {},
    ...values.role ? { requested_role: values.role } : {},
    ...values["card-url"] ? { card_url: values["card-url"] } : {},
    ...values["mcp-url"] ? { mcp_url: values["mcp-url"] } : {}
  };
}
async function registerWithPow(client, args, io) {
  const challenge = await callOnce(client, "register_agent", args, io);
  if (challenge.ok) return { ok: false, error: { code: "internal", message: "expected a proof-of-work challenge" } };
  if (challenge.error.code !== "pow_required") return challenge;
  const details = challenge.error.details;
  if (typeof details?.challenge !== "string" || typeof details.difficulty !== "number") {
    return { ok: false, error: { code: "internal", message: "the challenge is malformed" } };
  }
  const solution = solveAgentPow(details.challenge, details.difficulty);
  return await callOnce(client, "register_agent", { ...args, pow: { challenge: details.challenge, solution } }, io);
}
function printRegistered(result, path, values, io) {
  if (values.json) {
    io.out(JSON.stringify({ ...maskSecrets(result, values["print-secret"] ? [] : [result.token]), token_file: path }, null, 2));
    return;
  }
  io.out(`Registered ${result.agent_id} (registration ${result.registration_id}): ${result.status}.`);
  io.out(result.owner_email_sent ? `Approval email sent to ${result.owner_email_masked}.` : 'No approval email went out: give the owner email with "call set_owner_email".');
  io.out(`Token ${values["print-secret"] ? result.token : maskSecret(result.token)} stored in ${path} (0600).`);
  io.out('Check the outcome with "status", no more than once a minute.');
}
async function register(values, io) {
  if (!values.name) throw new CliError(`register needs --name
${USAGE}`, EXIT.usage);
  const path = tokenPath(values, io);
  if (existsSync2(path)) throw new CliError(`already registered: ${path} exists. Run "status", or pass another --token-file.`, EXIT.usage);
  const args = registerArgs({ ...values, name: values.name });
  const portal = portalOf(values, io);
  await prepareTokenFile(path, io);
  const client = new McpClient({ endpoint: `${portal}/mcp`, fetch: io.fetch });
  const answer = await registerWithPow(client, args, io);
  if (!answer.ok) return failure(io, answer.error);
  const result = answer.data;
  const saved = { portal, agent_id: result.agent_id, registration_id: result.registration_id, token_id: result.token_id, token: result.token, mcp_session_id: client.sessionId, saved_at: (/* @__PURE__ */ new Date()).toISOString() };
  writeSecretFile(path, `${JSON.stringify(saved, null, 2)}
`);
  printRegistered(result, path, values, io);
  return STATUS_EXIT[result.status] ?? EXIT.failed;
}
function readTokenFile(path) {
  let file;
  try {
    file = JSON.parse(readFileSync2(path, "utf8"));
  } catch {
    throw new CliError(`${path} is not a token file this helper wrote`, EXIT.usage);
  }
  if (typeof file?.token !== "string" || typeof file.portal !== "string") throw new CliError(`${path} is not a token file this helper wrote`, EXIT.usage);
  return { ...file, mcp_session_id: typeof file.mcp_session_id === "string" ? file.mcp_session_id : null };
}
function credentials(values, io) {
  if (io.env.DOUBLEAGENT_AGENT_TOKEN) return { token: io.env.DOUBLEAGENT_AGENT_TOKEN, path: null, file: null };
  const path = tokenPath(values, io);
  if (!path) throw new CliError(`pass --name or --token-file, or set DOUBLEAGENT_AGENT_TOKEN
${USAGE}`, EXIT.usage);
  if (!existsSync2(path)) throw new CliError(`no token file at ${path}: register first`, EXIT.usage);
  const file = readTokenFile(path);
  return { token: file.token, path, file };
}
function clientFor(values, io, auth) {
  const portal = values.portal || !auth.file ? portalOf(values, io) : originOf(auth.file.portal, "the token file portal");
  return new McpClient({ endpoint: `${portal}/mcp`, token: auth.token, sessionId: auth.file?.mcp_session_id ?? null, fetch: io.fetch });
}
function saveSession(auth, client) {
  if (auth.path && auth.file && client.sessionId !== auth.file.mcp_session_id) {
    writeSecretFile(auth.path, `${JSON.stringify({ ...auth.file, mcp_session_id: client.sessionId }, null, 2)}
`);
  }
}
async function status(values, io) {
  const auth = credentials(values, io);
  const client = clientFor(values, io, auth);
  const answer = await callOnce(client, "whoami", {}, io);
  saveSession(auth, client);
  if (!answer.ok) return failure(io, answer.error);
  const me = answer.data;
  if (values.json) io.out(JSON.stringify(maskSecrets(me, collectSecrets(me)), null, 2));
  else {
    io.out(`${me.name} (${me.agent_id}): registration ${me.registration.id} is ${me.registration.status}.`);
    for (const membership of me.memberships) io.out(`  ${membership.account_id} as ${membership.role}`);
  }
  return STATUS_EXIT[me.registration.status] ?? EXIT.failed;
}
function parseToolArgs(text) {
  if (text === void 0) return {};
  let args = null;
  try {
    args = JSON.parse(text);
  } catch {
  }
  if (!args || typeof args !== "object" || Array.isArray(args)) throw new CliError("--args must be a JSON object", EXIT.usage);
  return args;
}
async function call(tool, values, io) {
  if (!tool) throw new CliError(`call needs a tool name
${USAGE}`, EXIT.usage);
  const args = parseToolArgs(values.args);
  const secretFile = values["secret-file"] ? resolve2(io.cwd, values["secret-file"]) : null;
  if (SECRET_TOOLS.has(tool) && !secretFile && !values["print-secret"]) {
    throw new CliError(`${tool} returns a value shown once: pass --secret-file <path> (written 0600) or --print-secret`, EXIT.usage);
  }
  if (secretFile) {
    if (existsSync2(secretFile) && !values.force) {
      throw new CliError(`${secretFile} exists: pass --force to replace it, or choose another --secret-file`, EXIT.usage);
    }
    await assertSafeSecretPath(secretFile, io.cwd);
  }
  const auth = credentials(values, io);
  const client = clientFor(values, io, auth);
  const answer = await callOnce(client, tool, args, io);
  saveSession(auth, client);
  if (!answer.ok) return failure(io, answer.error);
  const secrets = collectSecrets(answer.data);
  if (secretFile && secrets.length) {
    writeSecretFile(secretFile, `${JSON.stringify(answer.data, null, 2)}
`);
    io.err(`The full answer, with its secret, is in ${secretFile} (0600).`);
  } else if (secrets.length && !values["print-secret"]) {
    io.err("The answer held a secret, masked below: pass --secret-file <path> next time to keep it.");
  }
  io.out(JSON.stringify(values["print-secret"] ? answer.data : maskSecrets(answer.data, secrets), null, 2));
  return EXIT.ok;
}
var portalCommand = async (argv, io) => await guarded(io, async () => {
  const { values, positionals } = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: true });
  const [command, tool] = positionals;
  if (values.help || !command) {
    io.out(USAGE);
    return values.help ? EXIT.ok : EXIT.usage;
  }
  if (command === "register") return await register(values, io);
  if (command === "status") return await status(values, io);
  if (command === "call") return await call(tool, values, io);
  throw new CliError(`unknown command "${command}"
${USAGE}`, EXIT.usage);
});

// src/skill-bin/portal.ts
await runAgentCommand(portalCommand);
