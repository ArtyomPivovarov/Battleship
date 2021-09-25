<template>
  <div class="ship">
    <img :src="src" :class="width < height ? 'rotate' : ''" />
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {};
  },
  computed: {
    src() {
      const decks = Math.max(this.width, this.height);
      return require(`@/assets/images/ships/ship-${decks}-deck.png`);
    },
  },
};
</script>

<style lang="scss" scoped>
.ship {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.rotate {
  transform: rotate(90deg);
}
</style>
