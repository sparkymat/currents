ALTER TABLE media_items
  ADD COLUMN video_file_path text;
ALTER TABLE media_items
  ADD COLUMN thumbnail_file_path text;
ALTER TABLE media_items
  ADD COLUMN subtitle_file_paths text[] DEFAULT '{}'::text[] NOT NULL;
ALTER TABLE media_items
  ADD COlUMN transcript text;
