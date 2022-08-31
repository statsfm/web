<template>
  <div>
    <div class="fixed left-0 top-0 right-0 bottom-0 min-h-screen min-w-screen bg-black bg-opacity-70 z-50 pt-[30vh] text-white text-center text-xl" v-if="loading">Loading...</div>
    <h1 class="mb-4">Account info</h1>
    <div v-if="user != undefined">
      <div class="relative rounded-xl overflow-hidden">
        <img class="relative rounded-xl w-60 h-60" :src="imagePreview" alt="" />
        <label
          for="desktop-image"
          class="absolute inset-0 w-60 h-60 bg-black bg-opacity-75 flex items-center justify-center text-sm font-medium text-white opacity-0 hover:opacity-100 focus-within:opacity-100"
        >
          <span>Change</span>
          <span class="sr-only"> ad image</span>
          <input
            type="file"
            id="desktop-image"
            name="image"
            ref="image"
            @change="updatePreview"
            class="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-xl"
            accept="image/jpg,image/png,image/gif"
          />
        </label>
        <span class="text-white">^ click the image to change (and make sure to hit save)</span>
      </div>

      <br>

      <div class="">
        <Input
          name="displayName"
          label="Display name"
          :value="user.displayName"
          maxlength="15"
          @input="updateDisplayName"
        />
      </div>

      <br>

      <div class="md:items-between flex flex-col md:flex-row md:gap-5">
        <div class="flex w-full flex-col md:w-6/12">
          <Input
            name="customUrl"
            label="Custom url"
            :value="user.customId"
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

      <div
        v-if="user?.profile && pronouns"
        class="md:items-between flex flex-col md:flex-row md:gap-5"
      >
        <select name="pronouns" id="pronouns" v-model="user.profile.pronouns">
          <option :value="null">None</option>
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
        :value="user.profile?.bio"
      @input="(val) => (user!.profile!.bio = val)"
      />

      <br />

      <Button size="small" class="" @click="save">Save</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';
import * as statsfm from '@statsfm/statsfm.js';
import { onBeforeMount, Ref, ref } from 'vue';
import Button from '~/components/base/Button.vue';
import Icon from '~/components/base/Icon.vue';
import Input from '~/components/base/Input/Input.vue';
import Textarea from '~/components/base/Textarea/Textarea.vue';
import { useApi } from '~/hooks';
import { useStore } from '~/store';

const api = useApi();
const store = useStore();
const user: Ref<statsfm.UserPrivate | undefined> = ref();
const customIdAvailable: Ref<boolean> = ref(true);
const pronouns: Ref<string[] | undefined> = ref();
const image = ref();
const imagePreview = ref();
const loading = ref(false);

const save = async () => {
  if (!user.value) return;
  
  try {
    loading.value = true;
    await api.me.updateProfile(user.value.profile!);
    await api.me.updateMe(user.value);
    await uploadImage();
  } catch(e) {
    alert(JSON.stringify(e));
  } finally { 
    loading.value = false;
  }
};

const checkAvailability = async (customId: string) => {
  user.value!.customId = customId;
  if (!customId) return;
  customIdAvailable.value = await api.me.customIdAvailable(customId);
};

const uploadImage = async (): Promise<string> => {
  const files = image.value!['files'];

  if (files.length == 0) return user.value!.image;

  const formData = new FormData();
  formData.append('file', files[0]);

  const { url } = (
    await api.http.post('/me/image', {
      body: formData,
      headers: {
        'Content-Type': null!
      }
    })
  ).data as { url: string };

  user.value!.image = url;

  return url;
};


const updatePreview = async () => {
  const file = image.value?.files[0];
  if (file) {
    imagePreview.value = URL.createObjectURL(file);
  }
};


// dit zou niet eens moeten maar we zijn toch bezig met next dus ff quick n dirty
const updateDisplayName = async (val) => {
  user.value!.displayName = val;
};


onBeforeMount(async () => {
  user.value = await api.me.get();

  imagePreview.value = user.value!.image;

  const res = await fetch('https://en.pronouns.page/api/pronouns').then((res) => res.json());
  pronouns.value = Object.values(res)
    .map((pronoun: any) => pronoun.aliases)
    .flat();
});
</script>
