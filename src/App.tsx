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
      <div style={"z-index: 100; top: 0; left:0; width: 100vw; height: 100vh; position: fixed; background-color: rgba(0,0,0,0.5); text-align: center; color: #fff; padding-top: 30vh;"}> 
        <h1 style={"font-size: 3rem;"}>Down for maintenance</h1>
        <br />
        <h1 style={"font-size: 2rem;"}>Please try again later :)<br/>I'm currently upgrading the infrastructure to grow to even more users and make the app faster. Please bear with me as this can take a few hours...<br/><br/>^Sjoerd</h1>
      </div>
      <RouterView key={route.path} />
      <Footer />
      <Toaster />
    </>
  );
});

export default App;
