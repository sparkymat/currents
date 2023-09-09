import {
  Anchor,
  Notification,
  Container,
  Flex,
  LoadingOverlay,
  Pagination,
  Title,
  useMantineColorScheme,
  Modal,
  TextInput,
  Radio,
  Group,
  Space,
  Button,
} from '@mantine/core';
import React, { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import { IconX } from '@tabler/icons-react';

import { AppDispatch } from '../../store';
import searchMediaItems from '../../features/MediaItems/searchMediaItems';
import {
  selectErrorMessage,
  selectLoading,
  selectPageSize,
  selectItems,
  selectShowError,
  selectTotalCount,
  selectFilterBarQuery,
  selectCreateModalShown,
  selectCreateModalURL,
  selectCreateModalMediaItemType,
} from '../../selectors/MediaItems';
import {
  dismissError,
  hideCreateModal,
  showCreateModal,
  updateCreateModalMediaItemType,
  updateCreateModalURL,
  updateFilterBarQuery,
  updatePage,
  updateQuery,
} from '../../features/MediaItems/slice';
import MediaItemsFilterBar from '../MediaItemsFilterBar';
import { MediaItemType } from '../../models/MediaItem';
import createMediaItem from '../../features/MediaItems/createMediaItem';

const MediaItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { colorScheme } = useMantineColorScheme();

  const { page: pageString, query } = useParams();

  const items = useSelector(selectItems);
  const loading = useSelector(selectLoading);
  const showError = useSelector(selectShowError);
  const errorMessage = useSelector(selectErrorMessage);
  const totalCount = useSelector(selectTotalCount);
  const filterBarQuery = useSelector(selectFilterBarQuery);
  const pageSize = useSelector(selectPageSize);

  const createModalShown = useSelector(selectCreateModalShown);
  const createModalURL = useSelector(selectCreateModalURL);
  const createModalMediaItemType = useSelector(selectCreateModalMediaItemType);

  const page = useMemo((): number => {
    let pageNumber = parseInt(pageString || '', 10);

    if (Number.isNaN(pageNumber)) {
      pageNumber = 1;
    }

    return pageNumber;
  }, [pageString]);

  const pageCount = useMemo(
    () => Math.ceil(totalCount / pageSize),
    [pageSize, totalCount],
  );

  useEffect(() => {
    document.title = 'currents';

    dispatch(updateQuery(query || ''));
    dispatch(updatePage(page));
    dispatch(
      searchMediaItems({
        query: query || '',
        page,
        pageSize,
      }),
    );
  }, [dispatch, page, pageSize, query]);

  const currentFilterURL = useMemo(
    () => (query && query !== '' ? `/#/search/${query}` : `/#/`),
    [query],
  );

  const newFilterURL = useMemo(
    () =>
      filterBarQuery && filterBarQuery !== ''
        ? `/#/search/${filterBarQuery}`
        : `/#/`,
    [filterBarQuery],
  );

  const filterBarQueryUpdated = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      dispatch(updateFilterBarQuery(evt.target.value));
    },
    [dispatch],
  );

  const errorDismissed = useCallback(() => {
    dispatch(dismissError());
  }, [dispatch]);

  const createModalOpened = useCallback(() => {
    dispatch(showCreateModal());
  }, [dispatch]);

  const createModalClosed = useCallback(() => {
    dispatch(hideCreateModal());
  }, [dispatch]);

  const createModalURLChanged = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      dispatch(updateCreateModalURL(evt.target.value));
    },
    [dispatch],
  );

  const createModalMediaItemTypeChanged = useCallback(
    (newItemType: MediaItemType) => {
      dispatch(updateCreateModalMediaItemType(newItemType));
    },
    [dispatch],
  );

  const createModalSubmitted = useCallback(() => {
    dispatch(
      createMediaItem({
        url: createModalURL,
        item_type: createModalMediaItemType,
      }),
    );
  }, [createModalMediaItemType, createModalURL, dispatch]);

  return (
    <Container fluid>
      <Flex direction="column">
        <MediaItemsFilterBar
          query={filterBarQuery}
          onQueryChanged={filterBarQueryUpdated}
          filterLocation={newFilterURL}
          onNewClicked={createModalOpened}
        />
        <Flex wrap="wrap">
          {items.map(v => (
            <Anchor
              color={colorScheme === 'dark' ? 'white' : 'dark'}
              underline={false}
              href={`/#/item/${v.id}`}
            >
              <Title order={6} weight={300}>
                {v.url}
              </Title>
            </Anchor>
          ))}
        </Flex>
        <Flex justify="center" mb="md">
          <Pagination
            value={page}
            boundaries={1}
            total={pageCount}
            position="center"
            withEdges
            getItemProps={p => ({
              component: 'a',
              href: `${currentFilterURL}/p/${p}`,
            })}
            getControlProps={control => {
              if (control === 'first') {
                return { component: 'a', href: currentFilterURL };
              }

              if (control === 'last') {
                return {
                  component: 'a',
                  href: `${currentFilterURL}/p/${pageCount}`,
                };
              }

              if (control === 'next') {
                return {
                  component: 'a',
                  href:
                    page + 1 > pageCount
                      ? `${currentFilterURL}/p/${page}`
                      : `${currentFilterURL}/p/${page + 1}`,
                };
              }

              if (control === 'previous') {
                return {
                  component: 'a',
                  href:
                    page - 1 < 1
                      ? `${currentFilterURL}/p/${page}`
                      : `${currentFilterURL}/p/${page - 1}`,
                };
              }

              return {};
            }}
          />
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
      <Modal
        title="Add new"
        opened={createModalShown}
        onClose={createModalClosed}
      >
        <Flex direction="column">
          <TextInput
            type="url"
            placeholder="Paste link here"
            value={createModalURL}
            onChange={createModalURLChanged}
          />
          <Space h="sm" />
          <Radio.Group
            label="Type"
            value={createModalMediaItemType}
            onChange={createModalMediaItemTypeChanged}
          >
            <Group mt="xs">
              <Radio value="video" label="Video" />
              <Radio value="article" label="Article" />
            </Group>
          </Radio.Group>
          <Space h="sm" />
          <Button variant="outline" onClick={createModalSubmitted}>
            Add
          </Button>
        </Flex>
      </Modal>
      <LoadingOverlay visible={loading} />
    </Container>
  );
};

export default MediaItems;
