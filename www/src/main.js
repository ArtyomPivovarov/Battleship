import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'normalize.css';
import '@/assets/styles/main.scss';

import TheHeader from './components/TheHeader.vue';
Vue.component('TheHeader', TheHeader);

import AppShip from './components/AppGameboard/AppShip.vue';
Vue.component('AppShip', AppShip);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
