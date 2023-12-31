import React from 'react';
import { Anchor, Flex, Text, Title } from '@mantine/core';
import { SubtitleEntry } from '../../models/Subtitle';

export interface SubtitlesViewProps {
  entries: SubtitleEntry[];
  onTimestampClicked(_timestampMS: number);
}

const pad = (num: number, size: number): string => {
  const s = `00${num}`;
  return s.substring(s.length - size);
};

const msToString = (ms: number): string => {
  const hours = Math.floor(ms / (3600 * 1000));
  const minutes = Math.floor(ms / (60 * 1000)) % 60;
  const seconds = Math.floor(ms / 1000) % 60;
  const centiseconds = Math.round(ms / 10);

  return `${hours}:${pad(minutes, 2)}:${pad(seconds, 2)}.${pad(
    centiseconds,
    2,
  )}`;
};

export const SubtitlesView = ({
  entries,
  onTimestampClicked,
}: SubtitlesViewProps) => (
  <Flex direction="column">
    {entries.map(e => (
      <Flex direction="column">
        <Flex>
          <Anchor
            underline={false}
            onClick={() => onTimestampClicked(e.start_ms)}
          >
            <Text size="sm" italic>{`${msToString(e.start_ms)} - ${msToString(
              e.end_ms,
            )}`}</Text>
          </Anchor>
        </Flex>
        {e.lines.map(line => (
          <>
            {line.speaker && <Title>{line.speaker}</Title>}
            {line.lines.map(innerLine => (
              <Text size="lg">{innerLine}</Text>
            ))}
          </>
        ))}
      </Flex>
    ))}
  </Flex>
);
