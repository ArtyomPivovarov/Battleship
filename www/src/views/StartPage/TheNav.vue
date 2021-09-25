<template>
  <nav>
    <ul>
      <li>
        <div class="item item-move">
          <div class="icon">
            <img src="@/assets/images/nav/nav-item-move.svg" alt />
          </div>
          <div class="text">
            <span>Мышью перетаскививай корабли на поле</span>
          </div>
        </div>
      </li>
      <li>
        <div class="item item-rotation">
          <div class="icon">
            <img src="@/assets/images/nav/nav-item-rotation.svg" alt />
          </div>
          <div class="text">
            <span>Кликай для поворота корабля</span>
          </div>
        </div>
      </li>
      <li>
        <div class="item btn item-random">
          <div class="icon">
            <img src="@/assets/images/nav/nav-item-random.svg" alt />
          </div>
          <div @click="randomShips" class="text active-el">
            <span>Расставить в случайном порядке</span>
          </div>
        </div>
      </li>
      <li>
        <div class="item btn item-delete">
          <div class="icon">
            <img src="@/assets/images/nav/nav-item-delete.svg" alt />
          </div>
          <div @click="clear" class="text active-el">
            <span>С глаз долой!</span>
          </div>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions } from 'vuex';

import { api } from '@/api';

import { shipCoords } from '@/functions';

export default {
  methods: {
    ...mapActions(['getStatus']),
    async clear() {
      const id = this.$route.params.id;
      const code = this.$route.params.code;

      await api.clear(id, code);
      await this.getStatus();
    },
    async randomShips() {
      const ships = [];
      let banXY = [];

      for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 5 - i; j++) {
          const ship = this.randomShipData(`${i}-${j}`, banXY);
          ships.push(ship);
          banXY = banXY.concat(shipCoords(ship, true)) ;
        }
      }

      await this.placeShips(ships);
    },
    async placeShips(ships) {
      await this.clear();

      const data = new FormData();
      ships.forEach((ship, index) => {
        for (const key in ship) {
          data.append(`ships[${index}][${key}]`, ship[key]);
        }
      });

      const id = this.$route.params.id;
      const code = this.$route.params.code;

      await api.placeShip(id, code, data);

      await this.getStatus();
    },
    randomShipData(ship, banXY) {
      let x = this.randomCoord();
      let y = this.randomCoord();
      let shipXY;
      let shipLength = parseInt(ship[0], 10);
      let orientation = 'horizontal';
      let shipIntersectBanZone

      do {
        if (x > 10 - shipLength) {
          x -= x + shipLength - 10;
        }

        shipXY = shipCoords({ ship, x, y, orientation }, false);

        shipIntersectBanZone = shipXY.some((xy) => banXY.includes(xy));

        if (!shipIntersectBanZone) {
          break;
        }

        orientation = 'vertical';

        if (y > 10 - shipLength) {
          y -= y + shipLength - 10;
        }

        shipXY = shipCoords({ ship, x, y, orientation }, false);

        shipIntersectBanZone = shipXY.some((xy) => banXY.includes(xy));

        if (!shipIntersectBanZone) {
          break;
        }

        x = this.randomCoord();
        y = this.randomCoord();
        orientation = 'horizontal';
      } while (x >= 0);

      return {
        ship,
        x,
        y,
        orientation,
      };
    },
    randomCoord() {
      return Math.round(Math.random() * 9);
    },

  },
};
</script>

<style lang="scss" scoped>
nav {
  width: 100%;
  margin-top: 50px;
  user-select: none;

  ul {
    display: flex;
    justify-content: space-between;
  }

  .item {
    display: flex;
    font-size: 14px;
  }

  .icon {
    margin-right: 15px;
  }
}
</style>
