ALTER TABLE public.chatrooms
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES public.chatrooms(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS is_category boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;

-- View um neue Spalten erweitern
CREATE OR REPLACE VIEW chatroom_with_member_count AS
SELECT
  c.id,
  c.name,
  c.description,
  c.emoji,
  c.category,
  c.created_at,
  c.parent_id,
  c.is_category,
  c.sort_order,
  COALESCE(m.member_count, 0)::int AS member_count
FROM chatrooms c
LEFT JOIN (
  SELECT chatroom_id, COUNT(*) AS member_count
  FROM chatroom_members
  GROUP BY chatroom_id
) m ON c.id = m.chatroom_id;
