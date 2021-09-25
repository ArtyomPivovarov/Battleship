<template>
  <div class="close-chat-btn">
    <div class="text active-el">
      <span>Скрыть чат</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.close-chat-btn {
  display: inline-block;
  font-weight: 900;
  font-size: 13px;
  user-select: none;

  .text {
    text-transform: uppercase;

    &:before {
      content: '';
      display: inline-block;
      width: 0;
      height: 0;
      margin-right: 8px;
      border-top: 6px solid transparent;
      border-right: 6px solid white;
      border-bottom: 6px solid transparent;
    }
  }
}
</style>
