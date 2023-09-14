package media

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/sparkymat/currents/internal/dbx"
)

func (s *Service) DestroyMediaItemTopic(ctx context.Context, userID uuid.UUID, mediaItemID uuid.UUID, topicID uuid.UUID) error {
	if _, err := s.db.FetchMediaItemForUser(ctx, dbx.FetchMediaItemForUserParams{
		MediaItemID: mediaItemID,
		UserID:      userID,
	}); err != nil {
		return fmt.Errorf("error fetching media item: %w", err)
	}

	//nolint:wrapcheck
	return s.db.RemoveTopicFromMediaItem(ctx, dbx.RemoveTopicFromMediaItemParams{
		MediaItemID: mediaItemID,
		TopicID:     topicID,
	})
}
