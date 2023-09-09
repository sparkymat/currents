package api

import (
	"net/http"
	"time"

	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/handler"
	"github.com/sparkymat/currents/internal/handler/api/presenter"
	"github.com/labstack/echo/v4"
)

type MediaItemsCreateRequest struct {
	URL         string    `json:"url"`
	ItemType    string    `json:"item_type"`
	PublishedAt time.Time `json:"published_at"`
}

func MediaItemsCreate(_ handler.ConfigService, s internal.Services) echo.HandlerFunc {
	return wrapWithAuth(func(c echo.Context, user dbx.User) error {
		var request MediaItemsCreateRequest

		if err := c.Bind(&request); err != nil {
			return renderError(c, http.StatusBadRequest, "invalid request params", err)
		}

		var itemType dbx.MediaItemType

		switch request.ItemType {
		case string(dbx.MediaItemTypeVideo):
			itemType = dbx.MediaItemTypeVideo
		case string(dbx.MediaItemTypeAudio):
			itemType = dbx.MediaItemTypeAudio
		case string(dbx.MediaItemTypeArticle):
			itemType = dbx.MediaItemTypeArticle
		default:
			return renderError(c, http.StatusBadRequest, "invalid item type", nil)
		}

		mediaItem, err := s.Media.CreateMediaItem(
			c.Request().Context(),
			user.ID,
			itemType,
			request.URL,
			request.PublishedAt,
		)
		if err != nil {
			return renderError(c, http.StatusInternalServerError, "failed to create media item", err)
		}

		presentedMediaItem := presenter.MediaItemFromModel(mediaItem)

		return c.JSON(http.StatusOK, presentedMediaItem)
	})
}
