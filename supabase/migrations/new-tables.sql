-- LoclSpots: Neue Tabellen (ohne places, collabs, collab_items, events anzufassen)
-- Führe im Supabase SQL Editor aus

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
-- 5. collab_likes
-- =============================================================================
CREATE TABLE collab_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collab_id uuid REFERENCES collabs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collab_id, user_id)
);

-- =============================================================================
-- 6. collab_chatroom_links
-- =============================================================================
CREATE TABLE collab_chatroom_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collab_id uuid REFERENCES collabs(id) ON DELETE CASCADE NOT NULL,
  chatroom_id uuid REFERENCES chatrooms(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(collab_id, chatroom_id)
);

-- =============================================================================
-- 7. event_participants
-- =============================================================================
CREATE TABLE event_participants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid REFERENCES events(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  UNIQUE(event_id, user_id)
);

-- =============================================================================
-- Indexes
-- =============================================================================

-- chatroom_members
CREATE INDEX idx_chatroom_members_chatroom_id ON chatroom_members(chatroom_id);
CREATE INDEX idx_chatroom_members_user_id ON chatroom_members(user_id);
CREATE INDEX idx_chatroom_members_joined_at ON chatroom_members(joined_at);

-- messages
CREATE INDEX idx_messages_chatroom_id ON messages(chatroom_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_chatroom_created ON messages(chatroom_id, created_at);

-- collab_likes
CREATE INDEX idx_collab_likes_collab_id ON collab_likes(collab_id);
CREATE INDEX idx_collab_likes_user_id ON collab_likes(user_id);

-- collab_chatroom_links
CREATE INDEX idx_collab_chatroom_links_collab_id ON collab_chatroom_links(collab_id);
CREATE INDEX idx_collab_chatroom_links_chatroom_id ON collab_chatroom_links(chatroom_id);

-- event_participants
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);

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
-- View: collab_with_likes_count
-- =============================================================================
CREATE VIEW collab_with_likes_count AS
SELECT
  c.id,
  c.owner_id,
  c.creator_id,
  c.title,
  c.description,
  c.is_public,
  c.cover_media_urls,
  c.created_at,
  c.updated_at,
  COALESCE(l.likes_count, 0)::int AS likes_count,
  ccl.chatroom_id
FROM collabs c
LEFT JOIN (
  SELECT collab_id, COUNT(*) AS likes_count
  FROM collab_likes
  GROUP BY collab_id
) l ON c.id = l.collab_id
LEFT JOIN collab_chatroom_links ccl ON c.id = ccl.collab_id;

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
