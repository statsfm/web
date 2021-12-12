<template>
  <div class="badge">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.badge {
  background-color: var(--primary-button-bg);
  color: var(--primary-button-text);
  padding: var(--space-xxs) var(--space-xs);
  border-radius: var(--radius-small);
  width: max-content;
  font-size: var(--size-s);
  font-weight: var(--weight-semi-bold);
  user-select: none;
}
</style>
