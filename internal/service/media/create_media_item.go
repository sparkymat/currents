package media

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/labstack/gommon/log"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/tasks"
)

func (s *Service) CreateMediaItem(ctx context.Context, userID uuid.UUID, itemType dbx.MediaItemType, url string, publishedAt time.Time) (dbx.MediaItem, error) {
	item, err := s.db.CreateMediaItem(ctx, dbx.CreateMediaItemParams{
		UserID:      userID,
		Url:         url,
		ItemType:    itemType,
		PublishedAt: pgtype.Timestamp{Valid: true, Time: publishedAt},
	})
	if err != nil {
		return dbx.MediaItem{}, fmt.Errorf("failed to create media item: %w", err)
	}

	if itemType == dbx.MediaItemTypeVideo {
		downloadTask, err := tasks.NewDownloadVideoTask(item.ID.String())
		if err != nil {
			return dbx.MediaItem{}, fmt.Errorf("failed to create download task. err: %w", err)
		}

		taskInfo, err := s.asynqProvider.Enqueue(downloadTask)
		if err != nil {
			return dbx.MediaItem{}, fmt.Errorf("failed to queue download task. err: %w", err)
		}

		log.Infof("queued video for download for item: id=%s task-id=%s task-queue=%s", item.ID.String(), taskInfo.ID, taskInfo.Queue)
	}

	return item, nil
}
