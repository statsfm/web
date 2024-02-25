import { useState, type FC, useEffect } from 'react';
import type * as statsfm from '@/utils/statsfm';
import { event } from 'nextjs-google-analytics';
import { useApi, useAuth } from '@/hooks';
import { supportUrls } from '@/utils/supportUrls';
import router from 'next/router';
import clsx from 'clsx';
import { Carousel } from '@/components/Carousel';
import {
  Section,
  SectionToolbarFriendMode,
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

export const TopListeners: FC<Props> = (props) => {
  const [topListeners, setTopListeners] = useState<statsfm.TopUser[]>([]);
  const [topListenersFriends, setTopListenersFriends] = useState(false);
  const [loading, setLoading] = useState(true);
  const [gridMode, setGridMode] = useState(false);
  const api = useApi();
  const { user, login } = useAuth();

  const type = `${props.type.toLowerCase()}s` as
    | 'tracks'
    | 'albums'
    | 'artists';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setTopListeners(
        await api[type]
          .topListeners(props.data.id, topListenersFriends)
          .catch(() => [])
      );
      setLoading(false);
    })();
  }, [topListenersFriends, props.data.id]);

  return (
    <Carousel>
      <Section
        title={`Top listeners ${
          topListenersFriends ? 'among your friends' : ''
        }`}
        description={`${
          topListenersFriends ? 'Friends' : 'People'
        } who listen a lot to ${props.data.name}`}
        toolbar={
          <div
            className={clsx(
              'flex gap-1',
              loading ? 'pointer-events-none opacity-30' : ''
            )}
          >
            {user && (
              <SectionToolbarFriendMode
                callback={(data) => {
                  setLoading(true);
                  setTopListenersFriends(data);
                }}
              />
            )}
            <SectionToolbarGridMode
              callback={(gridmode) => {
                event(`${props.type}_top_listener_grid`, {
                  gridmodeOn: !gridmode,
                });
                setGridMode(!gridmode);
                return !gridmode;
              }}
            />
            <div
              className={clsx(gridMode ? 'pointer-events-none opacity-30' : '')}
            >
              <SectionToolbarCarouselNavigation
                callback={() => event(`${props.type}_top_listener_previous`)}
              />
              <SectionToolbarCarouselNavigation
                next
                callback={() => event(`${props.type}_top_listener_next`)}
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
            className={`${!user && topListeners.length === 0 ? 'blur-sm' : ''}`}
          >
            {!loading && topListeners.length > 0
              ? topListeners.map((item) => (
                  <Carousel.Item
                    key={(Math.random() + 1).toString(36).substring(7)}
                    onClick={() => event(`${props.type}_top_listener_click`)}
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
          {!user && topListeners.length === 0 && (
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
