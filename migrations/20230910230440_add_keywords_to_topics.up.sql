ALTER TABLE topics
  ADD COLUMN keywords text[] DEFAULT '{}'::text[] NOT NULL;
