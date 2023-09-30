import React, { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Flex,
  LoadingOverlay,
  Pagination,
  Notification,
  Table,
} from '@mantine/core';
import { useParams } from 'react-router-dom';

import { IconX } from '@tabler/icons-react';
import { AppDispatch } from '../../store';
import { searchTopics } from '../../features/TopicsList/searchTopics';
import {
  selectFilterBarQuery,
  selectLoading,
  selectPageSize,
  selectTotalCount,
  selectItems,
  selectShowError,
  selectErrorMessage,
} from '../../selectors/TopicsList';
import {
  updateFilterBarQuery,
  updatePage,
  updateQuery,
  dismissError,
} from '../../features/TopicsList/slice';
import { TopicsListFilterBar } from '../TopicsListFilterBar';

export const TopicsList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { page: pageString, query } = useParams();

  const loading = useSelector(selectLoading);
  const showError = useSelector(selectShowError);
  const errorMessage = useSelector(selectErrorMessage);
  const topics = useSelector(selectItems);
  const totalCount = useSelector(selectTotalCount);
  const filterBarQuery = useSelector(selectFilterBarQuery);
  const pageSize = useSelector(selectPageSize);

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
    document.title = 'tubes';

    dispatch(updateQuery(query || ''));
    dispatch(updatePage(page));
    dispatch(
      searchTopics({
        query: query || '',
        page,
        pageSize,
      }),
    );
  }, [dispatch, page, pageSize, query]);

  const filterBarQueryUpdated = useCallback(
    (evt: ChangeEvent<HTMLInputElement>) => {
      dispatch(updateFilterBarQuery(evt.target.value));
    },
    [dispatch],
  );

  const currentFilterURL = useMemo(
    () => (query && query !== '' ? `/#/topics/search/${query}` : `/#/topics`),
    [query],
  );

  const errorDismissed = useCallback(() => {
    dispatch(dismissError());
  }, [dispatch]);

  const newFilterURL = useMemo(
    () =>
      filterBarQuery && filterBarQuery !== ''
        ? `/#/topics/search/${filterBarQuery}`
        : `/#/topics`,
    [filterBarQuery],
  );

  return (
    <Container fluid>
      <Flex direction="column">
        <TopicsListFilterBar
          query={filterBarQuery}
          onQueryChanged={filterBarQueryUpdated}
          filterLocation={newFilterURL}
          showCreateModal={() => {}}
        />
        <Table striped>
          <tbody>
            {topics.map(t => (
              <tr>
                <td>{t.name}</td>
              </tr>
            ))}
          </tbody>
        </Table>
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
      <LoadingOverlay visible={loading} />
    </Container>
  );
};
