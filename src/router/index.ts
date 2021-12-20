import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Home",
    component: () => import("../pages/Home.vue"),
  },
  {
    path: "/auth:route(.*)",
    name: "Auth",
    component: () => import("../pages/Auth.vue"),
  },
  {
    path: "/gift",
    name: "Gift",
    component: () => import("../pages/Gift.vue"),
  },
  {
    path: "/gift/success",
    name: "Success",
    component: () => import("../pages/Gift/Success.vue"),
  },
  {
    path: "/redeem",
    name: "Redeem",
    component: () => import("../pages/Redeem/Redeem.vue"),
  },
  {
    path: "/redeem/:code",
    name: "RedeemCode",
    component: () => import("../pages/Redeem/RedeemCode.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
