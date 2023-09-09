package ytdlp

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os/exec"
	"strings"
)

func New() *Provider {
	return &Provider{}
}

type Provider struct{}

type ProgressFunc func(ctx context.Context, callbackContext any, id string, status string, downloadedBytes int64, totalBytes int64, speed float64)

func (*Provider) DownloadVideo(ctx context.Context, callbackContext any, id string, url string, destinationPath string, progressFunc ProgressFunc) error {
	outputReader, outputWriter := io.Pipe()

	cmdCtx, cmdDone := context.WithCancel(context.Background())

	scannerStopped := make(chan struct{})

	go func() {
		defer close(scannerStopped)

		scanner := bufio.NewScanner(outputReader)
		for scanner.Scan() {
			parseAndCallback(ctx, callbackContext, id, scanner.Text(), progressFunc)
		}
	}()

	cmd := exec.Command("yt-dlp", "-o", "sub:subtitle.%(ext)s", "--write-subs", "--newline", url, "--progress-template", "%(progress)j", "-o", "video.%(ext)s", "-o", "thumbnail:thumb.%(ext)s", "--write-thumbnail", "--write-info-json") //nolint:lll,revive
	cmd.Dir = destinationPath
	cmd.Stdout = outputWriter

	if err := cmd.Start(); err != nil {
		cmdDone()

		return fmt.Errorf("failed to get stdout. err: %w", err)
	}

	go func() {
		_ = cmd.Wait()

		cmdDone()

		_ = outputWriter.Close()
	}()

	<-cmdCtx.Done()
	<-scannerStopped

	return nil
}

//nolint:tagliatelle
type ProgressUpdate struct {
	DownloadedBytes int64   `json:"downloaded_bytes"`
	TotalBytes      int64   `json:"total_bytes"`
	Filename        string  `json:"filename"`
	Status          string  `json:"status"`
	Elapsed         float64 `json:"elapsed"`
	Speed           float64 `json:"speed"`
	SpeedStr        string  `json:"_speed_str"`
	TotalBytesStr   string  `json:"_total_bytes_str"`
	ElapsedStr      string  `json:"_elapsed_str"`
	PercentStr      string  `json:"_percent_str"`
}

func parseAndCallback(ctx context.Context, callbackContext any, id string, line string, progressFunc ProgressFunc) {
	ignorePrefixes := []string{
		"[youtube]",
		"[info]",
		"[download]",
		"[Merger]",
		"Deleting",
	}

	for _, prefix := range ignorePrefixes {
		if strings.HasPrefix(line, prefix) {
			log.Println(line)

			return
		}
	}

	var update ProgressUpdate

	if err := json.Unmarshal([]byte(line), &update); err != nil {
		return
	}

	progressFunc(ctx, callbackContext, id, update.Status, update.DownloadedBytes, update.TotalBytes, update.Speed)
}
