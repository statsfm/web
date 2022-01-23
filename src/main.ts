import { createApp } from 'vue';
import App from './App.vue';

import router from './router';
import { createPinia } from 'pinia';
import i18n from './i18n';
import clickaway from 'vue3-click-away';
import { createHead } from '@vueuse/head';
import './styling/main.css';

const pinia = createPinia();

createApp(App).use(router).use(pinia).use(i18n).use(clickaway).use(createHead()).mount('#app');
