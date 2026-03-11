# Git Workflow

## Branch Strategy

| Branch     | Purpose                                                     |
|------------|-------------------------------------------------------------|
| `main`     | Stable, release-ready code                                  |
| `develop`  | Active development integration branch                       |
| `feature/*`| Feature branches off `develop`                              |
| `meta`     | Orphan branch — stores dev-only config, notes & tooling     |

---

## Meta Branch

The `meta` branch is an **orphan branch** (no shared history with `main`) that exclusively tracks development-only files that should **never** be included in any code branch:

| Directory       | Contents                                    |
|-----------------|---------------------------------------------|
| `.agents/`      | AI agent workflows and configuration        |
| `.vscode/`      | VS Code workspace settings                  |
| `notes/`        | Architecture docs, dev notes, specs         |
| `instructions/` | Project instructions, drafts, style guides  |

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
cd .meta-worktree && git add -A && git commit -m "docs: update notes"

# Push meta branch
cd .meta-worktree && git push origin meta
```

### Important Rules

1. **Never merge `meta` into any other branch** — it has no shared history.
2. **Never remove the `.gitignore` entries** for `.agents`, `.vscode`, `notes`, `instructions/`, and `.meta-worktree/` on code branches.
3. **Always commit meta file changes from `.meta-worktree/`**, not from the project root.
