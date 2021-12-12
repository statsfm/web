<template>
  <div class="overlay">
    <div class="loader"></div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation-duration: 0.3s;
  animation-fill-mode: both;
  animation-name: fade;
  cursor: pointer;
}

.loader {
  color: var(--color-primary);
  position: relative;
  font-size: 11px;
}

.loader,
.loader::before,
.loader::after {
  background: var(--color-primary);
  animation: load 1.05s infinite ease-in-out;
  border-radius: 10px;
  width: 1em;
  height: 4em;
}

.loader:before,
.loader:after {
  position: absolute;
  content: "";
}

.loader:before {
  left: -1.5em;
  animation-delay: -0.32s;
}

.loader:after {
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
