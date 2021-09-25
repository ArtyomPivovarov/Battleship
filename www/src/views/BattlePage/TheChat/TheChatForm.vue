<template>
  <div class="form">
    <form @submit.prevent="sendMessage">
      <div class="input">
        <textarea
          v-model.trim="message"
          @keyup.ctrl.enter="sendMessage"
          placeholder="написать в чат..."
          maxlength="250"
        ></textarea>
      </div>
      <div class="send-btn">
        <button class="active-el" type="submit">Отправить</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { api } from '@/api';

export default {
  data() {
    return {
      message: '',
    };
  },
  methods: {
    ...mapActions(['getMessages']),
    async sendMessage() {
      const data = new FormData();
      data.append('message', this.message);

      const id = this.$route.params.id;
      const code = this.$route.params.code;

      this.message = '';

      await api.chatSend(id, code, data);
      await this.getMessages();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.form {
  .input {
    margin-top: 50px;

    textarea {
      width: 100%;
      height: 90px;
      padding: 20px 20px;
      resize: none;
      outline: none;
      color: #979898;
      background-color: transparent;

    }
  }

  .send-btn {
    margin-top: 5px;

    button {
      padding: 12px 28px;
      font-weight: 900;
      background-color: $yellow;
      border: none;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.08rem;
    }
  }
}
</style>
