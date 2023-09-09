CREATE TYPE media_item_type AS ENUM ('video', 'audio', 'article');
CREATE TABLE media_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  item_type media_item_type NOT NULL,
  published_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER media_items_updated_at
  BEFORE UPDATE
  ON media_items
  FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);
