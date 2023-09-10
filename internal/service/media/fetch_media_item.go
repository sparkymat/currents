package media

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sparkymat/currents/internal/dbx"
)

func (s *Service) FetchMediaItem(ctx context.Context, userID uuid.UUID, mediaItemID uuid.UUID) (dbx.MediaItem, []dbx.Topic, error) {
	item, err := s.db.FetchMediaItemForUser(ctx, dbx.FetchMediaItemForUserParams{
		MediaItemID: mediaItemID,
		UserID:      userID,
	})
	if err != nil {
		return dbx.MediaItem{}, []dbx.Topic{}, fmt.Errorf("error fetching media item: %w", err)
	}

	topics, err := s.db.FetchTopicsForMediaItem(ctx, dbx.FetchTopicsForMediaItemParams{
		UserID:      userID,
		MediaItemID: mediaItemID,
	})
	if err != nil {
		return dbx.MediaItem{}, []dbx.Topic{}, fmt.Errorf("error fetching topics for media item: %w", err)
	}

	return item, topics, nil
}
