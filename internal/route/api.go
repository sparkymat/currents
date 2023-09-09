package route

import (
	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/auth"
	"github.com/sparkymat/currents/internal/handler/api"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func registerAPIRoutes(app *echo.Group, cfg ConfigService, s internal.Services) {
	apiGroup := app.Group("api")

	if cfg.ReverseProxyAuthentication() {
		apiGroup.Use(auth.ProxyAuthMiddleware(cfg, s.User))
	} else {
		apiGroup.Use(auth.APIMiddleware(cfg, s.User))
	}

	apiGroup.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup: "header:X-CSRF-Token",
	}))

	apiGroup.POST("/media_items", api.MediaItemsCreate(cfg, s))
	apiGroup.GET("/media_items", api.MediaItemsSearch(cfg, s))
}
