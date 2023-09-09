package internal

import (
	"context"
	"time"

	"github.com/sparkymat/currents/internal/dbx"
	"github.com/google/uuid"
)

type MediaService interface {
	CreateMediaItem(
		ctx context.Context,
		userID uuid.UUID,
		itemType dbx.MediaItemType,
		url string,
		publishedAt time.Time,
	) (dbx.MediaItem, error)
	SearchMediaItems(
		ctx context.Context,
		userID uuid.UUID,
		query string,
		pageSize int32,
		pageNumber int32,
	) ([]dbx.MediaItem, int64, error)
}
