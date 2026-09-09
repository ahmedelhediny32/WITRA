-- Attachments: admin-uploaded business documents visible to clients
-- (Strategy, SWOT Analysis, Marketing Plan, Brand Guidelines, etc.)

CREATE TABLE attachments (
  id          TEXT PRIMARY KEY,
  client_id   TEXT NOT NULL REFERENCES clients(id),
  label       TEXT NOT NULL DEFAULT 'Other',   -- category: Strategy, SWOT Analysis, Marketing Plan, Business Plan, Brand Guidelines, Other
  filename    TEXT NOT NULL,                    -- original file name
  mime_type   TEXT NOT NULL DEFAULT '',
  file_data   TEXT NOT NULL,                    -- base64 data URL
  file_size   INTEGER NOT NULL DEFAULT 0,       -- original file size in bytes
  uploaded_by TEXT NOT NULL REFERENCES users(id),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_client_id ON attachments(client_id);
