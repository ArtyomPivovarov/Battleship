<template>
  <div class="messages" v-chat-scroll>
    <div
      class="message"
      v-for="(message, i) in messages"
      :key="i"
      :class="message.my ? 'your-message' : 'enemy-message'"
    >
      <div class="message-wrapper">
        <div class="text-wrapper">
          <div class="text">
            <span>{{ message.message }}</span>
          </div>
          <div class="circle-wrapper">
            <div class="circle"></div>
          </div>
        </div>
        <div class="time">
          <span>{{ time(message.time) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import dateFormat from 'dateformat';

export default {
  directives: {
    'chat-scroll': {
      inserted: (el) => {
        el.scrollTop = el.scrollHeight;
      },
      componentUpdated: (el) => {
        el.scrollTop = el.scrollHeight;
      },
    },
  },
  methods: {
    time(timestamp) {
      const date = new Date(parseInt(timestamp, 10) * 1000);
      return dateFormat(date, 'HH:MM');
    },
  },
  computed: {
    ...mapState(['messages']),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.messages {
  height: 415px;
  width: 350px;
  margin-top: 44px;
  padding: 18px 20px;
  border: 1px solid $grey;
  border-radius: 3px;
  overflow-y: auto;

  .message {
    display: flex;
    word-break: break-word;

    &:not(:first-child) {
      margin-top: 16px;
    }

    .text-wrapper {
      position: relative;
      display: flex;

      .circle-wrapper {
        position: absolute;
        display: flex;
        align-items: flex-end;
        height: 100%;
        width: 7px;

        .circle:after {
          content: '';
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
        }
      }

      .text {
        position: relative;
        white-space: pre-line;
      }
    }

    .time {
      font-size: 12px;
      color: #656565;
    }
  }

  .enemy-message {
    padding-right: 15px;
    color: $red;
    
    .text {
      margin-left: 15px;
    }

    .circle-wrapper {
      left: 0;
    }

    .circle:after {
      background-color: $red;
    }

    .time {
      margin-left: 15px;
    }
  }

  .your-message {
    justify-content: flex-end;
    padding-left: 15px;
    color: $yellow;

    .text {
      margin-right: 15px;
    }

    .circle-wrapper {
      right: 0;
    }

    .circle:after {
      background-color: $yellow;
    }
  }
}
</style>
