package media

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/sparkymat/currents/internal/dbx"
)

func (s *Service) FetchMediaItem(ctx context.Context, userID uuid.UUID, mediaItemID uuid.UUID) (dbx.MediaItem, []dbx.MediaItemTopic, map[uuid.UUID]dbx.Topic, error) {
	item, err := s.db.FetchMediaItemForUser(ctx, dbx.FetchMediaItemForUserParams{
		MediaItemID: mediaItemID,
		UserID:      userID,
	})
	if err != nil {
		return dbx.MediaItem{}, []dbx.MediaItemTopic{}, map[uuid.UUID]dbx.Topic{}, fmt.Errorf("error fetching media item: %w", err)
	}

	mediaItemTopics, err := s.db.FetchMediaItemTopicsForMediaItem(ctx, dbx.FetchMediaItemTopicsForMediaItemParams{
		UserID:      userID,
		MediaItemID: mediaItemID,
	})
	if err != nil {
		return dbx.MediaItem{}, []dbx.MediaItemTopic{}, map[uuid.UUID]dbx.Topic{}, fmt.Errorf("error fetching topics for media item: %w", err)
	}

	topics, err := s.db.FetchTopicsByID(ctx, dbx.FetchTopicsByIDParams{
		UserID:   userID,
		TopicIds: lo.Map(mediaItemTopics, func(item dbx.MediaItemTopic, _ int) uuid.UUID { return item.TopicID }),
	})

	topicsMap := lo.SliceToMap(topics, func(item dbx.Topic) (uuid.UUID, dbx.Topic) { return item.ID, item })

	return item, mediaItemTopics, topicsMap, nil
}
