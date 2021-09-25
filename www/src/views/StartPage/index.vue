<template>
  <div class="page" @click="start" :class="!status ? 'pointer' : ''">
    <TheHeader></TheHeader>
    <main>
      <div class="content">
        <div class="container">
          <div class="content-wrapper">
            <AppGameboard></AppGameboard>
            <div class="promt-ready-wrapper">
              <AppPromt
                v-if="placesLength === 10 && !game.meReady"
                class="promt-active promt-clickable"
                @click.native="ready"
              >
                Все готово, адмирал! Начать игру!
              </AppPromt>
              <AppPromt v-if="game.meReady">
                Ждем готовности противника!
              </AppPromt>
            </div>
            <TheNav v-if="status === '1'"></TheNav>
          </div>
        </div>
      </div>
    </main>
    <AppPromt v-if="!status" class="promt-active promt-clickable">
      Для начала, расставь корабли, каналья!
    </AppPromt>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';

import { api } from '@/api';

import AppGameboard from './AppGameboard.vue';
import TheNav from './TheNav.vue';
import AppPromt from '@/components/AppPromt.vue';

import { ROUTES } from '@/router';

export default {
  components: {
    AppGameboard,
    AppPromt,
    TheNav,
  },
  data() {
    return {
      timerId: 0,
    };
  },
  methods: {
    ...mapMutations(['dropGameInfo', 'showLoader', 'hideLoader']),
    ...mapActions(['getStatus']),
    async start() {
      if (this.status) {
        return;
      }

      const { id, code } = await api.start();

      this.$router.push({
        name: ROUTES.Start,
        params: { id, code },
      });

      this.getStatus();
    },
    async ready() {
      const id = this.$route.params.id;
      const code = this.$route.params.code;

      const result = await api.ready(id, code);

      if (await result.enemyReady) {
        this.redirectToBattle();
      } else {
        await this.getStatus();
        this.timerId = setInterval(this.getStatus, 5000);
      }
    },
    redirectToBattle() {
      this.$router.push({
        name: ROUTES.Battle,
        params: { id: this.$route.params.id, code: this.$route.params.code },
      });
    },
  },
  computed: {
    ...mapState(['game', 'apiError']),
    ...mapState({
      status: (state) => state.game.status,
    }),
    ...mapGetters(['placesLength']),
  },
  watch: {
    status(status) {
      if (status === '2') {
        clearTimeout(this.timerId);
        this.redirectToBattle();
      }
    },
    apiError(err) {
      if (err === 102) {
        this.$router.go(-1);
      }
    },
  },
  created() {
    if (this.$route.params.id && this.$route.params.code) {
      this.showLoader();
      this.getStatus().finally(() => {
        if (this.game.status === '1') {
          this.hideLoader();
        }
      });
    } else if (this.game.status === '3') {
      this.dropGameInfo();
    }
  },
};
</script>

<style lang="scss" scoped>
main {
  .gameboard {
    padding-left: 460px;
  }

  .promt-ready-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    height: 84px;
    margin-top: 50px;

    .promt {
      position: static;
      transform: none;
    }
  }
}

.pointer {
  cursor: pointer;
}
</style>
