package media

import (
	"path/filepath"

	"github.com/google/uuid"
)

func (s *Service) videoFileFolder(mediaItemID uuid.UUID) string {
	idString := mediaItemID.String()

	return filepath.Join(s.storageFolder, "v", idString[0:1], idString)
}
