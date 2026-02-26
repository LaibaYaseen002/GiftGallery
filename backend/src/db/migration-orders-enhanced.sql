-- =============================================
-- Feature 18: Enhanced Order Management
-- =============================================

-- Add admin_notes column to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS admin_notes text;

-- Status History table
CREATE TABLE IF NOT EXISTS status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  old_status varchar(20),
  new_status varchar(20) NOT NULL,
  changed_by varchar(200) NOT NULL,
  note text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_status_history_order ON status_history(order_id);
