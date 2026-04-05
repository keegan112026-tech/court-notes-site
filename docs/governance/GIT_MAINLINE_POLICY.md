# GIT MAINLINE POLICY

## Mainline

- `main` is the formal code baseline
- `origin/main` is the remote baseline

## Working rule

Before editing:

1. confirm current branch
2. confirm `HEAD`
3. confirm `main`
4. confirm `origin/main`
5. compare current branch to `main`

## Dirty worktree rule

A dirty worktree is allowed only if:

- touched-file scope is explicitly defined
- unrelated files are not modified during the session
- changes are later grouped before commit

Do not treat a dirty worktree as a reason to guess.

## Commit grouping rule

When commits are eventually made, group them by:

1. formal product changes
2. governance and tooling changes
3. cleanup or archival changes

Do not mix all three into one undifferentiated commit.
