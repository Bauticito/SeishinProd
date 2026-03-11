CREATE TABLE IF NOT EXISTS quote_attachments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  file_base64 TEXT NOT NULL,
  folder_name TEXT,
  customer_name TEXT,
  odoo_document_id INTEGER,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error')),
  sync_error TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_quote_attachments_lead_id
ON quote_attachments(lead_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_quote_attachments_sync_status
ON quote_attachments(sync_status, created_at DESC);
