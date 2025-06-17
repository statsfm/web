import { useState, type FC, useEffect } from 'react';
import type * as statsfm from '@/utils/statsfm';
import { sendGAEvent } from '@next/third-parties/google';
import { useApi, useAuth } from '@/hooks';
import { supportUrls } from '@/utils/supportUrls';
import router from 'next/router';
import clsx from 'clsx';
import { Carousel } from '@/components/Carousel';
import {
  Section,
  SectionToolbarCarouselNavigation,
  SectionToolbarGridMode,
  SectionToolbarInfoMenu,
} from '@/components/Section';
import { TopListenerCardSkeleton } from './TopListenerCardSkeleton';
import { TopListenerCard } from './TopListenerCard';

type Props = {
  type: 'TRACK' | 'ALBUM' | 'ARTIST';
  data: statsfm.Track | statsfm.Album | statsfm.Artist;
};

const TopListenersBase: FC<
  {
    topListenerData: statsfm.TopUser[];
    friends: boolean;
    loading: boolean;
  } & Props
> = ({ topListenerData, friends, loading, data, type }) => {
  const { user, login } = useAuth();
  const [gridMode, setGridMode] = useState(false);
  return (
    <Carousel>
      <Section
        title={`Top listeners ${friends ? 'among your friends' : ''}`}
        description={`${friends ? 'Friends' : 'People'} who listen a lot to ${
          data.name
        }`}
        toolbar={
          <div
            className={clsx(
              'flex gap-1',
              loading ? 'pointer-events-none opacity-30' : '',
            )}
          >
            <SectionToolbarGridMode
              callback={(gridmode) => {
                sendGAEvent(
                  `${type}_top_listener${friends ? '_friends' : ''}_grid`,
                  {
                    gridmodeOn: !gridmode,
                  },
                );
                setGridMode(!gridmode);
                return !gridmode;
              }}
            />
            <div
              className={clsx(gridMode ? 'pointer-events-none opacity-30' : '')}
            >
              <SectionToolbarCarouselNavigation
                callback={() =>
                  sendGAEvent(
                    `${type}_top_listener${friends ? '_friends' : ''}_previous`,
                  )
                }
              />
              <SectionToolbarCarouselNavigation
                next
                callback={() =>
                  sendGAEvent(
                    `${type}_top_listener${friends ? '_friends' : ''}_next`,
                  )
                }
              />
            </div>
            <SectionToolbarInfoMenu
              description="Learn more about what top listeners are and how they're calculated"
              link={supportUrls.top_listeners}
            />
          </div>
        }
      >
        <div className="relative">
          <Carousel.Items
            className={`${
              !user && topListenerData.length === 0 ? 'blur-sm' : ''
            }`}
          >
            {!loading && topListenerData.length > 0
              ? topListenerData.map((item) => (
                  <Carousel.Item
                    key={(Math.random() + 1).toString(36).substring(7)}
                    onClick={() =>
                      sendGAEvent(
                        `${type}_top_listener${friends ? '_friends' : ''}_click`,
                      )
                    }
                  >
                    <div className="h-[270px]">
                      <TopListenerCard {...item} />
                    </div>
                  </Carousel.Item>
                ))
              : Array(10)
                  .fill(null)
                  .map(() => (
                    <Carousel.Item
                      key={(Math.random() + 1).toString(36).substring(7)}
                    >
                      <TopListenerCardSkeleton />
                    </Carousel.Item>
                  ))}
          </Carousel.Items>
          {!user && topListenerData.length === 0 && (
            <div className="absolute inset-0 grid place-items-center">
              <p className="m-0 text-lg text-text-grey">
                <a
                  className="cursor-pointer truncate leading-8 hover:underline"
                  onClick={() => login(router.asPath)}
                >
                  Login
                </a>{' '}
                to be able to see top listeners!
              </p>
            </div>
          )}
        </div>
      </Section>
    </Carousel>
  );
};

export const TopListeners: FC<Props> = (props) => {
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [topListenersFriends, setTopListenersFriends] = useState<
    statsfm.TopUser[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const api = useApi();
  const { user } = useAuth();

  const type = `${props.type.toLowerCase()}s` as
    | 'tracks'
    | 'albums'
    | 'artists';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setLoadingFriends(true);
      setTopListeners(
        await api[type].topListeners(props.data.id).catch(() => []),
      );
      setLoading(false);
      if (user) {
        setTopListenersFriends(
          await api[type].topListeners(props.data.id, true).catch(() => []),
        );
        setLoadingFriends(false);
      }
    })();
  }, [props.data.id]);

  return (
    <div>
      <TopListenersBase
        topListenerData={topListeners}
        friends={false}
        loading={loading}
        data={props.data}
        type={props.type}
      />
      {user && (
        <TopListenersBase
          topListenerData={topListenersFriends}
          friends
          loading={loadingFriends}
          data={props.data}
          type={props.type}
        />
      )}
    </div>
  );
};
