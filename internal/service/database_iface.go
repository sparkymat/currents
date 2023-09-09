package service

import (
	"context"

	"github.com/google/uuid"
	"github.com/sparkymat/currents/internal/dbx"
)

type DatabaseProvider interface {
	AddTopicToMediaItem(ctx context.Context, arg dbx.AddTopicToMediaItemParams) error
	ConfirmTopicForMediaItem(ctx context.Context, arg dbx.ConfirmTopicForMediaItemParams) error
	CountSearchedMediaItems(ctx context.Context, arg dbx.CountSearchedMediaItemsParams) (int64, error)
	CountSearchedTopics(ctx context.Context, arg dbx.CountSearchedTopicsParams) (int64, error)
	CreateMediaItem(ctx context.Context, arg dbx.CreateMediaItemParams) (dbx.MediaItem, error)
	CreateTopic(ctx context.Context, arg dbx.CreateTopicParams) (dbx.Topic, error)
	CreateUser(ctx context.Context, arg dbx.CreateUserParams) (dbx.User, error)
	DeleteMediaItem(ctx context.Context, arg dbx.DeleteMediaItemParams) error
	FetchMediaItem(ctx context.Context, mediaItemID uuid.UUID) (dbx.MediaItem, error)
	FetchMediaItemForUser(ctx context.Context, arg dbx.FetchMediaItemForUserParams) (dbx.MediaItem, error)
	FetchMediaItemTopicsForMediaItems(ctx context.Context, arg dbx.FetchMediaItemTopicsForMediaItemsParams) ([]dbx.MediaItemTopic, error)
	FetchMediaItemsByID(ctx context.Context, arg dbx.FetchMediaItemsByIDParams) ([]dbx.MediaItem, error)
	FetchUserByUsername(ctx context.Context, username string) (dbx.User, error)
	MarkVideoMediaItemAsProcessed(ctx context.Context, arg dbx.MarkVideoMediaItemAsProcessedParams) error
	MarkMediaItemAsProcessing(ctx context.Context, mediaItemID uuid.UUID) error
	RemoveTopicFromMediaItem(ctx context.Context, arg dbx.RemoveTopicFromMediaItemParams) error
	SearchMediaItems(ctx context.Context, arg dbx.SearchMediaItemsParams) ([]dbx.MediaItem, error)
	SearchTopics(ctx context.Context, arg dbx.SearchTopicsParams) ([]dbx.Topic, error)
}
