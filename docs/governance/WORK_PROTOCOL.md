# WORK PROTOCOL

This repository must be worked on through a fixed process. Memory is not enough.

## Required start sequence

1. Open UTF-8 shell
   - `npm run shell:utf8`
2. Run gate
   - `npm run gate:check`
3. Read the governance files listed by the gate
4. State the scope before editing

## Scope lock rule

Before editing, explicitly define:

- whether the target is formal, preview, prototype, demo, or archive
- which files will be touched
- which adjacent files must not be touched

For layout / copy / component reposition requests:

- use `docs/governance/DESIGN_CHANGE_REQUEST_TEMPLATE_2026-04-11.md`
- prefer position-based naming over only `附件一 / 附件二 / 附件三`
- explicitly separate:
  - formal copy
  - work instructions
  - keep / replace / do-not-do constraints

## Verification rule

After editing, verify:

- local pages
- production or preview pages as relevant
- type check
- whether any unintended routes or files changed

## Write rule

- Use UTF-8 safe flows
- Prefer Python or Node for generated text output
- Avoid Windows PowerShell 5.1 redirection for governance docs
- Use the repository gate instead of trusting terminal display

## Deployment rule

After any meaningful deploy or release candidate update:

- record branch
- record commit
- record target environment
- record pages checked
- record whether the deploy changed formal behavior
