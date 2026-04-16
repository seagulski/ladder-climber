CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL DEFAULT 'ANON',
  score INTEGER NOT NULL DEFAULT 0,
  highest_title TEXT NOT NULL DEFAULT 'Intern (Unpaid)',
  highest_floor INTEGER NOT NULL DEFAULT 1,
  time_survived_ms INTEGER NOT NULL DEFAULT 0,
  demotions INTEGER NOT NULL DEFAULT 0,
  max_multiplier REAL NOT NULL DEFAULT 1.0,
  build_version TEXT DEFAULT '1.0.0',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC);
