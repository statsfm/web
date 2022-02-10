<template>
  <div>
    <h1>Privacy</h1>
    <br />
    <PrivacySettings />
    <br />
    <DeleteData />
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import Divider from '~/components/base/Divider.vue';
import { useApi, useAuth } from '~/hooks';
import DeleteData from './DeleteData.vue';
import PrivacySettings from './PrivacySettings.vue';

const auth = useAuth();
const api = useApi();

onMounted(async () => {});
</script>
