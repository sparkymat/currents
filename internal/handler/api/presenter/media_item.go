package presenter

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/sparkymat/currents/internal/dbx"
)

type MediaItem struct {
	ID           string   `json:"id"`
	Title        string   `json:"title"`
	State        string   `json:"state"`
	URL          string   `json:"url"`
	ItemType     string   `json:"item_type"`
	PublishedAt  *string  `json:"published_at"`
	VideoURL     *string  `json:"video_url"`
	ThumbnailURL *string  `json:"thumbnail_url"`
	SubtitleURLs []string `json:"subtitle_urls"`
}

func MediaItemFromModel(m dbx.MediaItem) MediaItem {
	var publishedAt *string

	if m.PublishedAt.Valid {
		publishedAtString := m.PublishedAt.Time.Format("2006-01-02T15:04:05Z")
		publishedAt = &publishedAtString
	}

	v := MediaItem{
		ID:          m.ID.String(),
		Title:       m.Title,
		State:       string(m.State),
		URL:         m.Url,
		ItemType:    string(m.ItemType),
		PublishedAt: publishedAt,
		SubtitleURLs: lo.Map(m.SubtitleFilePaths, func(f string, _ int) string {
			return fmt.Sprintf(
				"%s/%s",
				videoMediaItemFolderPath(m.ID),
				f,
			)
		}),
	}

	if m.VideoFilePath.Valid {
		videoURL := fmt.Sprintf(
			"%s/%s",
			videoMediaItemFolderPath(m.ID),
			m.VideoFilePath.String,
		)

		v.VideoURL = &videoURL
	}

	if m.ThumbnailFilePath.Valid {
		thumbnailURL := fmt.Sprintf(
			"%s/%s",
			videoMediaItemFolderPath(m.ID),
			m.ThumbnailFilePath.String,
		)

		v.ThumbnailURL = &thumbnailURL
	}

	return v
}

func videoMediaItemFolderPath(id uuid.UUID) string {
	idString := id.String()
	prefix := idString[0:1]

	return fmt.Sprintf("/v/%s/%s", prefix, idString)
}
