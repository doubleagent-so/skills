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
const documents = files.filter(f => extname(f) === '.md');
const bodies = new Map(documents.map(f => [f, readFileSync(f, 'utf8')]));
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
let links = 0;
for (const [file, body] of bodies) {
  const withoutBlocks = body.replace(/^\s*```[^\n]*\n[\s\S]*?^\s*```\s*$/gm, '');
  assert(!/`(?:npx|npm|node|curl|bash|git|python3?)\s+[^`\n]+`/.test(withoutBlocks), `${relative(root, file)}: put runnable commands in fenced code blocks`);
  const prose = withoutBlocks.replace(/`[^`\n]+`/g, '');
  const targets = [
    ...[...prose.matchAll(/\[[^\]\n]*\]\(([^)\s]+)\)/g)].map(m => m[1]),
    ...[...prose.matchAll(/(?:href|src)="([^"]+)"/g)].map(m => m[1]),
  ];
  for (const target of targets) {
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) continue;
    const [path, fragment] = target.split('#');
    const dest = path ? resolve(dirname(file), decodeURIComponent(path)) : file;
    assert(!relative(root, dest).startsWith('..'), `${relative(root, file)}: link escapes repository: ${target}`);
    const skillRoot = resolve(root, 'skills/doubleagent');
    if (!relative(skillRoot, file).startsWith('..')) {
      assert(!relative(skillRoot, dest).startsWith('..'), `${relative(root, file)}: local link escapes installed skill: ${target}`);
    }
    assert(existsSync(dest), `${relative(root, file)}: missing target ${target}`);
    if (fragment && statSync(dest).isFile() && extname(dest) === '.md') {
      assert(anchors.get(dest)?.has(decodeURIComponent(fragment)), `${relative(root, file)}: missing anchor ${target}`);
    }
    links++;
  }
}
const skill = readFileSync(resolve(root, 'skills/doubleagent/SKILL.md'), 'utf8');
const frontmatter = /^---\n([\s\S]*?)\n---/.exec(skill)?.[1] ?? '';
assert(/^name: doubleagent$/m.test(frontmatter), 'Missing doubleagent skill name');
assert(/^license: MIT$/m.test(frontmatter), 'Missing skill license');
const helper = name => resolve(root, 'skills/doubleagent/scripts', `${name}.mjs`);
for (const name of ['snippet', 'verify', 'create-account']) execFileSync(process.execPath, ['--check', helper(name)]);
const stacks = ['html','vite','next-app','next-pages','astro','nuxt','sveltekit','remix','wordpress','wix','squarespace','webflow','shopify'];
for (const stack of stacks) {
  const result = JSON.parse(execFileSync(process.execPath, [helper('snippet'), stack, '--json'], { encoding: 'utf8' }));
  assert.equal(result.stack, stack); assert(result.file && result.where);
  assert(Array.isArray(result.lines));
  assert(result.lines.join('\n').includes('https://cdn.doubleagent.so/v1/doubleagent.js'));
}
console.log(`Checked ${documents.length} Markdown files, ${links} local references, 3 helper scripts and ${stacks.length} platform snippets.`);
