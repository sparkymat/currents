package internal

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sparkymat/currents/internal/dbx"
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
	FetchMediaItem(
		ctx context.Context,
		userID uuid.UUID,
		mediaItemID uuid.UUID,
	) (dbx.MediaItem, []dbx.MediaItemTopic, map[uuid.UUID]dbx.Topic, error)
	RescanMediaItem(
		ctx context.Context,
		userID uuid.UUID,
		mediaItemID uuid.UUID,
	) error
}
