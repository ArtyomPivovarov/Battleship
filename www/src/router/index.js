import Vue from 'vue';
import VueRouter from 'vue-router';

import StartPage from '@/views/StartPage';

import store from '@/store';

Vue.use(VueRouter);

export const ROUTES = {
  Start: 'Start',
  Battle: 'Battle',
  NotFound: 'NotFound',
};

const routes = [
  {
    path: '/placement/:id?/:code?',
    alias: '/',
    name: ROUTES.Start,
    component: StartPage,
  },
  {
    path: '/game/:id/:code',
    name: ROUTES.Battle,
    component: () => import('@/views/BattlePage'),
  },
  {
    path: '*',
    name: ROUTES.NotFound,
    component: () => import('@/views/NotFoundPage'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (
    to.name === ROUTES.Start &&
    from.name === ROUTES.Battle &&
    to.params.id === from.params.id &&
    to.params.code === from.params.code &&
    store.state.game.status === '2'
  ) {
    next(false);
  } else {
    next();
  }
});

export default router;
