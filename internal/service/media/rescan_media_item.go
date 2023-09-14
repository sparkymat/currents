package media

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/sparkymat/currents/internal/dbx"
)

func (s *Service) RescanMediaItem(ctx context.Context, userID uuid.UUID, mediaItemID uuid.UUID) error {
	_, err := s.db.FetchMediaItemForUser(ctx, dbx.FetchMediaItemForUserParams{
		MediaItemID: mediaItemID,
		UserID:      userID,
	})
	if err != nil {
		return fmt.Errorf("error fetching media item: %w", err)
	}

	scannedTopics, err := s.db.ScanMediaItemForTopics(ctx, mediaItemID)
	if err != nil {
		return fmt.Errorf("error scanning media item for topics: %w", err)
	}

	mediaItemTopics, err := s.db.FetchMediaItemTopicsForMediaItem(ctx, dbx.FetchMediaItemTopicsForMediaItemParams{
		UserID:      userID,
		MediaItemID: mediaItemID,
	})
	if err != nil {
		return fmt.Errorf("error fetching topics for media item: %w", err)
	}

	existingTopicIDs := lo.Map(mediaItemTopics, func(mit dbx.MediaItemTopic, _ int) uuid.UUID { return mit.TopicID })

	candidateTopics := lo.Filter(scannedTopics, func(t dbx.Topic, _ int) bool { return !lo.Contains(existingTopicIDs, t.ID) })

	for _, candidateTopic := range candidateTopics {
		if err := s.db.AddTopicToMediaItem(ctx, dbx.AddTopicToMediaItemParams{
			MediaItemID: mediaItemID,
			TopicID:     candidateTopic.ID,
		}); err != nil {
			return fmt.Errorf("error adding topic to media item: %w", err)
		}
	}

	return nil
}
