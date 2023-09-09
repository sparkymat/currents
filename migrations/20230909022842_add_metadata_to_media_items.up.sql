ALTER TABLE media_items
  ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb NOT NULL;
