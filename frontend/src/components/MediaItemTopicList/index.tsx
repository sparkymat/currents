import React from 'react';
import { ActionIcon, Flex, Menu, Table, Title } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';

import Topic from '../../models/Topic';

export interface MediaItemTopicListProps {
  topics: Topic[];
}

const MediaItemTopicList = ({ topics }: MediaItemTopicListProps) => (
  <Flex>
    <Table striped>
      <tbody>
        {topics.map(t => (
          <tr>
            <td>
              <Flex>
                <Title order={6} sx={{ flex: 1 }}>
                  {t.name}
                </Title>
              </Flex>
            </td>
            <td width={20}>
              <Menu position="bottom-end" width={200}>
                <Menu.Target>
                  <ActionIcon>
                    <IconDotsVertical size={14} />
                  </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item
                    component="a"
                    href={`/#/topic/${t.id}`}
                    target="_blank"
                  >
                    Open
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Flex>
);

export default MediaItemTopicList;
