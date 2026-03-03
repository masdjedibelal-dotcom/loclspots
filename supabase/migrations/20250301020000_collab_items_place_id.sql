-- collab_items: place_id hinzufügen für Verknüpfung mit places-Tabelle
-- Erforderlich damit Collab-Items korrekt gespeichert und mit Place-Details angezeigt werden.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'collab_items'
      AND column_name = 'place_id'
  ) THEN
    ALTER TABLE collab_items ADD COLUMN place_id uuid;
    CREATE INDEX IF NOT EXISTS idx_collab_items_place_id ON collab_items(place_id);
  END IF;
END $$;

-- created_at falls für Sortierung benötigt (optional)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'collab_items'
      AND column_name = 'created_at'
  ) THEN
    ALTER TABLE collab_items ADD COLUMN created_at timestamptz DEFAULT now();
  END IF;
END $$;
