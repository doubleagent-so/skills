#!/usr/bin/env node
// Offline validation for the published repository; never provisions an account.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else files.push(path);
  }
}
walk(root);
const skillRoots = readdirSync(resolve(root, 'skills'), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && existsSync(resolve(root, 'skills', entry.name, 'SKILL.md')))
  .map(entry => resolve(root, 'skills', entry.name));
assert(skillRoots.length > 0, 'No skills found');
const documents = files.filter(file => extname(file) === '.md');
const bodies = new Map(documents.map(file => [file, readFileSync(file, 'utf8')]));
const anchors = new Map();
for (const [file, body] of bodies) {
  const counts = new Map(), ids = new Set();
  let inFence = false;
  for (const line of body.split('\n')) {
    const fence = /^\s*```(.*)$/.exec(line);
    if (fence) {
      if (!inFence) assert(/^[a-z][a-z0-9_-]*$/.test(fence[1]), `${relative(root, file)}: code fence needs a lowercase language`);
      else assert(!fence[1].trim(), `${relative(root, file)}: unexpected content on closing code fence`);
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const heading = /^#{1,6}\s+(.+?)\s*#*\s*$/.exec(line);
    if (!heading) continue;
    const base = heading[1].toLowerCase().replace(/<[^>]*>/g, '').replace(/[^\p{L}\p{N}_\s-]/gu, '').replace(/ /g, '-');
    const count = counts.get(base) ?? 0;
    ids.add(count ? `${base}-${count}` : base); counts.set(base, count + 1);
  }
  assert(!inFence, `${relative(root, file)}: unclosed code fence`);
  anchors.set(file, ids);
}
const skillOf = file => skillRoots.find(skillRoot => !relative(skillRoot, file).startsWith('..'));
let links = 0;
for (const [file, body] of bodies) {
  const withoutBlocks = body.replace(/^\s*```[^\n]*\n[\s\S]*?^\s*```\s*$/gm, '');
  assert(!/`(?:npx|npm|node|curl|bash|git|python3?)\s+[^`\n]+`/.test(withoutBlocks), `${relative(root, file)}: put runnable commands in fenced code blocks`);
  const prose = withoutBlocks.replace(/`[^`\n]+`/g, '');
  const targets = [
    ...[...prose.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)].map(match => match[1]),
    ...[...prose.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]),
  ];
  for (const target of targets) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
    const [path, fragment] = target.split('#');
    const dest = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
    assert(!relative(root, dest).startsWith('..'), `${relative(root, file)}: link escapes repository: ${target}`);
    const skillRoot = skillOf(file);
    if (skillRoot) assert(!relative(skillRoot, dest).startsWith('..'), `${relative(root, file)}: local link escapes installed skill: ${target}`);
    assert(existsSync(dest), `${relative(root, file)}: missing target ${target}`);
    if (fragment && statSync(dest).isFile() && extname(dest) === '.md') {
      assert(anchors.get(dest)?.has(decodeURIComponent(fragment)), `${relative(root, file)}: missing anchor ${target}`);
    }
    links++;
  }
}
let helpers = 0;
for (const skillRoot of skillRoots) {
  const name = relative(resolve(root, 'skills'), skillRoot);
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(readFileSync(resolve(skillRoot, 'SKILL.md'), 'utf8'))?.[1] ?? '';
  assert(new RegExp(`^name: ${name}$`, 'm').test(frontmatter), `skills/${name}: frontmatter name must be ${name}`);
  assert(/^license: MIT$/m.test(frontmatter), `skills/${name}: missing license`);
  const scripts = resolve(skillRoot, 'scripts');
  if (!existsSync(scripts)) continue;
  for (const script of readdirSync(scripts).filter(file => /\.(?:mjs|js)$/.test(file))) {
    execFileSync(process.execPath, ['--check', resolve(scripts, script)]);
    helpers++;
  }
}
const agents = resolve(root, 'skills/doubleagent-agents/scripts');
if (existsSync(agents)) {
  for (const name of ['portal', 'proof', 'card', 'observe']) {
    assert(execFileSync(process.execPath, [resolve(agents, `${name}.mjs`), '--help'], { encoding: 'utf8' }).includes(`usage: ${name}.mjs`), `${name}.mjs --help`);
  }
}
const website = resolve(root, 'skills/doubleagent');
const helper = name => resolve(website, 'scripts', `${name}.mjs`);
assert(execFileSync(process.execPath, [helper('agents'), '--help'], { encoding: 'utf8' }).includes('agent-name'));
assert(JSON.parse(execFileSync(process.execPath, [helper('simulate'), '--list'], { encoding: 'utf8' })).agents.length > 0);
const stacks = ['html','vite','next-app','next-pages','astro','nuxt','sveltekit','remix','wordpress','wix','squarespace','webflow','shopify'];
for (const stack of stacks) {
  const result = JSON.parse(execFileSync(process.execPath, [helper('snippet'), stack, '--json'], { encoding: 'utf8' }));
  assert.equal(result.stack, stack); assert(result.file && result.where);
  assert(Array.isArray(result.lines));
  assert(result.lines.join('\n').includes('https://cdn.doubleagent.so/v1/doubleagent.js'));
}
process.stdout.write(`Checked ${documents.length} Markdown files in ${skillRoots.length} skills, ${links} local references, ${helpers} helper scripts and ${stacks.length} platform snippets.\n`);
