DROP TABLE topic_keywords;
ALTER TABLE topics
  ADD COLUMN keywords text[] NOT NULL DEFAULT '{}';
