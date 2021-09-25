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
        :is-draggable="isDraggable"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="false"
        :preventCollision="true"
        :margin="[1, 1]"
        :use-css-transforms="true"
        :auto-size="false"
        @layout-updated="returnIntersectingShip"
      >
        <grid-item
          v-for="ship in ships"
          :x="ship.x"
          :y="ship.y"
          :w="ship.w"
          :h="ship.h"
          :i="ship.i"
          :key="ship.i"
          @mousedown.native="recordCoords(ship, $event)"
          @mouseup.native="rotateHandler(ship, $event)"
          @move="moveHandler"
          @moved="movedHandler(ship)"
        >
          <AppShip
            :width="ship.w"
            :height="ship.h"
          ></AppShip>
        </grid-item>
      </grid-layout>
      
    </div>
    <AppWarning
        v-if="rotateWarning"
        :x="warningCoords.x"
        :y="warningCoords.y"
      >
        Так повернуть корабль нельзя
      </AppWarning>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import VueGridLayout from 'vue-grid-layout';

import AppAxisHorizon from '@/components/AppGameboard/AppAxisHorizon.vue';
import AppAxisVertical from '@/components/AppGameboard/AppAxisVertical.vue';
import AppWarning from '@/components/AppGameboard/AppWarning.vue';

import { api } from '@/api';

import { SHIPS_INIT } from '@/shipsInit';
import { shipCoords } from '@/functions';

export default {
  props: {},
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    AppAxisHorizon,
    AppAxisVertical,
    AppWarning,
  },
  data() {
    return {
      ships: SHIPS_INIT.map((ship) => Object.assign({}, ship)),
      rotateWarning: false,
      warningCoords: {
        x: 0,
        y: 0,
      },
      timerIdWarning: 0,
    };
  },
  methods: {
    ...mapActions(['getStatus']),
    intersect(item, event) {
      const activeShip = Object.assign({}, item);
      return this.ships.some((ship) => {
        if (activeShip.i === ship.i) {
          return false;
        }

        if (ship.x < 0) {
          return false;
        }

        const shipBanXY = shipCoords(ship, true);
        let activeShipBanXY = shipCoords(activeShip, false);

        if (event === 'rotate') {
          [activeShip.w, activeShip.h] = [activeShip.h, activeShip.w];
          activeShipBanXY = shipCoords(activeShip, false);
          [activeShip.w, activeShip.h] = [activeShip.h, activeShip.w];
        }

        return activeShipBanXY.some((xy) => shipBanXY.includes(xy));
      });
    },
    rotateHandler(ship, event) {
      if (ship.beMoved) {
        ship.beMoved = false;
        return;
      }

      if (ship.x < 0) {
        return;
      }

      if (
        !this.intersect(ship, 'rotate') &&
        !(ship.w > 10 - ship.y || ship.h > 10 - ship.x)
      ) {
        [ship.w, ship.h] = [ship.h, ship.w];

        this.placeShip(ship);
      } else {
        if (this.timerIdWarning) {
          clearTimeout(this.timerIdWarning);
        }
        this.rotateWarning = false;

        this.warningCoords.x = event.clientX;
        this.warningCoords.y = event.clientY;

        setTimeout(() => (this.rotateWarning = true), 0);
        this.timerIdWarning = setTimeout(
          () => (this.rotateWarning = false),
          2000
        );
      }
    },
    moveHandler(i, newX, newY) {
      const ship = Object.assign(
        {},
        this.ships.find((ship) => ship.i === i)
      );
      ship.x = newX;
      ship.y = newY;

      const intersect = this.intersect(ship, 'move');
      const placeholder = document.querySelector('.vue-grid-placeholder');

      if (intersect) {
        placeholder.style.background = 'red';
      } else if (!intersect) {
        placeholder.style.background = '';
      }
    },
    movedHandler(ship) {
      ship.beMoved = true;

      if (this.intersect(ship, 'move')) {
        ship.intersect = true;
        return;
      }

      this.placeShip(ship);
    },
    async placeShip(ship) {
      const data = new FormData();
      data.append('x', ship.x);
      data.append('y', ship.y);
      data.append('ship', ship.i);
      data.append('orientation', ship.w > ship.h ? 'horizontal' : 'vertical');

      const id = this.$route.params.id;
      const code = this.$route.params.code;

      await api.placeShip(id, code, data);
      await this.getStatus();
    },
    returnShips() {
      this.ships.forEach((ship, index) => {
        ship.x = SHIPS_INIT[index].x;
        ship.y = SHIPS_INIT[index].y;
        ship.w = SHIPS_INIT[index].w;
        ship.h = SHIPS_INIT[index].h;
      });
    },
    recordCoords(ship) {
      ship.prevX = ship.x;
      ship.prevY = ship.y;
    },
    returnIntersectingShip() {
      const intersectShip = this.ships.find((ship) => ship.intersect);

      if (!intersectShip) {
        return;
      }

      intersectShip.x = intersectShip.prevX;
      intersectShip.y = intersectShip.prevY;
      intersectShip.intersect = false;
    },
  },
  computed: {
    ...mapState(['game', 'fieldMy']),
    isDraggable() {
      return this.game.status === '1' && !this.game.meReady;
    },
  },
  watch: {
    fieldMy(fields) {
      if (!fields.length) {
        return;
      }

      const placed = [];

      fields.forEach((col, colIndex) => {
        col.forEach((item, itemIndex) => {
          if (item[0] === 'empty' || placed.includes(item[0])) {
            return;
          }

          const ship = this.ships.find((ship) => ship.i === item[0]);

          ship.x = colIndex;
          ship.y = itemIndex;

          const decks = col.filter((item) => item[0] === ship.i).length;
          ship.h = decks;
          if (decks === 1) {
            ship.w = parseInt(item[0][0], 10);
          } else {
            ship.w = 1;
          }

          placed.push(ship.i);
        });
      });

      if (!placed.length) {
        this.returnShips();
      }
    },
  },
};
</script>

<style></style>
