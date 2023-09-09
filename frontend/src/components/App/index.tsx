/* eslint-disable react/no-unknown-property */
import React, { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Anchor,
  AppShell,
  ColorScheme,
  Flex,
  Header,
  Menu,
  Title,
} from '@mantine/core';
import { useDispatch } from 'react-redux';
import { useLocalStorage } from '@mantine/hooks';
import { IconBrightness, IconSettings } from '@tabler/icons-react';

import { AppDispatch } from '../../store';
import { updatePath } from '../../features/App/slice';
import MediaItems from '../MediaItems';

const App = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'currents-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

  useEffect(() => {
    dispatch(updatePath(location.pathname));
  }, [dispatch, location]);

  return (
    <div>
      <AppShell
        padding="md"
        header={
          <Header height={{ base: 50, md: 70 }} p="md">
            <div
              style={{ display: 'flex', alignItems: 'center', height: '100%' }}
            >
              <Flex
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
                sx={{ width: '100%' }}
              >
                <Anchor
                  underline={false}
                  component="button"
                  onClick={() => navigate('/')}
                >
                  <Title order={3} weight={300}>
                    currents
                  </Title>
                </Anchor>

                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <ActionIcon>
                      <IconSettings size="1.5rem" />
                    </ActionIcon>
                  </Menu.Target>

                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconBrightness size={14} />}
                      onClick={() => toggleColorScheme()}
                    >
                      Toggle dark mode
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Flex>
            </div>
          </Header>
        }
        styles={thisTheme => ({
          main: {
            backgroundColor:
              thisTheme.colorScheme === 'dark'
                ? thisTheme.colors.dark[8]
                : thisTheme.colors.gray[0],
          },
        })}
      >
        <Routes>
          <Route index element={<MediaItems />} />
        </Routes>
      </AppShell>
    </div>
  );
};

export default App;
