<template>
  <div class="promt">
    <slot></slot>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_variables.scss";

.promt {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 30px 40px;
  white-space: nowrap;
  opacity: 0.5;
  background: #999;
  font-weight: 500;
  font-size: 25px;
  color: $black-on-yellow;
  z-index: 100;
  user-select: none;
  cursor: default;

  &:before {
    content: "— ";
  }
}

.promt-active {
  background-color: $yellow;
  opacity: 1;
}

.promt-clickable {
  cursor: pointer;
}
</style>
