package media

import "github.com/sparkymat/currents/internal/service"

func New(
	asynqProvider service.AsynqProvider,
	db service.DatabaseProvider,
	ytdlp service.YTDLPProvider,
	storageFolder string,
) *Service {
	return &Service{
		asynqProvider: asynqProvider,
		db:            db,
		storageFolder: storageFolder,
		ytdlp:         ytdlp,
	}
}

type Service struct {
	asynqProvider service.AsynqProvider
	db            service.DatabaseProvider
	storageFolder string
	ytdlp         service.YTDLPProvider
}
