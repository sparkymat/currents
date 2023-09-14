package api

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/handler"
)

func MediaItemsRescan(_ handler.ConfigService, s internal.Services) echo.HandlerFunc {
	return wrapWithAuth(func(c echo.Context, user dbx.User) error {
		idString := c.Param("id")

		mediaItemID, err := uuid.Parse(idString)
		if err != nil {
			return renderError(c, http.StatusBadRequest, "invalid id", err)
		}

		err = s.Media.RescanMediaItem(
			c.Request().Context(),
			user.ID,
			mediaItemID,
		)
		if err != nil {
			return renderError(c, http.StatusInternalServerError, "failed to rescan item", err)
		}

		return c.NoContent(http.StatusNoContent)
	})
}
