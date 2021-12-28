<template>
  <div class="loader">
    <div class="loading"></div>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  height: 100px;
  width: 100px;
  display: grid;
  place-items: center;
}

.loading {
  color: var(--color-primary);
  position: relative;
  font-size: 11px;
}

.loading,
.loading::before,
.loading::after {
  background: var(--color-primary);
  animation: load 1.05s infinite ease-in-out;
  border-radius: 10px;
  width: 1em;
  height: 4em;
}

.loading:before,
.loading:after {
  position: absolute;
  content: '';
}

.loading:before {
  left: -1.5em;
  animation-delay: -0.32s;
}

.loading:after {
  left: 1.5em;
  animation-delay: -0.12s;
}

@keyframes load {
  0%,
  80%,
  100% {
    box-shadow: 0 0;
    height: 3em;
  }
  40% {
    box-shadow: 0 -2em;
    height: 4em;
  }
}
</style>
