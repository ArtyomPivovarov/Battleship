<template>
  <div class="page">
    <TheHeader></TheHeader>
    <TheChatOpenBtn @click="toggleChat"></TheChatOpenBtn>
    <main>
      <div class="content">
        <div class="container">
          <div class="content-wrapper">
            <div class="game-spaces">
              <AppGamespaceYour></AppGamespaceYour>
              <AppGamespaceEnemy></AppGamespaceEnemy>
            </div>
          </div>
        </div>
      </div>
    </main>
    <TheChat v-if="chatOpen"></TheChat>
    <AppPromt v-if="winner" v-click-outside="closePromt" class="promt-active">
      Иван Фёдорович, вы одержали очередную победу!
    </AppPromt>
    <AppPromt v-if="loser" v-click-outside="closePromt" class="promt-active">
      Вы проиграли битву, но не войну
    </AppPromt>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

import vClickOutside from 'v-click-outside';

import AppGamespaceYour from './AppGamespaceYour';
import AppGamespaceEnemy from './AppGamespaceEnemy';
import TheChatOpenBtn from './TheChatOpenBtn.vue';
import TheChat from './TheChat';
import AppPromt from '@/components/AppPromt.vue';

export default {
  directives: {
    clickOutside: vClickOutside.directive,
  },
  components: {
    AppGamespaceYour,
    AppGamespaceEnemy,
    TheChatOpenBtn,
    TheChat,
    AppPromt,
  },
  data() {
    return {
      timerIdSts: 0,
      timerIdMsg: 0,
      isPromtClosed: false,
    };
  },
  methods: {
    ...mapMutations(['toggleChat', 'showLoader', 'hideLoader']),
    ...mapActions(['getStatus', 'getMessages']),
    closePromt() {
      this.isPromtClosed = true;
    },
  },
  computed: {
    ...mapState(['game', 'chatOpen', 'apiError']),
    winner() {
      return (
        this.game.status === '3' && this.game.myTurn && !this.isPromtClosed
      );
    },
    loser() {
      return (
        this.game.status === '3' && !this.game.myTurn && !this.isPromtClosed
      );
    },
  },
  watch: {
    apiError(err) {
      if (err === 102) {
        this.$router.go(-1);
      }
    },
  },
  created() {
    this.showLoader();

    this.getStatus()
      .then(() => {
        if (this.game.status === '1') {
          this.$router.go(-1);
        }
      })
      .finally(() => {
        if (!this.apiError) {
          this.hideLoader();
        }
      });
    this.timerIdSts = setInterval(() => this.getStatus(), 5000);

    this.getMessages();
    this.timerIdMsg = setInterval(() => this.getMessages(), 5000);
  },
  beforeDestroy() {
    clearInterval(this.timerIdMsg);
    clearInterval(this.timerIdSts);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.game-spaces {
  display: flex;
}

.game-space:first-child {
  margin-right: 96px;
}
</style>
