import { createApp } from "vue";
import App from "./App.vue";

import router from "./router";
import store, { key } from "./store";
import "./styling/main.scss";
import "./styling/main.css";

createApp(App).use(router).use(store, key).mount("#app");
