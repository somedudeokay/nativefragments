CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  recovery_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL
);
CREATE TABLE sessions (
  token_hash TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  expires_at INTEGER NOT NULL
);
CREATE INDEX sessions_expiry ON sessions(expires_at);
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK(length(title) BETWEEN 1 AND 200),
  done INTEGER NOT NULL DEFAULT 0 CHECK(done IN (0, 1)),
  created_at INTEGER NOT NULL
);
CREATE INDEX tasks_workspace ON tasks(workspace_id, created_at);
