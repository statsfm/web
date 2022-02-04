<script lang="ts" setup>
import { onMounted, ref, Ref, toRefs } from 'vue';
import { BacktrackStream } from '~/types';
import dayjs from '~/dayjs';
import { RouterLink } from 'vue-router';

interface Props {
  streams: BacktrackStream[];
}

const props = defineProps<Props>();
const { streams } = toRefs(props);

const pairs: Ref<Record<string, BacktrackStream[]>> = ref({});

// TODO: implement pagination
onMounted(() => {
  pairs.value = {};
  streams.value?.forEach((stream) => {
    const dm = dayjs(stream.endTime).format('LL');

    pairs.value[dm] = [...(pairs.value[dm] ?? []), stream];
  });
});
</script>

<template>
  <ul class="w-full">
    <li v-for="(streams, key) in pairs" class="relative mb-6 w-full flex items-start">
      <div
        class="bg-bodySecundary rounded-full aspect-square min-w-[4rem] w-16 grid place-items-center"
      >
        <div class="flex flex-col items-center">
          <span class="text-neutral-400 text-sm font-medium block"
            >{{ dayjs(key).format('MMM') }}
          </span>
          <span class="text-primary relative -mt-1 text-2xl font-bold block">{{
            dayjs(key).format('D')
          }}</span>
        </div>
      </div>

      <div v-if="streams.length > 1">
        <span
          class="absolute top-0 left-8 h-full -z-10 w-[3px] rounded bg-neutral-700"
          aria-hidden="true"
        />
        <span class="absolute bottom-0 left-7 w-3 -z-10 h-6 bg-bodyPrimary" aria-hidden="true" />
        <span
          class="absolute bottom-6 left-8 w-5 -z-10 h-[3px] rounded bg-neutral-700"
          aria-hidden="true"
        />
      </div>

      <ul class="max-w-full ml-2 mt-2 flex flex-col justify-between gap-4 w-full" role="list">
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
              class="my-auto text-right text-sm whitespace-nowrap font-medium text-neutral-400"
              >{{ dayjs(stream.endTime).fromNow() }}</time
            >
          </RouterLink>
        </li>
      </ul>
    </li>
    <!-- <Button
      size="small"
      id="dropdownButton"
      data-dropdown-toggle="dropdown"
      type="button"
      @click="loadStreams"
    >
      Load more streams
    </Button> -->
  </ul>
</template>
