package handler

import (
	"log"
	"net/http"

	"github.com/sparkymat/currents/internal/view"
	"github.com/labstack/echo/v4"
)

func Home(_ ConfigService, _ UserService) echo.HandlerFunc {
	return func(c echo.Context) error {
		csrfToken := getCSRFToken(c)
		if csrfToken == "" {
			log.Print("error: csrf token not found")

			//nolint:wrapcheck
			return c.String(http.StatusInternalServerError, "server error")
		}

		pageHTML := view.Home()
		htmlString := view.BasicLayout("currents", csrfToken, pageHTML)

		//nolint:wrapcheck
		return c.HTMLBlob(http.StatusOK, []byte(htmlString))
	}
}
