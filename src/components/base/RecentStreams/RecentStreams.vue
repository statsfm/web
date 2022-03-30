<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import { onBeforeMount, onMounted, onUpdated, ref, Ref, toRefs } from 'vue';
import { RouterLink } from 'vue-router';
import dayjs from '~/dayjs';

interface Props {
  pairs?: Record<string, statsfm.Stream[]>;
}

const props = defineProps<Props>();
const { pairs } = toRefs(props);
</script>

<template>
  <span class="text-center text-neutral-400" v-if="pairs == undefined">No streams</span>
  <ul class="w-full">
    <li v-for="(streams, key) in pairs" class="relative mb-6 flex w-full items-start">
      <div
        class="grid aspect-square w-16 min-w-[4rem] place-items-center rounded-full bg-bodySecundary"
      >
        <div class="flex flex-col items-center">
          <span class="block text-sm font-medium text-neutral-400"
            >{{ dayjs(key).format('MMM') }}
          </span>
          <span class="relative -mt-1 block text-2xl font-bold text-primary">{{
            dayjs(key).format('D')
          }}</span>
        </div>
      </div>

      <div v-if="streams.length > 1">
        <span
          class="absolute top-0 left-8 -z-10 h-full w-[3px] rounded bg-neutral-700"
          aria-hidden="true"
        />
        <span class="absolute bottom-0 left-7 -z-10 h-6 w-3 bg-bodyPrimary" aria-hidden="true" />
        <span
          class="absolute bottom-6 left-8 -z-10 h-[3px] w-5 rounded bg-neutral-700"
          aria-hidden="true"
        />
      </div>

      <ul class="ml-2 mt-2 flex w-full max-w-full flex-col justify-between gap-4" role="list">
        <li v-for="stream in streams">
          <RouterLink
            :to="{ name: 'Track', params: { id: stream.trackId } }"
            class="flex justify-between"
          >
            <div class="flex flex-col">
              <h4>{{ stream.trackName }}</h4>

              <span
                >Streamed for
                {{
                  dayjs
                    .duration({ milliseconds: stream.playedMs })
                    .add({ milliseconds: 0 }) // zonder dit werkt t niet lol
                    .format('mm:ss')
                }}</span
              >
            </div>

            <time
              class="my-auto whitespace-nowrap text-right text-sm font-medium text-neutral-400"
              >{{ dayjs(stream.endTime).fromNow() }}</time
            >
          </RouterLink>
        </li>
      </ul>
    </li>
  </ul>
</template>
