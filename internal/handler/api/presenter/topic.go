package presenter

import "github.com/sparkymat/currents/internal/dbx"

type Topic struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}

func TopicFromModel(m dbx.Topic) Topic {
	t := Topic{
		ID:          m.ID.String(),
		Name:        m.Name,
		Description: m.Description,
	}

	return t
}
