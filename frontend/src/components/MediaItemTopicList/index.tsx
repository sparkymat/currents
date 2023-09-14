import React from 'react';
import { ActionIcon, Flex, Space, Table, Title } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

import Topic from '../../models/Topic';

export interface MediaItemTopicListProps {
  topics: Topic[];
  topicDeleteClicked(id: string);
  topicConfirmClicked(id: string);
}

const MediaItemTopicList = ({
  topics,
  topicConfirmClicked,
  topicDeleteClicked,
}: MediaItemTopicListProps) => (
  <Flex direction="column">
    {topics.filter(t => t.confirmed).length > 0 && (
      <>
        <Table striped>
          <tbody>
            {topics
              .filter(t => t.confirmed)
              .map(t => (
                <tr key={t.id}>
                  <td>
                    <Flex>
                      <Title order={6} sx={{ flex: 1 }}>
                        {t.name}
                      </Title>
                    </Flex>
                  </td>
                  <td width={20}>
                    <Flex>
                      <ActionIcon
                        variant="outline"
                        color="red"
                        onClick={() => topicDeleteClicked(t.id)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Flex>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
        <Space h="md" />
      </>
    )}
    {topics.filter(t => !t.confirmed).length > 0 && (
      <>
        <Title order={6} weight={300} my="xs">
          Unconfirmed
        </Title>
        <Table striped>
          <tbody>
            {topics
              .filter(t => !t.confirmed)
              .map(t => (
                <tr key={t.id}>
                  <td>
                    <Flex>
                      <Title order={6} sx={{ flex: 1 }}>
                        {t.name}
                      </Title>
                    </Flex>
                  </td>
                  <td width={20}>
                    <Flex>
                      <ActionIcon
                        variant="outline"
                        color="green"
                        onClick={() => topicConfirmClicked(t.id)}
                      >
                        <IconCheck size={14} />
                      </ActionIcon>
                      <Space w="xs" />
                      <ActionIcon
                        variant="outline"
                        color="red"
                        onClick={() => topicDeleteClicked(t.id)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Flex>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </>
    )}
  </Flex>
);

export default MediaItemTopicList;
