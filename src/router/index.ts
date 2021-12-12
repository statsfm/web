import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/gift",
    name: "Gift",
    component: () => import("../pages/Gift.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
