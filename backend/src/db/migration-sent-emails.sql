-- Sent Emails table - logs all emails sent from admin
CREATE TABLE IF NOT EXISTS sent_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email varchar(200) NOT NULL,
  to_name varchar(200),
  subject varchar(300) NOT NULL,
  message text NOT NULL,
  type varchar(50) DEFAULT 'custom',
  reference_id uuid,
  sent_by varchar(200) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sent_emails_created ON sent_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_type ON sent_emails(type);
