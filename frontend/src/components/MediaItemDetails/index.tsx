import {
  Notification,
  Container,
  Flex,
  LoadingOverlay,
  Title,
  ScrollArea,
  Tabs,
} from '@mantine/core';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

import { AppDispatch } from '../../store';
import {
  selectErrorMessage,
  selectLoading,
  selectItem,
  selectShowError,
} from '../../selectors/MediaItemDetails';
import { dismissError } from '../../features/MediaItemDetails/slice';
import fetchMediaItem from '../../features/MediaItemDetails/fetchMediaItem';
import SubtitlesView from '../SubtitlesView';

const MediaItemDetails = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();

  const videoElement = useRef<HTMLVideoElement>(null);

  const item = useSelector(selectItem);
  const loading = useSelector(selectLoading);
  const showError = useSelector(selectShowError);
  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(fetchMediaItem(id || ''));
  }, [dispatch, id]);

  useEffect(() => {
    if (item) {
      document.title = `currents | ${item.title || '<blank>'}`;
    }
  }, [item]);

  const errorDismissed = useCallback(() => {
    dispatch(dismissError());
  }, [dispatch]);

  const timestampClicked = useCallback(
    (ms: number) => {
      if (videoElement.current) {
        videoElement.current.currentTime = ms / 1000;
      }
    },
    [videoElement],
  );

  return (
    <Container size="lg" pb="lg">
      <Flex wrap="wrap">
        <Flex direction="column" sx={{ flex: 1 }}>
          <Title mt="sm" order={1} weight={300}>
            {item?.title || item?.url}
          </Title>
          <Title mb="md" order={4} weight={300} italic>
            {`Published on ${item?.published_at.format('Do MMMM, YYYY')}`}
          </Title>
          <Flex wrap="wrap">
            <Flex sx={{ flex: 1 }}>
              {item?.video_url && (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  ref={videoElement}
                  key={item.id}
                  controls
                  style={{ width: '100%' }}
                >
                  <source src={item?.video_url} />
                  {item.subtitles.map(subtitle => (
                    <track
                      label={subtitle.languageLabel}
                      kind="subtitles"
                      srcLang={subtitle.languageCode}
                      src={subtitle.url}
                      default={subtitle.languageCode === 'en'}
                    />
                  ))}
                </video>
              )}
            </Flex>
            <Flex direction="column" sx={{ width: 360 }}>
              <Tabs defaultValue="transcript" h={400}>
                <Tabs.List>
                  <Tabs.Tab value="transcript">Transcript</Tabs.Tab>
                  <Tabs.Tab value="topics">Topics</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="transcript" pt="xs">
                  <ScrollArea.Autosize mah={400} p="xs">
                    {item?.transcript && (
                      <SubtitlesView
                        entries={item.transcript}
                        onTimestampClicked={timestampClicked}
                      />
                    )}
                  </ScrollArea.Autosize>
                </Tabs.Panel>
                <Tabs.Panel value="topics">
                  <Flex>topics</Flex>
                </Tabs.Panel>
              </Tabs>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      {showError && (
        <Flex direction="row-reverse">
          <Notification
            icon={<IconX size="1.1rem" />}
            color="red"
            title="Error"
            onClose={errorDismissed}
          >
            {errorMessage}
          </Notification>
        </Flex>
      )}
      <LoadingOverlay visible={loading} />
    </Container>
  );
};

export default MediaItemDetails;
