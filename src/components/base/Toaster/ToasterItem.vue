<template>
  <Card
    v-if="isActive"
    class="font-bold text-center animate-fade"
    :class="{
      'text-[#fc5353]': error.type == 'error',
      'text-[wite]': error.type == 'info',
    }"
    >{{ error.message }}</Card
  >
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";

import Card from "~/components/layout/Card.vue";
import { Error } from "~/types";

export default defineComponent({
  components: {
    Card,
  },
  props: {
    error: {
      type: Object as PropType<Error>,
      required: true,
    },
  },
  setup() {
    let isActive = ref(true);

    onMounted(() => {
      setTimeout(() => {
        isActive.value = false;
      }, 5000);
    });

    return { isActive };
  },
});
</script>
