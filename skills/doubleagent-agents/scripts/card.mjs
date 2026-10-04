#!/usr/bin/env node
// Generated helper from Double Agent (source and issues: github.com/doubleagent-so/skills). Do not edit.

// src/agent-skill/card.ts
import { existsSync as existsSync2, readFileSync as readFileSync3, writeFileSync as writeFileSync2 } from "node:fs";
import { join, resolve as resolve2 } from "node:path";
import { parseArgs } from "node:util";

// src/api.ts
var DEFAULT_API = "https://api.doubleagent.so";
var ApiError = class extends Error {
  constructor(status, code, message, body, headers) {
    super(message);
    this.status = status;
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

// src/io.ts
var CliError = class extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
    this.name = "CliError";
  }
};

// src/agent-skill/jose.ts
import { readFileSync } from "node:fs";

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

// src/agent-skill/jose.ts
var PARAMS = {
  ES256: { import: { name: "ECDSA", namedCurve: "P-256" }, sign: { name: "ECDSA", hash: "SHA-256" } },
  EdDSA: { import: { name: "Ed25519" }, sign: { name: "Ed25519" } }
};
var b64url = (bytes) => Buffer.from(bytes).toString("base64url");
function canonicalJson(value) {
  if (value === null || typeof value === "boolean" || typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new CliError("the card holds a number JSON cannot represent", EXIT.usage);
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`);
    return `{${entries.join(",")}}`;
  }
  throw new CliError("the card holds a value JSON cannot represent", EXIT.usage);
}
function readPrivateKey(path) {
  let jwk;
  try {
    jwk = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    throw new CliError(`${path} is not a JSON key file`, EXIT.usage);
  }
  if (!jwk || typeof jwk !== "object" || typeof jwk.d !== "string") {
    throw new CliError(`${path} is not a private key (no "d")`, EXIT.usage);
  }
  if (jwk.kty === "EC" && jwk.crv === "P-256" && typeof jwk.x === "string" && typeof jwk.y === "string") {
    return { jwk, alg: "ES256" };
  }
  if (jwk.kty === "OKP" && jwk.crv === "Ed25519" && typeof jwk.x === "string") return { jwk, alg: "EdDSA" };
  throw new CliError(`${path} must be a P-256 (ES256) or Ed25519 (EdDSA) key`, EXIT.usage);
}
async function importSigningKey(key) {
  const { kty, crv, x, y, d } = key.jwk;
  return await crypto.subtle.importKey("jwk", { kty, crv, x, y, d }, PARAMS[key.alg].import, false, ["sign"]);
}
async function signBytes(key, message) {
  const cryptoKey = await importSigningKey(key);
  return new Uint8Array(await crypto.subtle.sign(PARAMS[key.alg].sign, cryptoKey, Buffer.from(message, "utf8")));
}
async function signJws(header, encodedPayload, key) {
  const encodedHeader = b64url(JSON.stringify(header));
  const signature = b64url(await signBytes(key, `${encodedHeader}.${encodedPayload}`));
  return { protected: encodedHeader, signature, compact: `${encodedHeader}.${encodedPayload}.${signature}` };
}

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

// src/agent-skill/secret-files.ts
import { execFile } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync as readFileSync2, statSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
var exec = promisify(execFile);
function writeSecretFile(path, contents) {
  mkdirSync(dirname(path), { recursive: true, mode: 448 });
  writeFileSync(path, contents, { mode: 384 });
  chmodSync(path, 384);
}
function assertOwnerOnly(path, platform = process.platform) {
  if (platform === "win32") return;
  if (statSync(path).mode & 63) {
    throw new CliError(`${path} is readable by other users: run chmod 600 on it first`, EXIT.usage);
  }
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

// src/agent-skill/card.ts
var USAGE = `usage: card.mjs keygen --alg ES256|EdDSA --kid <kid> --out <dir>
       card.mjs sign <card.json> --key <private jwk> --jku <https URL of your jwks.json> [--card-url <url>] [--out <file> [--force]]
       card.mjs check <card URL or https origin> [--api <origin>] [--json]
The jku must be on the origin that serves the card: by default an origin of the card's interfaces, else --card-url.
--force replaces an existing --out file (re-signing a card).
Exit codes: 0 done (check: no problems), 1 failed (check: problems found), 2 usage.
Guide: references/agent-cards.md. Source and issues: github.com/doubleagent-so/skills`;
var OPTIONS = {
  alg: { type: "string" },
  kid: { type: "string" },
  out: { type: "string" },
  force: { type: "boolean" },
  key: { type: "string" },
  jku: { type: "string" },
  "card-url": { type: "string" },
  api: { type: "string" },
  json: { type: "boolean" },
  help: { type: "boolean" }
};
var GENERATE = { ES256: { name: "ECDSA", namedCurve: "P-256" }, EdDSA: { name: "Ed25519" } };
var KID_RE = /^[A-Za-z0-9._-]{1,64}$/;
function _existingKeys(jwksPath) {
  if (!existsSync2(jwksPath)) return [];
  let jwks;
  try {
    jwks = JSON.parse(readFileSync3(jwksPath, "utf8"));
  } catch {
    throw new CliError(`${jwksPath} is not a JWKS (not JSON): fix or move it first`, EXIT.usage);
  }
  const keys = jwks?.keys;
  if (!Array.isArray(keys)) throw new CliError(`${jwksPath} is not a JWKS (no "keys" list): fix or move it first`, EXIT.usage);
  return keys;
}
async function keygen(values, io) {
  const alg = values.alg;
  if (alg !== "ES256" && alg !== "EdDSA") throw new CliError(`--alg must be ES256 or EdDSA
${USAGE}`, EXIT.usage);
  if (!values.kid || !KID_RE.test(values.kid)) throw new CliError("--kid must be 1\u201364 of [A-Za-z0-9._-]", EXIT.usage);
  if (!values.out) throw new CliError(`missing --out
${USAGE}`, EXIT.usage);
  const dir = resolve2(io.cwd, values.out);
  const privatePath = join(dir, `${values.kid}.private.jwk.json`);
  const jwksPath = join(dir, "jwks.json");
  if (existsSync2(privatePath)) throw new CliError(`${privatePath} exists: refusing to overwrite a key`, EXIT.usage);
  const existing = _existingKeys(jwksPath);
  await assertSafeSecretPath(privatePath, io.cwd);
  const pair = await crypto.subtle.generateKey(GENERATE[alg], true, ["sign", "verify"]);
  const meta = { kid: values.kid, alg, use: "sig" };
  const privateJwk = await crypto.subtle.exportKey("jwk", pair.privateKey);
  writeSecretFile(privatePath, `${JSON.stringify({ ...privateJwk, ...meta }, null, 2)}
`);
  const { kty, crv, x, y } = await crypto.subtle.exportKey("jwk", pair.publicKey);
  const keys = [...existing.filter((key) => key.kid !== values.kid), { kty, crv, x, ...y ? { y } : {}, ...meta }];
  writeFileSync2(jwksPath, `${JSON.stringify({ keys }, null, 2)}
`);
  io.out(`Private key: ${privatePath} (0600; keep it out of the repository and the card).`);
  io.out(`Public JWKS: ${jwksPath}. Serve it on your card's origin, for example at /.well-known/jwks.json.`);
  return EXIT.ok;
}
function _readCard(path) {
  let raw;
  try {
    raw = JSON.parse(readFileSync3(path, "utf8"));
  } catch {
    throw new CliError(`${path} is not a readable JSON file`, EXIT.usage);
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new CliError(`${path} is not a JSON object`, EXIT.usage);
  const { signatures: _old, ...card } = raw;
  return card;
}
function _jkuOf(value) {
  const message = "--jku must be an https URL on the origin that serves the card";
  let jku;
  try {
    jku = new URL(value);
  } catch {
    throw new CliError(message, EXIT.usage);
  }
  if (jku.protocol !== "https:" || jku.username || jku.password) throw new CliError(message, EXIT.usage);
  return jku;
}
async function _loadKey(keyPath, io) {
  const path = resolve2(io.cwd, keyPath);
  const key = readPrivateKey(path);
  assertOwnerOnly(path);
  await assertSafeSecretPath(path, io.cwd);
  const { kid } = key.jwk;
  if (typeof kid !== "string" || !KID_RE.test(kid)) {
    throw new CliError(`${path} has no usable "kid": add the kid its public key has in your jwks.json`, EXIT.usage);
  }
  return { ...key, kid };
}
var _originOfUrl = (value) => {
  if (typeof value !== "string") return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};
function _cardOrigins(card, cardUrl) {
  if (cardUrl) {
    const origin = _originOfUrl(cardUrl);
    if (!origin || !origin.startsWith("https://")) throw new CliError("--card-url must be the https URL that serves the card", EXIT.usage);
    return [origin];
  }
  const interfaces = Array.isArray(card.supportedInterfaces) ? card.supportedInterfaces : [];
  const urls = [...interfaces.map((entry) => entry?.url), card.url];
  return [...new Set(urls.map(_originOfUrl).filter((origin) => origin?.startsWith("https://") ?? false))];
}
function _assertJkuOnCardOrigin(origins, jku) {
  if (!origins.length) {
    throw new CliError("cannot tell which origin serves this card (it names no https interface): pass --card-url", EXIT.usage);
  }
  if (!origins.includes(jku.origin)) {
    const where = origins.map((origin) => `${origin}/.well-known/jwks.json`).join(" or ");
    throw new CliError(
      `the jku must be on the origin that serves the card: serve jwks.json on ${origins.join(" or ")} (for example ${where}), or pass --card-url if the card is served elsewhere`,
      EXIT.usage
    );
  }
}
async function sign(file, values, io) {
  if (!file || !values.key || !values.jku) throw new CliError(`sign needs <card.json>, --key and --jku
${USAGE}`, EXIT.usage);
  const jku = _jkuOf(values.jku);
  const card = _readCard(resolve2(io.cwd, file));
  _assertJkuOnCardOrigin(_cardOrigins(card, values["card-url"]), jku);
  const out = values.out ? resolve2(io.cwd, values.out) : null;
  if (out && existsSync2(out) && !values.force) throw new CliError(`${out} exists: pass --force to replace it`, EXIT.usage);
  const key = await _loadKey(values.key, io);
  const header = { alg: key.alg, kid: key.kid, jku: jku.href };
  const signature = await signJws(header, b64url(canonicalJson(card)), key);
  const signed = `${JSON.stringify({ ...card, signatures: [{ protected: signature.protected, signature: signature.signature }] }, null, 2)}
`;
  const serve = `Serve your jwks.json at ${jku.href}, and never the private key.`;
  if (out) {
    writeFileSync2(out, signed);
    io.out(`Signed card: ${out}. ${serve}`);
  } else {
    io.out(signed.trimEnd());
    io.err(serve);
  }
  return EXIT.ok;
}
function _printCheck(result, io) {
  const { card } = result;
  io.out(
    `card ${card.url}: ${card.ok ? "readable" : "not readable"}, ${card.signed ? "signed" : "unsigned"}, ${card.skills} skills, ${card.endpoints} endpoints`
  );
  io.out(
    `domain file: ${result.domain_file.ok ? "found" : "missing"}; ERC-8004 tokens: ${result.tokens.length}; listing: ${result.listing?.id ?? "not listed"}`
  );
  for (const problem of result.problems) io.out(`  ${problem.code}: ${problem.message}`);
}
async function check(target, values, io) {
  if (!target) throw new CliError(`check needs a card URL or https origin
${USAGE}`, EXIT.usage);
  const api = createApi(originOf(values.api ?? io.env.DOUBLEAGENT_API ?? DEFAULT_API, "--api"), void 0, io.fetch);
  let result;
  try {
    result = (await api.request("GET", `/v1/directory/check?url=${encodeURIComponent(target)}`)).data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 400) throw new CliError(`${error.code}: ${error.message}`, EXIT.usage);
    throw error;
  }
  if (values.json) io.out(JSON.stringify(result, null, 2));
  else _printCheck(result, io);
  return result.problems.length ? EXIT.failed : EXIT.ok;
}
var cardCommand = async (argv, io) => await guarded(io, async () => {
  const { values, positionals } = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: true });
  const [command, target] = positionals;
  if (values.help || !command) {
    io.out(USAGE);
    return values.help ? EXIT.ok : EXIT.usage;
  }
  if (command === "keygen") return await keygen(values, io);
  if (command === "sign") return await sign(target, values, io);
  if (command === "check") return await check(target, values, io);
  throw new CliError(`unknown command "${command}"
${USAGE}`, EXIT.usage);
});

// src/skill-bin/card.ts
await runAgentCommand(cardCommand);
