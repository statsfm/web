import { ref, onMounted, onUnmounted } from 'vue'

export const useActiveElement = () => {
  const active = ref(document.activeElement);

  onMounted(() => {
    document.addEventListener('focusin', () => (active.value = document.activeElement));
  });

  onUnmounted(() => {
    document.removeEventListener('focusin', () => (active.value = document.activeElement));
  });

  return active;
};