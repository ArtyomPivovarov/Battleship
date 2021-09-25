<template>
  <header>
    <div class="container">
      <div class="header-wrapper">
        <div class="logo">
          <div class="title">
            <span>Sea battle</span>
          </div>
          <div class="subtitle">
            <span>epic</span>
          </div>
        </div>
        <div class="invite" v-if="game.status === '1'">
          <div class="text">
            <span>Пригласить к себе</span>
          </div>
          <div @click="copyLink()" class="icon active-el">
            <img src="~@/assets/images/header/copy.svg" alt="copy" />
          </div>
          <div class="link active-el">
            <a ref="inviteLink" :href="inviteLink">{{ inviteLink }}</a>
          </div>
        </div>
        <div v-if="game.status === '3'" class="new-game">
          <router-link to="/" tag="button">
            Новая игра
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
  methods: {
    async copyLink() {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(this.inviteLink);
      } else {
        // Edge
        const prevFocusEl = document.activeElement;
        const input = document.createElement('input');

        input.style.position = 'fixed';
        input.style.top = '0';
        input.style.left = '0';
        input.style.width = '2em';
        input.style.height = '2em';
        input.style.padding = '0';
        input.style.border = 'none';
        input.style.outline = 'none';
        input.style.boxShadow = 'none';
        input.style.background = 'transparent';

        input.value = this.inviteLink;
        document.body.appendChild(input);
        input.focus();
        input.select();

        document.execCommand('copy');

        document.body.removeChild(input);

        prevFocusEl.focus();
      }
    },
  },
  computed: {
    ...mapState(['game']),
    inviteLink() {
      return `${location.host}/placement/${this.game.id}/${this.game.invite}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.header-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-top: 24px;
  user-select: none;

  .logo {
    .title {
      font-size: 32px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .subtitle {
      text-align: right;
      font-size: 17px;
      font-style: italic;
    }
  }

  .invite {
    display: flex;
    align-items: flex-end;
    font-weight: 300;

    .icon {
      height: 30px;
      margin: 0 20px 0 16px;
    }

    .link a {
      user-select: auto;

      &,
      &:visited {
        text-decoration: none;
        color: $deep-blue;
      }
    }
  }

  .new-game {
    .router-link-active {
      padding: 10px 35px;
      background-color: $yellow;
      border-radius: 30px;
      font-size: 18px;
      font-weight: 500;
      border: 1px solid transparent;
      cursor: pointer;

      &:focus {
        outline: none
      }
    }
  }
}
</style>
