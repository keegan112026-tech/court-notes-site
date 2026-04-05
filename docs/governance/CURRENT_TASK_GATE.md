# CURRENT TASK GATE

Use this checklist before any new work session.

## Required answers

1. What production URL is being treated as display truth?
2. What branch is active?
3. What is `HEAD`?
4. What are `main` and `origin/main`?
5. Is the branch aligned with `main`?
6. Is the worktree clean or dirty?
7. What exact file scope will be touched this session?
8. What exact areas are out of scope this session?
9. Are we working on formal routes, preview routes, prototype routes, demo routes, or archive routes?
10. What local and online pages will be checked after the change?

## Mandatory commands

- `npm run shell:utf8`
- `npm run gate:check`

## Blocking conditions

Do not proceed casually if:

- required governance files are missing
- production checks fail
- encoding check fails
- governance docs UTF-8 check fails
- the worktree is dirty and touched-file scope has not been defined
