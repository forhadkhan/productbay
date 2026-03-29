# Git Workflow

- Use conventional git commit messages in lowercase always.
- Keep each commit small and focused on a single change.
- Use `bun run deploy-dist` to deploy the plugin to the `dist` branch.

## Meta Branch

The `meta` branch is an **orphan branch** (no shared history with `main`) that exclusively tracks development-only files that should **never** be included in any code branch:


### How It Works

- A **git worktree** at `.meta-worktree/` checks out the `meta` branch.
- **Symlinks** (`.agents` → `.meta-worktree/.agents`, `.vscode` → `.meta-worktree/.vscode`) make these files accessible from the project root.
- `notes/` and `instructions/` live directly in the main worktree but are **gitignored** on all non-meta branches.
- `.gitignore` on `main`/`develop`/feature branches ignores all meta directories, preventing accidental commits.

### Working with the Meta Branch

```bash
# View meta branch contents
cd .meta-worktree && ls

# Stage and commit changes to meta files
cd .meta-worktree && git add -A && git commit -m "docs: update meta branch"

# Push meta branch
cd .meta-worktree && git push origin meta
```

### Important Rules

1. **Never merge `meta` into any other branch** — it has no shared history.
2. **Never remove the `.gitignore` entries** for `.agents`, `.vscode`, `notes`, `instructions/`, and `.meta-worktree/` on code branches.
3. **Always commit meta file changes from `.meta-worktree/`**, not from the project root.

---

## Distribution Branch (`dist`)

The `dist` branch is an **orphan branch** that contains only the production-ready build of the plugin. It is designed to be lean and ready for deployment or tagging.

### Structure

Unlike the `main` branch, the `dist` branch contains **only** the contents of the `dist/productbay` directory at its root:
- `app/`, `assets/`, `vendor/`
- `productbay.php`, `readme.txt`, etc.
- `productbay.zip` (for convenience)

### Deployment Workflow

We use a specialized script to keep the `dist` branch in sync with the latest build from `main`.

| Command | Action |
|---------|--------|
| `bun run deploy-dist` | Builds the plugin, syncs artifacts to `dist`, and commits changes. |

### How It Works (Technical)

The `deploy-dist` script performs the following atomic operations:
1. Runs the production build (`bun run release`).
2. Creates a **temporary git worktree** for the `dist` branch.
3. Automatically wipes the `dist` branch while preserving the `.git` directory.
4. Copies the fresh build artifacts from `dist/productbay/` to the worktree root.
5. Commits the changes with a distribution timestamp.
6. Removes the temporary worktree.

### Rules for `dist` Branch

1. **Never manual edit** — Always use the `deploy-dist` script to ensure consistency.
2. **Force push may be required** — If the branch is re-initialized or history is wiped, use `git push -f origin dist`.
3. **No source code** — This branch should never contain `.ts`, `.tsx`, or build configs.
