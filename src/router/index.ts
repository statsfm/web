import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/auth:route(.*)',
    name: 'AuthCallback',
    component: () => import('../pages/Auth/AuthCallback.vue')
  },
  {
    path: '/gift',
    name: 'Gift',
    component: () => import('../pages/Gift/Gift.vue')
  },

  {
    path: '/gift/success',
    name: 'Success',
    component: () => import('../pages/Gift/Success.vue')
  },
  {
    path: '/redeem',
    name: 'Redeem',
    component: () => import('../pages/Redeem/Redeem.vue')
  },
  {
    path: '/redeem/:code',
    name: 'RedeemCode',
    component: () => import('../pages/Redeem/RedeemCode.vue')
  },
  {
    path: '/import',
    name: 'Import',
    component: () => import('../pages/Import/Import.vue')
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../pages/User.vue')
  },
  {
    path: '/artist/:id/:slug?',
    name: 'Artist',
    component: () => import('../pages/Artist.vue')
  },
  {
    path: '/:route(.*)',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
