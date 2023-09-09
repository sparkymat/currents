package presenter

import (
	"github.com/sparkymat/currents/internal/dbx"
)

type MediaItem struct {
	ID          string  `json:"id"`
	Title       string  `json:"title"`
	URL         string  `json:"url"`
	ItemType    string  `json:"item_type"`
	PublishedAt *string `json:"published_at"`
}

func MediaItemFromModel(m dbx.MediaItem) MediaItem {
	var publishedAt *string

	if m.PublishedAt.Valid {
		publishedAtString := m.PublishedAt.Time.Format("2006-01-02T15:04:05Z")
		publishedAt = &publishedAtString
	}

	return MediaItem{
		ID:          m.ID.String(),
		Title:       m.Title,
		URL:         m.Url,
		ItemType:    string(m.ItemType),
		PublishedAt: publishedAt,
	}
}
