-- RPC: Aktivste Chatrooms = die mit den meisten Nachrichten in den letzten 7 Tagen
-- Fallback: sortiert nach member_count, falls keine Nachrichten
-- Filter: is_category = false (keine Hauptkategorien)
CREATE OR REPLACE FUNCTION get_most_active_chatrooms(p_limit int DEFAULT 4)
RETURNS TABLE (
  id uuid,
  name text,
  description text,
  emoji text,
  category text,
  member_count int,
  recent_message_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.description,
    c.emoji,
    c.category,
    COALESCE(mc.cnt, 0)::int AS member_count,
    COALESCE(msg.recent_count, 0)::bigint AS recent_message_count
  FROM chatrooms c
  LEFT JOIN (
    SELECT chatroom_id, COUNT(*) AS cnt
    FROM chatroom_members
    GROUP BY chatroom_id
  ) mc ON c.id = mc.chatroom_id
  LEFT JOIN (
    SELECT chatroom_id, COUNT(*) AS recent_count
    FROM messages
    WHERE created_at >= now() - interval '7 days'
      AND (is_deleted IS NULL OR is_deleted = false)
    GROUP BY chatroom_id
  ) msg ON c.id = msg.chatroom_id
  WHERE COALESCE(c.is_category, false) = false
  ORDER BY recent_message_count DESC NULLS LAST, member_count DESC NULLS LAST
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_most_active_chatrooms(int) TO authenticated;
GRANT EXECUTE ON FUNCTION get_most_active_chatrooms(int) TO service_role;
