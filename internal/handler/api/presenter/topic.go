package presenter

import "github.com/sparkymat/currents/internal/dbx"

type Topic struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

type MediaItemTopic struct {
	Topic

	Confirmed bool `json:"confirmed"`
}

func TopicFromModel(m dbx.Topic) Topic {
	t := Topic{
		ID:          m.ID.String(),
		Name:        m.Name,
		Description: m.Description,
	}

	return t
}

func MediaItemTopicFromModel(t dbx.Topic, m dbx.MediaItemTopic) MediaItemTopic {
	pt := MediaItemTopic{
		Topic:     TopicFromModel(t),
		Confirmed: m.ConfirmedAt.Valid,
	}

	return pt
}
