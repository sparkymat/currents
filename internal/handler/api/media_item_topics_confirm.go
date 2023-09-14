package api

import (
	"net/http"

	"github.com/google/uuid"
	"github.com/labstack/echo/v4"
	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/handler"
)

func MediaItemTopicsConfirm(_ handler.ConfigService, s internal.Services) echo.HandlerFunc {
	return wrapWithAuth(func(c echo.Context, user dbx.User) error {
		mediaItemIDString := c.Param("id")

		mediaItemID, err := uuid.Parse(mediaItemIDString)
		if err != nil {
			return renderError(c, http.StatusBadRequest, "invalid id", err)
		}

		topicIDString := c.Param("topic_id")

		topicID, err := uuid.Parse(topicIDString)
		if err != nil {
			return renderError(c, http.StatusBadRequest, "invalid id", err)
		}

		if err := s.Media.ConfirmMediaItemTopic(
			c.Request().Context(),
			user.ID,
			mediaItemID,
			topicID,
		); err != nil {
			return renderError(c, http.StatusInternalServerError, "failed to confirm media item topic", err)
		}

		return c.NoContent(http.StatusNoContent)
	})
}
