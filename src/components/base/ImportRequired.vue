<template>
  <span class="text-l" v-if="user?.isPlus == undefined">
    <Link to="" @click="auth.login()" class="" href="#">Login</Link> to view this
  </span>
  <span class="text-l" v-else-if="user?.isPlus == true && user.hasImported == false">
    Import your streaming history with to view this
  </span>
  <span class="text-l" v-else-if="user?.isPlus == false">
    Import your streaming history with Spotistats Plus to view this
  </span>
  <slot v-else />
</template>

<script lang="ts" setup>
import { useUser, useAuth } from '~/hooks';
import Link from './Link.vue';

const user = useUser();
const auth = useAuth();
</script>
