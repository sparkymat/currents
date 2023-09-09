CREATE TYPE media_item_state AS ENUM ('pending', 'processing', 'processed', 'failed');
ALTER TABLE media_items
  ADD COLUMN state media_item_state NOT NULL DEFAULT 'pending';
