CREATE TABLE leads_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_type TEXT NOT NULL CHECK (lead_type IN ('contact', 'quote', 'cotización', 'recruitment')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  service TEXT,
  sub_service TEXT,
  quantity_text TEXT,
  months INTEGER,
  estimate TEXT,
  order_lines_json TEXT,
  sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error')),
  sync_error TEXT,
  odoo_partner_id INTEGER,
  odoo_sale_order_id INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO leads_new (
  id, lead_type, name, email, phone, company, message, service, sub_service, quantity_text, months, estimate,
  order_lines_json, sync_status, sync_error, odoo_partner_id, odoo_sale_order_id, ip_address, user_agent, created_at, updated_at
)
SELECT
  id, lead_type, name, email, phone, company, message, service, sub_service, quantity_text, months, estimate,
  order_lines_json, sync_status, sync_error, odoo_partner_id, odoo_sale_order_id, ip_address, user_agent, created_at, updated_at
FROM leads;

DROP TABLE leads;
ALTER TABLE leads_new RENAME TO leads;

CREATE INDEX idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX idx_leads_sync_status ON leads(sync_status);
CREATE INDEX idx_leads_email ON leads(email);
