CREATE TABLE IF NOT EXISTS user_premium (
  id                 TEXT        PRIMARY KEY,
  tier               TEXT        NOT NULL,
  activated_at       TIMESTAMPTZ,
  server_activations INTEGER     NOT NULL DEFAULT 0,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
