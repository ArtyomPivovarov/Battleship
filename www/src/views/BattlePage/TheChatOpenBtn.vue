<template>
  <div class="chat-open-wrapper">
    <div class="container">
      <div @click="toggleChat()" class="chat-open active-el">
        <div class="text">
          <span>ЧАТ</span>
        </div>
        <div class="notice">
          <div class="icon">
            <img src="~@/assets/images/chat-icon.svg" alt />
          </div>
          <div v-show="newMessages && !chatOpen" class="message-count">
            <span>{{ newMessages }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations(['toggleChat']),
  },
  computed: {
    ...mapState(['chatOpen', 'newMessages']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.chat-open {
  display: flex;
  max-width: 80px;
  margin-top: 12px;
  font-weight: 900;
  font-size: 13px;
  user-select: none;

  .text {
    margin-right: 12px;
  }

  .notice {
    display: flex;

    .icon {
      margin-top: 4px;
    }
  }

  .message-count {
    margin-left: -7px;
    margin-top: -3px;
    left: 0;
    width: 19px;
    height: 19px;
    line-height: 20px;
    text-align: center;
    background-color: $yellow;
    color: $black-on-yellow;
    border-radius: 10px;
    
    span {
      border-bottom: none;
    }
  }
}
</style>
