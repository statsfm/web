<template>
  <div class="divider" />
</template>

<style lang="scss" scoped>
.divider {
  width: 100%;
  display: flex;
  margin: var(--space-xs) 0;
  align-items: center;

  &::before,
  &::after {
    content: "";
    width: 100%;
    height: 1px;
    background: var(--border);
  }
}
</style>
