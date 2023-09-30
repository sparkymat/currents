import { Button, Flex, Paper, Space, TextInput } from '@mantine/core';
import React, { ChangeEvent, useCallback } from 'react';
import { IconFilter, IconSquarePlus } from '@tabler/icons-react';

export interface ChannelFilterBarProps {
  query: string;
  onQueryChanged(_evt: ChangeEvent<HTMLInputElement>);
  filterLocation: string;
  showCreateModal();
}

export const TopicsListFilterBar = ({
  query,
  onQueryChanged,
  filterLocation,
  showCreateModal,
}: ChannelFilterBarProps) => {
  const searchSubmitted = useCallback(
    (evt: React.KeyboardEvent<HTMLInputElement>) => {
      if (evt.keyCode === 13) {
        window.location.href = filterLocation;
      }
    },
    [filterLocation],
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
        <Button
          variant="outline"
          leftIcon={<IconFilter size={14} />}
          component="a"
          href={filterLocation}
        >
          Filter
        </Button>
        <Space w="sm" />
        <Button
          variant="filled"
          leftIcon={<IconSquarePlus size={14} />}
          onClick={showCreateModal}
        >
          New channel
        </Button>
      </Flex>
    </Paper>
  );
};
