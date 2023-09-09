all: currents

currents:
	CGO_ENABLED=0 go build -ldflags '-s -w -extldflags "-static"' -o currents currents.go

start-app:
	# Install reflex with 'go install github.com/cespare/reflex@latest'
	# Install godotenv with 'go install github.com/joho/godotenv/cmd/godotenv@latest'
	reflex -s -r '\.go$$' -- godotenv -f .env go run currents.go

start-worker:
	reflex -s -r '\.go$$' -- godotenv -f .env go run worker/main.go

start-view:
	# Install reflex with 'go install github.com/cespare/reflex@latest'
	reflex -r '\.qtpl$$' -- qtc -dir=internal/view

db-migrate:
	migrate -path migrations -database "postgres://127.0.0.1/currents?sslmode=disable" up

db-schema-dump:
	pg_dump --schema-only -O currents > internal/database/schema.sql

sqlc-gen:
	sqlc --experimental generate

.PHONY: currents start-app start-view db-migrate db-schema-dump sqlc-gen
