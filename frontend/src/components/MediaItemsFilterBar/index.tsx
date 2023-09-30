import { Button, Flex, Paper, Space, TextInput } from '@mantine/core';
import { IconDevicesPlus } from '@tabler/icons-react';
import React, { ChangeEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export interface MediaItemsFilterBarProps {
  query: string;
  onQueryChanged(_evt: ChangeEvent<HTMLInputElement>);
  filterLocation: string;
  onNewClicked();
}

export const MediaItemsFilterBar = ({
  query,
  onQueryChanged,
  filterLocation,
  onNewClicked,
}: MediaItemsFilterBarProps) => {
  const navigate = useNavigate();
  const searchSubmitted = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.keyCode === 13) {
        navigate(filterLocation);
      }
    },
    [filterLocation, navigate],
  );

  return (
    <Paper>
      <Flex p="sm">
        <TextInput
          placeholder="Search by name"
          value={query}
          onChange={onQueryChanged}
          onKeyDown={searchSubmitted}
          sx={{ flex: 1 }}
        />
        <Space w="sm" />
        <Button variant="outline" component="a" href={filterLocation}>
          Filter
        </Button>
        <Space w="sm" />
        <Button variant="filled" onClick={onNewClicked}>
          <IconDevicesPlus size="1.1rem" />
          <Space w="xs" />
          New
        </Button>
      </Flex>
    </Paper>
  );
};
