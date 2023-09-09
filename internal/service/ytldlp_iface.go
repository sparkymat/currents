package service

import (
	"context"

	"github.com/sparkymat/currents/internal/provider/ytdlp"
)

type YTDLPProvider interface {
	DownloadVideo(ctx context.Context, callbackContext any, id string, url string, destinationPath string, progressFunc ytdlp.ProgressFunc) error
}
