<template>
  <div v-click-outside="toggleChat" class="chat">
    <TheChatCloseBtn @click.native="toggleChat()"></TheChatCloseBtn>
    <TheChatMessages></TheChatMessages>
    <TheChatForm></TheChatForm>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

import vClickOutside from 'v-click-outside'

import TheChatCloseBtn from './TheChatCloseBtn.vue';
import TheChatMessages from './TheChatMessages.vue';
import TheChatForm from './TheChatForm.vue';

export default {
  directives: {
    clickOutside: vClickOutside.directive
  },
  components: {
    TheChatCloseBtn,
    TheChatMessages,
    TheChatForm,
  },
  methods: {
    ...mapMutations(['toggleChat', 'dropNewMessages']),
    ...mapActions(['getMessages'])
  },
  created() {
    this.dropNewMessages();
    this.getMessages()
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.chat {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 84px 24px 0 96px;
  font-size: 14px;
  background-color: $main-bg-color;
  opacity: 0.95;
  z-index: 90;
}
</style>
