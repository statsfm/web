import NProgress from 'nprogress';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/terms',
    name: 'Terms & Conditions',
    component: () => import('../pages/Terms.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy Policy',
    component: () => import('../pages/Privacy.vue')
  },
  {
    path: '/auth:route(.*)',
    name: 'AuthCallback',
    component: () => import('../pages/Auth/AuthCallback.vue')
  },
  {
    path: '/gift',
    name: 'Gift',
    component: () => import('../pages/Gift/Gift.vue'),
    children: [
      {
        path: '/gift/:code',
        name: 'GiftCoupon',
        component: () => import('../pages/Gift/GiftCoupon.vue')
      }
    ]
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

const router = createRouter({
  history: createWebHistory(),
  routes
});

NProgress.configure({
  template: '<div class="fixed z-59 top-0 left-0 w-full h-0.5 bg-primary" role="bar"></div>'
});

router.beforeEach(() => {
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
