<template>
  <div>
    <h1>Privacy</h1>
    <br />
    <PrivacySettings />
    <br />
    <h1>Danger zone</h1>
    <br />
    <div class="border border-red-500 rounded-xl p-5">
      <DeleteData />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DeleteData from './DeleteData.vue';
import PrivacySettings from './PrivacySettings.vue';
</script>
