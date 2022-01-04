<template>
  <div
    class="bg-bodySecundary rounded-full bg-cover bg-center aspect-square"
    :class="`w-${size}`"
    :style="{ backgroundImage: `url(${src})` }"
    href="#"
  ></div>
</template>

<script lang="ts" setup>
interface Props {
  size: string;
  src: string;
}

withDefaults(defineProps<Props>(), {
  size: '12'
});
</script>
