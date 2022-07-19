import { FC } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import { slugify } from '~/utils/slugify';
import dayjs from '~/dayjs';

// components
import { RouterLink } from 'vue-router';
import { Avatar } from '../Avatar';

// hooks
import { useI18n } from 'vue-i18n';

interface Props extends statsfm.TopArtist {}

export const ArtistCard: FC<Props> = ({ playedMs, streams, position, artist }) => {
  const { t } = useI18n();

  return (
    <RouterLink
      to={{
        name: 'Artist',
        params: { id: artist.id, slug: slugify(artist.name) }
      }}
    >
      <div class="flex w-40 flex-col items-center">
        <Avatar key={artist.image} name={artist.name} src={artist.image} size="3xl">
          <div class="rounded-lg bg-bodySecundary px-2 py-1">
            <h4 class="text-neutral-400">#{position}</h4>
          </div>
        </Avatar>

        <div class="mt-2 text-center">
          <h4>{artist.name}</h4>
          <p class="m-0 leading-tight line-clamp-2">
            <span>
              {playedMs && (
                <span>
                  {t('minutes', {
                    count: Math.floor(dayjs.duration(playedMs!, 'ms').asMinutes()).toLocaleString()
                  })}{' '}
                  •{' '}
                </span>
              )}
              <span>{t('streams', { count: streams })}</span>
            </span>
          </p>
        </div>
      </div>
    </RouterLink>
  );
};
