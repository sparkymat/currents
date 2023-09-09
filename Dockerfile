FROM hub.orion.home/golang:1.21 AS builder

RUN apt-get update && apt-get install -y \
  make \
  && rm -rf /var/lib/apt/lists/*

COPY . /app/

WORKDIR /app
RUN go generate ./...
RUN make currents

FROM hub.orion.home/debian:12-slim

RUN apt-get update && apt-get install -y \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/currents /bin/jukebox

WORKDIR /app
COPY public /app/public
COPY migrations /app/migrations

CMD ["/bin/crystal"]
