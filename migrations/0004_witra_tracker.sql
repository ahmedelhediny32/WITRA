-- WITRA's own internal Content Ops Tracker state (single row, agency-wide)
CREATE TABLE IF NOT EXISTS witra_content_ops_state (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  state_json  TEXT NOT NULL,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
