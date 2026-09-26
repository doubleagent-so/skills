#!/usr/bin/env node
// Generated from packages/cli (github.com/doubleagent-so/doubleagent). Do not edit.

// src/main.ts
import { createInterface } from "node:readline/promises";

// src/cli.ts
import { mkdirSync as mkdirSync2, writeFileSync as writeFileSync2 } from "node:fs";
import { dirname, join as join3, resolve } from "node:path";

// src/api.ts
var DEFAULT_API = "https://api.doubleagent.so";
var DEFAULT_PORTAL = "https://app.doubleagent.so";
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
function createApi(base, session, f = fetch) {
  const root = base.replace(/\/+$/, "");
  return {
    base: root,
    async request(method, path, body, headers = {}) {
      let res;
      try {
        res = await f(`${root}${path}`, {
          method,
          headers: {
            accept: "application/json",
            ...body !== void 0 ? { "content-type": "application/json" } : {},
            ...session ? { authorization: `Bearer ${session}` } : {},
            "user-agent": "doubleagent-cli",
            ...headers
          },
          body: body !== void 0 ? JSON.stringify(body) : void 0
        });
      } catch (e) {
        throw new ApiError(0, "network", `cannot reach ${root}: ${e.message}`);
      }
      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }
      if (!res.ok) {
        const err = data?.error;
        const code = typeof err === "string" ? err : err?.code ?? `http_${res.status}`;
        const message = typeof err === "object" && err?.message || `${method} ${path} \u2192 ${res.status}${typeof err === "string" ? ` ${err}` : ""}`;
        throw new ApiError(res.status, code, message, data, res.headers);
      }
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
function saveCredentials(env, c) {
  const dir = configDir(env);
  mkdirSync(dir, { recursive: true, mode: 448 });
  const path = credentialsPath(env);
  writeFileSync(path, `${JSON.stringify(c, null, 2)}
`, { mode: 384 });
  chmodSync(path, 384);
  return path;
}
function deleteCredentials(env) {
  rmSync(credentialsPath(env), { force: true });
}

// src/io.ts
var CliError = class extends Error {
  constructor(message, exitCode = 1) {
    super(message);
    this.exitCode = exitCode;
    this.name = "CliError";
  }
};
var str = (v) => typeof v === "string" ? v : void 0;
var apiBase = (args, io, creds) => (str(args.flags.api) ?? io.env.DOUBLEAGENT_API ?? creds?.api ?? DEFAULT_API).replace(/\/+$/, "");
var portalBase = (args, io) => (str(args.flags.portal) ?? io.env.DOUBLEAGENT_PORTAL ?? DEFAULT_PORTAL).replace(/\/+$/, "");
var anonApi = (args, io) => createApi(apiBase(args, io, loadCredentials(io.env)), void 0, io.fetch);
function sessionApi(args, io) {
  const creds = loadCredentials(io.env);
  const session = io.env.DOUBLEAGENT_SESSION ?? creds?.session;
  if (!session) throw new CliError("not logged in: run `npx @doubleagent-so/cli login` first (or set DOUBLEAGENT_SESSION)");
  const c = creds ?? { api: apiBase(args, io), session, saved_at: "" };
  return { api: createApi(apiBase(args, io, creds), session, io.fetch), creds: c };
}
var json = (io, v) => io.out(JSON.stringify(v, null, 2));

// src/pow.ts
import { createHash } from "node:crypto";
var MAX_D = 32;
function difficultyFrom(body) {
  const d = body?.error?.difficulty;
  return typeof d === "number" && Number.isInteger(d) ? d : null;
}
var leadingZeroBits = (h) => {
  let bits = 0;
  for (const byte of h) {
    if (byte === 0) {
      bits += 8;
      continue;
    }
    return bits + Math.clz32(byte) - 24;
  }
  return bits;
};
function solve(prefix, d) {
  if (d > MAX_D) throw new Error(`proof-of-work difficulty ${d} is too high`);
  for (let n = 0; ; n++) {
    if (leadingZeroBits(createHash("sha256").update(prefix + n).digest()) >= d) return String(n);
  }
}

// src/account.ts
var sleep = (io, ms) => io.sleep ? io.sleep(ms) : new Promise((r) => setTimeout(r, ms));
async function login(args, io) {
  const api = anonApi(args, io);
  const { data: d } = await api.request("POST", "/v1/auth/device", {});
  if (!d?.device_code || !d.user_code || !d.verify_url) throw new CliError("unexpected /v1/auth/device response");
  const asJson = !!args.flags.json;
  const msg = `Open ${d.verify_url} and confirm the code ${d.user_code}`;
  if (asJson) io.err(JSON.stringify({ verify_url: d.verify_url, user_code: d.user_code }));
  else io.out(`${msg}
Waiting for approval\u2026`);
  let interval = Math.max(1, d.interval ?? 5) * 1e3;
  const deadline = Date.now() + (d.expires_in ?? 600) * 1e3;
  while (Date.now() < deadline) {
    await sleep(io, interval);
    try {
      const { data } = await api.request("POST", "/v1/auth/device/token", { device_code: d.device_code });
      if (!data?.session) throw new CliError("unexpected /v1/auth/device/token response");
      const email = data.user?.email ?? await whoami(api.base, data.session, io);
      const path = saveCredentials(io.env, { api: api.base, session: data.session, email, saved_at: (/* @__PURE__ */ new Date()).toISOString() });
      if (asJson) json(io, { ok: true, email: email ?? null, credentials: path });
      else io.out(`Logged in${email ? ` as ${email}` : ""}. Session saved to ${path}`);
      return 0;
    } catch (e) {
      if (!(e instanceof ApiError)) throw e;
      if (e.status === 428 || e.code === "authorization_pending") continue;
      if (e.status === 429 || e.code === "slow_down") {
        interval += 5e3;
        continue;
      }
      if (e.status === 410 || e.code === "expired") throw new CliError("the code expired before it was approved; run `npx @doubleagent-so/cli login` again");
      throw e;
    }
  }
  throw new CliError("timed out waiting for approval");
}
async function whoami(base, session, io) {
  try {
    return (await createApi(base, session, io.fetch).request("GET", "/v1/me")).data?.user?.email;
  } catch {
    return void 0;
  }
}
async function logout(args, io) {
  const creds = loadCredentials(io.env);
  if (creds) {
    try {
      await sessionApi(args, io).api.request("POST", "/v1/auth/logout", { all: !!args.flags.all });
    } catch {
    }
  }
  deleteCredentials(io.env);
  if (args.flags.json) json(io, { ok: true });
  else io.out(creds ? "Logged out." : "Not logged in.");
  return 0;
}
var hostOf = (d) => typeof d === "string" ? d : d.hostname;
async function sites(args, io) {
  const { api } = sessionApi(args, io);
  const { data: me } = await api.request("GET", "/v1/me");
  if (args.flags.json) {
    json(io, me);
    return 0;
  }
  const accounts = me?.accounts ?? [];
  if (!accounts.length) io.out("No accounts yet. Create one with `npx @doubleagent-so/cli init --email you@example.com`.");
  for (const a of accounts) {
    io.out(`${a.name ?? a.id} (${a.id}${a.role ? `, ${a.role}` : ""})`);
    const list = a.sites ?? [];
    if (!list.length) io.out("  (no sites)");
    for (const s of list) io.out(`  ${s.id}  ${(s.status ?? "?").padEnd(10)}  ${s.name ?? ""}  ${(s.domains ?? []).map(hostOf).join(", ")}`);
  }
  return 0;
}
async function resolveSite(args, api) {
  const flag = str(args.flags.site);
  if (flag) return flag;
  const { data: me } = await api.request("GET", "/v1/me");
  const all = (me?.accounts ?? []).flatMap((a) => a.sites ?? []);
  if (all.length === 1) return all[0].id;
  if (!all.length) throw new CliError("no sites: create one with `npx @doubleagent-so/cli init --email you@example.com`");
  throw new CliError(`several sites: pass --site (${all.map((s) => s.id).join(", ")})`);
}
var rowsOf = (d) => Array.isArray(d) ? d : d?.keys ?? [];
var keyRowOf = (r) => {
  const { key, ...flat } = r ?? {};
  return key && typeof key === "object" ? { ...key, ...flat } : { ...flat, ...typeof key === "string" ? { key } : {} };
};
var secretOf = (k) => k.secret ?? (k.key?.startsWith("sk_") ? k.key : void 0);
var when = (t) => typeof t === "number" ? new Date(t * 1e3).toISOString() : t;
function printKey(io, k) {
  const state = k.revoked_at ? "revoked" : k.expires_at ? `expires ${when(k.expires_at)}` : "active";
  io.out(`  ${k.id}  ${k.kind ?? "?"}_${k.env ?? "?"}  ${k.public_key ?? k.prefix ?? ""}  ${state}${k.last_used_at ? `  last used ${when(k.last_used_at)}` : ""}`);
}
function showSecret(io, k) {
  const s = secretOf(k);
  if (!s) return;
  io.out(`
Secret key (shown once, store it server-side only, never in client code):
  ${s}`);
}
async function keys(args, io) {
  const { api } = sessionApi(args, io);
  const site = await resolveSite(args, api);
  const sub = args.pos[0] ?? "list";
  const base = `/v1/sites/${encodeURIComponent(site)}/keys`;
  const needId = () => {
    const id = args.pos[1];
    if (!id) throw new CliError(`usage: npx @doubleagent-so/cli keys ${sub} <key_id> [--site st_\u2026]`);
    return encodeURIComponent(id);
  };
  let result;
  switch (sub) {
    case "list":
      result = (await api.request("GET", base)).data;
      break;
    case "create": {
      const kind = str(args.flags.kind) ?? "pk";
      const env = str(args.flags.env) ?? "live";
      if (!["pk", "sk"].includes(kind) || !["live", "test"].includes(env)) throw new CliError("--kind must be pk|sk and --env live|test");
      result = (await api.request("POST", base, { kind, env })).data;
      break;
    }
    case "rotate":
      result = (await api.request("POST", `${base}/${needId()}/rotate`, {})).data;
      break;
    case "revoke":
      result = (await api.request("DELETE", `${base}/${needId()}`)).data ?? { revoked: args.pos[1] };
      break;
    default:
      throw new CliError(`unknown keys command "${sub}" (list|create|rotate|revoke)`);
  }
  if (args.flags.json) {
    json(io, { site, ...typeof result === "object" && result && !Array.isArray(result) ? result : { keys: result } });
    return 0;
  }
  if (sub === "list") {
    io.out(`Keys for ${site}:`);
    rowsOf(result).forEach((k) => printKey(io, k));
  } else if (sub === "revoke") {
    io.out(`Revoked ${args.pos[1]}.`);
  } else {
    const k = keyRowOf(result);
    io.out(sub === "rotate" ? "Rotated. The old key keeps working for 24 h." : "Created:");
    printKey(io, k);
    showSecret(io, k);
  }
  return 0;
}
var METHODS = ["dns", "meta", "file", "script"];
function howTo(method, host, info) {
  const i = info.instructions;
  if (method === "dns" && i?.dns?.name && i.dns.value) return `Add a DNS ${i.dns.type ?? "TXT"} record: ${i.dns.name}  "${i.dns.value}"`;
  if (method === "meta" && i?.meta?.html) return `Add to the <head> of https://${host}/: ${i.meta.html}`;
  if (method === "file" && i?.file?.url && i.file.body) return `Serve ${i.file.url} containing: ${i.file.body}`;
  if (method === "script" && i?.script?.html) return `Deploy this tag on https://${host}/: ${i.script.html}`;
  return info.token ? instructions(method, host, info.token) : void 0;
}
function instructions(method, host, token) {
  switch (method) {
    case "dns":
      return `Add a DNS TXT record: _doubleagent.${host}  "da-verify=${token}"  (an apex record also covers subdomains)`;
    case "meta":
      return `Add to the <head> of https://${host}/: <meta name="doubleagent-verification" content="${token}">`;
    case "file":
      return `Serve https://${host}/.well-known/doubleagent.txt containing: da-verify=${token}`;
    case "script":
      return `Deploy the SDK tag with this site's public key (data-key) on https://${host}/`;
  }
}
async function verifyDomain(args, io) {
  const host = args.pos[0]?.toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!host || !/^[a-z0-9.-]+(:\d+)?$/.test(host)) throw new CliError("usage: npx @doubleagent-so/cli verify-domain <host> --method dns|meta|file|script [--site st_\u2026]");
  const method = str(args.flags.method) ?? "dns";
  if (!METHODS.includes(method)) throw new CliError(`--method must be one of ${METHODS.join("|")}`);
  const { api } = sessionApi(args, io);
  const site = await resolveSite(args, api);
  const path = `/v1/sites/${encodeURIComponent(site)}/domains`;
  let info = {};
  try {
    info = (await api.request("POST", path, { hostname: host })).data ?? {};
  } catch (e) {
    if (!(e instanceof ApiError) || e.status !== 409) throw e;
    info = e.body?.domain ?? e.body ?? {};
  }
  const { data: r } = await api.request("POST", `${path}/${encodeURIComponent(host)}/verify`, { method });
  const how = howTo(method, host, info);
  if (args.flags.json) {
    json(io, { site, hostname: host, method, verified: !!r?.verified, detail: r?.detail ?? null, claimed: r?.claimed ?? null, token: info.token ?? null, instructions: how ?? info.instructions ?? null });
    return r?.verified ? 0 : 1;
  }
  if (r?.verified) {
    io.out(`Verified ${host} (${method}).`);
    if (r.claimed?.sessions) io.out(`Claimed ${r.claimed.sessions} session(s) collected before you joined.`);
    return 0;
  }
  io.out(`Not verified yet${r?.detail ? `: ${r.detail}` : ""}.`);
  if (how) io.out(how);
  io.out(`Then run: npx @doubleagent-so/cli verify-domain ${host} --method ${method}${args.flags.site ? ` --site ${site}` : ""}`);
  return 1;
}
var ACCOUNT_POW_BITS = 18;
async function createAccount(args, io, body) {
  const api = anonApi(args, io);
  const attempt = (bits) => {
    const ts = String(Math.floor(Date.now() / 1e3));
    const solution = solve(accountPowPrefix(body.email, ts), bits);
    return api.request("POST", "/v1/accounts", body, { "DA-PoW": `${ts}:${solution}` });
  };
  try {
    return (await attempt(ACCOUNT_POW_BITS)).data;
  } catch (e) {
    if (!(e instanceof ApiError) || !(e.status === 428 || e.code === "pow_required")) throw e;
    const d = difficultyFrom(e.body);
    if (d === null) throw new CliError("the API rejected the proof of work and sent no difficulty");
    return (await attempt(d)).data;
  }
}
var accountPowPrefix = (email, ts) => `da-accounts|${email.trim().toLowerCase()}|${ts}|`;

// src/analytics.ts
var RULES = [
  { name: "ga4", deps: ["react-ga4", "vue-gtag", "@next/third-parties", "nuxt-gtag"], source: /gtag\/js\?id=G-|gtag\(\s*['"]config['"]\s*,\s*['"]G-|<GoogleAnalytics\b/ },
  { name: "gtm", deps: ["react-gtm-module", "@gtm-support/vue-gtm"], source: /googletagmanager\.com\/gtm\.js|['"]GTM-[A-Z0-9]+['"]|<GoogleTagManager\b/ },
  { name: "gads", source: /gtag\/js\?id=AW-|['"]AW-\d+|googleadservices\.com/ },
  { name: "meta", deps: ["react-facebook-pixel", "react-meta-pixel"], source: /connect\.facebook\.net\/[^'"]*fbevents\.js|\bfbq\(\s*['"](init|track)/ },
  { name: "tiktok", source: /analytics\.tiktok\.com|\bttq\.(load|page|track)\(/ },
  { name: "klaviyo", deps: ["klaviyo-sdk"], source: /static\.klaviyo\.com|klaviyo\.js|_learnq/ },
  { name: "mixpanel", deps: ["mixpanel-browser"], source: /cdn\.mxpnl\.com|mixpanel\.init\(/ },
  { name: "segment", deps: ["@segment/analytics-next", "@segment/snippet"], source: /cdn\.segment\.com\/analytics\.js/ },
  { name: "posthog", deps: ["posthog-js"], source: /posthog\.init\(|[a-z]+\.posthog\.com\/static\/array\.js/ },
  { name: "amplitude", deps: ["@amplitude/analytics-browser", "@amplitude/unified", "amplitude-js"], source: /cdn\.amplitude\.com/ },
  { name: "hubspot", source: /js\.hs-scripts\.com|js\.hs-analytics\.net|_hsq/ },
  { name: "intercom", deps: ["@intercom/messenger-js-sdk", "react-use-intercom"], source: /widget\.intercom\.io|\bIntercom\(\s*['"]boot/ },
  { name: "clarity", deps: ["@microsoft/clarity"], source: /clarity\.ms\/tag/ },
  { name: "hotjar", deps: ["@hotjar/browser", "react-hotjar"], source: /static\.hotjar\.com|\bhj\(\s*['"]/ },
  { name: "stripe", deps: ["@stripe/stripe-js", "@stripe/react-stripe-js"], source: /js\.stripe\.com\/v3/ },
  { name: "mailchimp", source: /list-manage\.com\/subscribe/ }
];
function detectIntegrations(p, extraSources = {}) {
  const found = /* @__PURE__ */ new Map();
  for (const r of RULES) {
    const dep = r.deps?.find((d) => p.dep(d));
    if (dep) found.set(r.name, `dependency ${dep}`);
  }
  const sources = Object.entries(extraSources);
  for (const f of p.files()) {
    const txt = p.read(f);
    if (txt) sources.push([f, txt]);
  }
  for (const [file, txt] of sources) {
    for (const r of RULES) {
      if (!found.has(r.name) && r.source?.test(txt)) found.set(r.name, file);
    }
  }
  if (p.has("layout/theme.liquid")) found.set("shopify", "layout/theme.liquid");
  return RULES.map((r) => r.name).concat("shopify").filter((n, i, a) => a.indexOf(n) === i && found.has(n)).map((name) => ({ name, evidence: found.get(name) }));
}
function detectInHtml(html) {
  const out = RULES.filter((r) => r.source?.test(html)).map((r) => r.name);
  if (/cdn\.shopify\.com|Shopify\.theme/.test(html)) out.push("shopify");
  return out;
}

// src/detect.ts
var LABELS = {
  "next-app": "Next.js (app router)",
  "next-pages": "Next.js (pages router)",
  nuxt: "Nuxt",
  sveltekit: "SvelteKit",
  astro: "Astro",
  remix: "Remix / React Router",
  vite: "Vite",
  html: "Static HTML",
  "shopify-theme": "Shopify theme",
  "wordpress-theme": "WordPress theme",
  unknown: "Unknown"
};
var SRC_EXT = ["tsx", "jsx", "ts", "js"];
var withExt = (base) => SRC_EXT.map((e) => `${base}.${e}`);
var nextAppLayout = (p) => p.first(...withExt("app/layout"), ...withExt("src/app/layout"));
var nextDocumentPath = (p) => p.first(...withExt("pages/_document"), ...withExt("src/pages/_document"));
function detectId(p) {
  if (p.has("layout/theme.liquid")) return "shopify-theme";
  if (p.has("header.php") || /Theme Name:/i.test(p.read("style.css") ?? "")) return "wordpress-theme";
  if (p.dep("next")) {
    if (nextAppLayout(p)) return "next-app";
    return "next-pages";
  }
  if (p.dep("nuxt") || p.first("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs")) return "nuxt";
  if (p.dep("@sveltejs/kit")) return "sveltekit";
  if (p.dep("astro") || p.first("astro.config.mjs", "astro.config.ts", "astro.config.js")) return "astro";
  if ((p.dep("@remix-run/react") || p.dep("@react-router/dev")) && p.first(...withExt("app/root"))) return "remix";
  if (p.dep("vite") && p.has("index.html")) return "vite";
  if (p.has("index.html") || p.has("public/index.html") || p.files().some((f) => !f.includes("/") && /\.html?$/i.test(f))) return "html";
  return "unknown";
}
function detectPlatform(p) {
  if (p.dep("lovable-tagger")) return "lovable";
  if (p.has(".bolt")) return "bolt";
  const readme = p.read("README.md") ?? "";
  if (/lovable\.(dev|app)/i.test(readme)) return "lovable";
  if (/\bv0\.(dev|app)\b/i.test(readme)) return "v0";
  return void 0;
}
function detectStack(p) {
  const id = detectId(p);
  return { id, label: LABELS[id], platform: detectPlatform(p) };
}

// src/diff.ts
function unifiedDiff(path, before, after, context = 3) {
  const a = before === null ? [] : splitLines(before);
  const b = splitLines(after);
  const ops = diffLines(a, b);
  const hunks = [];
  let i = 0;
  while (i < ops.length) {
    if (ops[i].t === " ") {
      i++;
      continue;
    }
    let start = Math.max(0, i - context);
    let end = i;
    while (end < ops.length) {
      if (ops[end].t !== " ") {
        end++;
        continue;
      }
      let run2 = 0;
      while (end + run2 < ops.length && ops[end + run2].t === " ") run2++;
      if (end + run2 >= ops.length || run2 > context * 2) {
        end = Math.min(ops.length, end + context);
        break;
      }
      end += run2;
    }
    const slice = ops.slice(start, end);
    const aStart = ops[start].ai, bStart = ops[start].bi;
    const aLen = slice.filter((o) => o.t !== "+").length;
    const bLen = slice.filter((o) => o.t !== "-").length;
    hunks.push(`@@ -${aLen ? aStart + 1 : aStart},${aLen} +${bLen ? bStart + 1 : bStart},${bLen} @@`);
    for (const o of slice) hunks.push(`${o.t}${o.line}`);
    i = end;
    start = end;
  }
  const from = before === null ? "/dev/null" : `a/${path}`;
  return [`--- ${from}`, `+++ b/${path}`, ...hunks].join("\n");
}
var splitLines = (s) => {
  const lines = s.split("\n");
  if (lines[lines.length - 1] === "") lines.pop();
  return lines;
};
function diffLines(a, b) {
  let pre = 0;
  while (pre < a.length && pre < b.length && a[pre] === b[pre]) pre++;
  let suf = 0;
  while (suf < a.length - pre && suf < b.length - pre && a[a.length - 1 - suf] === b[b.length - 1 - suf]) suf++;
  const am = a.slice(pre, a.length - suf), bm = b.slice(pre, b.length - suf);
  const n = am.length, m = bm.length;
  const L = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let x2 = n - 1; x2 >= 0; x2--) for (let y2 = m - 1; y2 >= 0; y2--) L[x2][y2] = am[x2] === bm[y2] ? L[x2 + 1][y2 + 1] + 1 : Math.max(L[x2 + 1][y2], L[x2][y2 + 1]);
  const ops = [];
  for (let k = 0; k < pre; k++) ops.push({ t: " ", line: a[k], ai: k, bi: k });
  let x = 0, y = 0;
  while (x < n || y < m) {
    if (x < n && y < m && am[x] === bm[y]) {
      ops.push({ t: " ", line: am[x], ai: pre + x, bi: pre + y });
      x++;
      y++;
    } else if (y < m && (x >= n || L[x][y + 1] >= L[x + 1][y])) {
      ops.push({ t: "+", line: bm[y], ai: pre + x, bi: pre + y });
      y++;
    } else {
      ops.push({ t: "-", line: am[x], ai: pre + x, bi: pre + y });
      x++;
    }
  }
  for (let k = suf; k > 0; k--) ops.push({ t: " ", line: a[a.length - k], ai: a.length - k, bi: b.length - k });
  return ops;
}

// src/edit.ts
var lineStart = (s, idx) => s.lastIndexOf("\n", idx - 1) + 1;
var indentOf = (s, idx) => /^[ \t]*/.exec(s.slice(lineStart(s, idx)))[0];
function insertBefore(src, idx, lines) {
  const ls = lineStart(src, idx);
  const before = src.slice(ls, idx);
  if (before.trim() === "") {
    const prev = src.slice(0, ls).replace(/\s+$/, "");
    const indent = src.startsWith("</", idx) && prev ? indentOf(prev, prev.length) : before;
    const block = lines.map((l) => indent + l).join("\n");
    return `${src.slice(0, ls)}${block}
${src.slice(ls)}`;
  }
  return `${src.slice(0, idx)}${lines.join("")}${src.slice(idx)}`;
}
function insertAfterTag(src, tagStart, tagEnd, lines) {
  const nl = src.indexOf("\n", tagEnd);
  const restOfLine = nl < 0 ? src.slice(tagEnd) : src.slice(tagEnd, nl);
  if (nl < 0 || restOfLine.trim() !== "") return `${src.slice(0, tagEnd)}${lines.join("")}${src.slice(tagEnd)}`;
  const tagIndent = indentOf(src, tagStart);
  const unit = /\t/.test(tagIndent) ? "	" : "  ";
  const indent = tagIndent + unit;
  const block = lines.map((l) => indent + l).join("\n");
  return `${src.slice(0, nl + 1)}${block}
${src.slice(nl + 1)}`;
}
function afterImports(src) {
  const lines = src.split("\n");
  let offset = 0, inImport = false, lastEnd = -1, directiveEnd = 0;
  for (const line of lines) {
    const t = line.trim();
    const next = offset + line.length + 1;
    if (inImport) {
      if (/from\s*['"][^'"]+['"]/.test(t) || /^['"][^'"]+['"];?$/.test(t)) {
        inImport = false;
        lastEnd = next;
      }
    } else if (/^import\b/.test(t)) {
      if (/from\s*['"][^'"]+['"]|^import\s*['"][^'"]+['"]/.test(t)) lastEnd = next;
      else inImport = true;
    } else if (/^['"]use [a-z]+['"];?$/.test(t) && lastEnd < 0) {
      directiveEnd = next;
    }
    offset = next;
  }
  return Math.min(lastEnd >= 0 ? lastEnd : directiveEnd, src.length);
}
var insertLine = (src, idx, line) => `${src.slice(0, idx)}${line}
${src.slice(idx)}`;
function htmlHeadIndex(src) {
  const open = /<head\b[^>]*>/i.exec(src);
  const close = src.search(/<\/head\s*>/i);
  if (!open && close < 0) return -1;
  const from = open ? open.index + open[0].length : 0;
  const to = close >= 0 ? close : src.length;
  const rel = src.slice(from, to).search(/<script\b|%sveltekit\.head%|<\?php\s+wp_head\s*\(/i);
  return rel >= 0 ? from + rel : to;
}

// src/snippet.ts
var CDN_URL = "https://cdn.doubleagent.so/v1/doubleagent.js";
var STUB = "window.doubleagent=window.doubleagent||{q:[],push(){this.q.push(arguments)}};";
var PLACEHOLDER_KEY = "pk_test_REPLACE_ME";
var KEY_RE = /^pk_(live|test)_[A-Za-z0-9]{1,64}$/;
var SECRET_KEY_RE = /^sk_(live|test)_[A-Za-z0-9]{1,64}$/;
var INSTALLED_RE = /cdn\.doubleagent\.so\/v1\/doubleagent\.js|from\s+['"]@doubleagent(?:-so)?\/js['"]/;
var attr = (key) => key ? ` data-key="${key}"` : "";
var htmlSnippet = ({ key, profile }) => [
  `<script>${STUB}</script>`,
  `<script async src="${CDN_URL}"${attr(key)} data-profile="${profile}"></script>`
];
var astroSnippet = ({ key, profile }) => [
  `<script is:inline>${STUB}</script>`,
  `<script is:inline async src="${CDN_URL}"${attr(key)} data-profile="${profile}"></script>`
];
var nextSnippet = ({ key, profile }, Script = "Script") => [
  `<${Script} id="doubleagent-stub" strategy="beforeInteractive">`,
  `  {\`${STUB}\`}`,
  `</${Script}>`,
  `<${Script} src="${CDN_URL}" strategy="beforeInteractive"${attr(key)} data-profile="${profile}" />`
];
var jsxSnippet = ({ key, profile }) => [
  `<script dangerouslySetInnerHTML={{ __html: ${JSON.stringify(STUB)} }} />`,
  `<script async src="${CDN_URL}"${attr(key)} data-profile="${profile}" />`
];
var nuxtConfigSnippet = ({ key, profile }) => [
  "app: {",
  "  head: {",
  "    script: [",
  `      { innerHTML: ${JSON.stringify(STUB)} },`,
  `      { src: '${CDN_URL}', async: true,${key ? ` 'data-key': '${key}',` : ""} 'data-profile': '${profile}' },`,
  "    ],",
  "  },",
  "},"
];
var nuxtPlugin = ({ key, profile }) => `// Added by \`npx @doubleagent-so/cli init\`: loads the Double Agent SDK.
export default defineNuxtPlugin(() => {
  ${STUB}
  const s = document.createElement('script');
  s.async = true;
  s.src = '${CDN_URL}';
${key ? `  s.dataset.key = '${key}';
` : ""}  s.dataset.profile = '${profile}';
  document.head.appendChild(s);
});
`;
var nextDocument = (o) => `import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
${nextSnippet(o).map((l) => `        ${l}`).join("\n")}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
`;
function withKey(src, key) {
  if (/data-key="|'data-key':|dataset\.key = '/.test(src)) {
    return src.replace(/(data-key=")[^"]*(")/g, `$1${key}$2`).replace(/('data-key':\s*')[^']*(')/g, `$1${key}$2`).replace(/(dataset\.key = ')[^']*(')/g, `$1${key}$2`);
  }
  const url = CDN_URL.replace(/[./]/g, "\\$&");
  return src.replace(new RegExp(`(src="${url}")`, "g"), `$1 data-key="${key}"`).replace(new RegExp(`(src: '${url}',)`, "g"), `$1 'data-key': '${key}',`).replace(new RegExp(`^([ \\t]*)(s\\.src = '${url}';)$`, "gm"), `$1$2
$1s.dataset.key = '${key}';`);
}

// src/install.ts
var InstallError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "InstallError";
  }
};
var htmlFiles = (files, snippet = htmlSnippet) => (p, o, notes) => {
  const changes = [];
  for (const path of files) {
    const before = p.read(path);
    if (before === null) continue;
    const idx = htmlHeadIndex(before);
    if (idx < 0) {
      notes.push(`${path}: no <head> found, skipped`);
      continue;
    }
    changes.push({ path, before, after: insertBefore(before, idx, snippet(o)) });
  }
  if (!changes.length) throw new InstallError(`no file with a <head> found (looked at ${files.join(", ") || "nothing"})`);
  return changes;
};
function withScriptImport(src) {
  const m = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(src);
  if (m) return { src, name: m[1] };
  return { src: insertLine(src, afterImports(src), "import Script from 'next/script';"), name: "Script" };
}
function afterFirstTag(src, tags, lines, path) {
  for (const re of tags) {
    const m = re.exec(src);
    if (m) return insertAfterTag(src, m.index, m.index + m[0].length, lines);
  }
  throw new InstallError(`${path}: could not find where to insert (${tags.map((t) => t.source).join(" or ")})`);
}
var nextApp = (p, o) => {
  const path = nextAppLayout(p);
  const before = p.read(path);
  const name = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(before)?.[1] ?? "Script";
  const body = afterFirstTag(before, [/<head\b[^>]*>/, /<body\b[^>]*>/], nextSnippet(o, name), path);
  return [{ path, before, after: withScriptImport(body).src }];
};
var nextPages = (p, o) => {
  const path = nextDocumentPath(p);
  if (!path) {
    const dir = p.has("src/pages") ? "src/pages" : "pages";
    const ext = p.has("tsconfig.json") ? "tsx" : "js";
    return [{ path: `${dir}/_document.${ext}`, before: null, after: nextDocument(o) }];
  }
  let src = p.read(path);
  src = src.replace(/^([ \t]*)<Head\s*\/>/m, (_m, ind) => `${ind}<Head>
${ind}</Head>`);
  const name = /import\s+(\w+)\s+from\s+['"]next\/script['"]/.exec(src)?.[1] ?? "Script";
  src = afterFirstTag(src, [/<Head(?:\s[^>]*)?>/], nextSnippet(o, name), path);
  return [{ path, before: p.read(path), after: withScriptImport(src).src }];
};
var remix = (p, o) => {
  const path = p.first("app/root.tsx", "app/root.jsx", "app/root.ts", "app/root.js");
  const before = p.read(path);
  return [{ path, before, after: afterFirstTag(before, [/<head\b[^>]*>/], jsxSnippet(o), path) }];
};
var astro = (p, o, notes) => {
  const astroFiles = p.files().filter((f) => f.endsWith(".astro") && /<head\b/i.test(p.read(f) ?? ""));
  const layouts = astroFiles.filter((f) => f.startsWith("src/layouts/"));
  const targets = layouts.length ? layouts : astroFiles;
  if (!layouts.length && targets.length) notes.push("no src/layouts/*.astro with <head>; edited pages directly");
  return htmlFiles(targets, astroSnippet)(p, o, notes);
};
var nuxt = (p, o, notes) => {
  const path = p.first("nuxt.config.ts", "nuxt.config.js", "nuxt.config.mjs");
  const before = path ? p.read(path) : null;
  const call = before ? /defineNuxtConfig\(\s*\{/.exec(before) : null;
  if (path && before && call && !/^\s*app\s*:/m.test(before)) {
    return [{ path, before, after: insertAfterTag(before, call.index, call.index + call[0].length, nuxtConfigSnippet(o)) }];
  }
  const dir = p.has("app/app.vue") ? "app/plugins" : "plugins";
  const ext = path?.endsWith(".ts") ? "ts" : "js";
  notes.push(`nuxt.config already has an \`app\` block; added ${dir}/doubleagent.client.${ext} instead (the tag is injected client-side, so \`verify\` cannot see it in server HTML)`);
  return [{ path: `${dir}/doubleagent.client.${ext}`, before: null, after: nuxtPlugin(o) }];
};
var rootHtml = (p) => {
  const root = p.files().filter((f) => !f.includes("/") && /\.html?$/i.test(f));
  return root.length ? root : ["public/index.html"];
};
var PLANNERS = {
  "next-app": nextApp,
  "next-pages": nextPages,
  remix,
  astro,
  nuxt,
  vite: (p, o, n) => htmlFiles(["index.html"])(p, o, n),
  sveltekit: (p, o, n) => htmlFiles(["src/app.html"])(p, o, n),
  "wordpress-theme": (p, o, n) => htmlFiles(["header.php"])(p, o, n),
  html: (p, o, n) => htmlFiles(rootHtml(p))(p, o, n)
};
var installedIn = (p) => p.files().filter((f) => INSTALLED_RE.test(p.read(f) ?? ""));
function planInstall(p, stack, o) {
  const notes = [];
  if (stack.id === "shopify-theme") {
    notes.push("Add the SDK snippet once to the head of layout/theme.liquid. The CLI provides instructions without editing the theme; Shopify cart attributes are written by the SDK when a cart exists and consent permits.");
    return { status: "advice", changes: [], notes };
  }
  const existing = installedIn(p);
  if (existing.length) {
    const changes = o.key ? existing.flatMap((path) => {
      const before = p.read(path);
      const after = withKey(before, o.key);
      return after !== before ? [{ path, before, after }] : [];
    }) : [];
    if (!changes.length) notes.push(`already installed in ${existing.join(", ")}`);
    return { status: changes.length ? "update-key" : "installed", changes, notes };
  }
  const planner = PLANNERS[stack.id];
  if (!planner) return { status: "unsupported", changes: [], notes };
  return { status: "install", changes: planner(p, o, notes), notes };
}

// src/project.ts
import { existsSync, readdirSync, readFileSync as readFileSync2, statSync } from "node:fs";
import { join as join2, relative } from "node:path";
var SKIP_DIRS = /* @__PURE__ */ new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".output", ".svelte-kit", "out", "vendor", ".vercel", ".netlify", "coverage", ".astro", ".cache"]);
var SOURCE_EXT = /\.(html?|[cm]?[jt]sx?|vue|svelte|astro|liquid|php)$/i;
var MAX_FILES = 3e3;
var MAX_BYTES = 512 * 1024;
function openProject(cwd) {
  const has = (rel) => existsSync(join2(cwd, rel));
  const read = (rel) => {
    try {
      return readFileSync2(join2(cwd, rel), "utf8");
    } catch {
      return null;
    }
  };
  let pkg = null;
  try {
    pkg = JSON.parse(read("package.json") ?? "null");
  } catch {
    pkg = null;
  }
  let cache;
  return {
    cwd,
    pkg,
    has,
    read,
    first: (...rels) => rels.find(has),
    dep: (name) => !!(pkg?.dependencies?.[name] ?? pkg?.devDependencies?.[name]),
    files() {
      if (cache) return cache;
      const out = [];
      const walk = (dir) => {
        let entries;
        try {
          entries = readdirSync(dir);
        } catch {
          return;
        }
        for (const name of entries) {
          if (out.length >= MAX_FILES) return;
          const abs = join2(dir, name);
          let st;
          try {
            st = statSync(abs);
          } catch {
            continue;
          }
          if (st.isDirectory()) {
            if (!SKIP_DIRS.has(name)) walk(abs);
          } else if (SOURCE_EXT.test(name) && st.size <= MAX_BYTES) out.push(relative(cwd, abs).replace(/\\/g, "/"));
        }
      };
      walk(cwd);
      return cache = out.sort();
    }
  };
}

// src/skill.ts
var NEXT_IMPORT = "import Script from 'next/script';";
var HEAD = "inside <head>, before any other <script>";
var GUIDES = {
  html: { file: "every page (*.html)", where: HEAD, lines: htmlSnippet },
  vite: { file: "index.html", where: HEAD, lines: htmlSnippet },
  "next-app": { file: "app/layout.tsx (or src/app/layout.tsx)", where: "right after <head> (or first inside <body>)", import: NEXT_IMPORT, lines: (o) => nextSnippet(o) },
  "next-pages": { file: "pages/_document.tsx", where: "inside <Head>", import: NEXT_IMPORT, lines: (o) => nextSnippet(o) },
  astro: { file: "src/layouts/Layout.astro (every layout with <head>)", where: HEAD, lines: astroSnippet },
  nuxt: { file: "nuxt.config.ts", where: "first entry inside defineNuxtConfig({ \u2026 }) (merge into an existing app.head if present)", lines: nuxtConfigSnippet },
  sveltekit: { file: "src/app.html", where: "inside <head>, before %sveltekit.head%", lines: htmlSnippet },
  remix: { file: "app/root.tsx", where: "right after <head>", lines: jsxSnippet },
  wordpress: { file: "header.php (classic theme) or a header-code plugin", where: "before <?php wp_head(); ?>", lines: htmlSnippet },
  wix: { file: "Settings \u2192 Custom code \u2192 + Add Custom Code", where: "All pages, Head, load once", lines: htmlSnippet },
  squarespace: { file: "Settings \u2192 Developer tools \u2192 Code injection", where: "Header", lines: htmlSnippet },
  webflow: { file: "Site settings \u2192 Custom code", where: "Head code, then Publish", lines: htmlSnippet },
  shopify: {
    file: "layout/theme.liquid",
    where: HEAD,
    lines: htmlSnippet,
    note: "Add the snippet once to the shared theme head. The SDK detects Shopify and writes cart attributes when a cart exists and consent permits."
  }
};
var SNIPPET_STACKS = Object.keys(GUIDES);
function snippetFor(stack, o) {
  const g = GUIDES[stack];
  if (!g) throw new CliError(`unknown stack "${stack}" (one of: ${SNIPPET_STACKS.join(", ")})`);
  return { stack, file: g.file, where: g.where, ...g.import ? { import: g.import } : {}, lines: g.lines(o), ...g.note ? { note: g.note } : {} };
}
function publicKey(args) {
  const k = str(args.flags.key);
  if (k === void 0) return void 0;
  if (SECRET_KEY_RE.test(k)) throw new CliError("that is a secret key (sk_\u2026): it must never be put in client code");
  if (!KEY_RE.test(k)) throw new CliError(`"${k}" is not a public key (pk_live_\u2026 / pk_test_\u2026)`);
  return k;
}
async function snippetCmd(args, io) {
  const stack = args.pos[0];
  if (!stack) throw new CliError(`usage: snippet <stack> [--key pk_\u2026] [--json]  (stacks: ${SNIPPET_STACKS.join(", ")})`);
  const s = snippetFor(stack, { key: publicKey(args), profile: str(args.flags.profile) ?? "auto" });
  if (args.flags.json) {
    io.out(JSON.stringify(s, null, 2));
    return 0;
  }
  io.out(`# ${s.file}: ${s.where}`);
  if (s.note) io.out(s.note);
  if (s.import) io.out(s.import);
  for (const l of s.lines) io.out(l);
  return 0;
}
async function createAccountCmd(args, io) {
  const email = str(args.flags.email);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new CliError("usage: create-account --email you@example.com [--domain host] [--name name]");
  const domain = str(args.flags.domain)?.toLowerCase();
  const a = await createAccount(args, io, { email, domain, name: str(args.flags.name) });
  if (args.flags.json) {
    io.out(JSON.stringify({ ...a, warning: "keys are shown once; sk_* is server-side only, never in client code" }, null, 2));
    return 0;
  }
  io.out(`Created account ${a.account_id}, site ${a.site_id}.`);
  io.out("Keys (shown once; public keys go in data-key, secret keys stay server-side, never in client code):");
  for (const [k, v] of Object.entries(a.keys ?? {})) if (v) io.out(`  ${k}: ${v}`);
  const host = a.verify?.hostname ?? domain;
  if (a.verify?.token && host) io.out(`Verify the domain to see data: DNS TXT _doubleagent.${host} "da-verify=${a.verify.token}" (or meta tag / .well-known file; see references/claim)`);
  io.out(`Confirm the email sent to ${email}${a.login_url ? ` (or open ${a.login_url})` : ""}.`);
  return 0;
}

// src/verify.ts
var TIMEOUT_MS = 1e4;
var isObj = (x) => !!x && typeof x === "object" && !Array.isArray(x);
function parseInstallCheck(body) {
  if (!isObj(body)) return void 0;
  const bool = (k) => typeof body[k] === "boolean" ? body[k] : void 0;
  const s = (k) => typeof body[k] === "string" ? body[k] : void 0;
  const problems = Array.isArray(body.problems) ? body.problems.map((p) => isObj(p) ? { code: typeof p.code === "string" ? p.code : void 0, message: typeof p.message === "string" ? p.message : void 0, fix: typeof p.fix === "string" ? p.fix : void 0 } : { message: String(p) }) : void 0;
  return {
    ok: bool("ok"),
    script_found: bool("script_found"),
    script_src: s("script_src"),
    key: s("key"),
    key_valid: bool("key_valid"),
    profile_attr: s("profile_attr"),
    stub_before_script: bool("stub_before_script"),
    keyless: bool("keyless"),
    claim_url: s("claim_url"),
    integrations_detected: Array.isArray(body.integrations_detected) ? body.integrations_detected.filter((x) => typeof x === "string") : void 0,
    last_beacon_at: s("last_beacon_at") ?? (body.last_beacon_at === null ? null : void 0),
    problems
  };
}
var timeoutSignal = (ms) => {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms).unref?.();
  return c.signal;
};
var attr2 = (html, name) => new RegExp(`${name}["']?\\s*[:=]\\s*\\\\?["']([^"'\\\\]+)`).exec(html)?.[1];
async function verify(url, opts = {}) {
  const f = opts.fetch ?? fetch;
  const problems = [];
  const result = {
    url,
    ok: false,
    script: false,
    stub: false,
    keyValid: false,
    keyless: false,
    integrations: [],
    installCheck: { reachable: false },
    problems
  };
  let html = "";
  try {
    const res = await f(url, { headers: { "User-Agent": "doubleagent-cli (install verify)", Accept: "text/html" }, redirect: "follow", signal: timeoutSignal(TIMEOUT_MS) });
    result.status = res.status;
    html = await res.text();
    if (!res.ok) problems.push(`GET ${url} returned ${res.status}`);
  } catch (e) {
    problems.push(`could not fetch ${url}: ${e.message}`);
    return result;
  }
  result.script = /cdn\.doubleagent\.so\/v1\/doubleagent\.js/.test(html);
  result.stub = html.includes("window.doubleagent=window.doubleagent||");
  result.key = attr2(html, "data-key");
  result.endpoint = attr2(html, "data-endpoint");
  result.keyValid = !!result.key && KEY_RE.test(result.key) && result.key !== PLACEHOLDER_KEY;
  result.integrations = detectInHtml(html);
  if (!result.script) problems.push("SDK script tag not found in the server HTML (client-side injection is not visible here)");
  if (result.script && !result.stub) problems.push("queue stub missing: calls made before the SDK loads will throw");
  if (result.key === PLACEHOLDER_KEY) problems.push(`placeholder key ${PLACEHOLDER_KEY} is still in place`);
  else if (result.key && !result.keyValid) problems.push(`data-key "${result.key}" is not a pk_live_/pk_test_ key`);
  result.keyless = result.script && !result.key;
  const api = (opts.api ?? result.endpoint ?? DEFAULT_API).replace(/\/+$/, "");
  try {
    const res = await f(`${api}/v1/install-check?url=${encodeURIComponent(url)}`, { headers: { Accept: "application/json" }, signal: timeoutSignal(TIMEOUT_MS) });
    result.installCheck = { reachable: true, status: res.status };
    const text = await res.text();
    try {
      result.installCheck.body = JSON.parse(text);
    } catch {
      result.installCheck.body = text.slice(0, 500);
    }
    if (res.ok) result.installCheck.check = parseInstallCheck(result.installCheck.body);
  } catch (e) {
    result.installCheck = { reachable: false, error: e.message };
  }
  result.ok = result.script && result.stub && (result.keyless || result.keyValid);
  return result;
}

// src/cli.ts
var HELP = `doubleagent: install Double Agent, manage sites and keys

Usage
  npx @doubleagent-so/cli init [--key pk_\u2026 | --email you@example.com [--domain host] [--test]]
                       [--profile auto] [--dry-run] [--yes] [--json] [--cwd dir]
  npx @doubleagent-so/cli verify <url> [--api origin] [--json]
  npx @doubleagent-so/cli login | logout [--all]
  npx @doubleagent-so/cli sites [--json]
  npx @doubleagent-so/cli keys [list|create|rotate|revoke] [key_id] [--site st_\u2026] [--kind pk|sk] [--env live|test] [--json]
  npx @doubleagent-so/cli verify-domain <host> --method dns|meta|file|script [--site st_\u2026] [--json]
  npx @doubleagent-so/cli snippet <stack> [--key pk_\u2026] [--json]
  npx @doubleagent-so/cli create-account --email you@example.com [--domain host] [--json]

init           Installs the snippet. Without a key it installs keyless (claim the domain later to see data).
               --key sets a public key (or $DOUBLEAGENT_KEY); --email creates an account + site and uses its pk.
verify         Fetches <url>, checks the script tag, stub and key, and asks the API's install check.
login          Device-flow login; the session is saved to ~/.config/doubleagent/credentials.json (0600).
sites, keys    List sites; list, create, rotate or revoke keys (needs login).
verify-domain  Adds <host> to the site and verifies it (needs login).`;
var BOOL_FLAGS = /* @__PURE__ */ new Set(["dry-run", "yes", "y", "json", "help", "h", "test", "all"]);
var VALUE_FLAGS = ["key", "email", "domain", "name", "profile", "site", "kind", "env", "method", "api", "portal", "cwd"];
var EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
function parseArgs(argv) {
  const out = { pos: [], flags: {} };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--") || /^-[a-z]$/.test(a)) {
      const [k, v] = a.replace(/^-+/, "").split(/=(.*)/s, 2);
      if (v !== void 0) out.flags[k] = v;
      else if (BOOL_FLAGS.has(k) || i + 1 >= argv.length || argv[i + 1].startsWith("-")) out.flags[k] = true;
      else out.flags[k] = argv[++i];
    } else if (!out.cmd) out.cmd = a;
    else out.pos.push(a);
  }
  return out;
}
var COMMANDS = {
  init,
  verify: verifyCmd,
  login,
  logout,
  sites,
  keys,
  "verify-domain": verifyDomain,
  snippet: snippetCmd,
  "create-account": createAccountCmd
};
async function run(argv, io) {
  const args = parseArgs(argv);
  if (args.flags.help || args.flags.h || !args.cmd || args.cmd === "help") {
    io.out(HELP);
    return 0;
  }
  const cmd = COMMANDS[args.cmd];
  if (!cmd) {
    io.err(`unknown command "${args.cmd}"

${HELP}`);
    return 1;
  }
  try {
    const bare = VALUE_FLAGS.find((f) => args.flags[f] === true);
    if (bare) throw new CliError(`invalid --${bare}: expected a value`);
    return await cmd(args, io);
  } catch (e) {
    const known = e instanceof InstallError || e instanceof CliError || e instanceof ApiError;
    const msg = known ? e.message : e.stack ?? String(e);
    if (args.flags.json) io.out(JSON.stringify({ error: msg, ...e instanceof ApiError ? { code: e.code, status: e.status } : {} }, null, 2));
    else io.err(`error: ${msg}`);
    return e instanceof CliError ? e.exitCode : 1;
  }
}
function guessDomain(p) {
  const home = p.pkg?.homepage;
  try {
    if (home) return new URL(home).hostname;
  } catch {
  }
  return p.read("CNAME")?.trim().split(/\s/)[0] || p.read("public/CNAME")?.trim().split(/\s/)[0] || void 0;
}
function nextSteps(c) {
  const { stack, plan } = c;
  if (stack.id === "shopify-theme") {
    return [
      "Add these tags once inside the head of layout/theme.liquid, before other scripts:",
      ...htmlSnippet({ key: c.key, profile: c.profile }).map((l) => `  ${l}`),
      "Save and publish the theme, then visit the storefront with a cart to check the _da_* cart attributes."
    ];
  }
  if (plan.status === "unsupported") {
    return ["Paste this into the <head> of every page, before other scripts:", ...htmlSnippet({ key: c.key, profile: c.profile }).map((l) => `  ${l}`)];
  }
  const site = c.domain ?? "<your-domain>";
  const steps = [];
  if (c.keyless) {
    steps.push(`Installed without a key. Claim ${site} at ${c.claimUrl} to see retained data. Retention and collection limits apply.`);
  }
  steps.push(`Deploy, then run: npx @doubleagent-so/cli verify https://${site}`);
  if (c.account) {
    const v = c.account.verify;
    steps.push(`Confirm your email: check ${c.email} for the login link${c.account.login_url ? ` (or open ${c.account.login_url})` : ""}.`);
    if (v?.token) steps.push(`Verify ${v.hostname ?? site} to see data: DNS TXT _doubleagent.${v.hostname ?? site} "da-verify=${v.token}" (then run: npx @doubleagent-so/cli login && npx @doubleagent-so/cli verify-domain ${v.hostname ?? site} --method dns)`);
  } else if (!c.keyless) {
    steps.push(`Unlock the dashboard: npx @doubleagent-so/cli login, then npx @doubleagent-so/cli verify-domain ${site} --method dns`);
  } else {
    steps.push("Optional: npx @doubleagent-so/cli init --email you@example.com adds an account and key (live view, check()/tokens, webhooks).");
  }
  if (!c.keyless) steps.push("Server side: verify tokens from doubleagent.getToken(action) with @doubleagent-so/node (createDoubleAgent().verifyToken) before trusting them.");
  return steps;
}
function readKey(args, io) {
  const given = str(args.flags.key) ?? io.env.DOUBLEAGENT_KEY;
  if (given === void 0) return void 0;
  if (SECRET_KEY_RE.test(given)) throw new InstallError("that is a secret key (sk_\u2026): it must never be put in client code. Use the site's public key (pk_\u2026).");
  if (!KEY_RE.test(given)) throw new InstallError(`"${given}" is not a public key (expected pk_live_\u2026 or pk_test_\u2026)`);
  return given;
}
async function init(args, io) {
  const asJson = !!args.flags.json;
  const cwd = resolve(io.cwd, str(args.flags.cwd) ?? ".");
  const email = str(args.flags.email);
  const given = readKey(args, io);
  if (email && given) throw new InstallError("use either --email (creates a key) or --key, not both");
  if (email !== void 0 && !EMAIL_RE.test(email)) throw new InstallError(`"${email}" is not an email address`);
  const env = args.flags.test ? "test" : "live";
  const profile = str(args.flags.profile) ?? "auto";
  const dryRun = !!args.flags["dry-run"];
  const yes = !!(args.flags.yes || args.flags.y);
  const project = openProject(cwd);
  const stack = detectStack(project);
  const domain = str(args.flags.domain)?.toLowerCase() ?? guessDomain(project);
  const pending = `pk_${env}_PENDING`;
  const key = email ? pending : given;
  const plan = planInstall(project, stack, { key, profile });
  const integrations = detectIntegrations(project);
  const warnings = [];
  if (email && dryRun) warnings.push("dry run: no account is created; the diff shows a placeholder key");
  const diffs = plan.changes.map((c) => unifiedDiff(c.path, c.before, c.after));
  const claimUrl = `${portalBase(args, io)}/claim${domain ? `?domain=${encodeURIComponent(domain)}` : ""}`;
  if (!asJson) printHuman(io, stack, plan, integrations, diffs, warnings);
  let applied = false;
  let account;
  let finalKey = given;
  if (!dryRun) {
    const question = plan.changes.length ? `Apply ${plan.changes.length} change(s)${email ? ` and create an account for ${email}` : ""}? [Y/n] ` : void 0;
    if (question && !asJson && !yes && io.confirm && !await io.confirm(question)) {
      io.out("Aborted, nothing written.");
      return 1;
    }
    if (email) {
      account = await createAccount(args, io, { email, domain, name: str(args.flags.name) });
      finalKey = account.keys?.[`pk_${env}`] ?? account.keys?.pk_live ?? account.keys?.pk_test;
      if (!finalKey) throw new CliError("the account was created but the API returned no public key");
    }
    for (const c of plan.changes) {
      const abs = join3(cwd, c.path);
      mkdirSync2(dirname(abs), { recursive: true });
      writeFileSync2(abs, finalKey && email ? c.after.split(pending).join(finalKey) : c.after);
    }
    applied = plan.changes.length > 0;
  }
  const ctx = { stack, plan, profile, key: finalKey, keyless: !email && !given, domain, claimUrl, account, email };
  const steps = nextSteps(ctx);
  const code = plan.status === "unsupported" ? 2 : 0;
  if (asJson) {
    io.out(JSON.stringify({
      stack: stack.id,
      stack_label: stack.label,
      platform: stack.platform ?? null,
      status: plan.status,
      dry_run: dryRun,
      keyless: ctx.keyless,
      key: finalKey ?? null,
      domain: domain ?? null,
      claim_url: ctx.keyless ? claimUrl : null,
      files_changed: applied ? plan.changes.map((c) => c.path) : [],
      planned_changes: plan.changes.map((c) => ({ path: c.path, created: c.before === null })),
      account: account ? { ...account, warning: "keys.sk_test is shown once: store it server-side, never in client code" } : null,
      integrations: integrations.map((i) => i.name),
      warnings,
      notes: plan.notes,
      next_steps: steps,
      diff: diffs.join("\n")
    }, null, 2));
    return code;
  }
  if (applied) io.out(`
Wrote ${plan.changes.map((c) => c.path).join(", ")}.`);
  else if (dryRun && plan.changes.length) io.out("\nDry run: nothing written.");
  if (account) {
    io.out(`
Created account ${account.account_id} with site ${account.site_id}; installed ${finalKey}.`);
    if (account.keys?.sk_test) io.out(`Test secret key (shown once, server-side only, never in client code):
  ${account.keys.sk_test}`);
  }
  io.out(`
Next steps:
${steps.map((s) => s.startsWith("  ") ? s : `  - ${s}`).join("\n")}`);
  return code;
}
function printHuman(io, stack, plan, integrations, diffs, warnings) {
  io.out(`Stack: ${stack.label}${stack.platform ? ` (${stack.platform})` : ""}`);
  io.out(integrations.length ? `Integrations that will auto-activate: ${integrations.map((i) => `${i.name} (${i.evidence})`).join(", ")}` : "Integrations that will auto-activate: none detected");
  for (const w of warnings) io.err(`warning: ${w}`);
  for (const n of plan.notes) io.out(`note: ${n}`);
  if (plan.status === "installed") io.out("Already installed: nothing to do.");
  if (plan.status === "unsupported") io.out("Could not detect a supported stack.");
  if (diffs.length) io.out(`
${diffs.join("\n")}`);
}
async function verifyCmd(args, io) {
  const url = args.pos[0];
  if (!url || !/^https?:\/\//.test(url)) throw new InstallError("verify needs an http(s) URL, e.g. npx @doubleagent-so/cli verify https://example.com");
  const r = await verify(url, { api: str(args.flags.api), fetch: io.fetch });
  if (args.flags.json) {
    io.out(JSON.stringify(r, null, 2));
    return r.ok ? 0 : 1;
  }
  const mark = (b) => b ? "ok  " : "FAIL";
  io.out(`${mark(r.script)} script tag (cdn.doubleagent.so/v1/doubleagent.js)`);
  io.out(`${mark(r.stub)} queue stub`);
  io.out(r.keyless && r.script ? "ok   keyless install (claim the domain to see its data)" : `${mark(r.keyValid)} key ${r.key ?? "(none)"}`);
  if (r.integrations.length) io.out(`     integrations on page: ${r.integrations.join(", ")}`);
  const ic = r.installCheck;
  if (!ic.reachable) io.out(`     install check: API unreachable (${ic.error})`);
  else if (ic.status === 404) io.out("     install check: not available on this API yet");
  else if (ic.check) printInstallCheck(io, ic.check);
  else io.out(`     install check (${ic.status}): ${typeof ic.body === "string" ? ic.body : JSON.stringify(ic.body)}`);
  for (const p of r.problems) io.err(`problem: ${p}`);
  io.out(r.ok ? "\nInstalled correctly." : "\nNot installed correctly.");
  return r.ok ? 0 : 1;
}
function printInstallCheck(io, c) {
  const yn = (b) => b === void 0 ? "?" : b ? "yes" : "no";
  io.out(`     install check: ${c.ok === void 0 ? "no verdict" : c.ok ? "ok" : "NOT ok"}`);
  if (c.script_found !== void 0) io.out(`       script found: ${yn(c.script_found)}${c.script_src ? ` (${c.script_src})` : ""}`);
  if (c.keyless) io.out(`       keyless: yes${c.claim_url ? ` (claim at ${c.claim_url})` : ""}`);
  else if (c.key !== void 0 || c.key_valid !== void 0) io.out(`       key: ${c.key ?? "?"} (valid: ${yn(c.key_valid)})`);
  if (c.profile_attr !== void 0) io.out(`       data-profile: ${c.profile_attr}`);
  if (c.stub_before_script !== void 0) io.out(`       stub before script: ${yn(c.stub_before_script)}`);
  if (c.integrations_detected?.length) io.out(`       integrations: ${c.integrations_detected.join(", ")}`);
  if (c.last_beacon_at !== void 0) io.out(`       last beacon: ${c.last_beacon_at ?? "never"}`);
  for (const p of c.problems ?? []) {
    io.out(`       problem: ${p.message ?? p.code ?? "unknown"}${p.code && p.message ? ` [${p.code}]` : ""}`);
    if (p.fix) io.out(`         fix: ${p.fix}`);
  }
}

// src/main.ts
function ttyConfirm(p) {
  if (!p.stdin.isTTY || !p.stdout.isTTY) return void 0;
  return async (q) => {
    const rl = createInterface({ input: p.stdin, output: p.stdout });
    try {
      return !/^n/i.test((await rl.question(q)).trim());
    } finally {
      rl.close();
    }
  };
}
async function main(p, prefix = []) {
  const code = await run([...prefix, ...p.argv.slice(2)], {
    cwd: p.cwd(),
    env: p.env,
    out: (s) => p.stdout.write(`${s}
`),
    err: (s) => p.stderr.write(`${s}
`),
    confirm: ttyConfirm(p)
  });
  p.exitCode = code;
  return code;
}

// src/skill-bin/snippet.ts
void main(process, ["snippet"]);
