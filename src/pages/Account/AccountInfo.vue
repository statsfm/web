<template>
  <div>
    <h1 class="mb-4">Account info</h1>

    <Input
      name="customUrl"
      label="Custom url"
      :value="user.id"
      prefix="https://stats.fm/"
      :validation="!isCustomUrlAvailable ? 'Custom url not available' : null"
      @input="checkCustomUrlAvailability"
    />

    <br />

    <Textarea
      name="about"
      label="About"
      description="Brief description for your profile (max 512 characters)"
      maxlength="512"
      rows="3"
      placeholder="Something about yourself..."
    />

    <br />

    <Button size="small" class="" @click="alert('not implemented yet')">Save</Button>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Button from '~/components/base/Button.vue';
import { useApi, useUser } from '~/hooks';
import { useStore } from '~/store';
import Input from '~/components/base/Input/Input.vue';
import Textarea from '~/components/base/Textarea/Textarea.vue';

const api = useApi();
const store = useStore();
const user = useUser();
const isCustomUrlAvailable = ref(true);

onMounted(async () => {
  const _user = await api.me.get();
  store.setUser(_user);
});

// TODO: netter ofzo
const checkCustomUrlAvailability = (e: string) => {
  // mock custom url validation
  if (e === 'sjoerdgaatwakawaka') {
    isCustomUrlAvailable.value = false;
    return;
  }

  isCustomUrlAvailable.value = true;
};
</script>
