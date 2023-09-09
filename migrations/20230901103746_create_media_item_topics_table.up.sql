CREATE TABLE media_item_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_item_id uuid NOT NULL REFERENCES media_items(id),
  topic_id uuid NOT NULL REFERENCES topics(id),
  confirmed_at timestamp without time zone,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER media_item_topics_updated_at
  BEFORE UPDATE
  ON media_item_topics
  FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);
CREATE UNIQUE INDEX idx_media_item_topics ON media_item_topics (media_item_id, topic_id);
