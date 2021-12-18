import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store, { key } from "./store";
import i18n from "./i18n";
import "./styling/main.scss";
import "./styling/main.css";

createApp(App).use(router).use(store, key).use(i18n).mount("#app");
