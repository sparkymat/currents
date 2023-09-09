package media

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path"
	"path/filepath"

	"github.com/google/uuid"
	"github.com/labstack/gommon/log"
	"github.com/sparkymat/currents/internal/dbtypes"
	"github.com/sparkymat/currents/internal/dbx"
)

var ErrUnsupportedItemType = errors.New("unsupported item type")

//nolint:funlen,revive,cyclop
func (s *Service) DownloadVideo(ctx context.Context, id uuid.UUID) error {
	item, err := s.db.FetchMediaItem(ctx, id)
	if err != nil {
		log.Warnf("failed to load media item with id=%s", id)

		return fmt.Errorf("failed to load media item. err: %w", err)
	}

	if item.ItemType != dbx.MediaItemTypeVideo {
		log.Warnf("item is not of type video. id=%s", id)

		return ErrUnsupportedItemType
	}

	folder := s.videoFileFolder(item.ID)

	if err = os.MkdirAll(folder, 0o755); err != nil { //nolint:gomnd
		log.Warnf("failed to create folder for video with id=%s", id)

		return fmt.Errorf("failed to create folder. err: %w", err)
	}

	if err = s.db.MarkMediaItemAsProcessing(ctx, id); err != nil {
		log.Warnf("failed to mark as processing, item with id=%s", id)

		return fmt.Errorf("failed to mark item as processing. err: %w", err)
	}

	err = s.ytdlp.DownloadVideo(ctx, s, fmt.Sprintf("%d", id), item.Url, folder, UpdateDownloadProgress)
	if err != nil {
		log.Warnf("failed to download video with item id=%d. err: %v", id, err)

		return fmt.Errorf("failed to download video. err: %w", err)
	}

	entries, err := os.ReadDir(folder)
	if err != nil {
		log.Warnf("failed to read folder for video with id=%s", id)

		return fmt.Errorf("failed to read video folder. err: %w", err)
	}

	var videoFile, thumbnailFile string

	var subtitleFiles []string

	var transcript string

	var title string

	metadata := dbtypes.JSON{}

	for _, entry := range entries {
		if entry.Name() == "video.mp4" || entry.Name() == "video.webm" || entry.Name() == "video.mkv" {
			videoFile = entry.Name()
		}

		if entry.Name() == "thumb.jpg" || entry.Name() == "thumb.webp" {
			thumbnailFile = entry.Name()
		}

		if path.Ext(entry.Name()) == ".vtt" {
			subtitleFiles = append(subtitleFiles, entry.Name())

			if transcript == "" { // picking the first one - if present
				data, iErr := os.ReadFile(filepath.Join(folder, entry.Name()))
				if iErr == nil {
					transcript = string(data)
				}
			}
		}

		if entry.Name() == "video.info.json" {
			metadataBytes, iErr := os.ReadFile(filepath.Join(folder, entry.Name()))
			if iErr == nil {
				if iErr = json.Unmarshal(metadataBytes, &metadata); iErr == nil {
					title = metadata["title"].(string)
				}
			}
		}
	}

	err = s.db.MarkVideoMediaItemAsProcessed(ctx, dbx.MarkVideoMediaItemAsProcessedParams{
		MediaItemID:       id,
		VideoFilePath:     videoFile,
		ThumbnailFilePath: thumbnailFile,
		SubtitleFilePaths: subtitleFiles,
		Transcript:        transcript,
		Title:             title,
		Metadata:          metadata,
	})
	if err != nil {
		log.Warnf("failed to mark ready video with id=%s", id)

		return fmt.Errorf("failed to mark as ready. err: %w", err)
	}

	return nil
}

func UpdateDownloadProgress(_ context.Context, _ any, idString string, _ string, downloadedBytes int64, totalBytes int64, _ float64) {
	log.Infof("id: %s, download: %.2f", idString, float64(downloadedBytes)/float64(totalBytes))
}
