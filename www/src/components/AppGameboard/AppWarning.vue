<template>
  <div class="warning" ref="warning">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    x: Number,
    y: Number
  },
  mounted() {
    this.$refs.warning.style.left = this.x + 'px';
    this.$refs.warning.style.top = this.y + 'px';
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.warning {
  position: absolute;
  padding: 5px 12px;
  background-color: $yellow;
  color: $black-on-yellow;
  border-radius: 20px;
  white-space: nowrap;
}

</style>