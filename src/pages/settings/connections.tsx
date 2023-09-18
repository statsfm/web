import { AccountLayout } from '@/components/settings/Layout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/Button';
import { useApi, useAuth } from '@/hooks';
import type { UserSocialMediaConnection } from '@statsfm/statsfm.js';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import { event } from 'nextjs-google-analytics';

const PlatformStatus = {
  LOADING: 'LOADING',
  CONNECTED: 'CONNECTED',
  DISCONNECTED: 'DISCONNECTED',
} as const;

type PlatformType = {
  status: keyof typeof PlatformStatus;
  key: string;
  name: string;
  icon: string;
  can_refresh?: boolean;
  description: string;
  connection: UserSocialMediaConnection | null;
  connect: () => void;
  update?: () => void;
  disconnect: () => void;
};

const useConnections = () => {
  const api = useApi();

  const initialPlatforms: PlatformType[] = [
    {
      status: PlatformStatus.LOADING,
      key: 'discord',
      name: 'Discord',
      icon: 'https://cdn.stats.fm/file/statsfm/images/brands/discord/color.svg',
      description:
        'Connect your Discord account to get access to personalized commands with the stats.fm Discord bot',
      connection: null as UserSocialMediaConnection | null,
      can_refresh: true,
      // TODO: optimistic updates for connecting
      connect: () => {
        event('SETTINGS_connections_discord_connect');
        window.location.href = api.http.resolveUrl(
          '/me/connections/discord/redirect',
          true,
          new URLSearchParams({
            redirect_uri: window.location.href,
            authorization: api.http.accessToken!,
          }).toString()
        );
      },
      update: () => {
        event('SETTINGS_connections_discord_update');
        window.location.href = api.http.resolveUrl(
          '/me/connections/discord/redirect',
          true,
          new URLSearchParams({
            redirect_uri: window.location.href,
            authorization: api.http.accessToken!,
          }).toString()
        );
      },
      disconnect: () => {
        event('SETTINGS_connections_discord_disconnect');
      },
    },
  ];

  const [platforms, setPlatforms] = useState(initialPlatforms);

  const refetch = async () => {
    const userConnections = await api.me.socialMediaConnections();
    const hydratedPlatforms = platforms.map<PlatformType>((platform) => {
      const connection = userConnections.find(
        (connection) => connection.platform.name === platform.name
      );

      if (!connection)
        return {
          ...platform,
          status: PlatformStatus.DISCONNECTED,
        };

      return {
        ...platform,
        status: PlatformStatus.CONNECTED,
        connection,
        disconnect: async () => {
          await api.me.removeSocialMediaConnection(connection.id);

          const optimisticPlatforms = platforms.map<PlatformType>((platform) =>
            platform.name === connection.platform.name
              ? { ...platform, status: PlatformStatus.DISCONNECTED }
              : platform
          );
          setPlatforms(optimisticPlatforms);
          platform.disconnect();
        },
      };
    });

    setPlatforms(hydratedPlatforms);
  };

  useEffect(() => {
    refetch();
  }, []);

  return platforms;
};

// TODO: prefetch connections on the server
const ConnectionsList = () => {
  const platforms = useConnections();

  return (
    <div className="relative w-full">
      <SettingsHeader title="Connections" />

      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {platforms.map((platform) => (
          <li
            className="mb-4 w-full rounded-xl bg-foreground py-4 px-5"
            key={platform.key}
          >
            <h2 className="flex items-center gap-2">
              <img src={platform.icon} alt="icon" className="h-6" />
              {platform.name}
            </h2>

            <p className="-mt-1 text-sm text-neutral-500 sm:-mt-2">
              {platform.status === PlatformStatus.CONNECTED &&
              platform.connection
                ? `Connected as: ${platform.connection.platformUsername}`
                : 'Not Connected'}
            </p>

            <div className="flex flex-col lg:flex-row">
              <p className="">{platform.description}</p>
            </div>
            <div className="flex flex-col gap-2 lg:flex-row">
              {platform.status === PlatformStatus.CONNECTED &&
                platform.can_refresh &&
                'update' in platform && (
                  <Button
                    className="mt-auto h-min rounded-xl px-4 py-2"
                    disabled={!platform.can_refresh}
                    onClick={
                      platform.status === PlatformStatus.CONNECTED &&
                      platform.can_refresh &&
                      'update' in platform
                        ? platform.update
                        : () => {}
                    }
                  >
                    Refresh
                  </Button>
                )}
              <Button
                className="mt-auto h-min rounded-xl px-4 py-2"
                disabled={platform.status === PlatformStatus.LOADING}
                onClick={
                  platform.status === PlatformStatus.CONNECTED
                    ? platform.disconnect
                    : platform.connect
                }
              >
                {(() => {
                  if (platform.status === PlatformStatus.LOADING)
                    return 'LOADING';
                  if (platform.status === PlatformStatus.CONNECTED)
                    return 'Disconnect';
                  return 'Connect';
                })()}
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

const ConnectionsPage: NextPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AccountLayout>
      <ConnectionsList />
    </AccountLayout>
  );
};

export default ConnectionsPage;
