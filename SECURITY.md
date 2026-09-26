# Security

## Report a vulnerability privately

Email [support@doubleagent.so](mailto:support@doubleagent.so) with a description of
the affected skill, CLI command or service and a minimal reproduction. Include the
version or commit and the potential impact. Do not post exploitable details,
credentials or private session data in a public issue.

For ordinary installation questions, use the
[public issue tracker](https://github.com/doubleagent-so/skills/issues).

## Credentials and installation

Public keys beginning with `pk_` may be used in browser configuration. Secret keys
beginning with `sk_`, login sessions and verification credentials must remain
private. Account-creation commands can print credentials once; their JSON output
is sensitive too. Do not attach it to an issue or publish it in build logs.

If a secret is exposed, remove it from public locations and rotate or revoke it
through the account's key management. Removing a value from the latest commit does
not remove it from repository history.

Review the skill and proposed website edits before deployment. Keep existing
consent and CSP controls in place. Installation checks and visitor classifications
do not establish a visitor's authorization to perform an action.
