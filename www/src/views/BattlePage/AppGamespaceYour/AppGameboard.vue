<template>
  <div class="gameboard">
    <AppAxisHorizon></AppAxisHorizon>
    <AppAxisVertical></AppAxisVertical>
    <div class="battlefield">
      <grid-layout
        :layout.sync="ships"
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
          v-for="item in ships"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <AppShip :width="item.w" :height="item.h"></AppShip>
        </grid-item>
      </grid-layout>
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
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import VueGridLayout from 'vue-grid-layout';
import AppAxisHorizon from '@/components/AppGameboard/AppAxisHorizon.vue';
import AppAxisVertical from '@/components/AppGameboard/AppAxisVertical.vue';
import AppMark from '@/components/AppGameboard/AppMark.vue';

import { SHIPS_INIT } from '@/shipsInit';

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    AppAxisHorizon,
    AppAxisVertical,
    AppMark,
  },
  data() {
    return {
      ships: SHIPS_INIT.map((ship) => Object.assign({}, ship)),
      marks: [],
    };
  },
  methods: {    
    ...mapActions(['getStatus']),
    placeShips(fields) {
      if (!fields.length) {
        return;
      }

      const placedShips = [];

      fields.forEach((col, colIndex) => {
        col.forEach((item, itemIndex) => {
          const x = colIndex;

          const y = itemIndex;

          if (item[0] !== 'empty') {
            if (!placedShips.includes(item[0])) {
              const ship = this.ships.find((ship) => ship.i === item[0]);

              ship.x = x;
              ship.y = y;

              const decks = col.filter((item) => item[0] === ship.i).length;
              ship.h = decks;
              if (decks === 1) {
                ship.w = parseInt(item[0][0], 10);
              } else {
                ship.w = 1;
              }

              placedShips.push(ship.i);
            }
          }
        });
      });
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
  },
  computed: {
    ...mapState(['fieldMy']),
  },
  created() {
    this.getStatus().then(() => {
      this.placeShips(this.fieldMy);
    })
  },
  watch: {
    fieldMy(fields) {
      this.placeMarks(fields)
    },
  },
};
</script>

<style></style>
