package presenter

import (
	"fmt"
	"strings"

	"github.com/asticode/go-astisub"
	"github.com/google/uuid"
	"github.com/samber/lo"
	"github.com/sparkymat/currents/internal/dbtypes"
	"github.com/sparkymat/currents/internal/dbx"
)

type SubtitleEntry struct {
	StartMS int64          `json:"start_ms"`
	EndMS   int64          `json:"end_ms"`
	Lines   []SubtitleLine `json:"lines"`
}

type SubtitleLine struct {
	Speaker string   `json:"speaker"`
	Lines   []string `json:"lines"`
}

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

type DetailedMediaItem struct {
	MediaItem
	Transcript []SubtitleEntry `json:"transcript"`
	Metadata   dbtypes.JSON    `json:"metadata"`
	Topics     []Topic         `json:"topics"`
}

func DetailedMediaItemFromModel(m dbx.MediaItem, topics []dbx.Topic) DetailedMediaItem {
	item := MediaItemFromModel(m)

	detailedItem := DetailedMediaItem{
		MediaItem: item,
		Metadata:  m.Metadata,
		Topics:    lo.Map(topics, func(t dbx.Topic, _ int) Topic { return TopicFromModel(t) }),
	}

	if m.Transcript.Valid {
		parsedSubtitles, err := astisub.ReadFromWebVTT(strings.NewReader(m.Transcript.String))
		if err == nil {
			for _, subtitle := range parsedSubtitles.Items {
				transcriptItem := SubtitleEntry{
					StartMS: subtitle.StartAt.Milliseconds(),
					EndMS:   subtitle.EndAt.Milliseconds(),
				}

				for _, line := range subtitle.Lines {
					transcriptItem.Lines = append(transcriptItem.Lines, SubtitleLine{
						Speaker: line.VoiceName,
						Lines:   lo.Map(line.Items, func(i astisub.LineItem, _ int) string { return i.Text }),
					})
				}

				detailedItem.Transcript = append(detailedItem.Transcript, transcriptItem)
			}
		}
	}

	return detailedItem
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
