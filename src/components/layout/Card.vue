<template>
  <div class="card">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: fit-content;
  height: max-content;
  background-color: var(--color-body-secundary);
  padding: var(--space-s) var(--space-m);
  border-radius: var(--radius-default);
}
</style>
