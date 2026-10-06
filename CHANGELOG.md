# Changelog

The skills are published from the Double Agent source on every change; this file records user-visible changes.

## 2026-10-06

Two skills, installed together (see [Get started](README.md#get-started)):

- **`doubleagent`**: installs the Double Agent browser SDK in Next.js, Vite, static HTML, Astro, Nuxt, SvelteKit,
  Remix, WordPress, Shopify, Wix, Squarespace, Webflow and AI-generated projects, verifies a live installation,
  simulates human, bot and agent visits, and maps agent names to ERC-8004 registry identities. Its helper scripts
  are built from `@doubleagent-so/cli` 0.2.0 and score with `@doubleagent-so/agent-detector` 0.4.0.
- **`doubleagent-agents`**: connects an AI agent to Double Agent: registration and `daa_` tokens, the portal's A2A
  agent and MCP server, endpoint, card key and domain proofs, signed A2A Agent Cards, the agent directory and
  registry, and `@doubleagent-so/observe` 0.2.0 telemetry for A2A and MCP agents.
