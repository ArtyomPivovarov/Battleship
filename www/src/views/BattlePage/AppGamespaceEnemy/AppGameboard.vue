<template>
  <div class="gameboard">
    <AppAxisHorizon></AppAxisHorizon>
    <AppAxisVertical></AppAxisVertical>
    <div class="battlefield">
      <grid-layout
        :layout.sync="marks"
        :col-num="10"
        :col-width="46"
        :row-height="46"
        :max-rows="10"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="false"
        :margin="[1, 1]"
        :use-css-transforms="true"
        :auto-size="false"
      >
        <grid-item
          v-for="item in marks"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <AppMark :type="item.type"></AppMark>
        </grid-item>
      </grid-layout>
      <grid-layout
        :class="'layout-aim'"
        :layout.sync="layout"
        :col-num="10"
        :col-width="46"
        :row-height="46"
        :max-rows="10"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="false"
        :margin="[1, 1]"
        :use-css-transforms="true"
        :auto-size="false"
      >
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
          @click.native="shot(item, $event)"
        >
          <div class="item" :class="!game.myTurn ? 'aim-disable' : ''"></div>
        </grid-item>
      </grid-layout>
    </div>
    <AppWarning v-if="moveWarning" :x="warningCoords.x" :y="warningCoords.y">
      Не ваш ход
    </AppWarning>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import VueGridLayout from 'vue-grid-layout';
import AppAxisHorizon from '@/components/AppGameboard/AppAxisHorizon.vue';
import AppAxisVertical from '@/components/AppGameboard/AppAxisVertical.vue';
import AppMark from '@/components/AppGameboard/AppMark.vue';
import AppWarning from '@/components/AppGameboard/AppWarning.vue';

import { api } from '@/api';

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    AppAxisHorizon,
    AppAxisVertical,
    AppMark,
    AppWarning,
  },
  data() {
    return {
      marks: [],
      layout: [],
      moveWarning: false,
      warningCoords: {
        x: 0,
        y: 0,
      },
    };
  },
  methods: {
    ...mapActions(['getStatus']),
    layoutPlaceholder() {
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          this.layout.push({ x: j, y: i, w: 1, h: 1, i: `${i}${j}` });
        }
      }
    },
    placeMarks(fields) {
      if (!fields.length) {
        return;
      }

      fields.forEach((col, colIndex) => {
        col.forEach((item, itemIndex) => {
          const x = colIndex;
          const y = itemIndex;

          if (item[1]) {
            if (this.marks.some((mark) => mark.i === `${x}${y}`)) {
              return;
            }

            this.marks.push({
              x,
              y,
              w: 1,
              h: 1,
              i: `${x}${y}`,
              type: item[0] === 'empty' ? 'miss' : 'hit',
            });
          }
        });
      });
    },
    async shot(item, event) {
      if (this.game.status === '3') {
        return;
      }

      if (!this.game.myTurn) {
        this.moveWarning = false;

        this.warningCoords.x = event.clientX;
        this.warningCoords.y = event.clientY;

        setTimeout(() => (this.moveWarning = true), 0);
        this.timerIdWarning = setTimeout(
          () => (this.moveWarning = false),
          2000
        );

        return;
      }

      const data = new FormData();
      data.append('x', item.x);
      data.append('y', item.y);

      const id = this.$route.params.id;
      const code = this.$route.params.code;

      await api.shot(id, code, data);

      await this.getStatus();
    },
  },
  computed: {
    ...mapState(['fieldEnemy', 'game']),
  },
  watch: {
    fieldEnemy(fields) {
      this.placeMarks(fields);
    },
  },
  created() {
    this.layoutPlaceholder();
  },
};
</script>

<style land="scss" scoped>
.aim-disable {
  filter: grayscale(1) invert(1);
}
</style>
