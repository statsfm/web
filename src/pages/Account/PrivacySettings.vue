<template>
  <div>
    <h3>Visibility settings</h3>
    <p>Choose what data you want to share</p>
    <div class="text-white w-full" v-if="privacySettings">
      <div
        v-for="[setting, value] in Object.entries(privacySettings)"
        :key="setting"
        class="flex flex-row justify-between items-center w-full mb-5"
      >
        <div class="whitespace-nowrap">
          <span class="font-medium text-white text-lg">{{ setting }}</span>
          <br />
          <span class="font-medium text-3sm">Some info about this setting</span>
        </div>
        <div class="flex items-center md:mt-2">
          <div
            class="flex items-center m-2 cursor-pointer cm-toggle-wrapper mb-6"
            @click="(privacySettings as any)[setting] = !value"
          >
            <span class="font-semibold text-sm mr-2">Private</span>
            <div
              :class="[
                'rounded-full w-11 h-6 p-0.5 transition duration-200',
                value ? 'bg-primary' : 'bg-primary bg-opacity-30'
              ]"
            >
              <div
                :class="[
                  'rounded-full w-5 h-5 bg-white transform transition duration-200 ease-in-out',
                  value ? 'translate-x-2 mx-auto' : ''
                ]"
              ></div>
            </div>
            <span class="font-semibold text-sm ml-2">Public</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import { onBeforeMount, Ref, ref, watch } from 'vue';
import { useApi, useToaster } from '~/hooks';

const api = useApi();
const toaster = useToaster();

const privacySettings: Ref<statsfm.UserPrivacySettings | undefined> = ref();

onBeforeMount(async () => {
  privacySettings.value = await api.me.privacySettings();

  watch(privacySettings.value, async () => {
    await api.me.updatePrivacySettings(privacySettings.value!);

    // TODO: replace with i18n string
    toaster.success({
      message: 'Updated! It may take a few minutes before your changes take full effect'
    });
  });
});
</script>
