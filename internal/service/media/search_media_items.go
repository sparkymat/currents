package media

import (
	"context"
	"fmt"

	"github.com/sparkymat/currents/internal/dbx"
	"github.com/google/uuid"
)

func (s *Service) SearchMediaItems(
	ctx context.Context,
	userID uuid.UUID,
	query string,
	pageSize int32,
	pageNumber int32,
) ([]dbx.MediaItem, int64, error) {
	offset := (pageNumber - 1) * pageSize

	items, err := s.db.SearchMediaItems(ctx, dbx.SearchMediaItemsParams{
		UserID:     userID,
		Query:      query,
		PageOffset: offset,
		PageLimit:  pageSize,
	})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to search media items. err: %w", err)
	}

	totalCount, err := s.db.CountSearchedMediaItems(ctx, dbx.CountSearchedMediaItemsParams{
		UserID: userID,
		Query:  query,
	})
	if err != nil {
		return nil, 0, fmt.Errorf("failed to count searched videos. err: %w", err)
	}

	return items, totalCount, nil
}
