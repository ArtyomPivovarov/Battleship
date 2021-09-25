<template>
  <div class="mark">
    <div class="hit" v-if="type === 'hit'">
      <img src="@/assets/images/hit.svg" alt />
    </div>
    <div class="miss" v-if="type === 'miss'"></div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
  },
};
</script>

<style lang="scss" scoped>
.mark {
  &,
  .hit,
  .miss {
    width: 100%;
    height: 100%;
  }

  .hit,
  .miss {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hit {
    background-color: rgba(42, 119, 147, 0.5);
  }

  .miss {
    &:after {
      content: "";
      width: 16px;
      height: 16px;
      border-radius: 8px;
      background-color: #334b53;
    }
  }
}
</style>
