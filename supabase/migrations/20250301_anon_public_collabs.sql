-- Anonyme Lese-Zugriff auf öffentliche Collabs für Startseite & Detailseite
-- (supabasePublic nutzt anon key, benötigt diese Policies)

-- collabs: anon darf öffentliche Collabs lesen
CREATE POLICY "collabs_select_public"
  ON collabs FOR SELECT
  TO anon
  USING (is_public = true);

-- collab_items: anon darf Items von öffentlichen Collabs lesen
CREATE POLICY "collab_items_select_public"
  ON collab_items FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1 FROM collabs c
      WHERE c.id = collab_items.collab_id
        AND c.is_public = true
    )
  );
