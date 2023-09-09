package tasks

import (
	"context"

	"github.com/google/uuid"
)

type mediaService interface {
	DownloadVideo(ctx context.Context, id uuid.UUID) error
}
