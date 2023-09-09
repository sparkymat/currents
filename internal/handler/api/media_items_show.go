package api

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/handler"
	"github.com/sparkymat/currents/internal/handler/api/presenter"
)

func MediaItemsShow(cfg handler.ConfigService, s internal.Services) echo.HandlerFunc {
	return wrapWithAuth(func(c echo.Context, user dbx.User) error {
		idString := c.Param("id")

		mediaItemID, err := uuid.Parse(idString)
		if err != nil {
			return renderError(c, http.StatusBadRequest, "invalid id", err)
		}

		item, err := s.Media.FetchMediaItem(
			c.Request().Context(),
			user.ID,
			mediaItemID,
		)
		if err != nil {
			return renderError(c, http.StatusInternalServerError, "failed to fetch item", err)
		}

		presentedItem := presenter.DetailedMediaItemFromModel(item)

		return c.JSON(http.StatusOK, presentedItem)
	})
}
