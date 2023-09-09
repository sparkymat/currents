-- name: MarkVideoMediaItemAsProcessed :exec
UPDATE media_items
  SET state = 'processed', video_file_path = @video_file_path::text, thumbnail_file_path = @thumbnail_file_path::text, subtitle_file_paths = @subtitle_file_paths::text[], transcript = @transcript::text, title = @title::text, metadata = @metadata::jsonb
  WHERE id = @media_item_id::uuid;

-- name: MarkMediaItemAsProcessing :exec
UPDATE media_items
  SET state = 'processing'
  WHERE id = @media_item_id::uuid;

-- name: FetchMediaItem :one
SELECT *
  FROM media_items
  WHERE id = @media_item_id::uuid;

-- name: FetchMediaItemsByID :many
SELECT *
  FROM media_items
  WHERE id = ANY(@media_item_ids::uuid[])
    AND user_id = @user_id::uuid;

-- name: FetchMediaItemTopicsForMediaItems :many
SELECT mit.*
  FROM media_item_topics mit
  INNER JOIN media_items mi ON mi.id = mit.media_item_id
  WHERE mit.media_item_id = ANY(@media_item_ids::uuid[])
    AND mi.user_id = @user_id::uuid;

-- name: RemoveTopicFromMediaItem :exec
DELETE FROM media_item_topics
WHERE user_id = @user_id::uuid AND media_item_id = @media_item_id::uuid AND topic_id = @topic_id::uuid;

-- name: ConfirmTopicForMediaItem :exec
UPDATE media_item_topics
SET confirmed_at = CURRENT_TIMESTAMP
WHERE user_id = @user_id::uuid AND media_item_id = @media_item_id::uuid AND topic_id = @topic_id::uuid;

-- name: AddTopicToMediaItem :exec
INSERT INTO media_item_topics
(user_id, media_item_id, topic_id)
VALUES
(@user_id::uuid, @media_item_id::uuid, @topic_id::uuid);

-- name: CountSearchedTopics :one
SELECT COUNT(*)
  FROM topics
  WHERE user_id = @user_id::uuid
    AND name ILIKE '%' || @query::text || '%';

-- name: SearchTopics :many
SELECT *
  FROM topics
  WHERE user_id = @user_id::uuid
    AND name ILIKE '%' || @query::text || '%'
  ORDER BY name ASC
  LIMIT @page_limit::int
  OFFSET @page_offset::int;

-- name: CreateTopic :one
INSERT INTO topics
(user_id, title, description)
VALUES
(@user_id::uuid, @title::text, @description::text)
RETURNING *;

-- name: DeleteMediaItem :exec
DELETE FROM media_items
  WHERE id = @media_item_id::uuid
    AND user_id = @user_id::uuid;

-- name: CountSearchedMediaItems :one
SELECT COUNT(*)
  FROM media_items
  WHERE user_id = @user_id::uuid
    AND title ILIKE '%' || @query::text || '%';

-- name: SearchMediaItems :many
SELECT * 
  FROM media_items
  WHERE user_id = @user_id::uuid
    AND title ILIKE '%' || @query::text || '%'
  ORDER BY published_at DESC
  LIMIT @page_limit::int
  OFFSET @page_offset::int;

-- name: CreateMediaItem :one
INSERT INTO media_items
(user_id, item_type, title, url, published_at)
VALUES
(@user_id::uuid, @item_type::media_item_type, @title::text, @url::text, @published_at::timestamp)
RETURNING *;

-- name: FetchUserByUsername :one
SELECT * FROM users
WHERE username = @username::text LIMIT 1;

-- name: CreateUser :one
INSERT INTO users (
  name, username, encrypted_password
) VALUES (
  @name::text, @username::text, @encrypted_password::text
) RETURNING *;
