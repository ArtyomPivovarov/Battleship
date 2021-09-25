import Vue from 'vue';
import Vuex from 'vuex';

import router from '@/router';

import { api } from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    game: {
      status: '',
      id: '',
      invite: '',
      meReady: false,
      myTurn: false,
    },
    fieldMy: {},
    fieldEnemy: {},
    usedPlaces: [],
    messages: [],
    newMessages: 0,
    lastTime: '',
    apiError: 0,
    chatOpen: false,
    showLoader: false,
  },
  getters: {
    placesLength(state) {
      return state.usedPlaces ? state.usedPlaces.length : 0;
    },
  },
  mutations: {
    updateStatus(state, parameters) {
      if (parameters.success) {
        state.game.status = parameters.game.status;
        state.game.id = parameters.game.id;
        state.game.invite = parameters.game.invite;
        state.game.meReady = parameters.game.meReady;
        state.game.myTurn = parameters.game.myTurn;
        state.fieldMy = parameters.fieldMy;
        state.fieldEnemy = parameters.fieldEnemy;
        state.usedPlaces = parameters.usedPlaces;
      }

      if (!parameters.success) {
        state.apiError = parameters.error;
      } else {
        state.apiError = 0;
      }
    },
    dropGameInfo(state) {
      state.game = {
        status: '',
        id: '',
        invite: '',
        meReady: false,
        myTurn: false,
      };
      state.fieldMy = {};
      state.fieldEnemy = {};
      state.usedPlaces = [];
      state.messages = [];
      state.newMessages = 0;
      state.lastTime = '';
      state.apiError = 0;
      state.chatOpen = false;
    },
    pushMessages(state, messages) {
      state.messages.push(...messages);
    },
    updateLastTime(state, time) {
      state.lastTime = time;
    },
    updateNewMessages(state, amount) {
      if (!state.chatOpen) {
        state.newMessages += amount;
      }
    },
    dropNewMessages(state) {
      state.newMessages = 0;
    },
    toggleChat(state) {
      state.chatOpen = !state.chatOpen;
    },
    showLoader(state) {
      state.showLoader = true;
    },
    hideLoader(state) {
      state.showLoader = false;
    },
  },
  actions: {
    async getStatus({ commit }) {
      const id = router.currentRoute.params.id;
      const code = router.currentRoute.params.code;

      const result = await api.status(id, code);
      commit('updateStatus', result);
    },
    async getMessages({ state, commit }) {
      const id = router.currentRoute.params.id;
      const code = router.currentRoute.params.code;

      const result = await api.chatLoad(id, code, state.lastTime);

      if (state.lastTime) {
        commit(
          'updateNewMessages',
          result.messages.filter((message) => !message.my).length
        );
      }

      if (result.messages.length) {
        commit('pushMessages', result.messages);
        commit('updateLastTime', result.lastTime);
      }
    },
  },
  modules: {},
});
