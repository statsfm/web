import { defineComponent } from 'vue';
import * as statsfm from '@statsfm/statsfm.js';
import dayjs from '../../../dayjs';

// components
import { Avatar } from '../Avatar';
import { RouterLink } from 'vue-router';

// hooks
import { useI18n } from 'vue-i18n';

const positions: Record<number, string> = {
  1: 'bg-amber-400/30 text-amber-400',
  2: 'bg-gray-500/30 text-gray-500',
  3: 'bg-yellow-700/30 text-yellow-700'
};

interface Props {
  listener: statsfm.TopUser;
}

export const TopListenerCard = defineComponent<Props>(({ listener }) => {
  const { t } = useI18n();

  return () => (
    <RouterLink
      to={{ name: 'User', params: { userId: listener.user.customId ?? listener.user.id } }}
    >
      <div class="flex w-40 flex-col items-center">
        <Avatar src={listener.user.image} name={listener.user.displayName} size="3xl">
          <div class="rounded-lg bg-black">
            <span
              class={[
                'rounded-lg bg-bodySecundary px-2 py-1.5 text-lg drop-shadow-lg',
                positions[listener.position]
              ]}
            >
              #{listener.position}
            </span>
          </div>
        </Avatar>

        <div class="mt-2 text-center">
          <h4>{listener.user.displayName}</h4>
          <p class="m-0 line-clamp-2">
            <span>
              {t('minutes', {
                count: Math.round(
                  dayjs.duration(listener.playedMs!, 'ms').asMinutes()
                ).toLocaleString()
              })}
            </span>
            <br />
            <span>{t('streams', { count: listener.streams })}</span>
          </p>
        </div>
      </div>
    </RouterLink>
  );
});

TopListenerCard.props = ['listener'];
