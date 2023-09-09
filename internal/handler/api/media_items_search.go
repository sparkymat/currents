package api

import (
	"net/http"

	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/handler"
	"github.com/sparkymat/currents/internal/handler/api/presenter"
	"github.com/labstack/echo/v4"
	"github.com/samber/lo"
)

//nolint:tagliatelle
type MediaItemsSearchResponse struct {
	Items      []presenter.MediaItem `json:"items"`
	PageSize   int                   `json:"page_size"`
	PageNumber int                   `json:"page_number"`
	TotalCount int                   `json:"total_count"`
}

func MediaItemsSearch(_ handler.ConfigService, s internal.Services) echo.HandlerFunc {
	return wrapWithAuth(func(c echo.Context, user dbx.User) error {
		pageSize, pageNumber, err := parsePaginationParams(c)
		if err != nil {
			return renderError(c, http.StatusBadRequest, "invalid pagination params", err)
		}

		query := c.QueryParam("query")

		items, totalCount, err := s.Media.SearchMediaItems(c.Request().Context(), user.ID, query, pageSize, pageNumber)
		if err != nil {
			return renderError(c, http.StatusInternalServerError, "failed to fetch media items", err)
		}

		presentedItems := lo.Map(items, func(m dbx.MediaItem, _ int) presenter.MediaItem {
			return presenter.MediaItemFromModel(m)
		})

		response := MediaItemsSearchResponse{
			Items:      presentedItems,
			PageSize:   int(pageSize),
			PageNumber: int(pageNumber),
			TotalCount: int(totalCount),
		}

		return c.JSON(http.StatusOK, response) //nolint:wrapcheck
	})
}
