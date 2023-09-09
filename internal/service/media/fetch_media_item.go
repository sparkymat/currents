package media

import (
	"context"

	"github.com/google/uuid"
	"github.com/sparkymat/currents/internal/dbx"
)

func (s *Service) FetchMediaItem(ctx context.Context, userID uuid.UUID, mediaItemID uuid.UUID) (dbx.MediaItem, error) {
	return s.db.FetchMediaItemForUser(ctx, dbx.FetchMediaItemForUserParams{
		MediaItemID: mediaItemID,
		UserID:      userID,
	})
}
