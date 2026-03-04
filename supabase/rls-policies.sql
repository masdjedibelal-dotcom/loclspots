-- LoclSpots Row Level Security Policies
-- Führe dieses Skript im Supabase SQL Editor aus (nach schema.sql)

-- =============================================================================
-- RLS aktivieren für alle Tabellen
-- =============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE collabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE collab_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_participants ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- profiles
-- =============================================================================
CREATE POLICY "profiles_select_public"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =============================================================================
-- chatrooms
-- =============================================================================
CREATE POLICY "chatrooms_select_authenticated"
  ON chatrooms FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Keine Policy = nur Service Role (bypassed RLS) kann erstellen

-- =============================================================================
-- chatroom_members
-- =============================================================================
CREATE POLICY "chatroom_members_select_authenticated"
  ON chatroom_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "chatroom_members_insert_own"
  ON chatroom_members FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "chatroom_members_delete_own"
  ON chatroom_members FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- messages
-- =============================================================================
CREATE POLICY "messages_select_members"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chatroom_members cm
      WHERE cm.chatroom_id = messages.chatroom_id
        AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "messages_insert_own"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "messages_delete_own"
  ON messages FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- collabs
-- =============================================================================
CREATE POLICY "collabs_select_authenticated"
  ON collabs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "collabs_insert_authenticated"
  ON collabs FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "collabs_update_own"
  ON collabs FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "collabs_delete_own"
  ON collabs FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- =============================================================================
-- collab_items
-- =============================================================================
CREATE POLICY "collab_items_select_authenticated"
  ON collab_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "collab_items_insert_creator"
  ON collab_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collabs c
      WHERE c.id = collab_items.collab_id
        AND c.creator_id = auth.uid()
    )
  );

CREATE POLICY "collab_items_update_creator"
  ON collab_items FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collabs c
      WHERE c.id = collab_items.collab_id
        AND c.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM collabs c
      WHERE c.id = collab_items.collab_id
        AND c.creator_id = auth.uid()
    )
  );

CREATE POLICY "collab_items_delete_creator"
  ON collab_items FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collabs c
      WHERE c.id = collab_items.collab_id
        AND c.creator_id = auth.uid()
    )
  );

-- =============================================================================
-- events
-- =============================================================================
CREATE POLICY "events_select_authenticated"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "events_insert_authenticated"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "events_update_own"
  ON events FOR UPDATE
  TO authenticated
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "events_delete_own"
  ON events FOR DELETE
  TO authenticated
  USING (creator_id = auth.uid());

-- =============================================================================
-- event_participants
-- =============================================================================
CREATE POLICY "event_participants_select_authenticated"
  ON event_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "event_participants_insert_own"
  ON event_participants FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "event_participants_delete_own"
  ON event_participants FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =============================================================================
-- Realtime: messages-Tabelle aktivieren
-- =============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
