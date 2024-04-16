import { AccountLayout } from '@/components/settings/Layout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Button } from '@/components/Button';
import { useApi, useAuth } from '@/hooks';
import type { UserSocialMediaConnection } from '@/utils/statsfm';
import type { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import { event } from 'nextjs-google-analytics';
import { DropdownMenu } from '@/components/ui/DropdownMenu';
import { MdMoreVert, MdRefresh, MdLinkOff, MdLaunch } from 'react-icons/md';
import Link from 'next/link';

enum PlatformStatus {
  LOADING = 'LOADING',
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
}

type SocialPlatform = {
  status: keyof typeof PlatformStatus;
  key: string;
  name: string;
  icon: string;
  canRefresh?: boolean;
  description: string;
  connection: UserSocialMediaConnection | null;
  connect: () => void;
  update?: () => void;
  disconnect: () => void;
};

const useSocials = () => {
  const api = useApi();

  const initialPlatforms: SocialPlatform[] = [
    {
      status: PlatformStatus.LOADING,
      key: 'discord',
      name: 'Discord',
      icon: 'https://cdn.stats.fm/file/statsfm/images/brands/discord/color.svg',
      description:
        'Connect your Discord account to get access to personalized commands with the stats.fm Discord bot, and show your Discord profile on your stats.fm profile.',
      connection: null,
      canRefresh: true,
      // TODO: optimistic updates for connecting
      connect: () => {
        event('SETTINGS_connections_discord_connect');
        window.location.href = api.http.resolveUrl(
          '/me/connections/discord/redirect',
          true,
          new URLSearchParams({
            redirect_uri: window.location.href,
            authorization: api.http.accessToken!,
          }).toString(),
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
          }).toString(),
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
    const hydratedPlatforms = platforms.map<SocialPlatform>((platform) => {
      const connection = userConnections.find(
        (connection) => connection.platform.name === platform.name,
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

          const optimisticPlatforms = platforms.map<SocialPlatform>(
            (platform) =>
              platform.name === connection.platform.name
                ? { ...platform, status: PlatformStatus.DISCONNECTED }
                : platform,
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

// const useStreamingServices = () => {
//   return [];
// };

const EmptyStateDisplay = ({ message }: { message: string }) => {
  return (
    <div className="flex h-32 w-full items-center justify-center">
      <p>{message}</p>
    </div>
  );
};

const ConnectionCard = ({ platform }: { platform: SocialPlatform }) => {
  return (
    <li
      className="mb-4 flex h-60 w-full flex-col justify-between overflow-hidden rounded-xl bg-foreground shadow-lg"
      key={platform.key}
    >
      <div className="flex justify-between px-4 pt-4">
        <h3 className="flex items-center gap-2">
          <img src={platform.icon} alt="icon" className="m-1 h-5" />
          {platform.name}
        </h3>

        <DropdownMenu>
          <DropdownMenu.Trigger>
            <MdMoreVert />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content>
              <DropdownMenu.Item
                disabled={
                  platform.status !== PlatformStatus.CONNECTED ||
                  !platform.canRefresh
                }
                onSelect={
                  platform.canRefresh && 'update' in platform
                    ? platform.update
                    : () => {}
                }
              >
                <MdRefresh /> Refresh
              </DropdownMenu.Item>
              <DropdownMenu.Item
                disabled={platform.status !== PlatformStatus.CONNECTED}
                onSelect={platform.disconnect}
              >
                <MdLinkOff /> Disconnect
              </DropdownMenu.Item>

              {/* TODO: add link to documentation */}
              <DropdownMenu.Item asChild>
                <Link href={'https://support.stats.fm/docs'}>
                  <MdLaunch /> Documentation
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu>
      </div>

      <p className="px-4">{platform.description}</p>

      <div className="mt-2 flex flex-col gap-2 border-t-[0.5px] border-neutral-800 bg-black p-4">
        {platform.status === PlatformStatus.DISCONNECTED ? (
          <div className="flex flex-col lg:flex-row">
            <Button onClick={platform.connect}>Configure</Button>
          </div>
        ) : (
          platform.connection && (
            <div className="flex items-center gap-2">
              <img
                src={platform.connection.platformUserImage}
                className="aspect-square h-10 rounded-full"
                alt="avatar"
              />
              <p className="mt-0">
                <h6>{platform.connection.platformUsername}</h6>
                {platform.connection.platformUserId}
              </p>
            </div>
          )
        )}
      </div>
    </li>
  );
};

// TODO: prefetch connections on the server
const ConnectionsList = () => {
  // const streamingServices = useStreamingServices();
  const socials = useSocials();

  const unconfigured = socials.filter(
    (s) => s.status !== PlatformStatus.CONNECTED,
  );
  const configured = socials.filter(
    (s) => s.status === PlatformStatus.CONNECTED,
  );

  return (
    <div className="relative w-full">
      <SettingsHeader title="Connections" />
      {unconfigured.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {unconfigured.map((platform, i) => (
            <ConnectionCard key={i} platform={platform} />
          ))}
        </ul>
      ) : (
        <EmptyStateDisplay message="All connections are configured" />
      )}

      <h4>Configured</h4>
      {configured.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {configured.map((platform, i) => (
            <ConnectionCard key={i} platform={platform} />
          ))}
        </ul>
      ) : (
        <EmptyStateDisplay message="No connections configured yet" />
      )}
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
