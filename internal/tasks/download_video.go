package tasks

import (
	"context"
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hibiken/asynq"
)

const (
	TypeDownloadVideo = "video:download"
)

type DownloadVideoPayload struct {
	ID string `json:"id"`
}

func NewDownloadVideoTask(id string) (*asynq.Task, error) {
	payload, err := json.Marshal(DownloadVideoPayload{
		ID: id,
	})
	if err != nil {
		return nil, err //nolint:wrapcheck
	}

	return asynq.NewTask(TypeDownloadVideo, payload), nil
}

type VideoDownloader struct {
	mediaService mediaService
}

func (d *VideoDownloader) ProcessTask(ctx context.Context, t *asynq.Task) error {
	var p DownloadVideoPayload

	if err := json.Unmarshal(t.Payload(), &p); err != nil {
		return fmt.Errorf("json.Unmarshal failed: %w: %w", err, asynq.SkipRetry)
	}

	// Do stuff
	id, err := uuid.Parse(p.ID)
	if err != nil {
		return fmt.Errorf("invalid ID: %w: %w", err, asynq.SkipRetry)
	}

	return d.mediaService.DownloadVideo(ctx, id) //nolint:wrapcheck
}

func NewVideoDownloader(mediaService mediaService) *VideoDownloader {
	return &VideoDownloader{
		mediaService: mediaService,
	}
}
