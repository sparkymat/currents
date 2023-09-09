package main

//go:generate go run github.com/valyala/quicktemplate/qtc -dir=internal/view

import (
	"time"

	"github.com/sparkymat/currents/internal"
	"github.com/sparkymat/currents/internal/config"
	"github.com/sparkymat/currents/internal/database"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/provider/ytdlp"
	"github.com/sparkymat/currents/internal/route"
	"github.com/sparkymat/currents/internal/service/media"
	"github.com/sparkymat/currents/internal/service/user"
	"github.com/go-co-op/gocron"
	"github.com/hibiken/asynq"
	"github.com/labstack/echo/v4"
	"github.com/labstack/gommon/log"
)

func main() {
	cfg, err := config.New()
	if err != nil {
		panic(err)
	}

	dbDriver, err := database.New(cfg.DatabaseURL())
	if err != nil {
		log.Error(err)
		panic(err)
	}

	if err = dbDriver.AutoMigrate(); err != nil {
		log.Error(err)
		panic(err)
	}

	// Initialize web server
	db := dbx.New(dbDriver.DB())
	asynqClient := asynq.NewClient(asynq.RedisClientOpt{Addr: cfg.RedisURL()})
	ytdlpProvider := ytdlp.New()

	userService := user.New(db)
	mediaService := media.New(
		asynqClient,
		db,
		ytdlpProvider,
		cfg.StorageFolder(),
	)

	svc := internal.Services{
		User:  userService,
		Media: mediaService,
	}

	e := echo.New()
	route.Setup(e, cfg, svc)

	// Setup scheduler
	scheduler := gocron.NewScheduler(time.UTC)
	scheduler.StartAsync()

	e.Logger.Panic(e.Start(":8080"))
}
