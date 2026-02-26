-- =============================================
-- Feedback table
-- =============================================
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar(200),
  name varchar(200) NOT NULL,
  email varchar(200) NOT NULL,
  subject varchar(200) NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_read ON feedback(is_read);
