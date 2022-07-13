import { defineComponent } from 'vue';

// hooks
import { useRoute } from 'vue-router';

// components
import { RouterView } from 'vue-router';
import Footer from './components/layout/Footer.vue';
import Toaster from './components/base/Toaster/Toaster.vue';

const App = defineComponent(() => {
  const route = useRoute();

  return () => (
    <>
      <RouterView key={route.path} />
      <Footer />
      <Toaster />
    </>
  );
});

export default App;
