-- reactions-Spalte für Messages (jsonb: { "👍": ["user-id-1", "user-id-2"], "😂": ["user-id-3"] })
ALTER TABLE messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '{}';

-- Chatroom-Mitglieder dürfen Reactions auf Nachrichten setzen
CREATE POLICY "messages_update_members"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatroom_members cm
      WHERE cm.chatroom_id = messages.chatroom_id
        AND cm.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chatroom_members cm
      WHERE cm.chatroom_id = messages.chatroom_id
        AND cm.user_id = auth.uid()
    )
  );
