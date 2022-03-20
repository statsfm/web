<template>
  <div>
    <h1 class="mb-4">Account info</h1>

    <div v-if="customId != undefined" class="md:items-between flex flex-col md:flex-row md:gap-5">
      <div class="flex w-full flex-col md:w-6/12">
        <Input
          name="customUrl"
          label="Custom url"
          :value="customId"
          prefix="https://stats.fm/"
          :validation="customIdAvailable ? null : 'Custom url not available'"
          maxlength="32"
          @input="checkAvailability"
        />
      </div>
      <div
        class="flex items-center gap-1 md:pt-4"
        :class="customIdAvailable ? 'md:pb-0' : 'md:pb-4'"
      >
        <Icon
          :path="customIdAvailable ? mdiCheckCircleOutline : mdiCloseCircleOutline"
          :color="customIdAvailable ? '#22c55e' : '#ff005c'"
        />
        <span
          class="text-lg font-bold"
          :style="`color: ${customIdAvailable ? '#22c55e' : '#ff005c'}`"
          >{{ customIdAvailable ? 'Available' : 'Not Available' }}</span
        >
      </div>
    </div>

    <div v-if="profile && pronouns" class="md:items-between flex flex-col md:flex-row md:gap-5">
      <select name="pronouns" id="pronouns" v-model="profile.pronouns">
        <option v-for="pronoun in pronouns" :key="pronoun" :value="pronoun">{{ pronoun }}</option>
      </select>
    </div>

    <Textarea
      name="about"
      label="About"
      description="Brief description for your profile (max 512 characters)"
      maxlength="512"
      rows="3"
      placeholder="Something about yourself..."
    />

    <br />

    <Button size="small" class="" @click="save">Save</Button>
  </div>
</template>

<script lang="ts" setup>
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
import { UserProfile } from '@statsfm/statsfm.js';
import { onBeforeMount, Ref, ref } from 'vue';
import Button from '~/components/base/Button.vue';
import Icon from '~/components/base/Icon.vue';
import Input from '~/components/base/Input/Input.vue';
import Textarea from '~/components/base/Textarea/Textarea.vue';
import { useApi } from '~/hooks';
import { useStore } from '~/store';

const api = useApi();
const store = useStore();
const profile: Ref<UserProfile | undefined> = ref();
const customIdAvailable: Ref<boolean> = ref(true);
const pronounAvailable: Ref<boolean> = ref(true);
const customId: Ref<string | undefined> = ref();
const pronouns: Ref<string[] | undefined> = ref();

const save = async () => {
  if (!profile.value) return;
  await api.me.updateProfile(profile.value);
};

const checkAvailability = async (customId: string) => {
  if (!customId) return;
  customIdAvailable.value = await api.me.customIdAvailable(customId);
};

onBeforeMount(async () => {
  const user = await api.me.get();
  profile.value = user.profile;
  customId.value = user.customId ?? user.id;

  const res = await fetch('https://en.pronouns.page/api/pronouns').then((res) => res.json());
  pronouns.value = Object.values(res)
    .map((pronoun: any) => pronoun.aliases)
    .flat();
});
</script>
