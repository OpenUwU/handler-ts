CREATE TABLE IF NOT EXISTS guilds (
  id                              TEXT        PRIMARY KEY,
  created_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
