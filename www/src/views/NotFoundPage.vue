<template>
  <div class="page not-found">
    <div class="content">
      <div class="numb"><span>404</span></div>
      <div class="text"><span>Такого фарватера не существует!</span></div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '@/assets/styles/_variables.scss';

.not-found {
  justify-content: center;
  align-items: center;

  .content {
    padding: 25px 50px;
    text-align: center;
    background: $yellow;
    color: $black-on-yellow;
    white-space: nowrap;

    .numb {
      font-family: 'Roboto-Mono', serif;
      font-size: 100px;
      font-weight: 900;
      line-height: 1.2;
      
    }

    .text {
      font-size: 40px;
      font-weight: 500;
      line-height: 1.2;
    }
  }
}
</style>
