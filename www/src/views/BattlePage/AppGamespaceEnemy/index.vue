<template>
  <div class="game-space">
    <AppGameboard></AppGameboard>
    <div class="info">
      <div class="fleet">
        <div class="name">
          <span>Флот врага</span>
        </div>
        <div class="damage">
          <span>повреждение {{ damage }}%</span>
        </div>
      </div>
      <div class="ships-stat">
        <div class="item">
          <AppShip :width="4"></AppShip>
          <div class="ship-count">
            <span>{{ shipCount(4) }}</span>
          </div>
        </div>
        <div class="item">
          <AppShip :width="3"></AppShip>
          <div class="ship-count">
            <span>{{ shipCount(3) }}</span>
          </div>
        </div>
        <div class="item">
          <AppShip :width="2"></AppShip>
          <div class="ship-count">
            <span>{{ shipCount(2) }}</span>
          </div>
        </div>
        <div class="item">
          <AppShip :width="1"></AppShip>
          <div class="ship-count">
            <span>{{ shipCount(1) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

import AppGameboard from './AppGameboard.vue';

export default {
  components: {
    AppGameboard,
  },
  data() {
    return {
      shipsAmount: {
        '4': 1,
        '3': 2,
        '2': 3,
        '1': 4,
      },
    };
  },
  methods: {
    shipCount(type) {
      const ships = this.shipsAmount[type];
      let shipsRest = ships;

      if (!this.fieldEnemy.length) {
        return ships;
      }

      for (let i = 1; i <= ships; i++) {
        const ship = `${type}-${i}`;

        const brokenDecks = this.fieldEnemy.reduce((sum, col) => {
          return (
            sum + col.filter((item) => this.isBrokenDeck(item, ship)).length
          );
        }, 0);

        if (brokenDecks === parseInt(type, 10)) {
          shipsRest = shipsRest - 1;
        }
      }

      return shipsRest;
    },
    isBrokenDeck(item, ship) {
      if (ship) {
        return item[0] === ship && item[1];
      }

      return item[0] !== 'empty' && item[1];
    },
  },
  computed: {
    ...mapState(['fieldEnemy']),
    damage() {
      const decks = 20;

      if (!this.fieldEnemy.length) {
        return 0;
      }

      const brokenDecks = this.fieldEnemy.reduce((sum, col) => {
        return sum + col.filter((item) => this.isBrokenDeck(item)).length;
      }, 0);

      return brokenDecks * 100 / decks;
    },
  },
};
</script>

<style></style>
