<template>
  <div v-if="track">
    <HeroWithImageAndInfo
      :name="track.name"
      :image="track.albums[0].image"
      :subtitle="track.artists.map((artist: statsfm.ArtistSimple) => artist.name).join(', ')"
      :subtitle-to="{ path: `/artist/${track.artists[0].id}` }"
    />
  </div>
  <Container>
    <section class="mt-5" v-if="audioAnalysis">
      <h2>{{ t('track.audio_analysis') }}</h2>
      <div class="mt-2 flex flex-col justify-between md:flex-row">
        <div>
          <div class="grid basis-1/2 grid-cols-2 gap-2 md:grid-cols-3">
            <!-- The overall loudness of a track in decibels (dB). Loudness values are averaged across the entire track and are useful for comparing relative loudness of tracks. Loudness is the quality of a sound that is the primary psychological correlate of physical strength (amplitude). Values typically range between -60 and 0 db. -->
            <StatsCard :label="t('track.overall_loudness')">
              {{ audioAnalysis.loudness }}
            </StatsCard>

            <!-- The estimated overall key of the section. The values in this field ranging from 0 to 11 mapping to pitches using standard Pitch Class notation (E.g. 0 = C, 1 = C♯/D♭, 2 = D, and so on). If no key was detected, the value is -1. -->
            <StatsCard :label="t('track.key')" v-if="audioAnalysis.key >= 0">
              {{ keyToNote(audioAnalysis.key) }}
            </StatsCard>

            <!-- Indicates the modality (major or minor) of a section, the type of scale from which its melodic content is derived. This field will contain a 0 for "minor", a 1 for "major", or a -1 for no result. Note that the major key (e.g. C major) could more likely be confused with the minor key at 3 semitones lower (e.g. A minor) as both keys carry the same pitches. -->
            <StatsCard :label="t('track.mode')" v-if="audioAnalysis.mode >= 0">
              {{ audioAnalysis.mode == 0 ? 'Minor' : 'Major' }}
            </StatsCard>

            <!-- An estimated time signature. The time signature (meter) is a notational convention to specify how many beats are in each bar (or measure). The time signature ranges from 3 to 7 indicating time signatures of "3/4", to "7/4". -->
            <StatsCard :label="t('track.time_signature')">
              {{ audioAnalysis.time_signature }}/4
            </StatsCard>

            <!-- The overall estimated tempo of a track in beats per minute (BPM). In musical terminology, tempo is the speed or pace of a given piece and derives directly from the average beat duration. -->
            <StatsCard label="BPM">
              {{ audioAnalysis.tempo }}
            </StatsCard>
          </div>

          <div v-if="segment" class="mt-5">
            <h3>{{ t('track.segment') }}</h3>
            <span
              >{{ t('track.selected_segment') }}
              {{ dayjs.duration(segment.current.start, 'seconds').format('mm:ss') }} -
              {{ dayjs.duration(segment.next.start, 'seconds').format('mm:ss') }}</span
            >

            <StatsCard class="mt-2" :label="t('track.average_loudness_in_timeframe')">
              {{
                Math.round(((segment.current.loudness_max + segment.next.loudness_max) / 2) * 10) /
                10
              }}
            </StatsCard>
          </div>
        </div>

        <div>
          <AudioAnalysis :analysis="audioAnalysis" @segment="onSegmentHover" />
        </div>
      </div>
    </section>
  </Container>
</template>

<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import { onMounted, Ref, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import AudioAnalysis from '~/components/base/AudioAnalysis/AudioAnalysis.vue';
import HeroWithImageAndInfo from '~/components/base/HeroWithImageAndInfo.vue';
import StatsCard from '~/components/base/StatsCard.vue';
import Container from '~/components/layout/Container.vue';
import dayjs from '~/dayjs';
import { useApi } from '~/hooks';

const route = useRoute();
const { t } = useI18n();
const api = useApi();

const track: Ref<statsfm.Track | null> = ref(null);
const audioAnalysis: Ref<statsfm.AudioAnalysis | null> = ref(null);

const segment: Ref<{
  current: statsfm.AudioAnalysisSegment;
  next: statsfm.AudioAnalysisSegment;
} | null> = ref(null);

const getTrackAudioAnalysis = async (track: statsfm.Track): Promise<statsfm.AudioAnalysis> => {
  // todo: add this endpoint to api
  const id = (track.externalIds.spotify as string[])[0];
  // const token = await new auth().getSpotifyToken();
  // return await fetch(`https://api.spotify.com/v1/audio-analysis/${id}`, {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }).then((res) => res.json());
  return await (
    await api.http.get(`/spotify/audio-analysis/${id}`)
  ).data.item;
};

const keyToNote = (key: number): string => {
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return notes[key];
};

const onSegmentHover = (e: any) => {
  segment.value = e;
};

onMounted(async () => {
  const id = parseInt(route.params.id.toString());

  track.value = await api.tracks.get(id);
  audioAnalysis.value = await getTrackAudioAnalysis(track.value);
});
</script>
