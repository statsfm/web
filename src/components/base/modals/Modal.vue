<template>
  <div class="overlay">
    <div class="modal">
      <Container>
        <slot />
      </Container>
    </div>
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

.modal {
  width: max-content;
  background-color: var(--color-body-secundary);
  padding: var(--space-s);
  height: max-content;
  border-radius: var(--radius-default);
  z-index: 9999;
  animation-name: fade-in;
  animation-duration: 0.3s;
}

@media screen and (max-width: 850px) {
  .popup {
    width: 100%;
    position: fixed;
    bottom: 0;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    animation-name: fade-up;
  }
}

@keyframes fade-up {
  from {
    transform: translate3d(0, 50px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import Container from "~/components/layout/Container.vue";

export default defineComponent({
  components: {
    Container,
  },
  // emits: ["hide"],
  // setup(props, { emit }) {
  //   const hide = (e: Event) => {
  //     emit("hide", e);
  //   };

  //   return { hide };
  // },
});
</script>
