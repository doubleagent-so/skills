#!/usr/bin/env node
// Generated helper from Double Agent (source and issues: github.com/doubleagent-so/skills). Do not edit.

// src/agent-skill/proof.ts
import { createHmac } from "node:crypto";
import { readFileSync as readFileSync3 } from "node:fs";
import { resolve as resolve2 } from "node:path";
import { parseArgs } from "node:util";

// src/api.ts
var DEFAULT_PORTAL = "https://app.doubleagent.so";

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

// src/agent-skill/proof.ts
var USAGE = `usage: proof.mjs hmac [--secret-file <start_verification answer file>] --nonce=<nonce>
       proof.mjs jws --key <private jwk> --proof-id <apf_\u2026> --nonce=<nonce> [--aud https://app.doubleagent.so] [--lifetime 300]
       proof.mjs ed25519 --key <private Ed25519 jwk> --proof-id <apf_\u2026> --nonce=<nonce>
       proof.mjs mcp-record --key <private Ed25519 jwk>
hmac reads the proof secret from --secret-file (the 0600 file portal.mjs wrote), else from DOUBLEAGENT_PROOF_SECRET.
Write --nonce=<nonce> with "=": a nonce may start with "-". --aud defaults to DOUBLEAGENT_PORTAL, else https://app.doubleagent.so.
Exit codes: 0 done, 1 failed, 2 usage. Recipes: references/proofs.md. Source and issues: github.com/doubleagent-so/skills`;
var OPTIONS = {
  nonce: { type: "string" },
  "secret-file": { type: "string" },
  key: { type: "string" },
  "proof-id": { type: "string" },
  aud: { type: "string" },
  lifetime: { type: "string" },
  help: { type: "boolean" }
};
var DEFAULT_LIFETIME_S = 300;
var MAX_LIFETIME_S = 600;
var BASE64URL_RE = /^[A-Za-z0-9_-]+$/;
var required = (value, flag) => {
  if (!value) throw new CliError(`missing ${flag}
${USAGE}`, EXIT.usage);
  return value;
};
async function _loadKey(values, io) {
  const path = resolve2(io.cwd, required(values.key, "--key"));
  const key = readPrivateKey(path);
  assertOwnerOnly(path);
  await assertSafeSecretPath(path, io.cwd);
  return key;
}
async function _secretFromFile(file, io) {
  const path = resolve2(io.cwd, file);
  let answer;
  try {
    answer = JSON.parse(readFileSync3(path, "utf8"));
  } catch {
    throw new CliError(`${path} is not a readable JSON file`, EXIT.usage);
  }
  assertOwnerOnly(path);
  await assertSafeSecretPath(path, io.cwd);
  const secret = answer?.secret;
  if (typeof secret !== "string" || !secret) throw new CliError(`${path} has no "secret": pass the start_verification answer file`, EXIT.usage);
  return secret;
}
async function _hmac(values, io) {
  const file = values["secret-file"];
  const secret = file ? await _secretFromFile(file, io) : io.env.DOUBLEAGENT_PROOF_SECRET;
  if (!secret) throw new CliError("pass --secret-file <start_verification answer file>, or set DOUBLEAGENT_PROOF_SECRET", EXIT.usage);
  if (!BASE64URL_RE.test(secret)) throw new CliError("the proof secret is not base64url text", EXIT.usage);
  const nonce = required(values.nonce, "--nonce");
  return createHmac("sha256", Buffer.from(secret, "base64url")).update(nonce, "utf8").digest("base64url");
}
async function _jws(values, io, nowS) {
  const lifetime = Number(values.lifetime ?? DEFAULT_LIFETIME_S);
  if (!Number.isInteger(lifetime) || lifetime < 1 || lifetime > MAX_LIFETIME_S) {
    throw new CliError(`--lifetime must be 1\u2013${MAX_LIFETIME_S} seconds`, EXIT.usage);
  }
  const audience = originOf(values.aud ?? io.env.DOUBLEAGENT_PORTAL ?? DEFAULT_PORTAL, "--aud");
  const proofId = required(values["proof-id"], "--proof-id");
  const nonce = required(values.nonce, "--nonce");
  const key = await _loadKey(values, io);
  const iat = nowS();
  const claims = { aud: audience, proof_id: proofId, nonce, iat, exp: iat + lifetime };
  const header = { alg: key.alg, ...key.jwk.kid ? { kid: key.jwk.kid } : {} };
  return (await signJws(header, b64url(JSON.stringify(claims)), key)).compact;
}
async function _ed25519Key(values, io) {
  const key = await _loadKey(values, io);
  if (key.alg !== "EdDSA") throw new CliError("--key must be an Ed25519 key", EXIT.usage);
  return key;
}
async function _mcpRecord(values, io) {
  const key = await _ed25519Key(values, io);
  return `v=MCPv1; k=ed25519; p=${Buffer.from(key.jwk.x, "base64url").toString("base64")}`;
}
async function _ed25519(values, io) {
  const message = `${required(values["proof-id"], "--proof-id")}.${required(values.nonce, "--nonce")}`;
  return b64url(await signBytes(await _ed25519Key(values, io), message));
}
async function proofCommand(argv, io, { nowS = () => Math.floor(Date.now() / 1e3) } = {}) {
  return await guarded(io, async () => {
    const { values, positionals } = parseArgs({ args: argv, options: OPTIONS, allowPositionals: true, strict: true });
    const [command] = positionals;
    if (values.help || !command) {
      io.out(USAGE);
      return values.help ? EXIT.ok : EXIT.usage;
    }
    const commands = {
      hmac: async () => await _hmac(values, io),
      jws: async () => await _jws(values, io, nowS),
      ed25519: async () => await _ed25519(values, io),
      "mcp-record": async () => await _mcpRecord(values, io)
    };
    const run = Object.hasOwn(commands, command) ? commands[command] : void 0;
    if (!run) throw new CliError(`unknown command "${command}"
${USAGE}`, EXIT.usage);
    io.out(await run());
    return EXIT.ok;
  });
}

// src/skill-bin/proof.ts
await runAgentCommand(async (argv, io) => await proofCommand(argv, io));
