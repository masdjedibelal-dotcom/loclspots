-- Collab Likes für Toggle-Funktion
-- Führe nach schema.sql und rls-policies.sql aus

CREATE TABLE collab_likes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  collab_id uuid REFERENCES collabs(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(collab_id, user_id)
);

CREATE INDEX idx_collab_likes_collab_id ON collab_likes(collab_id);
CREATE INDEX idx_collab_likes_user_id ON collab_likes(user_id);

ALTER TABLE collab_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collab_likes_select_authenticated"
  ON collab_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "collab_likes_insert_own"
  ON collab_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "collab_likes_delete_own"
  ON collab_likes FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Trigger: likes_count in collabs synchron halten
CREATE OR REPLACE FUNCTION update_collab_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE collabs SET likes_count = likes_count + 1 WHERE id = NEW.collab_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE collabs SET likes_count = GREATEST(0, likes_count - 1) WHERE id = OLD.collab_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER collab_likes_count_trigger
  AFTER INSERT OR DELETE ON collab_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_collab_likes_count();
