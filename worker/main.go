package main

import (
	"github.com/sparkymat/currents/internal/config"
	"github.com/sparkymat/currents/internal/database"
	"github.com/sparkymat/currents/internal/dbx"
	"github.com/sparkymat/currents/internal/provider/ytdlp"
	"github.com/sparkymat/currents/internal/service/media"
	"github.com/sparkymat/currents/internal/tasks"
	"github.com/hibiken/asynq"
	"github.com/labstack/gommon/log"
)

const (
	QueueCriticalName     = "critical"
	QueueCriticalPriority = 6
	QueueDefaultName      = "default"
	QueueDefaultPriority  = 3
	QueueLowName          = "low"
	QueueLowPriority      = 1
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

	db := dbx.New(dbDriver.DB())
	asynqClient := asynq.NewClient(asynq.RedisClientOpt{Addr: cfg.RedisURL()})
	ytdlpProvider := ytdlp.New()

	mediaService := media.New(
		asynqClient,
		db,
		ytdlpProvider,
		cfg.StorageFolder(),
	)

	srv := asynq.NewServer(
		asynq.RedisClientOpt{Addr: cfg.RedisURL()},
		asynq.Config{
			// Specify how many concurrent workers to use
			Concurrency: 10, //nolint:gomnd
			// Optionally specify multiple queues with different priority.
			Queues: map[string]int{
				QueueCriticalName: QueueCriticalPriority,
				QueueDefaultName:  QueueDefaultPriority,
				QueueLowName:      QueueLowPriority,
			},
			// See the godoc for other configuration options
		},
	)

	// mux maps a type to a handler
	mux := asynq.NewServeMux()

	mux.Handle(tasks.TypeDownloadVideo, tasks.NewVideoDownloader(mediaService))

	if err := srv.Run(mux); err != nil {
		log.Fatalf("could not run server: %v", err)
	}
}
