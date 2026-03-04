-- Antworten auf Nachrichten
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reply_to_id uuid REFERENCES messages(id);
CREATE INDEX IF NOT EXISTS idx_messages_reply_to_id ON messages(reply_to_id);
