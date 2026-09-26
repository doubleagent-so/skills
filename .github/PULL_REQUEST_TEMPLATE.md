## Problem and change

Describe the user-facing problem and the resulting behavior or documentation.

## Source of truth

Link the corresponding monorepo change, or explain how maintainers should carry
this change back to `skills/repository/`, `skills/doubleagent/` or `packages/cli/`.
Direct distribution edits can be overwritten by the publisher.

## Validation

From the distribution repository root, run:

```sh
node tools/check-docs.mjs
```

- [ ] The documentation checker passes.
- [ ] Reviewed rendered prose, commands and code blocks.
- [ ] Checked examples and links relevant to this change.
- [ ] Updated source rather than hand-editing generated helper scripts.
- [ ] Removed credentials and private data from examples and logs.
