ALTER TABLE topics
  DROP COLUMN keywords;
CREATE TABLE topic_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  label text NOT NULL,
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TRIGGER topic_keywords_updated_at
  BEFORE UPDATE
  ON topic_keywords
  FOR EACH ROW
    EXECUTE FUNCTION moddatetime(updated_at);
