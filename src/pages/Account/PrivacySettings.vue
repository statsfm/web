<template>
  <div>
    <h3>Visibility settings</h3>
    <p>Choose what data you want to share</p>
    <div class="w-full text-white" v-if="privacySettings">
      <div
        v-for="[setting, value] in Object.entries(privacySettings)"
        :key="setting"
        class="mb-5 flex w-full flex-row items-center justify-between"
      >
        <div class="whitespace-nowrap">
          <h4>
            {{
              setting
                .split(/(?=[A-Z])/)
                .map((p) => p.toLowerCase())
                .join(' ')
            }}
          </h4>
          <span>Some info about this setting</span>
        </div>
        <div class="flex items-center">
          <Switch
            :checked="(privacySettings as any)[setting]"
            @checked="(privacySettings as any)[setting] = !value"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as statsfm from '@statsfm/statsfm.js';
import { onBeforeMount, Ref, ref, watch } from 'vue';
import { useApi, useToaster } from '~/hooks';
import Switch from '~/components/base/Switch/Switch.vue';

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
