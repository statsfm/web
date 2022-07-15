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
    name: 'Terms',
    component: () => import('../pages/Terms.vue')
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('../pages/Privacy.vue')
  },
  {
    path: '/beta',
    name: 'Beta',
    component: () => import('../pages/Beta.vue')
  },
  {
    path: '/auth:route(.*)',
    name: 'AuthCallback',
    component: () => import('../pages/Auth/AuthCallback.vue')
  },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../pages/Account/Account.vue'),
    children: [
      {
        path: '',
        name: 'AccountInfo',
        component: () => import('../pages/Account/AccountInfo.vue')
      },
      {
        path: '/account/connections',
        name: 'AccountConnections',
        component: () => import('../pages/Account/AccountConnections.vue')
      },
      {
        path: '/account/privacy',
        name: 'AccountPrivacy',
        component: () => import('../pages/Account/AccountPrivacy.vue')
      }
    ]
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
    path: '/artist/:id/:slug?',
    name: 'Artist',
    component: () => import('../pages/Artist')
  },
  {
    path: '/track/:id/:slug?',
    name: 'Track',
    component: () => import('../pages/Track.vue')
  },
  {
    path: '/album/:id/:slug?',
    name: 'Album',
    component: () => import('../pages/Album.vue')
  },
  {
    path: '/genre/:tag',
    name: 'Genre',
    component: () => import('../pages/Genre.vue')
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../pages/Search.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../pages/NotFound.vue')
  },
  {
    path: '/:userId',
    name: 'User',
    component: () => import('../pages/User')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 };
  }
});

NProgress.configure({
  template: '<div class="fixed z-59 top-0 left-0 w-full h-0.5 bg-primary" role="bar"></div>'
});

router.beforeEach(() => {
  // const processStore = useStore(pinia ); // <-- passing Pinia instance directly
  NProgress.start();
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
