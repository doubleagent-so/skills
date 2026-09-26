# Install Double Agent with a coding agent or CLI

[Documentation home](../README.md) · [Command reference](command-reference.md) · [Troubleshooting](troubleshooting.md)

Add the browser SDK to your website, deploy the change and check the installation.
The standard snippet works without a Double Agent account or API key. This is
called a **keyless installation**.

## Before you start

You need access to the website's source files or its platform settings. For
terminal commands, install Node.js and npm; the Double Agent CLI requires Node.js
18 or later. Use a supported Node.js release for your environment.

Choose the route that fits your site:

| Route | Use it when |
| --- | --- |
| [Coding agent](#install-with-a-coding-agent) | You want your agent to inspect the project and perform the integration |
| [CLI](#install-with-the-cli) | You want to preview and apply file changes yourself |
| [Platform guide](../README.md#supported-platforms) | You manage the site in a hosted editor or platform dashboard |

The coding-agent route needs an agent that supports skills. The platform guides
explain any additional access or plan requirements.

## Install with a coding agent

From your website project, install the skill:

```sh
npx skills add doubleagent-so/skills
```

Choose your coding agent in the installer. To inspect the available skill before
installing it, run:

```sh
npx skills add doubleagent-so/skills --list
```

The [skills CLI](https://github.com/vercel-labs/skills) manages agent selection and
installation scope. If GitHub requests authentication, use an account with access
to this repository through your configured Git or GitHub CLI authentication.

Ask your agent:

```text
Install Double Agent on this website using the doubleagent skill.
Use the default keyless setup where supported. Explain the file or setting changes,
then verify the deployed URL. Do not create an account for me.
```

Installing the skill adds instructions to your agent. The website receives the
SDK only after the agent performs the integration and you deploy the change.

## Install with the CLI

From your website project, preview the integration:

```sh
npx @doubleagent-so/cli init --dry-run
```

Check the detected framework, target files and proposed diff. The preview does
not edit files or create an account. If the plan matches your project, apply it:

```sh
npx @doubleagent-so/cli init
```

The CLI installs keyless unless you supply a public key or have set
`DOUBLEAGENT_KEY`. Some platforms return manual instructions instead of file edits.
Follow the relevant [platform guide](../README.md#supported-platforms) when needed.
Use one SDK installation per page; check for an existing tag, plugin or npm setup.

For automation and JSON output, see the [command reference](command-reference.md).

## Deploy and verify

Deploy through your site's normal process. Open the published URL, interact with
the page and follow [Verify a published installation](../skills/doubleagent/references/verify.md).
That guide covers browser loading, collection requests and HQ reporting.

For an additional HTML check, replace the example URL and run from any directory:

```sh
npx @doubleagent-so/cli verify https://your-site.example --json
```

Read the full result, including API diagnostics. A successful HTML check alone
does not prove that the SDK ran or classified a visit correctly.

For local development, use the browser checks. The remote installation service
cannot reach a server available only on your computer.

## View your data in HQ

[Claim your domain](https://app.doubleagent.so/claim) when you want access to its
data in HQ. Domain verification links retained keyless data to your account;
retention limits still apply. Follow the [claiming guide](../skills/doubleagent/references/claim.md).

To add an existing public key, replace the marked value and run from the website
project:

```sh
npx @doubleagent-so/cli init --key pk_live_REPLACEWITHYOURPUBLICKEY
```

Use only a public key in browser configuration. Keep secret keys on the server.
For optional account creation through the CLI, see
[Create an account](command-reference.md#create-an-account).
