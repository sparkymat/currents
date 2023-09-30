import {
  Notification,
  Container,
  Flex,
  LoadingOverlay,
  Title,
  ScrollArea,
  Anchor,
  Space,
  Card,
  Menu,
  ActionIcon,
  Button,
} from '@mantine/core';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { IconDotsVertical, IconX } from '@tabler/icons-react';

import { AppDispatch } from '../../store';
import {
  selectErrorMessage,
  selectLoading,
  selectItem,
  selectShowError,
} from '../../selectors/MediaItemDetails';
import { dismissError } from '../../features/MediaItemDetails/slice';
import { fetchMediaItem } from '../../features/MediaItemDetails/fetchMediaItem';
import { SubtitlesView } from '../SubtitlesView';
import { MediaItemTopicList } from '../MediaItemTopicList';
import { rescanMediaItem } from '../../features/MediaItemDetails/rescanMediaItem';
import { confirmMediaItemTopic } from '../../features/MediaItemDetails/confirmMediaItemTopic';
import { deleteMediaItemTopic } from '../../features/MediaItemDetails/deleteMediaItemTopic';

export const MediaItemDetails = () => {
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

  const rescanClicked = useCallback(() => {
    dispatch(rescanMediaItem(id || ''));
  }, [dispatch, id]);

  const confirmTopicClicked = useCallback(
    (topicID: string) => {
      dispatch(
        confirmMediaItemTopic({
          mediaItemID: id || '',
          topicID,
        }),
      );
    },
    [dispatch, id],
  );

  const deleteTopicClicked = useCallback(
    (topicID: string) => {
      dispatch(
        deleteMediaItemTopic({
          mediaItemID: id || '',
          topicID,
        }),
      );
    },
    [dispatch, id],
  );

  return (
    <Container size="lg" pb="lg">
      <Title mt="sm" order={1} weight={300}>
        {item?.title || item?.url}
      </Title>
      <Title mb="md" order={4} weight={300} italic>
        {`Published on ${item?.published_at.format('Do MMMM, YYYY')}`}
      </Title>

      <Flex wrap="wrap">
        <Flex direction="column" sx={{ flex: 1 }}>
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
          <Anchor underline={false} target="_blank" href={item?.url}>
            <Title mt="xs" order={4} weight={300}>{`URL: ${item?.url}`}</Title>
          </Anchor>
        </Flex>
        <Space w="sm" h="sm" />
        <Flex direction="column" sx={{ width: 360 }}>
          <Card title="Transcript">
            <Card.Section withBorder inheritPadding py="xs">
              <Title order={6}>Transcript</Title>
            </Card.Section>
            <ScrollArea.Autosize h={300} p="xs">
              {item?.transcript && (
                <SubtitlesView
                  entries={item.transcript}
                  onTimestampClicked={timestampClicked}
                />
              )}
            </ScrollArea.Autosize>
          </Card>
          <Space h="md" />
          <Card title="Transcript">
            <Card.Section withBorder inheritPadding py="xs">
              <Flex align="center">
                <Title order={6} sx={{ flex: 1 }}>
                  Topics
                </Title>
                <Menu>
                  <Menu.Target>
                    <ActionIcon>
                      <IconDotsVertical size={14} />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item>Add topic</Menu.Item>
                    <Menu.Item>Rescan for topics</Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </Card.Section>
            <ScrollArea.Autosize h={300} p="xs">
              <MediaItemTopicList
                topics={item?.topics || []}
                topicDeleteClicked={deleteTopicClicked}
                topicConfirmClicked={confirmTopicClicked}
              />
            </ScrollArea.Autosize>
            <Card.Section p="sm">
              <Flex>
                <Button
                  sx={{ flex: 1 }}
                  variant="filled"
                  onClick={rescanClicked}
                >
                  Re-scan
                </Button>
                <Space w="sm" />
                <Button sx={{ flex: 1 }} variant="filled">
                  Add
                </Button>
              </Flex>
            </Card.Section>
          </Card>
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
