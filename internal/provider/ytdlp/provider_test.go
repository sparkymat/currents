package ytdlp_test

import (
	"context"
	"fmt"
	"math/rand"
	"os"
	"path/filepath"
	"testing"

	"github.com/sparkymat/currents/internal/provider/ytdlp"
	"github.com/samber/lo"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestDownloadVideo(t *testing.T) {
	t.Parallel()

	tmpPath := filepath.Join("/tmp", "currents-test", fmt.Sprintf("%d", rand.Int()%10000))
	err := os.MkdirAll(tmpPath, 0o755)
	require.NoError(t, err)

	defer func() {
		os.RemoveAll(tmpPath)
	}()

	svc := ytdlp.New()
	err = svc.DownloadVideo(
		context.Background(),
		nil,
		"abc",
		"https://www.youtube.com/watch?v=cwZb2mqId0A",
		tmpPath,
		func(ctx context.Context, appContext any, id string, status string, downloadedBytes int64, totalBytes int64, speed float64) {
			assert.Equal(t, "abc", id)
			assert.Contains(t, []string{"downloading", "finished"}, status)
			assert.GreaterOrEqual(t, downloadedBytes, int64(0))
			assert.GreaterOrEqual(t, totalBytes, int64(0))
			assert.GreaterOrEqual(t, speed, float64(0))
		},
	)
	assert.NoError(t, err)

	files, err := os.ReadDir(tmpPath)
	require.NoError(t, err)

	assert.Equal(t, 4, len(files))

	fileNames := lo.Map(files, func(f os.DirEntry, _ int) string { return f.Name() })

	assert.ElementsMatch(t, []string{"video.webm", "thumb.webp", "video.en.vtt", "video.info.json"}, fileNames)
}
