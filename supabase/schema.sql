-- LoclSpots Database Schema
-- Führe dieses Skript im Supabase SQL Editor aus

-- =============================================================================
-- 1. profiles
-- =============================================================================
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text NOT NULL,
  bio text,
  interests text[] DEFAULT '{}',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 2. chatrooms
-- =============================================================================
CREATE TABLE chatrooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  emoji text DEFAULT '💬',
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 3. chatroom_members
-- =============================================================================
CREATE TABLE chatroom_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  UNIQUE(chatroom_id, user_id)
);

-- =============================================================================
-- 4. messages
-- =============================================================================
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 5. collabs
-- =============================================================================
CREATE TABLE collabs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  category text NOT NULL,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_emoji text DEFAULT '📋',
  likes_count int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 6. collab_items
-- =============================================================================
CREATE TABLE collab_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collab_id uuid REFERENCES collabs(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  maps_url text NOT NULL,
  description text,
  position int DEFAULT 0
);

-- =============================================================================
-- 7. events
-- =============================================================================
CREATE TABLE events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  maps_url text,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =============================================================================
-- 8. event_participants
-- =============================================================================
CREATE TABLE event_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(event_id, user_id)
);

-- =============================================================================
-- View: chatroom_with_member_count
-- =============================================================================
CREATE VIEW chatroom_with_member_count AS
SELECT
  c.id,
  c.name,
  c.description,
  c.emoji,
  c.category,
  c.created_at,
  COALESCE(m.member_count, 0)::int AS member_count
FROM chatrooms c
LEFT JOIN (
  SELECT chatroom_id, COUNT(*) AS member_count
  FROM chatroom_members
  GROUP BY chatroom_id
) m ON c.id = m.chatroom_id;

-- =============================================================================
-- Indexes
-- =============================================================================

-- chatroom_members
CREATE INDEX idx_chatroom_members_chatroom_id ON chatroom_members(chatroom_id);
CREATE INDEX idx_chatroom_members_user_id ON chatroom_members(user_id);

-- messages
CREATE INDEX idx_messages_chatroom_id ON messages(chatroom_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_chatroom_created ON messages(chatroom_id, created_at);

-- collabs
CREATE INDEX idx_collabs_creator_id ON collabs(creator_id);
CREATE INDEX idx_collabs_chatroom_id ON collabs(chatroom_id);
CREATE INDEX idx_collabs_created_at ON collabs(created_at);

-- collab_items
CREATE INDEX idx_collab_items_collab_id ON collab_items(collab_id);

-- events
CREATE INDEX idx_events_creator_id ON events(creator_id);
CREATE INDEX idx_events_chatroom_id ON events(chatroom_id);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_created_at ON events(created_at);

-- event_participants
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);

-- =============================================================================
-- Seed: 8 Chatrooms
-- =============================================================================
INSERT INTO chatrooms (name, description, emoji, category) VALUES
  ('Kultur & Stadtleben', 'Theater, Museen, Kino und urbanes Leben', '🎭', 'Kultur & Stadtleben'),
  ('Outdoor & Natur', 'Wandern, Parks, Natur erkunden', '🥾', 'Outdoor & Natur'),
  ('Brettspiele', 'Spieleabende, Tabletop, Kartenspiele', '♟️', 'Brettspiele'),
  ('Neu in der Stadt', 'Für Neulinge und alle, die die Stadt erkunden wollen', '🏙️', 'Neu in der Stadt'),
  ('Tanzen & Bewegung', 'Tanzabende, Fitness, Bewegung', '💃', 'Tanzen & Bewegung'),
  ('Sport & Fitness', 'Sportarten, Workouts, gemeinsame Aktivität', '⚽', 'Sport & Fitness'),
  ('Kochen & Genuss', 'Rezepte, Restaurants, Foodie-Treffen', '🍳', 'Kochen & Genuss'),
  ('Schwarzes Brett', 'Ankündigungen, Suche & Biete, Sonstiges', '📌', 'Schwarzes Brett');
