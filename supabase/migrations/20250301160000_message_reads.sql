-- message_reads: Letzter Lesezeitpunkt pro User/Chatroom
CREATE TABLE IF NOT EXISTS message_reads (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE CASCADE NOT NULL,
  last_read_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, chatroom_id)
);

CREATE INDEX IF NOT EXISTS idx_message_reads_user_id ON message_reads(user_id);

ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "message_reads_select_own"
  ON message_reads FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "message_reads_insert_own"
  ON message_reads FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "message_reads_update_own"
  ON message_reads FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- RPC: Ungelesene Anzahl pro Chatroom für einen User
CREATE OR REPLACE FUNCTION get_unread_counts(p_user_id uuid)
RETURNS TABLE (chatroom_id uuid, unread_count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT
    cm.chatroom_id,
    COUNT(m.id)::bigint
  FROM chatroom_members cm
  LEFT JOIN message_reads mr
    ON mr.chatroom_id = cm.chatroom_id AND mr.user_id = p_user_id
  LEFT JOIN messages m
    ON m.chatroom_id = cm.chatroom_id
    AND m.created_at > COALESCE(mr.last_read_at, '1970-01-01'::timestamptz)
    AND m.user_id != p_user_id
  WHERE cm.user_id = p_user_id
  GROUP BY cm.chatroom_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
