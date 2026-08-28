CREATE TABLE IF NOT EXISTS server_premium (
  id            TEXT        PRIMARY KEY,
  activated_by  TEXT        NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
